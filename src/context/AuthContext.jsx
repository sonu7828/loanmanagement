import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  EMPLOYEE: 'employee',
  HR: 'hr',
  ADMIN: 'admin',
  CREDIT: 'credit',
  FINANCE: 'finance',
  MANAGEMENT: 'management',
  RECOVERY: 'recovery',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persisted session
    const storedUser = localStorage.getItem('lms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, role = ROLES.Employee) => {
    // Mock login logic
    const mockUser = {
      id: '1',
      name: 'Test User',
      email,
      role,
    };
    setUser(mockUser);
    localStorage.setItem('lms_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lms_user');
  };

  const value = React.useMemo(() => ({
    user, 
    role: user?.role, 
    login, 
    logout, 
    loading
  }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
