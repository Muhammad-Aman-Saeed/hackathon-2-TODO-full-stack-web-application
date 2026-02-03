'use client';

import { useState, useEffect } from 'react';
import { User, CurrentUserState } from '@/types';
import { apiClient } from '@/lib/api';

export const useAuth = () => {
  const [authState, setAuthState] = useState<CurrentUserState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Attempt to get token and verify user
        const token = localStorage.getItem('jwt_token');
        if (token) {
          // Try to validate the token by making a request to the backend
          try {
            // Attempt to get user info using the token
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/auth/token`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const userData = await response.json();

              setAuthState({
                user: {
                  id: userData.user_id,
                  email: userData.email || '', // Use empty string if email is not provided
                  createdAt: userData.created_at || new Date().toISOString(),
                  updatedAt: userData.updated_at || new Date().toISOString(),
                }, // User object with required properties
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } else {
              // Token is invalid, remove it
              localStorage.removeItem('jwt_token');
              setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
            }
          } catch (validationError) {
            // If token validation fails, remove the token
            localStorage.removeItem('jwt_token');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: (error as Error).message,
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await apiClient.login({ email, password });
      
      // Store token in localStorage
      localStorage.setItem('jwt_token', response.token);
      
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = (error as Error).message || 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await apiClient.register({ email, password, name });
      
      // Store token in localStorage
      localStorage.setItem('jwt_token', response.token);
      
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = (error as Error).message || 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
};