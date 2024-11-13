import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, addToFavorites, removeFavorite } from '../services/api';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  const loadMovieDetails = async () => {
    try {
      const data = await getMovieDetails(id);
      setMovie(data);
    } catch (error) {
      setError('加载电影详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(movie.id);
        setIsFavorite(false);
      } else {
        await addToFavorites(movie);
        setIsFavorite(true);
      }
    } catch (error) {
      alert(isFavorite ? '取消收藏失败' : '添加收藏失败');
    }
  };

  if (loading) return <div className="loading">加载中...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!movie) return null;

  return (
    <div className="movie-details">
      <div className="movie-details-content">
        <div className="movie-poster">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} 
          />
          <button 
            className={`favorite-btn ${isFavorite ? 'remove-favorite-btn' : ''}`}
            onClick={handleFavoriteClick}
          >
            {isFavorite ? '取消收藏' : '添加收藏'}
          </button>
        </div>
        
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <div className="movie-meta">
            <span>{movie.release_date}</span>
            <span> • </span>
            <span>{movie.runtime}分钟</span>
            <span> • </span>
            <span>评分：{movie.vote_average}</span>
          </div>
          
          <div className="movie-overview">
            <h3>剧情简介</h3>
            <p>{movie.overview}</p>
          </div>
          
          {movie.credits && (
            <div className="movie-cast">
              <h3>主要演员</h3>
              <div className="cast-list">
                {movie.credits.cast.slice(0, 6).map(actor => (
                  <div key={actor.id} className="cast-item">
                    <img 
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                    />
                    <div className="actor-name">{actor.name}</div>
                    <div className="character-name">{actor.character}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails; 