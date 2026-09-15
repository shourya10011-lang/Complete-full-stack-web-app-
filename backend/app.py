import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.exceptions import HTTPException

from config import Config
from models import db
from routes import (
    auth_bp,
    courses_bp,
    lessons_bp,
    enrollments_bp,
    lesson_progress_bp,
    reviews_bp,
    users_bp,
)

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for frontend clients
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")}},
        supports_credentials=True,
    )

    # Initialize Extensions
    db.init_app(app)
    jwt = JWTManager(app)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(courses_bp)
    app.register_blueprint(lessons_bp)
    app.register_blueprint(enrollments_bp)
    app.register_blueprint(lesson_progress_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(users_bp)

    # Health Check Endpoint
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "EduLearn API",
            "version": "1.0.0"
        }), 200

    # JWT Error Handlers
    @jwt.unauthorized_loader
    def custom_unauthorized_response(err_str):
        return jsonify({
            "error": {
                "message": "Missing authorization token in request headers.",
                "code": "MISSING_TOKEN"
            }
        }), 401

    @jwt.invalid_token_loader
    def custom_invalid_token_response(err_str):
        return jsonify({
            "error": {
                "message": f"Invalid authorization token: {err_str}",
                "code": "INVALID_TOKEN"
            }
        }), 401

    @jwt.expired_token_loader
    def custom_expired_token_response(jwt_header, jwt_payload):
        return jsonify({
            "error": {
                "message": "Token has expired. Please log in again.",
                "code": "TOKEN_EXPIRED"
            }
        }), 401

    # Centralized JSON Error Handlers
    @app.errorhandler(400)
    def handle_bad_request(e):
        return jsonify({
            "error": {
                "message": getattr(e, "description", "Bad Request"),
                "code": "BAD_REQUEST"
            }
        }), 400

    @app.errorhandler(401)
    def handle_unauthorized(e):
        return jsonify({
            "error": {
                "message": getattr(e, "description", "Authentication required."),
                "code": "UNAUTHORIZED"
            }
        }), 401

    @app.errorhandler(403)
    def handle_forbidden(e):
        return jsonify({
            "error": {
                "message": getattr(e, "description", "Access denied."),
                "code": "FORBIDDEN"
            }
        }), 403

    @app.errorhandler(404)
    def handle_not_found(e):
        return jsonify({
            "error": {
                "message": getattr(e, "description", "Requested resource was not found."),
                "code": "NOT_FOUND"
            }
        }), 404

    @app.errorhandler(405)
    def handle_method_not_allowed(e):
        return jsonify({
            "error": {
                "message": getattr(e, "description", "Method not allowed for this route."),
                "code": "METHOD_NOT_ALLOWED"
            }
        }), 405

    @app.errorhandler(500)
    def handle_internal_server_error(e):
        return jsonify({
            "error": {
                "message": "An internal server error occurred. Please try again later.",
                "code": "INTERNAL_SERVER_ERROR"
            }
        }), 500

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        return jsonify({
            "error": {
                "message": e.description,
                "code": e.name.upper().replace(" ", "_")
            }
        }), e.code

    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        app.logger.error(f"Unhandled Exception: {str(e)}", exc_info=True)
        return jsonify({
            "error": {
                "message": "An unexpected error occurred.",
                "code": "SERVER_ERROR"
            }
        }), 500

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
