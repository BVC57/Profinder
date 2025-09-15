import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    if (token && userId) {
      setIsAuthenticated(true);
      setUser({
        id: userId,
        role: role,
        token: token,
        name: name
      });
    }
    setLoading(false);
  }, [isAuthenticated]);
  
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userId', userData.user._id);
    localStorage.setItem('role', userData.user.role);
    localStorage.setItem('name', userData.user.name);
    setIsAuthenticated(true);
    setUser({
      id: userData.user._id,
      role: userData.user.role,
      token: userData.token,
      name: userData.user.name
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    
    setIsAuthenticated(false);
    setUser(null);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const getUserRole = () => {
    return localStorage.getItem('role');
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    getToken,
    getUserRole
  };
}; 