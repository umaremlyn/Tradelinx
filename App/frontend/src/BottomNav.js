import React from 'react';
import './BottomNav.css';
import { FaHome, FaSearch, FaExchangeAlt, FaWallet, FaUser } from 'react-icons/fa';

const BottomNav = ({ current, onChange }) => {
  const navItems = [
    { label: 'Home', icon: <FaHome />, key: 'home' },
    { label: 'Explore', icon: <FaSearch />, key: 'explore' },
    { label: 'Trade', icon: <FaExchangeAlt />, key: 'trade' },
    { label: 'Wallet', icon: <FaWallet />, key: 'wallet' },
    { label: 'Account', icon: <FaUser />, key: 'account' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.key}
          className={`nav-btn${current === item.key ? ' active' : ''}`}
          onClick={() => onChange(item.key)}
          aria-label={item.label}
        >
          {item.icon}
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
