import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Main.css';

function OwnerLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isLogin) {
      // Login
      try {
        const response = await axios.post(`https://lapinfo-backend-2.onrender.com/owner/login`, {
          username,
          password,
        });
        const data = response.data;
        console.log('Login success:', data);
        localStorage.setItem('username', data.owner.username);
        localStorage.setItem('id', data.owner._id);
        localStorage.setItem('userType', 'owner');
        setError('');
        navigate('/owner/add-shop'); 
      } catch (error) {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error('Server error:', error.response.data);
          setError(error.response.data.message || 'Incorrect username or password');
        } else if (error.request) {
          // Request was made but no response received
          console.error('No response received:', error.request);
          setError('No response from server. Please try again later.');
        } else {
          // Other errors
          console.error('Error:', error.message);
          setError('An unexpected error occurred.');
        }
      }
    } else {
      // Registration
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      try {
        const response = await axios.post(`https://lapinfo-backend-2.onrender.com/owner/register`, {
          username,
          password,
        });
        const data = response.data;
        console.log('Registration success:', data);
        setSuccess(true);
        setError('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        navigate('/owner/add-shop');
      } catch (error) {
        if (error.response) {
          console.error('Server error:', error.response.data);
          setError(error.response.data.message || 'Registration failed');
        } else if (error.request) {
          console.error('No response received:', error.request);
          setError('No response from server. Please try again later.');
        } else {
          console.error('Error:', error.message);
          setError('An unexpected error occurred.');
        }
      }
    }
  };
  

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess(false);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Owner Login' : 'Owner Registration'}</h2>
      <div className="container-elements">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        {!isLogin && (
          <>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <br />
          </>
        )}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      {error && <p className="error-message" style={{color:"rgb(255, 172, 18)"}}>{error}</p>}
      {success && <p className="success-message" style={{color:"rgb(255, 172, 18)"}}>Registration successful!</p>}
      <p style={{color:"rgb(255, 255, 255)"}}>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button type="button" onClick={toggleMode}>
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
      </div>
    </div>
  );
}

export default OwnerLogin;