import React, { useState } from 'react';
import './Login.css';
import { useAuth } from './AuthContext';
import { fetchLogin } from './api';

const Login = ({ onSwitch }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLogin(email, password);
      login(data.user); // Set user in global context
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2 className="login-title">Sign In</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
          <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
          {error && <div className="login-error">{error}</div>}
          <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'SIGN IN'}</button>
        </form>
        <div className="login-signup">Don't have an account? <span className="login-signup-link" onClick={() => onSwitch('signup')}>Sign up!</span></div>
      </div>
    </div>
  );
};

export default Login;
