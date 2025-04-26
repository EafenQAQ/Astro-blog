<template>
    <label class="swap swap-rotate">
      <input
        type="checkbox"
        v-model="isDark"
        aria-label="Theme toggle"
       />
  
      <svg class="swap-off h-7 w-7 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
      </svg>
  
      <svg class="swap-on h-7 w-7 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
      </svg>
  
    </label>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  
  // --- Configuration ---
  // Define the names of your light and dark themes.
  // These MUST match the themes defined in your tailwind.config.js
  // and the logic in your initial head script (Layout.astro).
  const LIGHT_THEME = 'light'; // Or 'cupcake', 'bumblebee', etc.
  const DARK_THEME = 'dark';   // Or 'night', 'synthwave', etc.
  // --- End Configuration ---
  
  // Reactive state to track if dark mode is enabled.
  // This will be bound to the checkbox's checked state.
  // true = dark theme, false = light theme.
  const isDark = ref(false);
  
  // Function to apply the theme to the <html> element and save preference.
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    console.log(`Theme changed to: ${theme}`); // For debugging
  };
  
  // Watch for changes in the isDark state (triggered by checkbox toggle).
  watch(isDark, (newVal) => {
    const newTheme = newVal ? DARK_THEME : LIGHT_THEME;
    applyTheme(newTheme);
  });
  
  // Run this code only after the component has mounted on the client.
  onMounted(() => {
    // Determine the initial theme based on localStorage or the attribute
    // already set by the script in <head>.
    const initialTheme = localStorage.getItem('theme') || document.documentElement.getAttribute('data-theme');
  
    // Set the initial state of the checkbox.
    isDark.value = initialTheme === DARK_THEME;
  
    // Optional: Ensure the theme attribute is correctly set, just in case.
    // This usually isn't strictly necessary if the head script works correctly,
    // but provides an extra layer of consistency.
    const themeToApply = isDark.value ? DARK_THEME : LIGHT_THEME;
    if (document.documentElement.getAttribute('data-theme') !== themeToApply) {
        applyTheme(themeToApply);
    }
  });
  </script>
  
  <style scoped>
  /* You can add specific styles for the label or icons if needed */
  .swap input[type="checkbox"] {
      /* Visually hide the checkbox itself, as the label handles the interaction */
      /* daisyUI might already do this, but being explicit can help */
      opacity: 0;
      width: 0;
      height: 0;
      position: absolute;
  }
  .swap {
      /* Ensure the label is interactive */
      cursor: pointer;
      display: inline-grid; /* Aligns icons nicely */
      place-items: center; /* Centers icons */
  }
  .swap svg {
      /* Ensure icons from both states take up the same space */
      grid-column-start: 1;
      grid-row-start: 1;
      /* Adjust size if h-10/w-10 in template is too large/small */
      /* width: 2rem;  */
      /* height: 2rem; */
  }
  </style>