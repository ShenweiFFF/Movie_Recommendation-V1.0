import React, { useState } from 'react';
import { getRecommendations, addToFavorites } from '../services/api';
import MovieCard from './MovieCard';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState(() => {
    const cached = localStorage.getItem('movieRecommendations');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);
    localStorage.removeItem('movieRecommendations');
    setRecommendations(null);
    
    try {
      const response = await getRecommendations();
      setRecommendations(response.recommendations);
      localStorage.setItem('movieRecommendations', JSON.stringify(response.recommendations));
    } catch (error) {
      setError(error.response?.data?.error || '获取推荐失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (movie) => {
    try {
      await addToFavorites(movie);
      setFavorites([...favorites, movie.id]);
      alert('添加成功！');
    } catch (error) {
      alert('添加失败，请重试');
    }
  };

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h2>基于您的收藏，为您推荐</h2>
        {recommendations && (
          <button 
            className="refresh-btn"
            onClick={handleGetRecommendations}
          >
            重新推荐
          </button>
        )}
      </div>

      <div className="recommendations-content">
        {!recommendations && !loading && (
          <div className="empty-recommendations">
            <p>获取个性化电影推荐</p>
            <button 
              className="get-recommendations-btn"
              onClick={handleGetRecommendations}
            >
              获取推荐
            </button>
          </div>
        )}
        
        {loading && (
          <div className="loading-container">
            <div className="loading">正在生成推荐...</div>
            <p>正在分析您的观影喜好，请稍候</p>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        {recommendations && (
          <div className="movies-grid">
            {recommendations.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onFavorite={handleFavorite}
                isFavorite={favorites.includes(movie.id)}
                showDetails={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations; 