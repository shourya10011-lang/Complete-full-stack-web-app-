from datetime import datetime
from flask import Blueprint, request, jsonify
from models import db, Lesson, Enrollment, LessonProgress, Certificate
from utils import token_required, validate_lesson_progress

lesson_progress_bp = Blueprint("lesson_progress", __name__, url_prefix="/api/lesson-progress")

@lesson_progress_bp.route("", methods=["POST"])
@token_required
def mark_lesson_complete():
    data = request.get_json() or {}
    error = validate_lesson_progress(data)
    if error:
        return jsonify({"error": {"message": error, "code": "VALIDATION_ERROR"}}), 400

    lesson_id = int(data["lesson_id"])
    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return jsonify({"error": {"message": "Lesson not found.", "code": "NOT_FOUND"}}), 404

    user = request.current_user
    course = lesson.course

    # Check enrollment
    enrollment = Enrollment.query.filter_by(user_id=user.id, course_id=course.id).first()
    if not enrollment:
        # Auto-enroll student if taking preview lesson or clicking complete
        enrollment = Enrollment(
            user_id=user.id,
            course_id=course.id,
            progress_percent=0.0,
            completed=False
        )
        course.student_count = (course.student_count or 0) + 1
        db.session.add(enrollment)
        db.session.flush()

    # Find or create lesson progress
    progress_record = LessonProgress.query.filter_by(user_id=user.id, lesson_id=lesson_id).first()
    if not progress_record:
        progress_record = LessonProgress(
            user_id=user.id,
            lesson_id=lesson_id,
            completed=True,
            completed_at=datetime.utcnow()
        )
        db.session.add(progress_record)
    else:
        progress_record.completed = True
        progress_record.completed_at = datetime.utcnow()

    db.session.flush()

    # Recalculate course progress
    total_lessons = Lesson.query.filter_by(course_id=course.id).count()
    if total_lessons > 0:
        completed_lessons = (
            db.session.query(LessonProgress)
            .join(Lesson, Lesson.id == LessonProgress.lesson_id)
            .filter(
                Lesson.course_id == course.id,
                LessonProgress.user_id == user.id,
                LessonProgress.completed == True
            )
            .count()
        )
        new_percent = min(100.0, round((completed_lessons / total_lessons) * 100.0, 1))
    else:
        new_percent = 100.0

    enrollment.progress_percent = new_percent

    certificate_issued = None
    if new_percent >= 100.0 and not enrollment.completed:
        enrollment.completed = True
        enrollment.completed_at = datetime.utcnow()

        cert = Certificate.query.filter_by(user_id=user.id, course_id=course.id).first()
        if not cert:
            cert = Certificate(
                user_id=user.id,
                course_id=course.id,
                certificate_code=Certificate.generate_code(course.id, user.id)
            )
            db.session.add(cert)
            db.session.flush()
            certificate_issued = cert.to_dict(include_details=True)

    db.session.commit()

    return jsonify({
        "message": "Lesson progress updated.",
        "lesson_id": lesson_id,
        "completed": True,
        "course_id": course.id,
        "progress_percent": enrollment.progress_percent,
        "course_completed": enrollment.completed,
        "certificate": certificate_issued
    }), 200
