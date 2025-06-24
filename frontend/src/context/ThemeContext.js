import React, { createContext, useState, useContext, useEffect } from 'react';

const themes = {
  light: 'light',
  dark: 'dark',
  system: 'system'
};

const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const getInitialTheme = () => {
  if (typeof window === 'undefined') return themes.light;
  
  try {
    const savedTheme = localStorage.getItem('theme');
    
    // Check if savedTheme is one of our valid themes
    if (savedTheme && Object.values(themes).includes(savedTheme)) {
      // If saved theme is "system", get the actual system theme
      if (savedTheme === themes.system) {
        return getSystemTheme();
      }
      return savedTheme;
    }
    
    return getSystemTheme();
  } catch (error) {
    console.error('Error reading theme from localStorage:', error);
    return themes.light;
  }
};

const getInitialSetting = () => {
  if (typeof window === 'undefined') return themes.system;
  
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && Object.values(themes).includes(savedTheme)) {
      return savedTheme;
    }
    return themes.system;
  } catch (error) {
    console.error('Error reading theme from localStorage:', error);
    return themes.system;
  }
};

const ThemeContext = createContext({
  theme: themes.light,
  themeSetting: themes.system,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [themeSetting, setThemeSetting] = useState(getInitialSetting);
  
  const updateTheme = (newTheme) => {
    try {
      // Save the theme setting to localStorage
      localStorage.setItem('theme', newTheme);
      
      // Update the theme setting state
      setThemeSetting(newTheme);
      
      // Set the actual theme (if system, get the system preference)
      if (newTheme === themes.system) {
        setTheme(getSystemTheme());
      } else {
        setTheme(newTheme);
      }
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  };
  
  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (themeSetting === themes.system) {
        setTheme(e.matches ? themes.dark : themes.light);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [themeSetting]);
  
  // Update the document element class when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Update the meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? '#1f2937' : '#4f46e5'
      );
    }
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, themeSetting, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
