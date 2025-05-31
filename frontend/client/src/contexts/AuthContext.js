import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is installed

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth check

  useEffect(() => {
    // Check for token in localStorage on initial load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['x-auth-token'] = token; // Set auth header for future requests
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5001/api/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ userId: res.data.userId, name: res.data.name, email: res.data.email }));
      setUser({ userId: res.data.userId, name: res.data.name, email: res.data.email });
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      return { success: true };
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      return { success: false, message: err.response ? err.response.data.message : 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('http://localhost:5001/api/users/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ userId: res.data.userId, name: res.data.name, email: res.data.email }));
      setUser({ userId: res.data.userId, name: res.data.name, email: res.data.email });
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err.response ? err.response.data : err.message);
      return { success: false, message: err.response ? err.response.data.message : 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
