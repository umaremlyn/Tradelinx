import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onStart, onWaitlist, onSignUp }) => (
  <div className="landing-root">
    <header className="landing-hero">
      <img src="/logo192.png" alt="Tradelinx Logo" className="landing-logo" />
      <h1 className="landing-title">Connect. Trade. Grow.</h1>
      <p className="landing-tagline">Africa's no. 1 leading marketplace!</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '24px 0' }}>
        <button className="landing-cta" onClick={onStart}>Sign In</button>
        <button className="landing-cta" style={{ background: '#fff', color: '#e10600', border: '1.5px solid #e10600' }} onClick={onSignUp}>Sign Up</button>
        <button className="landing-cta" style={{ background: '#fff', color: '#e10600', border: '1.5px solid #e10600' }} onClick={onWaitlist}>Join Waitlist</button>
      </div>
    </header>
    <section className="landing-how">
      <h2>How TradeLinx Works</h2>
      <div className="landing-steps">
        <div className="landing-step">
          <h3>For Buyers</h3>
          <ul>
            <li>Sign up and browse suppliers</li>
            <li>Send requests and negotiate offers</li>
            <li>Pay securely via escrow</li>
          </ul>
        </div>
        <div className="landing-step">
          <h3>For Suppliers</h3>
          <ul>
            <li>Register your business</li>
            <li>Upload products and documents</li>
            <li>Get approved and start selling</li>
          </ul>
        </div>
      </div>
    </section>
    <section className="landing-benefits">
      <h2>Why TradeLinx?</h2>
      <ul>
        <li>Safe, monitored conversations</li>
        <li>Escrow payment for trust</li>
        <li>Easy onboarding for buyers & suppliers</li>
        <li>Mobile-first, modern experience</li>
      </ul>
    </section>
    <section className="landing-faq">
      <h2>FAQ</h2>
      <details>
        <summary>Is TradeLinx free to join?</summary>
        <p>Yes, you can join and browse for free. Fees may apply for premium features.</p>
      </details>
      <details>
        <summary>How does escrow work?</summary>
        <p>Payments are held securely until both parties confirm delivery.</p>
      </details>
      <details>
        <summary>How do I get approved as a supplier?</summary>
        <p>Submit your business documents. Our admin team will review and approve your application.</p>
      </details>
    </section>
    <section className="landing-contact">
      <h2>Contact & Newsletter</h2>
      <form className="landing-newsletter">
        <input type="email" placeholder="Your email address" required />
        <button type="submit">Subscribe</button>
      </form>
      <p>For support: <a href="mailto:support@tradelinx.com">support@tradelinx.com</a></p>
    </section>
  </div>
);

export default LandingPage;
