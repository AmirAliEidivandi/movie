import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

export function Home() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const navigationCards = [
    { title: t("dashboard.movies"), path: "/movies", icon: "🎬" },
    { title: t("dashboard.favorites"), path: "/favorites", icon: "⭐" },
    { title: t("dashboard.watchlist"), path: "/watchlist", icon: "📋" },
    { title: t("dashboard.ratings"), path: "/ratings", icon: "⭐" },
  ];

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {navigationCards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              className={`block p-6 rounded-lg shadow-md transition-transform hover:scale-105
                ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-white hover:bg-gray-50 text-gray-900"
                }`}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h2 className="text-xl font-semibold">{card.title}</h2>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
