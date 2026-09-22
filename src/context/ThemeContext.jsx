import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// Helper to evaluate OS system preference
const getSystemTheme = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export const ThemeProvider = ({ children }) => {
  // 1. Initialize State
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    // Only use saved theme if explicitly set to "light" or "dark"
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }
    // Otherwise, fallback to System Preference
    return getSystemTheme();
  });

  // Track whether user explicitly toggled the theme in this session
  const [hasUserOverridden, setHasUserOverridden] = useState(() => {
    return Boolean(localStorage.getItem("theme"));
  });

  // 2. DOM Attribute & LocalStorage Sync
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    // Only save to localStorage if the user explicitly chose a theme
    if (hasUserOverridden) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, hasUserOverridden]);

  // 3. Listen to Real-time System OS Theme Changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      // Only auto-switch if the user hasn't explicitly picked a theme in localStorage
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    // Attach listener
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  // 4. Toggle Theme Handler
  const toggleTheme = () => {
    setHasUserOverridden(true);
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", nextTheme); // Force write to storage
      return nextTheme;
    });
  };

  // 5. Reset to System Preference (Optional Helper)
  const resetToSystemTheme = () => {
    localStorage.removeItem("theme");
    setHasUserOverridden(false);
    setTheme(getSystemTheme());
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, resetToSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
