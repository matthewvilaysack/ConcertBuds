const Theme = {
  colors: {
    primary: {
      main: '#846AE3',
      light: '#898FCA',
      dark: '#554ACD',
      accent: '#6F52CF'
    },

    secondary: {
      pink: '#F464A2',
      red: '#FD5F74',
      coral: '#FFAAA7',
      fuschia: '#DB64B4'
    },

    background: {
      primary: '#846AE3',
      secondary: '#6F52CF',
      gradient: 'radial-gradient(227.69% 155.46% at 49.87% -55.46%, #554ACD 0%, #898FCA 35%, #CBD1CD 66.5%, #F1F1F2 99.99%)',
      overlay: 'rgba(217, 217, 217, 0.58)',
      blurred: 'rgba(255, 255, 255, 0.5)'
    },

    text: {
      primary: '#000000',
      secondary: '#686767',
      tertiary: '#868686',
      white: '#FFFFFF',
      medium: '#A0A0A0'
    },

    ui: {
      border: '#CCCCCC',
      inputBackground: 'rgba(255, 255, 255, 0.61)',
      buttonPrimary: '#846AE3',
      buttonDanger: '#FC5058',
      shadow: 'rgba(0, 0, 0, 0.25)'
    }
  },

  typography: {
    fontFamilies: {
      primary: 'Doppio One',
      display: 'Lilita One',
      mono: 'JetBrains Mono'
    },
    sizes: {
      xs: 13,
      sm: 14,
      base: 16,
      lg: 20,
      xl: 24,
      '2xl': 28,
      '3xl': 34,
      '4xl': 38,
      '5xl': 48
    }
  },

  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40
  },

  borderRadius: {
    sm: 8,
    md: 10,
    lg: 20,
    xl: 40,
    full: 62
  },

  effects: {
    blur: 'blur(23.85px)',
    boxShadow: 'inset 0px 0px 8px rgba(0, 0, 0, 0.3)',
    textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
  },

  zIndex: {
    base: 0,
    above: 1,
    modal: 100,
    overlay: 1000
  }
};

export default Theme;