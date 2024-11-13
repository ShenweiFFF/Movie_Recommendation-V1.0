from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from .models import db, User
from .routes.movies import movies_bp
from .routes.auth import auth_bp
from config import Config

login_manager = LoginManager()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # 初始化扩展
    CORS(app, supports_credentials=True)
    db.init_app(app)
    login_manager.init_app(app)
    
    # 配置会话持久化
    app.config['REMEMBER_COOKIE_DURATION'] = 86400  # 24小时
    app.config['PERMANENT_SESSION_LIFETIME'] = 86400  # 24小时
    app.config['SESSION_COOKIE_SECURE'] = False  # 开发环境设为False
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    
    # 注册蓝图
    app.register_blueprint(movies_bp, url_prefix='/api/movies')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    return app