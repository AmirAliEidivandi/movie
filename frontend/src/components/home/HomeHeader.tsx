import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";

export function HomeHeader() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  return (
    <header className={`w-full ${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-4xl font-bold tracking-tight">{t("home.title")}</h1>
      </div>
    </header>
  );
}
