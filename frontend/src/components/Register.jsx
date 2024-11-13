import React, { useState } from 'react';
import { register } from '../services/api';

const Register = ({ onRegisterSuccess }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(userData);
      alert('注册成功！请登录');
      onRegisterSuccess();
    } catch (error) {
      alert(error.response?.data?.error || '注册失败');
    }
  };

  return (
    <div className="auth-container">
      <h2>注册</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="用户名"
          value={userData.username}
          onChange={(e) => setUserData({...userData, username: e.target.value})}
        />
        <input
          type="email"
          placeholder="邮箱"
          value={userData.email}
          onChange={(e) => setUserData({...userData, email: e.target.value})}
        />
        <input
          type="password"
          placeholder="密码"
          value={userData.password}
          onChange={(e) => setUserData({...userData, password: e.target.value})}
        />
        <button type="submit">注册</button>
      </form>
    </div>
  );
};

export default Register; 