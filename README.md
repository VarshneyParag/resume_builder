# 📝 ResumeCraft: Advanced AI-Powered Resume Builder

[![Python Version](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/)
[![Framework](https://img.shields.io/badge/framework-Flask-lightgrey.svg)](https://flask.palletsprojects.com/)
[![Database](https://img.shields.io/badge/database-SQLite-green.svg)](https://sqlite.org/)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](https://opensource.org/licenses/MIT)

**ResumeCraft** is a state-of-the-art, feature-rich web application designed to help job seekers build premium, ATS-friendly resumes in minutes. With a gorgeous dark-themed modern UI, an interactive step-by-step editor, real-time previewing, integrated **AI writing assistance**, and seamless PDF downloads, it delivers an outstanding user experience.

---

## ✨ Outstanding Features

- 🤖 **Dynamic AI Writing Assistant**: Stuck on phrasing? The integrated client-side AI Writer modal targets active text areas (like Summaries, Work Experience, or Projects) and runs dynamic typing animations utilizing custom backend recommendations tailored to your job role and tech stack.
- 📈 **Dynamic Profile Completeness & Optimizer**: Features a mathematical progress bar on the dashboard showing how complete your profile is. Click "View Optimization Tips" for a breakdown of which columns are missing to hit 100%.
- 💾 **Live Auto-Save & Sync**: Every update is automatically cached. When you click download, all form inputs are instantly committed to SQLite via an AJAX POST before rendering the document.
- 🖨️ **Zero-Dependency PDF Compilation**: Solves common native library conflicts on Windows by utilizing client-side `html2pdf.js` inside templates to download a perfect, highly-polished PDF directly to the Downloads folder.
- ⚙️ **Interactive Settings & Toggles**: A robust settings dashboard supporting username/password updates, validation rules, and integration toggles (e.g. Google Accounts).
- 🔑 **Simulated Google OAuth Authentication**: Single-click Google login that automatically registers new users and initializes a pre-filled professional default template.
- 🔔 **Contextual Dropdowns & Notifications**: Real-time notifications and an interactive global header menu for user profiles.
- 💬 **Sidebar FAQ & Help Center**: A beautiful overlay panel containing immediate FAQs, markdown guides, and support links directly accessible from both the dashboard and editor views.

---

## 📂 Codebase Directory Structure

Here is a visual overview of how the repository is structured:

```text
resume_builder/
├── app.py                # Main Flask Application & Route Controllers
├── config.py             # App Configurations (DB Path, Secret Keys)
├── models.py             # SQLAlchemy Database Models (User, Resume, PersonalDetails, etc.)
├── requirements.txt      # Python Dependencies (Flask, SQLAlchemy, etc.)
├── .gitignore            # Git exclusion rules
├── pdf_generator/        # Server-side PDF generation package
│   ├── __init__.py
│   └── generator.py      # WeasyPrint wrapper (with elegant HTML fallback)
├── static/               # Client-Side Assets
│   ├── css/
│   │   └── style.css     # Premium Responsive Stylesheets (Glassmorphism, Dark/Light modules)
│   └── js/
│       └── main.js       # Complete Frontend Interactions (AI Writer, Steppers, Modals, Auto-Save)
├── templates/            # Jinja2 HTML Templates
│   ├── base.html         # Global Shell Navigation & Sidebars
│   ├── dashboard.html    # User Hub (Resume management, completeness tracker)
│   ├── index.html        # Elegant landing page with pricing, features & testimonials
│   ├── login.html        # Secure Login layout (Supports Google login simulator)
│   ├── register.html     # Sign Up form
│   ├── resume_form.html  # Immersive Stepper Editor with Live HTML Preview & AI Writer
│   ├── resume_preview.html # Live print layout & HTML preview render
│   ├── pdf_template.html   # Dedicated PDF stylesheet & layout with html2pdf compiler
│   └── settings.html     # Detailed User Account & Integration Settings Panel
└── utils/                # General Helpers & Validation Modules
    ├── __init__.py
    ├── helpers.py        # General utilities
    └── validators.py     # Inputs validator rules
```

---

## 🛠️ Technology Stack

- **Backend**: Python 3.x, Flask, SQLAlchemy (SQLite Database)
- **Frontend**: Responsive HTML5, Vanilla CSS3 (Custom Glassmorphic styles, custom variables), JavaScript (ES6+ Web APIs)
- **PDF Compilation**: `html2pdf.js` integration with non-blocking print layouts
- **Animation**: CSS Transition matrices and real-time JavaScript typing engine

---

## 🚀 Local Installation & Setup

Get ResumeCraft up and running on your local machine in under 5 minutes:

### 1. Clone the Repository
```bash
git clone https://github.com/VarshneyParag/resume_builder.git
cd resume_builder
```

### 2. Create a Virtual Environment
```bash
python -m venv venv
# On Windows (Command Prompt)
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables
Create a file named `.env` in the root folder and add your secret key:
```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-super-secret-key-change-this-in-production
```

### 5. Run the Application
```bash
python app.py
```
Open your browser and navigate to **`http://localhost:5000`**.

---

## 📸 Key UI Screenshots

### Home & Stepper Editor
*A high-fidelity resume builder interface including Live Side-by-Side Previews, an AI Writer popup modal, progress meters, and dynamic completeness status updates.*

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more details.

---

## ⭐️ Support & Feedback
If you like **ResumeCraft**, please star this repository! It helps recruiters notice the project and supports future developments. For feedback, feel free to open a Github Issue.
