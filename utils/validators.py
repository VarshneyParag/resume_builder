import re
import html


def validate_email(email):
    """Validate email format."""
    if not email:
        return False, "Email is required."
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        return False, "Please enter a valid email address."
    return True, ""


def validate_password(password):
    """Validate password strength."""
    if not password:
        return False, "Password is required."
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    return True, ""


def validate_name(name):
    """Validate name is not empty."""
    if not name or not name.strip():
        return False, "Name is required."
    if len(name.strip()) < 2:
        return False, "Name must be at least 2 characters."
    return True, ""


def validate_phone(phone):
    """Validate phone number format (optional field)."""
    if not phone:
        return True, ""
    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
    if not cleaned.isdigit() or len(cleaned) < 7 or len(cleaned) > 15:
        return False, "Please enter a valid phone number."
    return True, ""


def sanitize_input(text):
    """Sanitize user input to prevent XSS."""
    if not text:
        return ''
    return html.escape(str(text).strip())


def sanitize_url(url):
    """Sanitize URL input."""
    if not url:
        return ''
    url = str(url).strip()
    if url and not url.startswith(('http://', 'https://', 'www.')):
        if '.' in url:
            url = 'https://' + url
    return html.escape(url)
