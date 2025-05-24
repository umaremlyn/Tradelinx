import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import LandingPage from './LandingPage';
import Login from './Login';
import SignUp from './SignUp';
import SupplierOnboarding from './SupplierOnboarding';
import BuyerOnboarding from './BuyerOnboarding';
import BottomNav from './BottomNav';
import HomeScreen from './HomeScreen';
import WalletScreen from './WalletScreen';
import ExploreScreen from './ExploreScreen';
import TradeScreen from './TradeScreen';
import AccountScreen from './AccountScreen';
import AdminScreen from './AdminScreen';
import './App.css';

function MainApp() {
  const { user, onboardingStatus } = useAuth();
  const [route, setRoute] = useState('landing'); // landing, login, signup, waitlist, supplierOnboarding, buyerOnboarding, app
  const [currentScreen, setCurrentScreen] = useState('home');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');

  // Waitlist form handler
  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setWaitlistError('');
    setWaitlistSubmitted(false);
    if (!waitlistEmail.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setWaitlistError('Please enter a valid email.');
      return;
    }
    try {
      // You can replace this with a real API call
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail })
      });
      setWaitlistSubmitted(true);
    } catch (err) {
      setWaitlistError('Failed to join waitlist. Please try again.');
    }
  };

  // Routing logic
  if (!user) {
    if (route === 'login') return <Login onSwitch={setRoute} />;
    if (route === 'signup') return <SignUp onSwitch={setRoute} />;
    if (route === 'waitlist') {
      return (
        <div className="waitlist-root" style={{ maxWidth: 400, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e1060022', padding: 32, textAlign: 'center' }}>
          <button className="waitlist-back" style={{ background: 'none', border: 'none', color: '#e10600', fontWeight: 600, fontSize: 16, marginBottom: 16, cursor: 'pointer' }} onClick={() => setRoute('landing')}>&larr; Back</button>
          <h2 style={{ color: '#e10600', marginBottom: 12 }}>Join the Waitlist</h2>
          <p style={{ color: '#444', marginBottom: 24, fontSize: 16 }}>Be the first to know when TradeLinx launches. Enter your email below:</p>
          <form className="waitlist-form" onSubmit={handleWaitlistSubmit}>
            <input
              type="email"
              placeholder="Your email address"
              value={waitlistEmail}
              onChange={e => setWaitlistEmail(e.target.value)}
              required
              style={{ fontSize: '1.1em', padding: '0.7em', borderRadius: 8, border: '1.5px solid #e10600', width: '100%', marginBottom: 12, outline: 'none' }}
            />
            <button type="submit" style={{ background: '#e10600', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7em 2em', fontWeight: 600, fontSize: 16, width: '100%' }}>
              Join Waitlist
            </button>
            {waitlistError && <div className="waitlist-error" style={{ color: 'red', marginTop: 8 }}>{waitlistError}</div>}
            {waitlistSubmitted && <div className="waitlist-success" style={{ color: 'green', marginTop: 8 }}>Thank you! You'll be notified when we launch.</div>}
          </form>
        </div>
      );
    }
    return <LandingPage onStart={() => setRoute('login')} onWaitlist={() => setRoute('waitlist')} onSignUp={() => setRoute('signup')} />;
  }

  // Add admin route handling
  if (window.location.hash === '#/admin') {
    return <AdminScreen />;
  }

  // After login, show onboarding if not approved
  if (user.role === 'supplier' && onboardingStatus !== 'approved') {
    return <SupplierOnboarding />;
  }
  if (user.role === 'buyer' && onboardingStatus !== 'approved') {
    return <BuyerOnboarding />;
  }

  // Main app screens (authenticated and onboarded)
  let ScreenComponent;
  switch (currentScreen) {
    case 'wallet':
      ScreenComponent = <WalletScreen />;
      break;
    case 'home':
      ScreenComponent = <HomeScreen />;
      break;
    case 'explore':
      ScreenComponent = <ExploreScreen />;
      break;
    case 'trade':
      ScreenComponent = <TradeScreen />;
      break;
    case 'account':
      ScreenComponent = <AccountScreen />;
      break;
    default:
      ScreenComponent = <HomeScreen />;
  }

  return (
    <div className="App" style={{paddingBottom: '80px', minHeight: '100vh', background: '#fff'}}>
      {ScreenComponent}
      <BottomNav current={currentScreen} onChange={setCurrentScreen} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
