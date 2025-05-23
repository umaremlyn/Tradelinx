import React, { useState } from 'react';
import './SignUp.css';
import { useAuth } from './AuthContext';
import { fetchRegister } from './api';

const NIGERIA_CODE = '+234';

const SignUp = ({ onSwitch }) => {
  const { login } = useAuth();
  const [role, setRole] = useState('merchant');
  const [form, setForm] = useState({
    businessName: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRole = r => setRole(r);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let user;
      if (role === 'merchant') {
        user = await fetchRegister(form.email, form.password, role, form.businessName, form.phone, form.address);
      } else {
        user = await fetchRegister(form.email, form.password, role, form.name, form.phone);
      }
      login(user.user); // Set user in global context
      onSwitch && onSwitch('login');
    } catch (err) {
      // Show backend error if available
      if (err && err.message) {
        setError(err.message);
      } else {
        setError('Sign up failed. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-bg">
      <div className="signup-card">
        <button className="signup-back" onClick={onSwitch}>&larr;</button>
        <h2 className="signup-title">Sign Up</h2>
        <div className="signup-tabs">
          <button className={`signup-tab${role === 'merchant' ? ' active' : ''}`} onClick={() => handleRole('merchant')}>Merchant</button>
          <button className={`signup-tab${role === 'buyer' ? ' active' : ''}`} onClick={() => handleRole('buyer')}>Buyer</button>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          {error && <div className="signup-error">{error}</div>}
          {role === 'merchant' ? (
            <>
              <label>Business Name<input name="businessName" value={form.businessName} onChange={handleChange} required /></label>
              <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} required /></label>
              <label>Password<input name="password" type="password" value={form.password} onChange={handleChange} required /></label>
              <label>Confirm Password<input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required /></label>
              <label>Phone Number<div className="signup-phone"><span className="signup-flag">🇳🇬</span><span className="signup-code">{NIGERIA_CODE}</span><input name="phone" value={form.phone} onChange={handleChange} required /></div></label>
              <label>Business Address<input name="address" value={form.address} onChange={handleChange} required /></label>
            </>
          ) : (
            <>
              <label>Name<input name="name" value={form.name} onChange={handleChange} required /></label>
              <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} required /></label>
              <label>Password<input name="password" type="password" value={form.password} onChange={handleChange} required /></label>
              <label>Confirm Password<input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required /></label>
              <label>Phone Number<div className="signup-phone"><span className="signup-flag">🇳🇬</span><span className="signup-code">{NIGERIA_CODE}</span><input name="phone" value={form.phone} onChange={handleChange} required /></div></label>
            </>
          )}
          <button className="signup-btn" type="submit" disabled={loading}>{loading ? 'Signing up...' : 'SIGN UP'}</button>
        </form>
        <div className="signup-login">Already have an account? <span className="signup-login-link" onClick={() => onSwitch('login')}>Log in!</span></div>
      </div>
    </div>
  );
};

export default SignUp;
