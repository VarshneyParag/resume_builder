import os
from flask import render_template, current_app

# Try WeasyPrint, fall back gracefully
WEASYPRINT_AVAILABLE = False
try:
    from weasyprint import HTML
    WEASYPRINT_AVAILABLE = True
except (ImportError, OSError):
    pass


def generate_resume_pdf(resume):
    """
    Generate a PDF from the resume data.
    Returns the PDF bytes or None if generation fails.
    """
    try:
        html_content = render_template('pdf_template.html', resume=resume)

        if WEASYPRINT_AVAILABLE:
            base_url = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
            pdf_doc = HTML(string=html_content, base_url=base_url)
            return pdf_doc.write_pdf()
        else:
            # Fallback: return HTML content for browser-based PDF printing
            return html_content.encode('utf-8')
    except Exception as e:
        print(f"PDF Generation Error: {e}")
        return None


def get_pdf_available():
    """Check if PDF generation is available."""
    return WEASYPRINT_AVAILABLE
