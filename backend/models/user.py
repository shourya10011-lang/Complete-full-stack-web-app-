from datetime import datetime
import bcrypt
from . import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(180), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    avatar_url = db.Column(db.String(500), nullable=True)
    role = db.Column(db.Enum("student", "instructor", "admin", name="user_roles"), nullable=False, default="student", index=True)
    bio = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    courses_taught = db.relationship("Course", backref="instructor", lazy="dynamic", cascade="all, delete-orphan")
    enrollments = db.relationship("Enrollment", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    lesson_progress = db.relationship("LessonProgress", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    reviews = db.relationship("Review", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    certificates = db.relationship("Certificate", backref="user", lazy="dynamic", cascade="all, delete-orphan")

    def set_password(self, password: str):
        salt = bcrypt.gensalt(rounds=12)
        self.password_hash = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    def check_password(self, password: str) -> bool:
        if not self.password_hash:
            return False
        try:
            return bcrypt.checkpw(password.encode("utf-8"), self.password_hash.encode("utf-8"))
        except Exception:
            return False

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "avatar_url": self.avatar_url,
            "role": self.role,
            "bio": self.bio,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
