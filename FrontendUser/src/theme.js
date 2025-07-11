export const theme = {
  colors: {
    primary: '#F39C12', // Golden Yellow/Orange
    secondary: '#1ABC9C', // Teal/Dark Turquoise
    white: '#FFFFFF',
    lightGrey: '#ECF0F1',
    darkGrey: '#34495E',
  },
  typography: {
    fontFamily: {
      heading: "'Poppins', sans-serif",
      body: "'Roboto', sans-serif",
    },
    fontSize: {
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.75rem',
      body: '1rem',
      small: '0.875rem',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
    md: '0 4px 10px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  buttons: {
    primary: {
      backgroundColor: '#F39C12',
      color: '#FFFFFF',
      hoverBg: '#E67E22',
    },
    secondary: {
      backgroundColor: '#1ABC9C',
      color: '#FFFFFF',
      hoverBg: '#16A085',
    },
    outline: {
      borderColor: '#1ABC9C',
      color: '#1ABC9C',
      hoverBg: '#1ABC9C',
      hoverColor: '#FFFFFF',
    },
  },
  inputs: {
    borderColor: '#ECF0F1',
    focusBorderColor: '#1ABC9C',
    placeholderColor: '#95A5A6',
  },
};

export default theme;