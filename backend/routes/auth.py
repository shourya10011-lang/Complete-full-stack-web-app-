from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import db, User
from utils import token_required, validate_signup, validate_login

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}
    error = validate_signup(data)
    if error:
        return jsonify({"error": {"message": error, "code": "VALIDATION_ERROR"}}), 400

    email = data["email"].strip().lower()
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": {"message": "An account with this email already exists.", "code": "EMAIL_EXISTS"}}), 400

    user = User(
        name=data["name"].strip(),
        email=email,
        role=data.get("role", "student"),
        avatar_url=data.get("avatar_url", f"https://api.dicebear.com/7.x/initials/svg?seed={data['name'].strip()}"),
        bio=data.get("bio", "")
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({
        "message": "User registered successfully.",
        "token": token,
        "user": user.to_dict()
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    error = validate_login(data)
    if error:
        return jsonify({"error": {"message": error, "code": "VALIDATION_ERROR"}}), 400

    email = data["email"].strip().lower()
    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"error": {"message": "Invalid email or password.", "code": "INVALID_CREDENTIALS"}}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({
        "message": "Login successful.",
        "token": token,
        "user": user.to_dict()
    }), 200

@auth_bp.route("/me", methods=["GET"])
@token_required
def get_me():
    user = request.current_user
    return jsonify({
        "user": user.to_dict()
    }), 200
