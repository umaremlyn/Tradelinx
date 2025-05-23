// Supplier onboarding: submit business name, CAC, and license files
export async function submitSupplierOnboarding({ userId, businessName, cacFile, licenseFile }) {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('businessName', businessName);
  formData.append('cacCertificate', cacFile);
  if (licenseFile) formData.append('licenses', licenseFile);
  // regulated is true if licenseFile is provided
  formData.append('regulated', !!licenseFile);

  const res = await fetch('/api/onboarding/supplier', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to submit supplier onboarding');
  return res.json();
}

// Buyer onboarding: submit business/legal name
export async function submitBuyerOnboarding({ userId, businessName }) {
  const res = await fetch('/api/onboarding/buyer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ userId, name: businessName })
  });
  if (!res.ok) throw new Error('Failed to submit buyer onboarding');
  return res.json();
}

// Login API helper
export async function fetchLogin(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

// Register API helper
export async function fetchRegister(email, password, role, name, phone, address) {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, role, name, phone, address })
  });
  if (!res.ok) {
    let errMsg = 'Registration failed';
    try {
      const err = await res.json();
      if (err && err.error) errMsg = err.error;
    } catch {}
    throw new Error(errMsg);
  }
  return res.json();
}
