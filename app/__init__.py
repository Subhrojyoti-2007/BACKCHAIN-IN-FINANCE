import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

from .config import Config
from .extensions import db, jwt

def create_app(config_class=Config):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    STATIC_DIR = os.path.join(BASE_DIR, 'dist')
    
    app = Flask(__name__, static_folder=STATIC_DIR)
    app.config.from_object(config_class)
    
    CORS(app)
    
    # Initialize Flask extensions here
    db.init_app(app)
    jwt.init_app(app)
    
    # Register blueprints here
    # from app.routes.auth import auth_bp
    # app.register_blueprint(auth_bp, url_prefix='/api')
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path.startswith("api/"):
            return jsonify({"error": "Not Found"}), 404
            
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')
            
    return app
