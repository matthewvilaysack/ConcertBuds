// Theme configuration with consistent color palette and semantic naming
const Theme = {
  colors: {
    // Primary brand colors
    primary: {
      main: '#846AE3',      // Purple - main brand color
      light: '#898FCA',     // Light purple for gradients
      dark: '#554ACD',      // Dark purple for emphasis
      accent: '#6F52CF'     // Accent purple
    },

    // Secondary color palette
    secondary: {
      pink: '#F464A2',
      red: '#FD5F74',
      coral: '#FFAAA7',
      fuschia: '#DB64B4'
    },

    // Background colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F1F1F2',
      gradient: 'radial-gradient(227.69% 155.46% at 49.87% -55.46%, #554ACD 0%, #898FCA 35%, #CBD1CD 66.5%, #F1F1F2 99.99%)',
      overlay: 'rgba(217, 217, 217, 0.58)',
      blurred: 'rgba(255, 255, 255, 0.5)'
    },

    // Text colors
    text: {
      primary: '#000000',
      secondary: '#686767',
      tertiary: '#868686',
      white: '#FFFFFF',
      medium: '#A0A0A0' // Ensure this property is defined
    },

    // UI element colors
    ui: {
      border: '#CCCCCC',
      inputBackground: 'rgba(255, 255, 255, 0.61)',
      buttonPrimary: '#846AE3',
      buttonDanger: '#FC5058',
      shadow: 'rgba(0, 0, 0, 0.25)'
    }
  },

  // Typography
  typography: {
    fontFamilies: {
      primary: 'Doppio One',
      display: 'Lilita One',
      mono: 'JetBrains Mono'
    },
    sizes: {
      xs: '13px',
      sm: '14px',
      base: '16px',
      lg: '20px',
      xl: '24px',
      '2xl': '28px',
      '3xl': '34px',
      '4xl': '38px',
      '5xl': '48px'
    }
  },

  // Spacing and sizing
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '40px'
  },

  // Border radius
  borderRadius: {
    sm: '8px',
    md: '10px',
    lg: '20px',
    xl: '40px',
    full: '62px'
  },

  // Shadows and effects
  effects: {
    blur: 'blur(23.85px)',
    boxShadow: 'inset 0px 0px 8px rgba(0, 0, 0, 0.3)',
    textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
  },

  // Z-index levels
  zIndex: {
    base: 0,
    above: 1,
    modal: 100,
    overlay: 1000
  }
};

export default Theme;