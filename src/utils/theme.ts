// src/theme/theme.ts

export const lightColors = {
  background: '#FFFFFF',
  text: '#222222',
  primary: '#3498db',
  secondary: '#2ecc71',
  border: '#cccccc',
  placeholder: '#888888',
  card: '#f9f9f9',
};

export const darkColors = {
  background: '#121212',
  text: '#eeeeee',
  primary: '#1e90ff',
  secondary: '#27ae60',
  border: '#333333',
  placeholder: '#aaaaaa',
  card: '#1e1e1e',
};

export const lightTheme = {
  colors: lightColors,
  mode: 'light' as const,
};

export const darkTheme = {
  colors: darkColors,
  mode: 'dark' as const,
};

export type Theme = typeof lightTheme | typeof darkTheme;
