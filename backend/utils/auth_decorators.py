from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models.user import User

def token_required(fn):
    """
    Decorator requiring a valid JWT bearer token.
    Attaches current User instance to request.current_user.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(int(user_id))
            if not user:
                return jsonify({
                    "error": {
                        "message": "User associated with token not found.",
                        "code": "USER_NOT_FOUND"
                    }
                }), 401
            request.current_user = user
        except Exception as e:
            return jsonify({
                "error": {
                    "message": f"Authentication required or invalid token: {str(e)}",
                    "code": "UNAUTHORIZED"
                }
            }), 401
        return fn(*args, **kwargs)
    return wrapper

def role_required(*allowed_roles):
    """
    Decorator enforcing user role permissions (e.g., 'instructor', 'admin').
    Must be used along with or after token_required.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            current_user = getattr(request, "current_user", None)
            if not current_user:
                try:
                    verify_jwt_in_request()
                    user_id = get_jwt_identity()
                    current_user = User.query.get(int(user_id))
                    request.current_user = current_user
                except Exception:
                    return jsonify({
                        "error": {
                            "message": "Authentication required.",
                            "code": "UNAUTHORIZED"
                        }
                    }), 401

            if not current_user or current_user.role not in allowed_roles:
                return jsonify({
                    "error": {
                        "message": f"Access denied. Requires one of roles: {', '.join(allowed_roles)}",
                        "code": "FORBIDDEN"
                    }
                }), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def optional_token(fn):
    """
    Optional token decorator: attaches current_user if valid token present,
    but proceeds without error if not present.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        request.current_user = None
        try:
            verify_jwt_in_request(optional=True)
            identity = get_jwt_identity()
            if identity:
                request.current_user = User.query.get(int(identity))
        except Exception:
            request.current_user = None
        return fn(*args, **kwargs)
    return wrapper
