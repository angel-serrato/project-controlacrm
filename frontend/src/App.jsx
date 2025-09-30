import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import ComingSoon from "./features/ComingSoon";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    background: { default: "#f9f9f9" },
    text: { primary: "#333" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ComingSoon />
    </ThemeProvider>
  );
}

export default App;
