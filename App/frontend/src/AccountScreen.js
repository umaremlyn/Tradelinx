import React, { useEffect, useState } from 'react';
import './AccountScreen.css';
import { fetchNotifications } from './api';
import AdminScreen from './AdminScreen';

const user = {
  name: 'Ahmed Sisseh',
  email: 'Ahmedsisseh@example.com',
  role: 'Supplier',
};

const menu = [
  { icon: '👤', label: 'My Profile' },
  { icon: '⏱️', label: 'Trade History' },
  { icon: '📅', label: 'Order History' },
  { icon: '💳', label: 'Payment Methods' },
  { icon: '⚙️', label: 'Settings' },
  { icon: '❓', label: 'Help & Support' },
  { icon: '⏏️', label: 'Logout', logout: true },
];

const AccountScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace 'userId' with actual user id from context or props
    const userId = 'demo-user';
    fetchNotifications(userId)
      .then(data => {
        setNotifications(data.notifications || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load notifications');
        setLoading(false);
      });
  }, []);

  // For demo, use hardcoded user. Replace with context in production.
  const isAdmin = user.role && user.role.toLowerCase() === 'admin';

  return (
    <div className="account-container">
      <div className="account-header">
        <div className="account-avatar" />
        <div className="account-info">
          <div className="account-name">{user.name}</div>
          <div className="account-email">{user.email}</div>
          <div className="account-role">{user.role}</div>
        </div>
        <button className="account-edit-btn" aria-label="Edit Profile">✎</button>
      </div>
      <div className="account-menu">
        {menu.map((item, i) => (
          <button
            className={`account-menu-item${item.logout ? ' logout' : ''}`}
            key={item.label}
          >
            <span className="account-menu-icon">{item.icon}</span>
            <span className="account-menu-label">{item.label}</span>
            <span className="account-menu-arrow">›</span>
          </button>
        ))}
        {isAdmin && (
          <button className="account-menu-item" style={{ color: '#e10600', fontWeight: 600 }} onClick={() => window.location.hash = '#/admin'}>
            <span className="account-menu-icon">🛡️</span>
            <span className="account-menu-label">Admin Dashboard</span>
            <span className="account-menu-arrow">›</span>
          </button>
        )}
      </div>
      <div className="account-notification-container">
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {!loading && !error && notifications.map((n, i) => (
          <div className="account-notification-card" key={i}>
            <span className={`account-notification-icon ${n.type}`}>{n.icon}</span>
            <div className="account-notification-info">
              <div className="account-notification-title">{n.title}</div>
              <div className="account-notification-desc">{n.desc}</div>
            </div>
            <div className="account-notification-time">{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountScreen;
