import React, { useState } from 'react';
import './SupplierOnboarding.css';
import { submitSupplierOnboarding } from './api.js';
import { useAuth } from './AuthContext';

const SupplierOnboarding = ({ onComplete, onboardingStatus: onboardingStatusProp, userId: userIdProp }) => {
  const { user, onboardingStatus } = useAuth();
  const [businessName, setBusinessName] = useState('');
  const [cacFile, setCacFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
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
      await submitSupplierOnboarding({ userId: effectiveUserId, businessName, cacFile, licenseFile });
      onComplete && onComplete();
    } catch (err) {
      setError('Failed to submit. Please try again.');
    }
    setSubmitting(false);
  };

  if (effectiveOnboardingStatus === 'pending') {
    return <div className="onboarding-status">Your application is under review. We'll notify you once approved.</div>;
  }
  if (effectiveOnboardingStatus === 'approved') {
    return <div className="onboarding-status approved">Your supplier account is approved! You can now upload products.</div>;
  }

  return (
    <div className="supplier-onboarding-root">
      <h2>Supplier Onboarding</h2>
      <form className="supplier-onboarding-form" onSubmit={handleSubmit}>
        <label>
          Business Name
          <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} required />
        </label>
        <label>
          CAC Certificate
          <input type="file" accept="application/pdf,image/*" onChange={e => setCacFile(e.target.files[0])} required />
        </label>
        <label>
          License (if regulated)
          <input type="file" accept="application/pdf,image/*" onChange={e => setLicenseFile(e.target.files[0])} />
        </label>
        {error && <div className="onboarding-error">{error}</div>}
        <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit for Review'}</button>
      </form>
    </div>
  );
};

export default SupplierOnboarding;
