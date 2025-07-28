import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themes = {
  dark: {
    // Background colors
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    tertiary: '#3d3d3d',
    
    // Text colors
    textPrimary: '#ffffff',
    textSecondary: '#b0b0b0',
    textTertiary: '#888888',
    
    // Accent colors
    accent: '#8c4a3a',
    accentHover: '#a0553f',
    accentLight: '#d17f65',
    
    // UI colors
    border: '#404040',
    borderLight: '#555555',
    shadow: 'rgba(0, 0, 0, 0.5)',
    shadowLight: 'rgba(0, 0, 0, 0.3)',
    
    // Component specific
    header: '#1f1f1f',
    footer: '#0f0f0f',
    card: '#2a2a2a',
    cardHover: '#333333',
    
    // Form elements
    input: '#3a3a3a',
    inputFocus: '#4a4a4a',
    inputBorder: '#555555',
    inputBorderFocus: '#8c4a3a',
    
    // Buttons
    buttonPrimary: 'linear-gradient(45deg, #8c4a3a, #a0553f)',
    buttonPrimaryHover: 'linear-gradient(45deg, #a0553f, #b46449)',
    buttonSecondary: '#3a3a3a',
    buttonSecondaryHover: '#4a4a4a',
    
    // Status colors
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    
    // Gradients
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    gradientReverse: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
  },
  
  light: {
    // Background colors
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#e9ecef',
    
    // Text colors
    textPrimary: '#2c3e50',
    textSecondary: '#5a6c7d',
    textTertiary: '#7f8c8d',
    
    // Accent colors
    accent: '#8c4a3a',
    accentHover: '#a0553f',
    accentLight: '#d17f65',
    
    // UI colors
    border: '#ecf0f1',
    borderLight: '#dee2e6',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowLight: 'rgba(0, 0, 0, 0.05)',
    
    // Component specific
    header: '#E6E6E4',
    footer: '#f1f3f4',
    card: '#ffffff',
    cardHover: '#f8f9fa',
    
    // Form elements
    input: '#ffffff',
    inputFocus: '#ffffff',
    inputBorder: '#ecf0f1',
    inputBorderFocus: '#3498db',
    
    // Buttons
    buttonPrimary: 'linear-gradient(45deg, #3498db, #2980b9)',
    buttonPrimaryHover: 'linear-gradient(45deg, #2980b9, #1f5f8b)',
    buttonSecondary: '#ecf0f1',
    buttonSecondaryHover: '#dee2e6',
    
    // Status colors
    success: '#27ae60',
    error: '#e74c3c',
    warning: '#f39c12',
    info: '#3498db',
    
    // Gradients
    gradient: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    gradientReverse: 'linear-gradient(135deg, #e9ecef 0%, #f8f9fa 100%)',
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('teipsum-theme');
    return savedTheme || 'dark'; // Default to dark theme
  });

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    localStorage.setItem('teipsum-theme', newTheme);
  };

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('teipsum-theme', theme);
  };

  // Apply theme to document root for CSS custom properties
  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    // Set CSS custom properties
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Set theme class on body
    document.body.className = `theme-${currentTheme}`;
    
    // Set meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.primary);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = theme.primary;
      document.head.appendChild(meta);
    }
  }, [currentTheme]);

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    toggleTheme,
    changeTheme,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light',
    availableThemes: [
      { key: 'light', name: 'Light Theme', icon: '☀️' },
      { key: 'dark', name: 'Dark Theme', icon: '🌙' }
    ]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};