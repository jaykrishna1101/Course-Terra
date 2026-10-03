import os
from flask import Flask
from flask_cors import CORS
from .config import config

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Configure CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['FRONTEND_URL']}})

    # Register blueprints (routes)
    from .routes.health import health_bp
    from .routes.courses import courses_bp
    from .routes.auth import auth_bp
    from .routes.admin import admin_bp
    from .routes.payments import payments_bp
    from .routes.lessons import lessons_bp
    
    app.register_blueprint(health_bp, url_prefix='/api/v1')
    app.register_blueprint(courses_bp, url_prefix='/api/v1/courses')
    app.register_blueprint(auth_bp, url_prefix='/api/v1/me')
    app.register_blueprint(admin_bp, url_prefix='/api/v1/admin')
    app.register_blueprint(payments_bp, url_prefix='/api/v1/payments')
    app.register_blueprint(lessons_bp, url_prefix='/api/v1/lessons')

    return app
