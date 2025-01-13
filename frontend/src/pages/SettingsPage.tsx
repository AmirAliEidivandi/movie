import { useTranslation } from "react-i18next";
import { SettingsForm } from "../components/dashboard/SettingsForm";
import { useTheme } from "../contexts/ThemeContext";

export function SettingsPage() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  return (
    <div className="max-w-4xl mx-auto">
      <h1
        className={`text-2xl font-bold mb-8 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {t("dashboard.settings")}
      </h1>
      <SettingsForm />
    </div>
  );
}
