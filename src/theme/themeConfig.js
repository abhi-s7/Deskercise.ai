import { theme } from 'antd';

const { defaultAlgorithm } = theme;

export const themeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    // Futuristic AI color palette
    colorPrimary: '#6366f1', // Modern indigo
    colorPrimaryHover: '#818cf8',
    colorPrimaryActive: '#4f46e5',
    
    // Background colors with gradients
    colorBgContainer: '#ffffff',
    colorBgLayout: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    colorBgElevated: '#ffffff',
    
    // Text colors
    colorText: '#1e293b',
    colorTextSecondary: '#64748b',
    colorTextTertiary: '#94a3b8',
    
    // Border colors
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
    
    // Success, warning, error colors
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#6366f1',
    
    // Enhanced border radius
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,
    
    // Font sizes
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    
    // Enhanced shadows for depth
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    
    // Components specific tokens
    Button: {
      borderRadius: 12,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },
    Card: {
      borderRadius: 20,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    Layout: {
      headerBg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      headerHeight: 64,
      headerPadding: '0 50px',
    },
    Typography: {
      titleMarginBottom: 16,
      titleMarginTop: 0,
      titleFontSize: 14,
      titleFontSizeLG: 16,
      titleFontSizeSM: 12,
    },
  },
  components: {
    Button: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    Card: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    Layout: {
      styleOverrides: {
        header: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    Typography: {
      styleOverrides: {
        h1: {
          fontSize: '32px !important',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        h2: {
          fontSize: '24px !important',
          fontWeight: 600,
          color: '#1e293b',
        },
        h3: {
          fontSize: '20px !important',
          fontWeight: 600,
          color: '#1e293b',
        },
        h4: {
          fontSize: '18px !important',
          fontWeight: 600,
          color: '#1e293b',
        },
        h5: {
          fontSize: '16px !important',
          fontWeight: 600,
          color: '#1e293b',
        },
      },
    },
  },
}; 