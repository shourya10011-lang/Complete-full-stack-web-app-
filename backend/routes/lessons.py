from flask import Blueprint, request, jsonify
from models import db, Course, Lesson, Enrollment, LessonProgress
from utils import token_required, optional_token

lessons_bp = Blueprint("lessons", __name__, url_prefix="/api/lessons")

@lessons_bp.route("/course/<int:course_id>", methods=["GET"])
@optional_token
def get_course_lessons(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": {"message": "Course not found.", "code": "NOT_FOUND"}}), 404

    is_enrolled = False
    completed_lesson_ids = set()

    if getattr(request, "current_user", None):
        user = request.current_user
        # Admins and course instructor have full access
        if user.role == "admin" or user.id == course.instructor_id:
            is_enrolled = True
        else:
            enrollment = Enrollment.query.filter_by(user_id=user.id, course_id=course.id).first()
            if enrollment:
                is_enrolled = True
                progresses = LessonProgress.query.filter_by(user_id=user.id, completed=True).all()
                completed_lesson_ids = {p.lesson_id for p in progresses}

    lessons = course.lessons.order_by(Lesson.order_index).all()
    results = []

    for lesson in lessons:
        is_locked = not is_enrolled and not lesson.is_preview
        lesson_data = lesson.to_dict(include_content=not is_locked)
        lesson_data["is_locked"] = is_locked
        lesson_data["completed"] = lesson.id in completed_lesson_ids
        results.append(lesson_data)

    return jsonify({
        "course_id": course_id,
        "is_enrolled": is_enrolled,
        "lessons": results
    }), 200

@lessons_bp.route("/<int:lesson_id>", methods=["GET"])
@optional_token
def get_lesson(lesson_id):
    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return jsonify({"error": {"message": "Lesson not found.", "code": "NOT_FOUND"}}), 404

    course = lesson.course
    is_enrolled = False
    is_completed = False

    if getattr(request, "current_user", None):
        user = request.current_user
        if user.role == "admin" or user.id == course.instructor_id:
            is_enrolled = True
        else:
            enrollment = Enrollment.query.filter_by(user_id=user.id, course_id=course.id).first()
            if enrollment:
                is_enrolled = True
                prog = LessonProgress.query.filter_by(user_id=user.id, lesson_id=lesson.id).first()
                if prog and prog.completed:
                    is_completed = True

    if not is_enrolled and not lesson.is_preview:
        return jsonify({
            "error": {
                "message": "This lesson is locked. Please enroll in the course to access full content.",
                "code": "LESSON_LOCKED"
            }
        }), 403

    data = lesson.to_dict(include_content=True)
    data["is_locked"] = False
    data["completed"] = is_completed
    data["course"] = {
        "id": course.id,
        "title": course.title,
        "category": course.category
    }

    return jsonify({"lesson": data}), 200
