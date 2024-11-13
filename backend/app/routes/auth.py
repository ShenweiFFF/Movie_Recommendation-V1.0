from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, login_required
from ..models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "用户名已存在"}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "邮箱已被注册"}), 400
    
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    
    return jsonify({"message": "注册成功"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']):
        session.permanent = True
        login_user(user, remember=True)
        return jsonify({
            "message": "登录成功",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        })
    
    return jsonify({"error": "用户名或密码错误"}), 401

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "登出成功"}) 