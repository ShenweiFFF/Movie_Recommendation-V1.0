import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie, onFavorite, onRemoveFavorite, isFavorite }) => {
  const navigate = useNavigate();

  const handlePosterClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card">
      <div className="movie-poster" onClick={handlePosterClick}>
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title}
          className="clickable-poster"
        />
      </div>
      <div className="movie-card-content">
        <h3 className="clickable-title" onClick={handlePosterClick}>{movie.title}</h3>
        <p>{movie.overview}</p>
        {isFavorite ? (
          <button 
            onClick={() => onRemoveFavorite(movie.id)}
            className="remove-favorite-btn"
          >
            取消收藏
          </button>
        ) : (
          <button onClick={() => onFavorite(movie)}>
            添加到收藏
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard; 