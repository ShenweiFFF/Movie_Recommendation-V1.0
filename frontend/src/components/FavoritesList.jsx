import React, { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from '../services/api';
import MovieCard from './MovieCard';

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      alert('加载收藏列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (movieId) => {
    try {
      await removeFavorite(movieId);
      // 从列表中移除该电影
      setFavorites(favorites.filter(movie => movie.id !== movieId));
      alert('已从收藏中移除');
    } catch (error) {
      alert('取消收藏失败，请重试');
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="favorites-container">
      <h2>我的收藏</h2>
      {favorites.length === 0 ? (
        <p className="no-favorites">还没有收藏任何电影</p>
      ) : (
        <div className="movies-grid">
          {favorites.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={true}
              onRemoveFavorite={handleRemoveFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList; 