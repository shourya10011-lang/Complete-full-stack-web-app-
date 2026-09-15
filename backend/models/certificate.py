from datetime import datetime
import uuid
from . import db

class Certificate(db.Model):
    __tablename__ = "certificates"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    certificate_code = db.Column(db.String(100), nullable=False, unique=True, index=True)

    @staticmethod
    def generate_code(course_id: int, user_id: int) -> str:
        unique_suffix = uuid.uuid4().hex[:8].upper()
        year = datetime.utcnow().year
        return f"EDU-CERT-{year}-C{course_id}-U{user_id}-{unique_suffix}"

    def to_dict(self, include_details=True):
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "course_id": self.course_id,
            "issued_at": self.issued_at.isoformat() if self.issued_at else None,
            "certificate_code": self.certificate_code,
        }
        if include_details:
            if self.course:
                data["course_title"] = self.course.title
                data["instructor_name"] = self.course.instructor.name if self.course.instructor else "EduLearn Faculty"
            if self.user:
                data["recipient_name"] = self.user.name
        return data
