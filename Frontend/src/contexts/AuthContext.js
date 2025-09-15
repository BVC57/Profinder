import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
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
        name: name,
        email: localStorage.getItem('email') || '',
        city: localStorage.getItem('city') || '',
        pincode: localStorage.getItem('pincode') || '',
        mobile: localStorage.getItem('mobile') || '',
        profilePhoto: localStorage.getItem('profilePhoto') || '',
        verified: localStorage.getItem('verified') === 'true'
      });
    }
    setLoading(false);
  }, []);
  
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userId', userData.user._id);
    localStorage.setItem('role', userData.user.role);
    localStorage.setItem('name', userData.user.name);
    
    // Store additional user data in localStorage
    if (userData.user.email) localStorage.setItem('email', userData.user.email);
    if (userData.user.city) localStorage.setItem('city', userData.user.city);
    if (userData.user.pincode) localStorage.setItem('pincode', userData.user.pincode);
    if (userData.user.mobile) localStorage.setItem('mobile', userData.user.mobile);
    if (userData.user.profilePhoto) localStorage.setItem('profilePhoto', userData.user.profilePhoto);
    if (userData.user.verified !== undefined) localStorage.setItem('verified', userData.user.verified.toString());
    
    setIsAuthenticated(true);
    setUser({
      id: userData.user._id,
      role: userData.user.role,
      token: userData.token,
      name: userData.user.name,
      email: userData.user.email,
      city: userData.user.city,
      pincode: userData.user.pincode,
      mobile: userData.user.mobile,
      profilePhoto: userData.user.profilePhoto,
      verified: userData.user.verified
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('city');
    localStorage.removeItem('pincode');
    localStorage.removeItem('mobile');
    localStorage.removeItem('profilePhoto');
    localStorage.removeItem('verified');
    setIsAuthenticated(false);
    setUser(null);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const getUserRole = () => {
    return localStorage.getItem('role');
  };

  const updateUser = (userData) => {
    // Update localStorage with new user data
    if (userData.name) {
      localStorage.setItem('name', userData.name);
    }
    if (userData.email) {
      localStorage.setItem('email', userData.email);
    }
    if (userData.city) {
      localStorage.setItem('city', userData.city);
    }
    if (userData.pincode) {
      localStorage.setItem('pincode', userData.pincode);
    }
    if (userData.mobile) {
      localStorage.setItem('mobile', userData.mobile);
    }
    if (userData.profilePhoto) {
      localStorage.setItem('profilePhoto', userData.profilePhoto);
    }
    if (userData.verified !== undefined) {
      localStorage.setItem('verified', userData.verified.toString());
    }
    
    // Update user state
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
    
    console.log('User profile updated:', userData);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    getToken,
    getUserRole,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 