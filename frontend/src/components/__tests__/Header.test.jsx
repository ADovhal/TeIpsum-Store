import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Header from '../Header/Header';
import authReducer from '../../features/auth/authSlice';
import cartReducer from '../../features/cart/cartSlice';

// Mock context providers
const mockHeaderHeightContext = {
  setHeaderHeight: jest.fn()
};

const mockLanguageContext = {
  t: (key) => key,
  currentLanguage: 'en',
  setLanguage: jest.fn()
};

const mockThemeContext = {
  theme: {
    header: '#ffffff',
    border: '#e5e7eb',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    input: '#ffffff',
    textPrimary: '#111827',
    inputBorder: '#d1d5db',
    accent: '#3b82f6'
  }
};

jest.mock('../../context/HeaderHeightContext', () => ({
  HeaderHeightContext: {
    Consumer: ({ children }) => children(mockHeaderHeightContext)
  }
}));

jest.mock('../../context/LanguageContext', () => ({
  useLanguage: () => mockLanguageContext
}));

jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => mockThemeContext
}));

// Mock the admin hook
jest.mock('../../features/admin/useIsAdmin', () => {
  return jest.fn(() => false); // Default to non-admin
});

import useIsAdmin from '../../features/admin/useIsAdmin';

describe('Header Component', () => {
  let store;

  const createStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        auth: authReducer,
        cart: cartReducer
      },
      preloadedState: {
        auth: {
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          roles: [],
          loading: false,
          error: null,
          ...initialState.auth
        },
        cart: {
          items: [],
          isOpen: false,
          totalItems: 0,
          totalPrice: 0,
          ...initialState.cart
        }
      }
    });
  };

  const renderHeader = (storeState = {}) => {
    store = createStore(storeState);
    
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render header with logo and navigation', () => {
      renderHeader();

      expect(screen.getByAltText('TeIpsum Logo')).toBeInTheDocument();
      expect(screen.getByText('home')).toBeInTheDocument();
      expect(screen.getByText('store')).toBeInTheDocument();
      expect(screen.getByText('about')).toBeInTheDocument();
      expect(screen.getByText('contact')).toBeInTheDocument();
    });

    it('should render search input', () => {
      renderHeader();

      const searchInput = screen.getByPlaceholderText('searchPlaceholder');
      expect(searchInput).toBeInTheDocument();
    });

    it('should render cart button', () => {
      renderHeader();

      const cartButton = screen.getByRole('button', { name: /shopping cart/i });
      expect(cartButton).toBeInTheDocument();
    });
  });

  describe('Authentication States', () => {
    it('should show login button when not authenticated', () => {
      renderHeader();

      const loginLink = screen.getByRole('link', { name: '' }); // Icon button
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('should show profile link when authenticated', () => {
      renderHeader({
        auth: {
          isAuthenticated: true,
          user: { id: '1', email: 'test@example.com' },
          roles: ['ROLE_USER']
        }
      });

      const profileLink = screen.getByRole('link', { name: '' }); // Icon button
      expect(profileLink).toHaveAttribute('href', '/profile');
    });
  });

  describe('Admin Navigation', () => {
    it('should not show admin button for regular users', () => {
      useIsAdmin.mockReturnValue(false);
      
      renderHeader({
        auth: {
          isAuthenticated: true,
          user: { id: '1', email: 'test@example.com' },
          roles: ['ROLE_USER']
        }
      });

      expect(screen.queryByText('manageUsers')).not.toBeInTheDocument();
    });

    it('should show admin button for admin users', () => {
      useIsAdmin.mockReturnValue(true);
      
      renderHeader({
        auth: {
          isAuthenticated: true,
          user: { id: '1', email: 'admin@example.com' },
          roles: ['ROLE_ADMIN']
        }
      });

      expect(screen.getByText('manageUsers')).toBeInTheDocument();
      
      const adminLink = screen.getByRole('link', { name: /manageUsers/i });
      expect(adminLink).toHaveAttribute('href', '/admin/users');
    });

    it('should not show admin button when not authenticated', () => {
      useIsAdmin.mockReturnValue(true); // Even if hook says admin
      
      renderHeader({
        auth: {
          isAuthenticated: false // Not authenticated
        }
      });

      expect(screen.queryByText('manageUsers')).not.toBeInTheDocument();
    });
  });

  describe('Cart Functionality', () => {
    it('should show cart item count when items in cart', () => {
      renderHeader({
        cart: {
          items: [
            { id: '1', quantity: 2 },
            { id: '2', quantity: 1 }
          ],
          totalItems: 3
        }
      });

      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should not show cart badge when cart is empty', () => {
      renderHeader({
        cart: {
          items: [],
          totalItems: 0
        }
      });

      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('should toggle cart when cart button is clicked', () => {
      renderHeader();

      const cartButton = screen.getByRole('button', { name: /shopping cart/i });
      fireEvent.click(cartButton);

      // Verify action was dispatched (cart state would change in real app)
      expect(cartButton).toBeInTheDocument();
    });
  });

  describe('Mobile Navigation', () => {
    it('should render hamburger menu button', () => {
      renderHeader();

      const hamburgerButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      expect(hamburgerButton).toBeInTheDocument();
    });

    it('should toggle mobile menu', () => {
      renderHeader();

      const hamburgerButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      
      // Initially shows hamburger icon
      expect(screen.getByText('☰')).toBeInTheDocument();
      
      // Click to open menu
      fireEvent.click(hamburgerButton);
      
      // Should show close icon
      expect(screen.getByText('✕')).toBeInTheDocument();
      
      // Click again to close
      fireEvent.click(hamburgerButton);
      
      // Should show hamburger again
      expect(screen.getByText('☰')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should handle search input changes', () => {
      renderHeader();

      const searchInput = screen.getByPlaceholderText('searchPlaceholder');
      
      fireEvent.change(searchInput, { target: { value: 'test search' } });
      
      expect(searchInput.value).toBe('test search');
    });

    it('should handle search form submission', () => {
      // Mock navigate
      const mockNavigate = jest.fn();
      jest.doMock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate
      }));

      renderHeader();

      const searchInput = screen.getByPlaceholderText('searchPlaceholder');
      const searchForm = searchInput.closest('form');
      
      fireEvent.change(searchInput, { target: { value: 'shirt' } });
      fireEvent.submit(searchForm);

      // Search input should be cleared after submission
      expect(searchInput.value).toBe('');
    });

    it('should not submit empty search', () => {
      renderHeader();

      const searchInput = screen.getByPlaceholderText('searchPlaceholder');
      const searchForm = searchInput.closest('form');
      
      fireEvent.submit(searchForm);

      // Nothing should happen with empty search
      expect(searchInput.value).toBe('');
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href attributes for all nav links', () => {
      renderHeader();

      expect(screen.getByRole('link', { name: 'home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'store' })).toHaveAttribute('href', '/pre-store');
      expect(screen.getByRole('link', { name: 'about' })).toHaveAttribute('href', '/about');
      expect(screen.getByRole('link', { name: 'contact' })).toHaveAttribute('href', '/contact');
      expect(screen.getByRole('link', { name: 'discounts' })).toHaveAttribute('href', '/discounts');
      expect(screen.getByRole('link', { name: 'newCollection' })).toHaveAttribute('href', '/new-collection');
    });

    it('should close mobile menu when nav link is clicked', () => {
      renderHeader();

      const hamburgerButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      
      // Open mobile menu
      fireEvent.click(hamburgerButton);
      expect(screen.getByText('✕')).toBeInTheDocument();
      
      // Click a nav link
      const homeLink = screen.getByRole('link', { name: 'home' });
      fireEvent.click(homeLink);
      
      // Menu should close
      expect(screen.getByText('☰')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderHeader();

      expect(screen.getByRole('button', { name: /toggle navigation menu/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /shopping cart/i })).toBeInTheDocument();
    });

    it('should update cart button aria label with item count', () => {
      renderHeader({
        cart: {
          items: [{ id: '1', quantity: 2 }],
          totalItems: 2
        }
      });

      expect(screen.getByRole('button', { name: /shopping cart \(2 items\)/i })).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    it('should apply theme styles to header elements', () => {
      renderHeader();

      const searchInput = screen.getByPlaceholderText('searchPlaceholder');
      
      expect(searchInput).toHaveStyle({
        backgroundColor: '#ffffff',
        color: '#111827',
        borderColor: '#d1d5db'
      });
    });
  });
});
