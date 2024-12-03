import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export function NotFoundPage() {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isRTL = useTheme().language === "fa";

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-xl px-4 py-8 mx-auto text-center">
        {/* 404 SVG Illustration */}
        <svg
          className={`w-64 h-64 mx-auto mb-8 ${
            isDarkMode ? "text-gray-700" : "text-gray-200"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21.9 9.6c-.2-.5-.8-.7-1.3-.5l-2.9 1.4-2.1-2.1-2.1-2.1 1.4-2.9c.2-.5 0-1.1-.5-1.3-.5-.2-1.1 0-1.3.5l-1.4 2.9-3-3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l3 3-2.9 1.4c-.5.2-.7.8-.5 1.3.2.5.8.7 1.3.5l2.9-1.4 2.1 2.1 2.1 2.1-1.4 2.9c-.2.5 0 1.1.5 1.3.5.2 1.1 0 1.3-.5l1.4-2.9 3 3c.4.4 1 .4 1.4 0s.4-1 0-1.4l-3-3 2.9-1.4c.5-.2.7-.8.5-1.3z" />
        </svg>

        {/* Error Text */}
        <h1
          className={`mb-4 text-8xl font-extrabold ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          404
        </h1>

        <h2
          className={`mb-4 text-2xl font-bold ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {t("errors.pageNotFound")}
        </h2>

        <p
          className={`mb-8 text-lg ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {t("errors.pageNotFoundMessage")}
        </p>

        {/* Updated Action Buttons with consistent spacing */}
        <div
          className={`flex flex-col sm:flex-row justify-center gap-4 ${
            isRTL ? "sm:flex-row-reverse" : ""
          }`}
        >
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
              isDarkMode
                ? "text-gray-200 bg-gray-800 hover:bg-gray-700"
                : "text-gray-700 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {t("actions.goBack")}
          </button>

          <Link
            to="/"
            className={`px-6 py-3 text-sm font-medium text-white rounded-lg transition-colors ${
              isDarkMode
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {t("actions.backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
