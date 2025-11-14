import { createContext, useContext, useState, useEffect } from 'react';
import {
  isAuthenticated,
  getUserInfo,
  login as authLogin,
  logout as authLogout,
  handleCallback,
  storeTokens
} from './authService.js';

const AuthContext = createContext(null);

/**
 * Custom hook to use authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Authentication Provider Component
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for OAuth callback on mount
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const errorParam = urlParams.get('error');

      // If we have an error parameter, display it
      if (errorParam) {
        const errorDescription = urlParams.get('error_description');
        setError(`Authentication failed: ${errorDescription || errorParam}`);
        setLoading(false);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // If we have a code, process the callback
      if (code) {
        try {
          const tokenData = await handleCallback(window.location.href);
          storeTokens(tokenData);
          
          // Get user info from the token
          const userInfo = getUserInfo();
          setUser(userInfo);
          
          // Clean up URL - remove query parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          console.error('Error handling OAuth callback:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
        return;
      }

      // Check if already authenticated
      if (isAuthenticated()) {
        const userInfo = getUserInfo();
        setUser(userInfo);
      }
      
      setLoading(false);
    };

    handleOAuthCallback();
  }, []);

  const login = () => {
    setError(null);
    authLogin();
  };

  const logout = () => {
    setUser(null);
    setError(null);
    authLogout(true);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
