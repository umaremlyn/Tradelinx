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

// Fetch trade offers and requests
export async function fetchTradeOffers(type) {
  // type: 'offers' or 'requests'
  const res = await fetch(`/api/marketplace/trades?type=${type}`);
  if (!res.ok) throw new Error('Failed to fetch trade data');
  return res.json();
}

// Fetch all products/markets for ExploreScreen
export async function fetchMarkets() {
  const res = await fetch('/api/marketplace/products');
  if (!res.ok) throw new Error('Failed to fetch markets');
  return res.json();
}

// Fetch posts/feed for HomeScreen
export async function fetchPosts() {
  const res = await fetch('/api/marketplace/products'); // Using products as feed for MVP
  if (!res.ok) throw new Error('Failed to fetch feed');
  const data = await res.json();
  // Map products to feed post format
  return (data.products || []).map(p => ({
    id: p.id,
    business: p.name,
    slogan: p.description,
    image: (p.image_urls && p.image_urls[0]) || '',
    content: p.description,
  }));
}

// Fetch wallet info for WalletScreen
export async function fetchWallet(userId) {
  const res = await fetch(`/api/users/${userId}/wallet`);
  if (!res.ok) throw new Error('Failed to fetch wallet');
  return res.json();
}

// Fetch messages for NegotiationScreen
export async function fetchMessages(conversationId, user1, user2) {
  // user1 and user2 are user IDs
  const res = await fetch(`/api/marketplace/messages?user1=${user1}&user2=${user2}`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

// Send a message
export async function sendMessage({ senderId, receiverId, productId, content }) {
  const res = await fetch('/api/marketplace/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senderId, receiverId, productId, content })
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

// Fetch notifications for AccountScreen
export async function fetchNotifications(userId) {
  const res = await fetch(`/api/users/${userId}/notifications`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

// --- Admin API helpers ---

// Get all supplier applications (optionally filter by status)
export async function fetchSupplierApplications(status) {
  const url = status ? `/api/admin/suppliers?status=${status}` : '/api/admin/suppliers';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch supplier applications');
  return res.json();
}

// Approve a supplier application
export async function approveSupplier(id) {
  const res = await fetch(`/api/admin/suppliers/${id}/approve`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to approve supplier');
  return res.json();
}

// Reject a supplier application
export async function rejectSupplier(id, reason) {
  const res = await fetch(`/api/admin/suppliers/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason })
  });
  if (!res.ok) throw new Error('Failed to reject supplier');
  return res.json();
}

// Get all users (optionally filter by role or flagged)
export async function fetchUsers(role, flagged) {
  let url = '/api/admin/users';
  const params = [];
  if (role) params.push(`role=${role}`);
  if (flagged) params.push('flagged=true');
  if (params.length) url += '?' + params.join('&');
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

// Flag a user
export async function flagUser(id) {
  const res = await fetch(`/api/admin/users/${id}/flag`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to flag user');
  return res.json();
}

// Change user role
export async function changeUserRole(id, role) {
  const res = await fetch(`/api/admin/users/${id}/role`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role })
  });
  if (!res.ok) throw new Error('Failed to change user role');
  return res.json();
}

// Get all messages (optionally filter by flagged)
export async function fetchMessagesAdmin(flagged) {
  const url = flagged ? '/api/admin/messages?flagged=true' : '/api/admin/messages';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

// Flag a message
export async function flagMessage(id) {
  const res = await fetch(`/api/admin/messages/${id}/flag`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to flag message');
  return res.json();
}
