from datetime import datetime
from flask import Blueprint, request, jsonify
from models import db, Enrollment, Course, Certificate
from utils import token_required, validate_enrollment

enrollments_bp = Blueprint("enrollments", __name__, url_prefix="/api/enrollments")

@enrollments_bp.route("", methods=["POST"])
@token_required
def enroll():
    data = request.get_json() or {}
    error = validate_enrollment(data)
    if error:
        return jsonify({"error": {"message": error, "code": "VALIDATION_ERROR"}}), 400

    course_id = int(data["course_id"])
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": {"message": "Course not found.", "code": "NOT_FOUND"}}), 404

    existing = Enrollment.query.filter_by(
        user_id=request.current_user.id,
        course_id=course_id
    ).first()

    if existing:
        return jsonify({
            "message": "Already enrolled in this course.",
            "enrollment": existing.to_dict(include_course=True)
        }), 200

    enrollment = Enrollment(
        user_id=request.current_user.id,
        course_id=course_id,
        progress_percent=0.0,
        completed=False
    )

    course.student_count = (course.student_count or 0) + 1
    db.session.add(enrollment)
    db.session.commit()

    return jsonify({
        "message": "Successfully enrolled in course.",
        "enrollment": enrollment.to_dict(include_course=True)
    }), 201

@enrollments_bp.route("/me", methods=["GET"])
@token_required
def get_my_enrollments():
    user = request.current_user
    enrollments = Enrollment.query.filter_by(user_id=user.id).order_by(Enrollment.enrolled_at.desc()).all()

    return jsonify({
        "enrollments": [e.to_dict(include_course=True) for e in enrollments],
        "count": len(enrollments)
    }), 200

@enrollments_bp.route("/<int:enrollment_id>/progress", methods=["PUT"])
@token_required
def update_progress(enrollment_id):
    enrollment = Enrollment.query.get(enrollment_id)
    if not enrollment:
        return jsonify({"error": {"message": "Enrollment not found.", "code": "NOT_FOUND"}}), 404

    if enrollment.user_id != request.current_user.id and request.current_user.role != "admin":
        return jsonify({"error": {"message": "Unauthorized.", "code": "FORBIDDEN"}}), 403

    data = request.get_json() or {}
    progress_val = data.get("progress_percent")
    if progress_val is None:
        return jsonify({"error": {"message": "progress_percent is required.", "code": "VALIDATION_ERROR"}}), 400

    try:
        progress_val = float(progress_val)
        if progress_val < 0 or progress_val > 100:
            return jsonify({"error": {"message": "progress_percent must be between 0 and 100.", "code": "VALIDATION_ERROR"}}), 400
    except (ValueError, TypeError):
        return jsonify({"error": {"message": "Invalid progress value.", "code": "VALIDATION_ERROR"}}), 400

    enrollment.progress_percent = progress_val
    if progress_val >= 100.0 and not enrollment.completed:
        enrollment.completed = True
        enrollment.completed_at = datetime.utcnow()

        # Issue certificate if not already issued
        cert = Certificate.query.filter_by(user_id=enrollment.user_id, course_id=enrollment.course_id).first()
        if not cert:
            cert = Certificate(
                user_id=enrollment.user_id,
                course_id=enrollment.course_id,
                certificate_code=Certificate.generate_code(enrollment.course_id, enrollment.user_id)
            )
            db.session.add(cert)

    db.session.commit()
    return jsonify({
        "message": "Progress updated successfully.",
        "enrollment": enrollment.to_dict(include_course=True)
    }), 200
