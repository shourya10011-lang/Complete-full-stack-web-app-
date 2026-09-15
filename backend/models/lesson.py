from . import db

class Lesson(db.Model):
    __tablename__ = "lessons"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    order_index = db.Column(db.Integer, nullable=False, default=1)
    duration_minutes = db.Column(db.Integer, nullable=False, default=10)
    type = db.Column(db.Enum("video", "quiz", "reading", name="lesson_types"), nullable=False, default="video")
    video_url = db.Column(db.String(500), nullable=True)
    content_text = db.Column(db.Text, nullable=True)
    is_preview = db.Column(db.Boolean, nullable=False, default=False)

    # Relationships
    progress_records = db.relationship("LessonProgress", backref="lesson", lazy="dynamic", cascade="all, delete-orphan")

    def to_dict(self, include_content=True):
        data = {
            "id": self.id,
            "course_id": self.course_id,
            "title": self.title,
            "order_index": self.order_index,
            "duration_minutes": self.duration_minutes,
            "type": self.type,
            "is_preview": self.is_preview,
        }
        if include_content:
            data["video_url"] = self.video_url
            data["content_text"] = self.content_text
        return data
