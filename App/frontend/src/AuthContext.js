import React, { createContext, useContext, useState } from 'react';

// AuthContext provides user, onboarding status, and auth actions
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, email, ... }
  const [onboardingStatus, setOnboardingStatus] = useState(null); // 'pending', 'approved', etc.

  // Call this after login/signup
  const login = (userData) => {
    setUser(userData);
    // Optionally fetch onboarding status here
  };

  const logout = () => {
    setUser(null);
    setOnboardingStatus(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, onboardingStatus, setOnboardingStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
