from datetime import datetime
from . import db

class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    category = db.Column(db.String(100), nullable=False, index=True)
    difficulty = db.Column(db.Enum("beginner", "intermediate", "advanced", name="course_difficulty"), nullable=False, default="beginner", index=True)
    price = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    discount_price = db.Column(db.Numeric(10, 2), nullable=True)
    thumbnail_url = db.Column(db.String(500), nullable=True)
    rating_avg = db.Column(db.Float, nullable=False, default=0.0)
    rating_count = db.Column(db.Integer, nullable=False, default=0)
    student_count = db.Column(db.Integer, nullable=False, default=0)
    duration_hours = db.Column(db.Float, nullable=False, default=0.0)
    published = db.Column(db.Boolean, nullable=False, default=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    lessons = db.relationship("Lesson", backref="course", lazy="dynamic", cascade="all, delete-orphan", order_by="Lesson.order_index")
    enrollments = db.relationship("Enrollment", backref="course", lazy="dynamic", cascade="all, delete-orphan")
    reviews = db.relationship("Review", backref="course", lazy="dynamic", cascade="all, delete-orphan")
    certificates = db.relationship("Certificate", backref="course", lazy="dynamic", cascade="all, delete-orphan")

    def to_dict(self, include_lessons=False, include_instructor=True):
        data = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "instructor_id": self.instructor_id,
            "category": self.category,
            "difficulty": self.difficulty,
            "price": float(self.price) if self.price is not None else 0.0,
            "discount_price": float(self.discount_price) if self.discount_price is not None else None,
            "thumbnail_url": self.thumbnail_url,
            "rating_avg": round(float(self.rating_avg), 1) if self.rating_avg is not None else 0.0,
            "rating_count": self.rating_count,
            "student_count": self.student_count,
            "duration_hours": float(self.duration_hours) if self.duration_hours is not None else 0.0,
            "published": self.published,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

        if include_instructor and self.instructor:
            data["instructor"] = {
                "id": self.instructor.id,
                "name": self.instructor.name,
                "avatar_url": self.instructor.avatar_url,
                "bio": self.instructor.bio,
            }

        if include_lessons:
            data["lessons"] = [lesson.to_dict() for lesson in self.lessons.order_by("order_index").all()]
            data["lessons_count"] = len(data["lessons"])

        return data
