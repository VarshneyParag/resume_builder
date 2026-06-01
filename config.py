import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-fallback-secret-key')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///resumecraft.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_SSL_STRICT = False  # Disable strict referrer check over SSL to support mobile browsers
    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)),
                                 os.environ.get('UPLOAD_FOLDER', 'uploads/photos'))
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 5 * 1024 * 1024))  # 5MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
