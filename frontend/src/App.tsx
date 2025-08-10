import { useTranslation } from "react-i18next";
import { Slide, ToastContainer } from "react-toastify";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  const { i18n } = useTranslation();

  return (
    <ThemeProvider>
      <ToastHost rtl={i18n.dir() === "rtl"} />
      <AppRoutes />
    </ThemeProvider>
  );
}

function ToastHost({ rtl }: { rtl: boolean }) {
  const { isDarkMode } = useTheme();
  return (
    <ToastContainer
      position={rtl ? "top-left" : "top-right"}
      rtl={rtl}
      autoClose={3000}
      closeOnClick
      newestOnTop
      pauseOnHover
      hideProgressBar={false}
      draggable
      limit={3}
      theme={isDarkMode ? "dark" : "light"}
      transition={Slide}
    />
  );
}

export default App;
