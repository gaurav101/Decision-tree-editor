import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import App from "./decision-tree-editor";
import { C } from "./constants";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: C.bg,
      paper: C.panel,
    },
    primary: {
      main: C.accent,
    },
    secondary: {
      main: C.green,
    },
    error: {
      main: C.red,
    },
    warning: {
      main: C.amber,
    },
    text: {
      primary: C.text,
      secondary: C.muted,
    },
    divider: C.border,
  },
  typography: {
    fontFamily: "'DM Mono', 'Fira Code', monospace",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 700,
        },
      },
    },
  },
});

const root = createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);