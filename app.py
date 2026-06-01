import os
import re
from flask import (Flask, render_template, request, redirect, url_for,
                   flash, send_file, jsonify, abort)
from flask_login import (LoginManager, login_user, logout_user,
                         login_required, current_user)
from flask_wtf.csrf import CSRFProtect
from io import BytesIO

from config import Config
from models import db, User, Resume, PersonalDetails, Education, WorkExperience, Project, Skill
from utils.helpers import save_photo, delete_photo
from utils.validators import validate_email, validate_password, validate_name, sanitize_input
from pdf_generator.generator import generate_resume_pdf, get_pdf_available


# ── App Factory ──────────────────────────────────────────────────────────
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
csrf = CSRFProtect(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please sign in to access this page.'
login_manager.login_message_category = 'info'


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))


# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


# ── Public Routes ────────────────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        valid, msg = validate_email(email)
        if not valid:
            flash(msg, 'error')
            return redirect(url_for('login'))

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            login_user(user, remember=True)
            flash(f'Welcome back, {user.name}!', 'success')
            next_page = request.args.get('next')
            return redirect(next_page or url_for('dashboard'))
        else:
            flash('Invalid email or password.', 'error')

    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        # Validate
        valid, msg = validate_name(name)
        if not valid:
            flash(msg, 'error')
            return redirect(url_for('register'))

        valid, msg = validate_email(email)
        if not valid:
            flash(msg, 'error')
            return redirect(url_for('register'))

        valid, msg = validate_password(password)
        if not valid:
            flash(msg, 'error')
            return redirect(url_for('register'))

        # Check existing
        if User.query.filter_by(email=email).first():
            flash('An account with this email already exists.', 'error')
            return redirect(url_for('register'))

        # Create user
        user = User(name=sanitize_input(name), email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        login_user(user, remember=True)
        flash('Welcome to ResumeCraft! Let\'s build your first resume.', 'success')
        return redirect(url_for('dashboard'))

    return render_template('register.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been signed out.', 'info')
    return redirect(url_for('index'))


# ── Dashboard ────────────────────────────────────────────────────────────

def calculate_completeness(resume):
    if not resume:
        return 0, ["Create your first resume to see optimization tips!"]
    
    score = 0
    tips = []
    
    # 1. Personal details check (up to 20%)
    pd = resume.personal_details
    pd_score = 0
    missing_fields = []
    if pd:
        if pd.full_name: pd_score += 5
        else: missing_fields.append("Full Name")
        if pd.email: pd_score += 5
        else: missing_fields.append("Email")
        if pd.phone: pd_score += 5
        else: missing_fields.append("Phone")
        if pd.job_title: pd_score += 5
        else: missing_fields.append("Job Title")
    else:
        missing_fields = ["Full Name", "Email", "Phone", "Job Title"]
    
    score += pd_score
    if missing_fields:
        tips.append(f"Add missing personal details: {', '.join(missing_fields)}")
        
    # 2. Professional summary check (20%)
    if pd and pd.profile_summary:
        score += 20
    else:
        tips.append("Write a professional summary to tell recruiters about your career highlights.")
        
    # 3. Work experience (20%)
    if resume.work_experience:
        score += 20
    else:
        tips.append("Add your work experiences (jobs, internships) with descriptions.")
        
    # 4. Education (20%)
    if resume.education:
        score += 20
    else:
        tips.append("List your educational background (degrees, certificates).")
        
    # 5. Skills (10%)
    if resume.skills:
        score += 10
    else:
        tips.append("Add at least 3-5 technical or professional skills to pass automated ATS filters.")
        
    # 6. Projects (10%)
    if resume.projects:
        score += 10
    else:
        tips.append("Include relevant personal or academic projects to show hands-on experience.")
        
    return score, tips


@app.route('/dashboard')
@login_required
def dashboard():
    resumes = Resume.query.filter_by(user_id=current_user.id).order_by(
        Resume.is_default.desc(), Resume.updated_at.desc()
    ).all()
    
    default_resume = next((r for r in resumes if r.is_default), None)
    if not default_resume and resumes:
        default_resume = resumes[0]
        
    completeness, tips = calculate_completeness(default_resume)
    return render_template('dashboard.html', resumes=resumes, completeness=completeness, tips=tips)


# ── Resume CRUD ──────────────────────────────────────────────────────────

@app.route('/resume/create', methods=['GET', 'POST'])
@login_required
def create_resume():
    resume = Resume(
        user_id=current_user.id,
        title='Untitled Resume',
        is_default=not Resume.query.filter_by(user_id=current_user.id).first()
    )
    db.session.add(resume)
    db.session.flush()

    # Create empty personal details
    pd = PersonalDetails(resume_id=resume.id)
    db.session.add(pd)
    db.session.commit()

    flash('New resume created! Start filling in your details.', 'success')
    return redirect(url_for('edit_resume', resume_id=resume.id))


@app.route('/resume/<int:resume_id>', methods=['GET'])
@login_required
def edit_resume(resume_id):
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first_or_404()
    pd = resume.personal_details
    return render_template('resume_form.html', resume=resume, pd=pd)


@app.route('/resume/<int:resume_id>/update', methods=['POST'])
@login_required
def update_resume(resume_id):
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first_or_404()

    # Update title
    title = request.form.get('title', '').strip()
    if title:
        resume.title = sanitize_input(title)

    # Update or create personal details
    pd = resume.personal_details
    if not pd:
        pd = PersonalDetails(resume_id=resume.id)
        db.session.add(pd)

    pd.full_name = sanitize_input(request.form.get('full_name', ''))
    pd.job_title = sanitize_input(request.form.get('job_title', ''))
    pd.email = request.form.get('email', '').strip()
    pd.phone = sanitize_input(request.form.get('phone', ''))
    pd.address = sanitize_input(request.form.get('address', ''))
    pd.linkedin = request.form.get('linkedin', '').strip()
    pd.github = request.form.get('github', '').strip()
    pd.profile_summary = request.form.get('profile_summary', '').strip()

    # Handle photo upload
    photo = request.files.get('photo')
    if photo and photo.filename:
        # Delete old photo if exists
        delete_photo(pd.photo_path, os.path.abspath(os.path.dirname(__file__)))
        photo_path = save_photo(photo, app.config['UPLOAD_FOLDER'])
        if photo_path:
            pd.photo_path = photo_path

    # ── Parse dynamic sections ──

    # Education
    Education.query.filter_by(resume_id=resume.id).delete()
    edu_idx = 0
    while True:
        degree = request.form.get(f'education[{edu_idx}][degree]', '').strip()
        institution = request.form.get(f'education[{edu_idx}][institution]', '').strip()
        if not degree and not institution:
            break
        edu = Education(
            resume_id=resume.id,
            degree=sanitize_input(degree),
            institution=sanitize_input(institution),
            year=sanitize_input(request.form.get(f'education[{edu_idx}][year]', '')),
            percentage=sanitize_input(request.form.get(f'education[{edu_idx}][percentage]', ''))
        )
        db.session.add(edu)
        edu_idx += 1

    # Work Experience
    WorkExperience.query.filter_by(resume_id=resume.id).delete()
    exp_idx = 0
    while True:
        job_title = request.form.get(f'experience[{exp_idx}][job_title]', '').strip()
        company = request.form.get(f'experience[{exp_idx}][company]', '').strip()
        if not job_title and not company:
            break
        exp = WorkExperience(
            resume_id=resume.id,
            job_title=sanitize_input(job_title),
            company=sanitize_input(company),
            start_date=sanitize_input(request.form.get(f'experience[{exp_idx}][start_date]', '')),
            end_date=sanitize_input(request.form.get(f'experience[{exp_idx}][end_date]', '')),
            description=request.form.get(f'experience[{exp_idx}][description]', '').strip()
        )
        db.session.add(exp)
        exp_idx += 1

    # Projects
    Project.query.filter_by(resume_id=resume.id).delete()
    proj_idx = 0
    while True:
        name = request.form.get(f'projects[{proj_idx}][name]', '').strip()
        if not name:
            break
        proj = Project(
            resume_id=resume.id,
            name=sanitize_input(name),
            tech_stack=sanitize_input(request.form.get(f'projects[{proj_idx}][tech_stack]', '')),
            description=request.form.get(f'projects[{proj_idx}][description]', '').strip(),
            live_link=request.form.get(f'projects[{proj_idx}][live_link]', '').strip()
        )
        db.session.add(proj)
        proj_idx += 1

    # Skills
    Skill.query.filter_by(resume_id=resume.id).delete()
    skills_str = request.form.get('skills', '')
    if skills_str:
        for skill_name in skills_str.split(','):
            skill_name = skill_name.strip()
            if skill_name:
                skill = Skill(resume_id=resume.id, skill_name=sanitize_input(skill_name))
                db.session.add(skill)

    db.session.commit()
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'status': 'ok'})
    flash('Resume saved successfully!', 'success')
    return redirect(url_for('edit_resume', resume_id=resume.id))


