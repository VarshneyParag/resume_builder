import os
import uuid
from PIL import Image
from werkzeug.utils import secure_filename


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}


def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_unique_filename(filename):
    """Generate a unique filename preserving the extension."""
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else 'jpg'
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    return secure_filename(unique_name)


def save_photo(file, upload_folder, max_size=(400, 400)):
    """
    Save and resize an uploaded photo.
    Returns the relative path to the saved file, or None on failure.
    """
    if not file or not allowed_file(file.filename):
        return None

    os.makedirs(upload_folder, exist_ok=True)

    filename = generate_unique_filename(file.filename)
    filepath = os.path.join(upload_folder, filename)

    try:
        img = Image.open(file.stream)
        # Convert to RGB if necessary (handles PNG with alpha)
        if img.mode in ('RGBA', 'P', 'LA'):
            img = img.convert('RGB')
        img.thumbnail(max_size, Image.LANCZOS)
        img.save(filepath, quality=90, optimize=True)
        return f"uploads/photos/{filename}"
    except Exception as e:
        print(f"Error saving photo: {e}")
        return None


def delete_photo(photo_path, base_dir):
    """Delete a photo file if it exists."""
    if not photo_path:
        return
    full_path = os.path.join(base_dir, photo_path)
    if os.path.exists(full_path):
        try:
            os.remove(full_path)
        except OSError:
            pass


def format_date(date_str):
    """Format a date string for display."""
    if not date_str:
        return 'Present'
    return date_str
