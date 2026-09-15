from flask import Blueprint, request, jsonify
from models import db, User, Enrollment, Course, Certificate
from utils import token_required, validate_profile_update

users_bp = Blueprint("users", __name__, url_prefix="/api/users")

@users_bp.route("/me/dashboard", methods=["GET"])
@token_required
def get_dashboard():
    user = request.current_user

    # Fetch user's enrollments
    enrollments = Enrollment.query.filter_by(user_id=user.id).all()

    in_progress = []
    completed = []

    for enr in enrollments:
        enr_dict = enr.to_dict(include_course=True)
        if enr.completed or enr.progress_percent >= 100.0:
            completed.append(enr_dict)
        else:
            in_progress.append(enr_dict)

    # Fetch user certificates
    certs = Certificate.query.filter_by(user_id=user.id).order_by(Certificate.issued_at.desc()).all()
    certificates_data = [c.to_dict(include_details=True) for c in certs]

    # Recommended courses (courses not yet enrolled in)
    enrolled_course_ids = {e.course_id for e in enrollments}
    recommended = Course.query.filter(
        Course.published == True,
        ~Course.id.in_(enrolled_course_ids) if enrolled_course_ids else True
    ).order_by(Course.rating_avg.desc()).limit(4).all()

    stats = {
        "total_enrolled": len(enrollments),
        "in_progress_count": len(in_progress),
        "completed_count": len(completed),
        "certificates_count": len(certs),
    }

    return jsonify({
        "user": user.to_dict(),
        "stats": stats,
        "in_progress_courses": in_progress,
        "completed_courses": completed,
        "certificates": certificates_data,
        "recommended_courses": [c.to_dict(include_lessons=False) for c in recommended]
    }), 200

@users_bp.route("/me", methods=["PUT"])
@token_required
def update_profile():
    user = request.current_user
    data = request.get_json() or {}

    error = validate_profile_update(data)
    if error:
        return jsonify({"error": {"message": error, "code": "VALIDATION_ERROR"}}), 400

    if "name" in data and data["name"].strip():
        user.name = data["name"].strip()
    if "bio" in data:
        user.bio = data["bio"].strip()
    if "avatar_url" in data and data["avatar_url"].strip():
        user.avatar_url = data["avatar_url"].strip()

    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully.",
        "user": user.to_dict()
    }), 200
