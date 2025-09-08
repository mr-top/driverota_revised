import { createContext, useState, useEffect } from "react";

const ThemeContext = createContext();

function getPreference () {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') || getPreference());

  useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  function getTheme () {
    return currentTheme;
  }

  function changeTheme (newTheme) {
    setCurrentTheme(newTheme);
  }

  return (
    <ThemeContext.Provider value={{getTheme, changeTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeProvider }