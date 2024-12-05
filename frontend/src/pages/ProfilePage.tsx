import { useTranslation } from "react-i18next";
import { ProfileForm } from "../components/dashboard/ProfileForm";
import { useTheme } from "../contexts/ThemeContext";

export function ProfilePage() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  return (
    <div className="max-w-4xl mx-auto">
      <h1
        className={`text-2xl font-bold mb-8 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {t("profile.title")}
      </h1>
      <ProfileForm />
    </div>
  );
}
