from flask import Blueprint, jsonify, request, current_app
from flask_login import login_required, current_user
from ..services.tmdb_service import TMDBService
from ..services.openai_service import OpenAIService
from ..models import db, Movie
from datetime import datetime

movies_bp = Blueprint('movies', __name__)

def get_tmdb_service():
    return TMDBService(current_app.config['TMDB_API_KEY'])

def get_openai_service():
    return OpenAIService(current_app.config['OPENAI_API_KEY'])

@movies_bp.route('/search')
def search_movies():
    query = request.args.get('query', '')
    page = request.args.get('page', 1)
    tmdb_service = get_tmdb_service()
    results = tmdb_service.search_movies(query, page)
    return jsonify(results)

@movies_bp.route('/favorites', methods=['POST'])
@login_required
def add_to_favorites():
    movie_data = request.json
    movie = Movie.query.filter_by(tmdb_id=movie_data['id']).first()
    
    if not movie:
        release_date = None
        if movie_data.get('release_date'):
            try:
                release_date = datetime.strptime(movie_data['release_date'], '%Y-%m-%d').date()
            except ValueError:
                pass

        movie = Movie(
            tmdb_id=movie_data['id'],
            title=movie_data['title'],
            overview=movie_data.get('overview', ''),
            poster_path=movie_data.get('poster_path', ''),
            release_date=release_date
        )
        db.session.add(movie)
    
    if movie not in current_user.favorites:
        current_user.favorites.append(movie)
        db.session.commit()
        return jsonify({"message": "添加成功"})
    return jsonify({"message": "电影已在收藏列表中"})

@movies_bp.route('/recommendations')
@login_required
def get_recommendations():
    favorite_movies = [movie.title for movie in current_user.favorites]
    if not favorite_movies:
        return jsonify({"error": "请先添加喜欢的电影"}), 400
        
    openai_service = get_openai_service()
    tmdb_service = get_tmdb_service()
    
    # 获取推荐的电影名称列表
    movie_names = openai_service.get_movie_recommendations(favorite_movies)
    
    # 搜索每个电影的详细信息
    recommendations = []
    for movie_name in movie_names:
        # 从电影名中提取年份
        movie_title = movie_name.split('(')[0].strip()
        search_results = tmdb_service.search_movies(movie_title)
        
        if search_results.get('results'):
            # 获取第一个搜索结果
            movie_info = search_results['results'][0]
            recommendations.append({
                'id': movie_info['id'],
                'title': movie_info['title'],
                'original_title': movie_info.get('original_title'),
                'overview': movie_info.get('overview', ''),
                'poster_path': movie_info.get('poster_path'),
                'release_date': movie_info.get('release_date'),
                'vote_average': movie_info.get('vote_average')
            })
    
    return jsonify({"recommendations": recommendations})

@movies_bp.route('/favorites', methods=['GET'])
@login_required
def get_favorites():
    favorites = [{
        'id': movie.tmdb_id,
        'title': movie.title,
        'overview': movie.overview,
        'poster_path': movie.poster_path,
        'release_date': movie.release_date.isoformat() if movie.release_date else None
    } for movie in current_user.favorites]
    return jsonify(favorites)

@movies_bp.route('/trending')
def get_trending_movies():
    page = request.args.get('page', 1)
    tmdb_service = get_tmdb_service()
    results = tmdb_service.get_trending_movies(page)
    return jsonify(results)

@movies_bp.route('/favorites/<int:movie_id>', methods=['DELETE'])
@login_required
def remove_from_favorites(movie_id):
    movie = Movie.query.filter_by(tmdb_id=movie_id).first()
    if movie and movie in current_user.favorites:
        current_user.favorites.remove(movie)
        db.session.commit()
        return jsonify({"message": "已从收藏中移除"})
    return jsonify({"error": "电影未找到或未收藏"}), 404

@movies_bp.route('/<int:movie_id>')
def get_movie_details(movie_id):
    try:
        tmdb_service = get_tmdb_service()
        movie_details = tmdb_service.get_movie_details(movie_id)
        if movie_details.get('status_code') == 34:  # TMDB API 电影未找到的状态码
            return jsonify({"error": "电影未找到"}), 404
        return jsonify(movie_details)
    except Exception as e:
        return jsonify({"error": "获取电影详情失败"}), 500