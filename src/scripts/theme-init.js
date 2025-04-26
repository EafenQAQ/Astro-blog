// src/scripts/theme-init.js
const theme = (() => {
    // 1. Check localStorage
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    // 2. Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'; // Or your preferred default dark theme
    }
    // 3. Default theme
    return 'light'; // Or your preferred default light theme
  })();
  
  // Apply the theme to the <html> element
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  // Store the initial theme determination for the Vue component to potentially read later
  // (Optional, but can help synchronize state if needed)
  document.documentElement.dataset.initialTheme = theme;