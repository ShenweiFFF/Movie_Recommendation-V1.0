import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// 配置 axios
axios.defaults.withCredentials = true;

export const register = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  return response.data;
};

export const logout = async () => {
  const response = await axios.get(`${API_BASE_URL}/auth/logout`);
  return response.data;
};

export const searchMovies = async (query) => {
  const response = await axios.get(`${API_BASE_URL}/movies/search`, {
    params: { query }
  });
  return response.data;
};

export const addToFavorites = async (movie) => {
  const response = await axios.post(`${API_BASE_URL}/movies/favorites`, movie);
  return response.data;
};

export const getFavorites = async () => {
  const response = await axios.get(`${API_BASE_URL}/movies/favorites`);
  return response.data;
};

export const getRecommendations = async () => {
  const response = await axios.get(`${API_BASE_URL}/movies/recommendations`);
  return response.data;
};

export const getTrendingMovies = async () => {
  const response = await axios.get(`${API_BASE_URL}/movies/trending`);
  return response.data;
};

export const removeFavorite = async (movieId) => {
  const response = await axios.delete(`${API_BASE_URL}/movies/favorites/${movieId}`);
  return response.data;
};

export const getMovieDetails = async (movieId) => {
  const response = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
  return response.data;
}; 