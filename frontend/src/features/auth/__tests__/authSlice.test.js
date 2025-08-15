import { configureStore } from '@reduxjs/toolkit';
import authReducer, { 
  login, 
  register, 
  refreshToken, 
  logoutAsync,
  setAccessToken,
  clearAuthState 
} from '../authSlice';

// Mock the auth service
jest.mock('../AuthService', () => ({
  authLoginUser: jest.fn(),
  registerUser: jest.fn(),
  refreshAccessToken: jest.fn()
}));

import { authLoginUser, registerUser, refreshAccessToken } from '../AuthService';

describe('authSlice', () => {
  let store;

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        auth: authReducer
      }
    });
    
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = store.getState().auth;
      
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
    });

    it('should load access token from localStorage if present', () => {
      localStorage.setItem('accessToken', 'test-token');
      
      // Create new store to test localStorage loading
      const newStore = configureStore({
        reducer: {
          auth: authReducer
        }
      });
      
      const state = newStore.getState().auth;
      expect(state.accessToken).toBe('test-token');
    });
  });

  describe('synchronous actions', () => {
    it('should handle setAccessToken', () => {
      const newToken = 'new-access-token';
      
      store.dispatch(setAccessToken(newToken));
      
      const state = store.getState().auth;
      expect(state.accessToken).toBe(newToken);
    });

    it('should handle clearAuthState', () => {
      // First set some auth state
      store.dispatch(setAccessToken('test-token'));
      
      // Then clear it
      store.dispatch(clearAuthState());
      
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('login async thunk', () => {
    it('should handle successful login', async () => {
      const mockResponse = {
        id: 'user-123',
        email: 'test@example.com',
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123'
      };

      authLoginUser.mockResolvedValue(mockResponse);

      const credentials = { email: 'test@example.com', password: 'password123' };
      
      await store.dispatch(login(credentials));
      
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual({
        id: 'user-123',
        email: 'test@example.com'
      });
      expect(state.accessToken).toBe('access-token-123');
      expect(state.refreshToken).toBe('refresh-token-123');
    });

    it('should handle login failure', async () => {
      const errorMessage = 'Invalid credentials';
      authLoginUser.mockRejectedValue(new Error(errorMessage));

      const credentials = { email: 'test@example.com', password: 'wrong-password' };
      
      await store.dispatch(login(credentials));
      
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
    });

    it('should set loading state during login', () => {
      authLoginUser.mockImplementation(() => new Promise(() => {})); // Never resolves

      store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
      
      const state = store.getState().auth;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('register async thunk', () => {
    it('should handle successful registration', async () => {
      const mockResponse = {
        id: 'user-456',
        email: 'newuser@example.com',
        token: 'registration-token-456'
      };

      registerUser.mockResolvedValue(mockResponse);

      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'John',
        surname: 'Doe'
      };
      
      await store.dispatch(register(userData));
      
      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      // Note: registration doesn't automatically log in the user
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle registration failure', async () => {
      const errorMessage = 'Email already exists';
      registerUser.mockRejectedValue(new Error(errorMessage));

      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'John',
        surname: 'Doe'
      };
      
      await store.dispatch(register(userData));
      
      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('refreshToken async thunk', () => {
    it('should handle successful token refresh', async () => {
      const newAccessToken = 'new-access-token-789';
      refreshAccessToken.mockResolvedValue(newAccessToken);

      await store.dispatch(refreshToken());
      
      const state = store.getState().auth;
      expect(state.accessToken).toBe(newAccessToken);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle token refresh failure', async () => {
      const errorMessage = 'Refresh token expired';
      refreshAccessToken.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(refreshToken());
      
      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('logoutAsync thunk', () => {
    it('should clear auth state on logout', async () => {
      // First set some auth state
      store.dispatch(setAccessToken('test-token'));
      
      // Then logout
      await store.dispatch(logoutAsync());
      
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should clear error when starting new login attempt', async () => {
      // First create an error state
      authLoginUser.mockRejectedValue(new Error('First error'));
      await store.dispatch(login({ email: 'test@example.com', password: 'wrong' }));
      
      expect(store.getState().auth.error).toBe('First error');
      
      // Then start a new login - error should be cleared
      authLoginUser.mockImplementation(() => new Promise(() => {})); // Pending
      store.dispatch(login({ email: 'test@example.com', password: 'correct' }));
      
      const state = store.getState().auth;
      expect(state.error).toBeNull();
      expect(state.loading).toBe(true);
    });
  });

  describe('localStorage integration', () => {
    it('should save tokens to localStorage on successful login', async () => {
      const mockResponse = {
        id: 'user-123',
        email: 'test@example.com',
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123'
      };

      authLoginUser.mockResolvedValue(mockResponse);

      await store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
      
      expect(localStorage.getItem('accessToken')).toBe('access-token-123');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token-123');
    });

    it('should clear localStorage on logout', async () => {
      // Set some items in localStorage
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('refreshToken', 'test-refresh');
      localStorage.setItem('userRole', 'user');
      
      await store.dispatch(logoutAsync());
      
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('userRole')).toBeNull();
    });
  });
});
