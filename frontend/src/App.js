import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import MovieList from './pages/MovieList';
import FavoritesList from './components/FavoritesList';
import Recommendations from './components/Recommendations';
import Login from './components/Login';
import Register from './components/Register';
import { logout } from './services/api';
import MovieDetails from './components/MovieDetails';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      alert('登出失败');
    }
  };

  if (!user) {
    return (
      <Router>
        <div className="App">
          {showRegister ? (
            <div>
              <Register onRegisterSuccess={() => setShowRegister(false)} />
              <button className="auth-switch-btn" onClick={() => setShowRegister(false)}>
                返回登录
              </button>
            </div>
          ) : (
            <div>
              <Login onLoginSuccess={setUser} />
              <button className="auth-switch-btn" onClick={() => setShowRegister(true)}>
                注册新账号
              </button>
            </div>
          )}
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="App">
        <nav className="nav-bar">
          <div className="nav-brand">电影推荐系统</div>
          <div className="nav-links">
            <Link to="/">搜索电影</Link>
            <Link to="/favorites">我的收藏</Link>
            <Link to="/recommendations">获取推荐</Link>
            <button onClick={handleLogout} className="logout-btn">
              登出
            </button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/favorites" element={<FavoritesList />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 