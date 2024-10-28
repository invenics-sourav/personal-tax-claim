/**
 * Material UI Theme Configuration
 * 
 * This module defines the custom theme for the application using Material UI's theming system.
 * It includes color palette, typography, component overrides, and other theme-related settings.
 */

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  // Color palette configuration
  palette: {
    primary: {
      main: '#023047', // Deep Blue - Primary brand color
      light: '#0A4B6C',
      dark: '#011824',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#219EBC', // Ocean Blue - Secondary brand color
      light: '#8ECAE6', // Sky Blue - Light accent
      dark: '#1A7D95',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FB8500', // Orange - Warning/Attention color
      light: '#FF9D33',
      dark: '#CC6C00',
      contrastText: '#ffffff',
    },
    info: {
      main: '#FFB703', // Yellow - Information/Highlight color
      light: '#FFC640',
      dark: '#CC9200',
      contrastText: '#000000',
    },
    background: {
      default: '#F5F7F9', // Light gray background
      paper: '#ffffff',
    },
  },

  // Typography configuration
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700, // Bold headlines
    },
    h2: {
      fontWeight: 600, // Semi-bold subheadings
    },
    button: {
      fontWeight: 600,
      textTransform: 'none', // Preserve original text case in buttons
    },
  },

  // Shape configuration
  shape: {
    borderRadius: 8, // Consistent border radius across components
  },

  // Component-specific style overrides
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
          boxShadow: 'none', // Remove default button shadows
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#219EBC', // Consistent hover state for text fields
            },
          },
        },
      },
    },
  },
});