from .auth import auth_bp
from .courses import courses_bp
from .lessons import lessons_bp
from .enrollments import enrollments_bp
from .lesson_progress import lesson_progress_bp
from .reviews import reviews_bp
from .users import users_bp

__all__ = [
    "auth_bp",
    "courses_bp",
    "lessons_bp",
    "enrollments_bp",
    "lesson_progress_bp",
    "reviews_bp",
    "users_bp",
]
