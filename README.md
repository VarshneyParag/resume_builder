<div align="center">
  <img src="https://img.icons8.com/color/120/000000/resume.png" alt="ResumeCraft Logo">
  
  # 🚀 ResumeCraft
  **The Next-Generation AI-Powered Resume Builder**
  
  [![Python](https://img.shields.io/badge/Python-3.8+-blue.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
  [![Flask](https://img.shields.io/badge/Flask-2.x-black.svg?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
  [![SQLite](https://img.shields.io/badge/SQLite-Database-003B57.svg?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
  [![License](https://img.shields.io/badge/License-MIT-success.svg?style=for-the-badge)](#license)
  [![Live Demo](https://img.shields.io/badge/Live_Demo-Online-success.svg?style=for-the-badge&logo=vercel)](https://resume-craft-builder.onrender.com)
  
  [**View Live Application**](https://resume-craft-builder.onrender.com) • [**Report Bug**](https://github.com/VarshneyParag/resume_builder/issues) • [**Request Feature**](https://github.com/VarshneyParag/resume_builder/issues)
</div>

<br />

> **ResumeCraft** is a state-of-the-art, feature-rich web application designed to help job seekers build premium, **ATS-friendly resumes** in minutes. Featuring an integrated AI Writing Assistant, a glassmorphic modern UI, dynamic completeness tracking, and a fully native-like mobile experience.

---

## ✨ Why ResumeCraft? (Features)

*   📱 **Native App Mobile Experience**: Beautifully engineered bottom-navigation bars, glassmorphism overlays, and fluid vertical stacking ensure the app feels like a premium native mobile application on your phone.
*   🤖 **Dynamic AI Writing Assistant**: Stuck on phrasing? Let our AI draft high-impact bullet points for your Summary, Work Experience, or Projects based on your specific job role and tech stack.
*   🎯 **ATS-Optimized Formatting**: Every downloaded resume is rigorously structured to pass modern Applicant Tracking Systems (ATS).
*   🖨️ **Zero-Dependency PDF Compilation**: Solves common native library conflicts by utilizing ultra-fast client-side `html2pdf.js`. Generates pixel-perfect PDFs directly to your Downloads folder.
*   📈 **Profile Optimizer & Completeness Tracker**: Features a mathematical progress bar and contextual popup tips guiding you to hit 100% profile completeness.
*   💾 **Live Auto-Save & Sync**: Never lose your progress. Edits are seamlessly synchronized with our secure backend architecture.
*   🔑 **Frictionless Onboarding**: Includes Google OAuth simulation for secure, one-click registration and login.

---

## 🎨 UI Showcase

<div align="center">
  <table>
    <tr>
      <td align="center"><b>🖥️ Desktop Editor Layout</b></td>
      <td align="center"><b>📱 Mobile Native Dashboard</b></td>
    </tr>
    <tr>
      <td align="center">Split-pane side-by-side editing with live preview rendering.</td>
      <td align="center">Glassmorphic bottom-nav bars with intelligent stacking.</td>
    </tr>
  </table>
</div>

---

## 🛠️ Technology Stack

| Architecture | Technologies |
| :--- | :--- |
| **Frontend UI/UX** | Responsive HTML5, Vanilla CSS3 (Custom Variables, CSS Grids), JavaScript ES6+ |
| **Backend API** | Python 3.x, Flask (WSGI Web Framework), Flask-Login, Flask-WTF |
| **Database** | SQLAlchemy ORM, SQLite |
| **Cloud Deployment**| Render (Gunicorn WSGI HTTP Server) |

---

## 🚀 Local Installation & Setup

Want to run ResumeCraft on your own machine? It takes less than 5 minutes:

### 1. Clone the Repository
```bash
git clone https://github.com/VarshneyParag/resume_builder.git
cd resume_builder
```

### 2. Create a Virtual Environment
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Set Environment Variables
Create a file named `.env` in the root folder:
```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-super-secret-key
```

### 5. Run the Application
```bash
python app.py
```
Open your browser and navigate to **`http://localhost:5000`**. The database tables will be created automatically on startup!

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⭐️ Show your Support!

If you found this project helpful, learned something new, or used it to land a job, please **leave a ⭐ Star** on this repository! It helps the project grow and motivates further open-source development.

<div align="center">
  <p>Built with ❤️ by Parag Varshney.</p>
</div>
