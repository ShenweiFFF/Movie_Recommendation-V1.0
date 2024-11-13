import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { searchMovies, addToFavorites, getTrendingMovies } from '../services/api';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  const loadTrendingMovies = async () => {
    try {
      const results = await getTrendingMovies();
      setMovies(results.results);
    } catch (error) {
      console.error('加载热门电影失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadTrendingMovies();
      return;
    }
    setLoading(true);
    try {
      const results = await searchMovies(searchQuery);
      setMovies(results.results);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (movie) => {
    try {
      await addToFavorites(movie);
      alert('添加成功！');
    } catch (error) {
      alert('添加失败，请重试');
    }
  };

  return (
    <div className="movie-list">
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索电影..."
        />
        <button onClick={handleSearch}>搜索</button>
      </div>
      
      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <>
          <h2 className="section-title">
            {searchQuery ? '搜索结果' : '本周热门电影'}
          </h2>
          <div className="movies-grid">
            {movies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MovieList; 