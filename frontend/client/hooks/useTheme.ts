import { useContext } from "react";
import { ThemeProviderContext } from "../contexts/ThemeContext"; // We will update the context next

/**
 * Custom hook for accessing the theme context.
 * Provides the current theme and a function to set the theme.
 *
 * @returns {{
 * theme: "dark" | "light" | "system",
 * setTheme: (theme: "dark" | "light" | "system") => void
 * }}
 * @throws {Error} If used outside of a ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