@app.route('/resume/<int:resume_id>/autosave', methods=['POST'])
@login_required
@csrf.exempt
def autosave_resume(resume_id):
    """AJAX autosave endpoint."""
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first()
    if not resume:
        return jsonify({'status': 'error'}), 404

    # Quick save personal details only for autosave
    pd = resume.personal_details
    if not pd:
        pd = PersonalDetails(resume_id=resume.id)
        db.session.add(pd)

    pd.full_name = request.form.get('full_name', pd.full_name or '')
    pd.job_title = request.form.get('job_title', pd.job_title or '')
    pd.profile_summary = request.form.get('profile_summary', pd.profile_summary or '')

    title = request.form.get('title', '').strip()
    if title:
        resume.title = title

    db.session.commit()
    return jsonify({'status': 'ok'})


@app.route('/resume/<int:resume_id>/delete', methods=['POST'])
@login_required
def delete_resume(resume_id):
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first_or_404()

    # Delete photo if exists
    if resume.personal_details and resume.personal_details.photo_path:
        delete_photo(resume.personal_details.photo_path, os.path.abspath(os.path.dirname(__file__)))

    db.session.delete(resume)
    db.session.commit()
    flash('Resume deleted.', 'info')
    return redirect(url_for('dashboard'))


@app.route('/resume/<int:resume_id>/set-default', methods=['POST'])
@login_required
@csrf.exempt
def set_default_resume(resume_id):
    # Unset all defaults for this user
    Resume.query.filter_by(user_id=current_user.id).update({'is_default': False})

    # Set new default
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first_or_404()
    resume.is_default = True
    db.session.commit()

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'status': 'ok'})
    flash(f'"{resume.title}" set as default resume.', 'success')
    return redirect(url_for('dashboard'))


