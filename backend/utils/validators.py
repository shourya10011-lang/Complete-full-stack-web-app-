import re

EMAIL_REGEX = re.compile(r"^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$")

def validate_signup(data):
    if not isinstance(data, dict):
        return "Request body must be a JSON object"
    
    name = data.get("name", "").strip() if data.get("name") else ""
    email = data.get("email", "").strip().lower() if data.get("email") else ""
    password = data.get("password", "")

    if not name or len(name) < 2:
        return "Full name must be at least 2 characters long."
    if not email or not EMAIL_REGEX.match(email):
        return "A valid email address is required."
    if not password or len(password) < 6:
        return "Password must be at least 6 characters long."
    
    role = data.get("role", "student")
    if role not in ["student", "instructor", "admin"]:
        return "Role must be 'student', 'instructor', or 'admin'."
    
    return None

def validate_login(data):
    if not isinstance(data, dict):
        return "Request body must be a JSON object"
    email = data.get("email", "").strip().lower() if data.get("email") else ""
    password = data.get("password", "")
    if not email or not EMAIL_REGEX.match(email):
        return "A valid email address is required."
    if not password:
        return "Password is required."
    return None

def validate_course(data, is_update=False):
    if not isinstance(data, dict):
        return "Request body must be a JSON object"

    if not is_update:
        if not data.get("title") or len(str(data["title"]).strip()) < 3:
            return "Title is required and must be at least 3 characters."
        if not data.get("description") or len(str(data["description"]).strip()) < 10:
            return "Description is required and must be at least 10 characters."
        if not data.get("category"):
            return "Category is required."

    difficulty = data.get("difficulty")
    if difficulty and difficulty not in ["beginner", "intermediate", "advanced"]:
        return "Difficulty must be 'beginner', 'intermediate', or 'advanced'."

    if "price" in data:
        try:
            price_val = float(data["price"])
            if price_val < 0:
                return "Price must be non-negative."
        except (ValueError, TypeError):
            return "Price must be a valid number."

    if "discount_price" in data and data["discount_price"] is not None:
        try:
            disc_val = float(data["discount_price"])
            if disc_val < 0:
                return "Discount price must be non-negative."
        except (ValueError, TypeError):
            return "Discount price must be a valid number."

    return None

def validate_review(data):
    if not isinstance(data, dict):
        return "Request body must be a JSON object"
    
    rating = data.get("rating")
    if rating is None:
        return "Rating is required."
    try:
        rating_int = int(rating)
        if rating_int < 1 or rating_int > 5:
            return "Rating must be an integer between 1 and 5."
    except (ValueError, TypeError):
        return "Rating must be an integer between 1 and 5."

    comment = data.get("comment", "")
    if comment and len(str(comment).strip()) > 2000:
        return "Comment cannot exceed 2000 characters."

    return None

def validate_lesson_progress(data):
    if not isinstance(data, dict):
        return "Request body must be a JSON object"
    lesson_id = data.get("lesson_id")
    if not lesson_id:
        return "lesson_id is required."
    try:
        int(lesson_id)
    except (ValueError, TypeError):
        return "lesson_id must be a valid integer."
    return None

def validate_enrollment(data):
    if not isinstance(data, dict):
        return "Request body must be a JSON object"
    course_id = data.get("course_id")
    if not course_id:
        return "course_id is required."
    try:
        int(course_id)
    except (ValueError, TypeError):
        return "course_id must be a valid integer."
    return None

def validate_profile_update(data):
    if not isinstance(data, dict):
        return "Request body must be a JSON object"
    if "name" in data and len(str(data["name"]).strip()) < 2:
        return "Name must be at least 2 characters long."
    if "email" in data and not EMAIL_REGEX.match(str(data["email"]).strip().lower()):
        return "Invalid email address."
    return None
