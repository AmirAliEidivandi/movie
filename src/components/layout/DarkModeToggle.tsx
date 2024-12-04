import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";

export function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg ${
        isDarkMode
          ? "text-gray-400 hover:text-gray-200"
          : "text-gray-500 hover:text-gray-700"
      }`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}