@app.route('/resume/<int:resume_id>/preview')
@login_required
def preview_resume(resume_id):
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first_or_404()
    pd = resume.personal_details
    return render_template('resume_preview.html', resume=resume, pd=pd)


# ── PDF Download ─────────────────────────────────────────────────────────

@app.route('/resume/<int:resume_id>/download-pdf')
@login_required
def download_pdf(resume_id):
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first_or_404()
    pd = resume.personal_details

    pdf_bytes = generate_resume_pdf(resume)

    if pdf_bytes is None:
        flash('Error generating PDF. Please try again.', 'error')
        return redirect(url_for('edit_resume', resume_id=resume.id))

    if get_pdf_available():
        # Return actual PDF
        filename = f"{pd.full_name.replace(' ', '_') if pd and pd.full_name else 'resume'}_resume.pdf"
        return send_file(
            BytesIO(pdf_bytes),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=filename
        )
    else:
        # Fallback: return HTML for browser printing
        return pdf_bytes.decode('utf-8')


# ── Uploaded Files ───────────────────────────────────────────────────────

@app.route('/uploads/photos/<filename>')
def uploaded_file(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))


# ── Error Handlers ───────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(e):
    return render_template('base.html', error='Page not found'), 404


@app.errorhandler(500)
def server_error(e):
    return render_template('base.html', error='Server error'), 500


