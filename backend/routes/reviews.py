from flask import Blueprint, request, jsonify
from sqlalchemy import func
from models import db, Review, Course, Enrollment
from utils import token_required, validate_review

reviews_bp = Blueprint("reviews", __name__, url_prefix="/api/reviews")

@reviews_bp.route("/course/<int:course_id>", methods=["GET"])
def get_course_reviews(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": {"message": "Course not found.", "code": "NOT_FOUND"}}), 404

    reviews = Review.query.filter_by(course_id=course_id).order_by(Review.created_at.desc()).all()

    # Rating breakdown
    breakdown = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    total_rating = 0
    for r in reviews:
        if 1 <= r.rating <= 5:
            breakdown[r.rating] += 1
            total_rating += r.rating

    total_count = len(reviews)
    avg_rating = round(total_rating / total_count, 1) if total_count > 0 else 0.0

    return jsonify({
        "course_id": course_id,
        "rating_avg": avg_rating,
        "rating_count": total_count,
        "breakdown": breakdown,
        "reviews": [r.to_dict(include_user=True) for r in reviews]
    }), 200

@reviews_bp.route("/course/<int:course_id>", methods=["POST"])
@token_required
def submit_review(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": {"message": "Course not found.", "code": "NOT_FOUND"}}), 404

    user = request.current_user

    # Must be enrolled (or admin/instructor testing)
    enrollment = Enrollment.query.filter_by(user_id=user.id, course_id=course_id).first()
    if not enrollment and user.role not in ["admin"]:
        return jsonify({
            "error": {
                "message": "You must be enrolled in this course to leave a review.",
                "code": "NOT_ENROLLED"
            }
        }), 403

    # One review per user
    existing = Review.query.filter_by(user_id=user.id, course_id=course_id).first()
    if existing:
        return jsonify({
            "error": {
                "message": "You have already submitted a review for this course.",
                "code": "REVIEW_ALREADY_EXISTS"
            }
        }), 400

    data = request.get_json() or {}
    error = validate_review(data)
    if error:
        return jsonify({"error": {"message": error, "code": "VALIDATION_ERROR"}}), 400

    rating_val = int(data["rating"])
    comment_val = data.get("comment", "").strip()

    review = Review(
        user_id=user.id,
        course_id=course_id,
        rating=rating_val,
        comment=comment_val
    )
    db.session.add(review)
    db.session.flush()

    # Recalculate course rating_avg and rating_count
    stats = db.session.query(
        func.avg(Review.rating),
        func.count(Review.id)
    ).filter(Review.course_id == course_id).first()

    course.rating_avg = round(float(stats[0] or 0.0), 1)
    course.rating_count = int(stats[1] or 0)

    db.session.commit()

    return jsonify({
        "message": "Review submitted successfully.",
        "review": review.to_dict(include_user=True)
    }), 201
