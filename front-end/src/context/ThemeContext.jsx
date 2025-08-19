import { createContext, useMemo, useState, useEffect } from "react";
import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material/styles";

/**
 * ThemeContext: persist mode, follow system preference, expose toggle.
 */
export const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  const systemPrefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initialMode =
    localStorage.getItem("themeMode") || (systemPrefersDark ? "dark" : "light");

  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleTheme = () => setMode((p) => (p === "light" ? "dark" : "light"));

  let theme = useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: { mode },
          shape: { borderRadius: 10 },
          components: {
            MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
            MuiCard: { defaultProps: { elevation: 2 } },
          },
        })
      ),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};