# ── AI Writer, Settings, and Google Login ────────────────────────────────

@app.route('/login/google')
def google_login():
    # Simulate Google OAuth Callback
    email = "googleuser@example.com"
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # Create Google User
        user = User(name="Google User", email=email)
        user.set_password("google-secure-password-12345")
        db.session.add(user)
        db.session.commit()
        
        # Create an empty resume for the Google User
        resume = Resume(
            user_id=user.id,
            title='Google Profile Resume',
            is_default=True
        )
        db.session.add(resume)
        db.session.flush()
        pd = PersonalDetails(
            resume_id=resume.id,
            full_name="Google User",
            email=email,
            job_title="Software Architect"
        )
        db.session.add(pd)
        db.session.commit()
        
    login_user(user, remember=True)
    flash('Welcome back! Successfully logged in with Google.', 'success')
    return redirect(url_for('dashboard'))


@app.route('/settings', methods=['GET', 'POST'])
@login_required
def settings():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        
        # Validation
        if name:
            valid, msg = validate_name(name)
            if not valid:
                flash(msg, 'error')
                return redirect(url_for('settings'))
            current_user.name = sanitize_input(name)
            
        if email:
            valid, msg = validate_email(email)
            if not valid:
                flash(msg, 'error')
                return redirect(url_for('settings'))
            # Check duplicate email if it changed
            if email != current_user.email:
                if User.query.filter_by(email=email).first():
                    flash('This email is already in use by another account.', 'error')
                    return redirect(url_for('settings'))
                current_user.email = email
                
        if password:
            valid, msg = validate_password(password)
            if not valid:
                flash(msg, 'error')
                return redirect(url_for('settings'))
            current_user.set_password(password)
            
        db.session.commit()
        flash('Account settings updated successfully!', 'success')
        return redirect(url_for('settings'))
        
    return render_template('settings.html')


