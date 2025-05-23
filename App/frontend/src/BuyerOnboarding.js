import React, { useState } from 'react';
import './BuyerOnboarding.css';
import { submitBuyerOnboarding } from './api.js';
import { useAuth } from './AuthContext';

const BuyerOnboarding = ({ onComplete, onboardingStatus: onboardingStatusProp, userId: userIdProp }) => {
  const { user, onboardingStatus } = useAuth();
  const [businessName, setBusinessName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Prefer context userId/onboardingStatus, fallback to props for backward compatibility
  const effectiveUserId = user?.id || userIdProp;
  const effectiveOnboardingStatus = onboardingStatus || onboardingStatusProp;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitBuyerOnboarding({ userId: effectiveUserId, businessName });
      onComplete && onComplete();
    } catch (err) {
      setError('Failed to submit. Please try again.');
    }
    setSubmitting(false);
  };

  if (effectiveOnboardingStatus === 'pending') {
    return <div className="onboarding-status">Your onboarding is under review. We'll notify you once approved.</div>;
  }
  if (effectiveOnboardingStatus === 'approved') {
    return <div className="onboarding-status approved">Your buyer account is ready! You can now explore the marketplace.</div>;
  }

  return (
    <div className="buyer-onboarding-root">
      <h2>Buyer Onboarding</h2>
      <form className="buyer-onboarding-form" onSubmit={handleSubmit}>
        <label>
          Business/Legal Name
          <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} required />
        </label>
        {error && <div className="onboarding-error">{error}</div>}
        <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Complete Onboarding'}</button>
      </form>
    </div>
  );
};

export default BuyerOnboarding;
