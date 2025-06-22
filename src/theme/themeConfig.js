import { theme } from 'antd';

const { defaultAlgorithm } = theme;

export const themeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    colorPrimary: '#722ed1',
    colorPrimaryHover: '#9254de',
    colorPrimaryActive: '#531dab',
    
    // Background colors
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBgElevated: '#ffffff',
    
    // Text colors
    colorText: '#262626',
    colorTextSecondary: '#8c8c8c',
    colorTextTertiary: '#bfbfbf',
    
    // Border colors
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    
    // Success, warning, error colors
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#722ed1', // Changed to match primary purple
    
    // Border radius
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    
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
    
    // Shadows
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    boxShadowSecondary: '0 4px 12px rgba(0,0,0,0.1)',
    
    // Components specific tokens
    Button: {
      borderRadius: 6,
      controlHeight: 32,
      controlHeightLG: 40,
      controlHeightSM: 24,
    },
    Card: {
      borderRadius: 16,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 64,
      headerPadding: '0 50px',
    },
    Typography: {
      titleMarginBottom: 16,
      titleMarginTop: 0,
      titleFontSize: 12,
      titleFontSizeLG: 14,
      titleFontSizeSM: 10,
    },
  },
  components: {
    Button: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    Card: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    Layout: {
      styleOverrides: {
        header: {
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    Typography: {
      styleOverrides: {
        h1: {
          fontSize: '12px !important',
          fontWeight: 600,
        },
        h2: {
          fontSize: '12px !important',
          fontWeight: 600,
        },
        h3: {
          fontSize: '12px !important',
          fontWeight: 600,
        },
        h4: {
          fontSize: '12px !important',
          fontWeight: 600,
        },
        h5: {
          fontSize: '12px !important',
          fontWeight: 600,
        },
      },
    },
  },
}; 