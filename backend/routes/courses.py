from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from models import db, Course, Lesson, Enrollment, Review
from utils import token_required, role_required, optional_token, validate_course

courses_bp = Blueprint("courses", __name__, url_prefix="/api/courses")

@courses_bp.route("", methods=["GET"])
def get_courses():
    category = request.args.get("category")
    difficulty = request.args.get("difficulty")
    search = request.args.get("search")
    sort = request.args.get("sort", "popular") # popular, newest, rating, price_asc, price_desc
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 9, type=int)

    query = Course.query.filter_by(published=True)

    if category and category.lower() != "all":
        query = query.filter(Course.category.ilike(category))

    if difficulty and difficulty.lower() != "all":
        query = query.filter(Course.difficulty == difficulty.lower())

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Course.title.ilike(search_term),
                Course.description.ilike(search_term),
                Course.category.ilike(search_term)
            )
        )

    # Sorting
    if sort == "newest":
        query = query.order_by(Course.created_at.desc())
    elif sort == "rating":
        query = query.order_by(Course.rating_avg.desc(), Course.rating_count.desc())
    elif sort == "price_asc":
        query = query.order_by(Course.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Course.price.desc())
    else: # default: popular
        query = query.order_by(Course.student_count.desc(), Course.rating_avg.desc())

    pagination = query.paginate(page=page, per_page=limit, error_out=False)
    courses = [c.to_dict(include_lessons=False) for c in pagination.items]

    return jsonify({
        "courses": courses,
        "total": pagination.total,
        "page": page,
        "limit": limit,
        "pages": pagination.pages,
        "has_next": pagination.has_next,
        "has_prev": pagination.has_prev,
    }), 200

@courses_bp.route("/<int:course_id>", methods=["GET"])
@optional_token
def get_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": {"message": "Course not found.", "code": "COURSE_NOT_FOUND"}}), 404

    course_data = course.to_dict(include_lessons=True, include_instructor=True)

    # Check if current user is enrolled
    is_enrolled = False
    enrollment_data = None
    if getattr(request, "current_user", None):
        enrollment = Enrollment.query.filter_by(
            user_id=request.current_user.id,
            course_id=course.id
        ).first()
        if enrollment:
            is_enrolled = True
            enrollment_data = enrollment.to_dict(include_course=False)

    course_data["is_enrolled"] = is_enrolled
    course_data["enrollment"] = enrollment_data

    return jsonify({"course": course_data}), 200

@courses_bp.route("", methods=["POST"])
@token_required
@role_required("instructor", "admin")
def create_course():
    data = request.get_json() or {}
    error = validate_course(data, is_update=False)
    if error:
        return jsonify({"error": {"message": error, "code": "VALIDATION_ERROR"}}), 400

    course = Course(
        title=data["title"].strip(),
        description=data["description"].strip(),
        instructor_id=request.current_user.id,
        category=data["category"].strip(),
        difficulty=data.get("difficulty", "beginner"),
        price=data.get("price", 0.0),
        discount_price=data.get("discount_price"),
        thumbnail_url=data.get("thumbnail_url", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=380&fit=crop"),
        duration_hours=data.get("duration_hours", 0.0),
        published=data.get("published", True)
    )

    db.session.add(course)
    db.session.commit()

    return jsonify({
        "message": "Course created successfully.",
        "course": course.to_dict(include_lessons=True)
    }), 201

@courses_bp.route("/<int:course_id>", methods=["PUT"])
@token_required
@role_required("instructor", "admin")
def update_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": {"message": "Course not found.", "code": "NOT_FOUND"}}), 404

    # Allow if admin or instructor of this course
    if request.current_user.role != "admin" and course.instructor_id != request.current_user.id:
        return jsonify({"error": {"message": "You can only edit your own courses.", "code": "FORBIDDEN"}}), 403

    data = request.get_json() or {}
    error = validate_course(data, is_update=True)
    if error:
        return jsonify({"error": {"message": error, "code": "VALIDATION_ERROR"}}), 400

    if "title" in data:
        course.title = data["title"].strip()
    if "description" in data:
        course.description = data["description"].strip()
    if "category" in data:
        course.category = data["category"].strip()
    if "difficulty" in data:
        course.difficulty = data["difficulty"]
    if "price" in data:
        course.price = data["price"]
    if "discount_price" in data:
        course.discount_price = data["discount_price"]
    if "thumbnail_url" in data:
        course.thumbnail_url = data["thumbnail_url"]
    if "duration_hours" in data:
        course.duration_hours = data["duration_hours"]
    if "published" in data:
        course.published = data["published"]

    db.session.commit()
    return jsonify({
        "message": "Course updated successfully.",
        "course": course.to_dict(include_lessons=True)
    }), 200

@courses_bp.route("/<int:course_id>", methods=["DELETE"])
@token_required
@role_required("instructor", "admin")
def delete_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": {"message": "Course not found.", "code": "NOT_FOUND"}}), 404

    if request.current_user.role != "admin" and course.instructor_id != request.current_user.id:
        return jsonify({"error": {"message": "You can only delete your own courses.", "code": "FORBIDDEN"}}), 403

    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "Course deleted successfully."}), 200
