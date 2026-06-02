from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(UserMixin, db.Model):
    __tablename__ = 'users'

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    resumes = db.relationship('Resume', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.email}>'


class Resume(db.Model):
    __tablename__ = 'resumes'

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False, default='Untitled Resume')
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    personal_details = db.relationship('PersonalDetails', backref='resume', uselist=False,
                                       cascade='all, delete-orphan')
    education = db.relationship('Education', backref='resume', lazy=True,
                                cascade='all, delete-orphan', order_by='Education.id')
    work_experience = db.relationship('WorkExperience', backref='resume', lazy=True,
                                      cascade='all, delete-orphan', order_by='WorkExperience.id')
    projects = db.relationship('Project', backref='resume', lazy=True,
                               cascade='all, delete-orphan', order_by='Project.id')
    skills = db.relationship('Skill', backref='resume', lazy=True,
                             cascade='all, delete-orphan', order_by='Skill.id')

    def __repr__(self):
        return f'<Resume {self.title}>'


class PersonalDetails(db.Model):
    __tablename__ = 'personal_details'

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=False, unique=True)
    full_name = db.Column(db.String(200), default='')
    job_title = db.Column(db.String(200), default='')
    email = db.Column(db.String(120), default='')
    phone = db.Column(db.String(30), default='')
    address = db.Column(db.String(300), default='')
    linkedin = db.Column(db.String(300), default='')
    github = db.Column(db.String(300), default='')
    profile_summary = db.Column(db.Text, default='')
    photo_path = db.Column(db.String(500), default='')


class Education(db.Model):
    __tablename__ = 'education'

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=False)
    degree = db.Column(db.String(200), default='')
    institution = db.Column(db.String(200), default='')
    year = db.Column(db.String(20), default='')
    percentage = db.Column(db.String(20), default='')


class WorkExperience(db.Model):
    __tablename__ = 'work_experience'

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=False)
    job_title = db.Column(db.String(200), default='')
    company = db.Column(db.String(200), default='')
    start_date = db.Column(db.String(30), default='')
    end_date = db.Column(db.String(30), default='')
    description = db.Column(db.Text, default='')


class Project(db.Model):
    __tablename__ = 'projects'

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=False)
    name = db.Column(db.String(200), default='')
    tech_stack = db.Column(db.String(500), default='')
    description = db.Column(db.Text, default='')
    live_link = db.Column(db.String(500), default='')


class Skill(db.Model):
    __tablename__ = 'skills'

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=False)
    skill_name = db.Column(db.String(100), default='')
