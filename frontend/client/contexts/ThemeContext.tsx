import { createContext, useEffect, useState } from "react";

// Define the possible theme values
type Theme = "dark" | "light" | "system";

// Define the shape of the state that our context will provide
interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Set the initial state for the context
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

// Create and EXPORT the context so the hook can import it
export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

// This is the main provider component
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme", // This is the key for localStorage
  ...props
}: ThemeProviderProps) {
  // State to hold the current theme
  const [theme, setTheme] = useState<Theme>(
    // On initial load, try to get the theme from localStorage, or use the default
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  // This effect runs whenever the `theme` state changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove any existing theme classes
    root.classList.remove("light", "dark");

    // If the theme is 'system', we need to check the user's OS preference
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    // Otherwise, just add the selected theme's class (e.g., 'dark' or 'light')
    root.classList.add(theme);
  }, [theme]);

  // The value that will be provided to all children components
  const value = {
    theme,
    // This function updates both localStorage and the component's state
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Define the shape of the props for our ThemeProvider component
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}