@app.route('/api/ai-generate', methods=['POST'])
@login_required
@csrf.exempt
def ai_generate():
    data = request.get_json() or {}
    section = data.get('section', 'summary')
    role = data.get('role', '').strip()
    keywords = data.get('keywords', '').strip()
    
    role_lower = role.lower()
    
    # Standard roles data
    suggestions = {
        'developer': {
            'summary': "Results-driven Software Engineer with extensive experience designing and deploying high-performance applications. Proficient in full-stack development using advanced technologies to solve complex architectural challenges. Adept at collaborating in agile environments to build robust systems.",
            'experience': "• Led the design, development, and deployment of scalable microservices, improving platform stability by 35%.\n• Optimized database query performance and indexes, reducing average API response times by 120ms.\n• Implemented automated CI/CD pipelines, accelerating feature releases and deployment frequency by 40%.\n• Mentored junior developers and enforced robust clean-coding standards via comprehensive peer reviews.",
            'project': "Built a real-time analytics engine utilizing Python and Flask with WebSocket communication. Integrated caching layers to support 50,000+ active events daily with sub-millisecond response latency."
        },
        'designer': {
            'summary': "Creative UI/UX Designer dedicated to crafting intuitive, visually stunning digital experiences. Specialized in human-centered design principles, interactive prototyping, and comprehensive user research. Proven track record of translating complex product ideas into simple, conversion-oriented layouts.",
            'experience': "• Redesigned the core mobile application onboarding flow, increasing user signups by 22%.\n• Established and maintained a cohesive digital design system, cutting team design-to-development handoff time by 50%.\n• Conducted over 30 usability test sessions to identify friction points and validate interactive web flows.\n• Created high-fidelity responsive web prototypes using modern Figma standards, achieving positive user engagement feedback.",
            'project': "Designed a next-generation task-management dashboard focused on accessibility and minimal design patterns. Produced interactive click-through prototypes and component-driven styling systems."
        },
        'manager': {
            'summary': "Strategic Product Manager with a strong technical background and a passion for building user-centric solutions. Skilled in product lifecycle leadership, market research, and agile execution. Exceptional at driving cross-functional alignment between engineering, design, and business teams.",
            'experience': "• Defined the roadmap and launched a core enterprise module, generating $1.2M in new annual recurring revenue.\n• Translated executive strategies into actionable product roadmaps, sprint goals, and agile requirements.\n• Managed the end-to-end lifecycle of high-priority integrations, reducing customer onboarding churn by 18%.\n• Utilized data-driven KPI metrics to drive post-launch optimization, raising user retention rates by 12%.",
            'project': "Spearheaded the integration of a localized payments engine, expanding addressable markets into 4 new global territories and boosting overall transaction volumes."
        },
        'analyst': {
            'summary': "Detail-oriented Data Analyst with a track record of transforming complex datasets into actionable business intelligence. Expertise in predictive modeling, statistical reporting, and interactive data visualization. Highly proficient in database extraction and analytical dashboards.",
            'experience': "• Designed and maintained dynamic executive dashboards, saving stakeholders 10 hours weekly in manual data assembly.\n• Conducted thorough churn-rate regression analyses, enabling marketing teams to improve retention by 8%.\n• Optimized SQL extract routines, reducing analytical report execution times by 50%.\n• Performed comprehensive market segment analysis to identify high-value consumer demographics.",
            'project': "Created an automated predictive modeling pipeline to forecast monthly inventory demands, increasing ordering accuracy by 15%."
        }
    }
    
    matched_role = 'developer'  # Default
    if 'design' in role_lower or 'ux' in role_lower or 'ui' in role_lower or 'artist' in role_lower:
        matched_role = 'designer'
    elif 'manager' in role_lower or 'pm' in role_lower or 'lead' in role_lower or 'scrum' in role_lower:
        matched_role = 'manager'
    elif 'analyst' in role_lower or 'data' in role_lower or 'science' in role_lower or 'bi' in role_lower:
        matched_role = 'analyst'
        
    s_data = suggestions[matched_role]
    raw_content = s_data.get(section, s_data['summary'])
    
    # Customise raw content dynamically using keywords if provided
    if keywords:
        kw_list = [k.strip() for k in keywords.split(',') if k.strip()]
        kw_formatted = ", ".join(kw_list)
        if section == 'summary':
            raw_content = f"{raw_content.rstrip('.')} specializing in {kw_formatted}."
        elif section == 'project':
            raw_content = f"{raw_content.rstrip('.')} Leverage of {kw_formatted} was pivotal in achieving target performance gains."
        elif section == 'experience':
            raw_content = f"• Developed robust modules leveraging {kw_formatted} to meet performance objectives.\n{raw_content}"
            
    # If the user typed a specific role, insert it dynamically
    if role and matched_role == 'developer':
        raw_content = raw_content.replace("Software Engineer", role)
        
    return jsonify({
        'status': 'success',
        'generated_text': raw_content
    })


# ── Main ─────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("\n[OK] Database tables created successfully!")
        print(f"[PDF] Generation: {'WeasyPrint (Full PDF)' if get_pdf_available() else 'HTML Fallback (Browser Print)'}")
        print(f"[DB] Database: {app.config['SQLALCHEMY_DATABASE_URI']}")
        print(f"[DIR] Uploads: {app.config['UPLOAD_FOLDER']}")
        print(f"\n[*] Starting ResumeCraft on http://localhost:5000\n")

    app.run(debug=True, host='0.0.0.0', port=5000)
