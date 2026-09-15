from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .course import Course
from .lesson import Lesson
from .enrollment import Enrollment
from .lesson_progress import LessonProgress
from .review import Review
from .certificate import Certificate

__all__ = [
    "db",
    "User",
    "Course",
    "Lesson",
    "Enrollment",
    "LessonProgress",
    "Review",
    "Certificate",
]
