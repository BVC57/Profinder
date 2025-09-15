import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Load saved theme settings from localStorage
  const [themeSettings, setThemeSettings] = useState(() => {
    const savedSettings = localStorage.getItem('themeSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      primaryColor: '#1976d2',
      fontSize: 14,
      darkMode: false
    };
  });

  // Create theme based on settings
  const createAppTheme = (settings) => {
    let theme = createTheme({
      palette: {
        mode: settings.darkMode ? 'dark' : 'light',
        primary: {
          main: settings.primaryColor,
          contrastText: '#fff',
        },
        secondary: {
          main: '#764ba2',
          contrastText: '#fff',
        },
        background: {
          default: settings.darkMode ? '#121212' : '#f5f5f5',
          paper: settings.darkMode ? '#1e1e1e' : '#fff',
        },
        success: {
          main: '#43a047',
        },
        warning: {
          main: '#ffa726',
        },
        error: {
          main: '#e53935',
        },
        info: {
          main: '#29b6f6',
        },
        text: {
          primary: settings.darkMode ? '#fff' : '#222',
          secondary: settings.darkMode ? '#ccc' : '#555',
        },
      },
      typography: {
        fontFamily: 'Poppins, Roboto, Helvetica, Arial, sans-serif',
        fontSize: settings.fontSize,
        h1: {
          fontWeight: 700,
          fontSize: `${Math.max(2.5, settings.fontSize / 6)}rem`,
          letterSpacing: '-1px',
        },
        h2: {
          fontWeight: 700,
          fontSize: `${Math.max(2, settings.fontSize / 7)}rem`,
        },
        h3: {
          fontWeight: 600,
          fontSize: `${Math.max(1.5, settings.fontSize / 9)}rem`,
        },
        h4: {
          fontWeight: 600,
          fontSize: `${Math.max(1.25, settings.fontSize / 11)}rem`,
        },
        h5: {
          fontWeight: 500,
          fontSize: `${Math.max(1.1, settings.fontSize / 13)}rem`,
        },
        h6: {
          fontWeight: 500,
          fontSize: `${Math.max(1, settings.fontSize / 14)}rem`,
        },
        body1: {
          fontSize: `${settings.fontSize}px`,
        },
        body2: {
          fontSize: `${Math.max(12, settings.fontSize - 2)}px`,
        },
        button: {
          fontWeight: 600,
          textTransform: 'none',
          fontSize: `${settings.fontSize}px`,
        },
      },
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 900,
          lg: 1200,
          xl: 1536,
        },
      },
      shape: {
        borderRadius: 10,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              fontWeight: 600,
              padding: '8px 24px',
              fontSize: `${settings.fontSize}px`,
            },
            containedPrimary: {
              background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.primaryColor}dd 100%)`,
              color: '#fff',
            },
            outlinedPrimary: {
              borderColor: settings.primaryColor,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 0,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              boxShadow: `0 4px 24px ${settings.primaryColor}14`,
            },
          },
        },
        MuiAvatar: {
          styleOverrides: {
            root: {
              border: '2px solid #fff',
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              fontWeight: 500,
              fontSize: `${Math.max(12, settings.fontSize - 2)}px`,
            },
          },
        },
      },
    });

    theme = responsiveFontSizes(theme);
    return theme;
  };

  const [theme, setTheme] = useState(() => createAppTheme(themeSettings));

  // Update theme when settings change
  useEffect(() => {
    const newTheme = createAppTheme(themeSettings);
    setTheme(newTheme);
  }, [themeSettings]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('themeSettings', JSON.stringify(themeSettings));
  }, [themeSettings]);

  const updateThemeSettings = (newSettings) => {
    setThemeSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const value = {
    theme,
    themeSettings,
    updateThemeSettings
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
