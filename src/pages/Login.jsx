import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login/', {
        email: formData.email,
        password: formData.password,
      });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#ECE9E9', color: '#000000ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', width: '90%', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1>AI Workout Tracker</h1>
          <p>Your Personal AI-Powered Fitness Journey</p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <button style={{ backgroundColor: '#c6e469', color: '#000', border: 'none', borderRadius: '5px', padding: '10px', width: '100%', marginBottom: '10px' }} onClick={() => navigate('/register')}>Sign Up Free</button>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="email"
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="password"
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
            </div>
            {errors.general && <div style={{ color: 'red' }}>{errors.general}</div>}
            <button type="submit" style={{ backgroundColor: 'transparent', color: '#000000ff', border: '1px solid #000000ff', borderRadius: '5px', padding: '10px', width: '100%', marginBottom: '10px' }}>Login</button>
          </form>
          <button style={{ backgroundColor: '#ffd700', color: '#000', border: 'none', borderRadius: '5px', padding: '10px', width: '100%', marginBottom: '10px' }}>Upgrade to Premium – Get 50% OFF</button>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✓ AI Workouts</li>
          <li>✓ Progress Tracking</li>
          <li>✓ 1000+ Exercises</li>
        </ul>
      </div>
    </div>
  );
};

export default Login;
