import {
  ClockIcon,
  CogIcon,
  CreditCardIcon,
  FilmIcon,
  HeartIcon,
  HomeIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<React.ComponentProps<"svg">>;
}

export function DashboardSidebar() {
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const navItems: NavItem[] = [
    { path: "/dashboard", label: "dashboard.home", icon: HomeIcon },
    { path: "/dashboard/profile", label: "dashboard.profile", icon: UserIcon },
    { path: "/dashboard/wallet", label: "Wallet", icon: CreditCardIcon },
    { path: "/dashboard/movies", label: "dashboard.movies", icon: FilmIcon },
    {
      path: "/dashboard/favorites",
      label: "dashboard.favorites",
      icon: HeartIcon,
    },
    {
      path: "/dashboard/watchlist",
      label: "dashboard.watchlist",
      icon: ClockIcon,
    },
    { path: "/dashboard/ratings", label: "dashboard.ratings", icon: StarIcon },
    {
      path: "/dashboard/settings",
      label: "dashboard.settings",
      icon: CogIcon,
    },
  ];

  return (
    <aside
      className={`fixed ${isRTL ? "right-0" : "left-0"} top-16 bottom-0 w-64 
        ${isDarkMode ? "bg-gray-800" : "bg-white"} 
        shadow-sm overflow-y-auto`}
    >
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center ${
                isRTL ? "space-x-reverse" : "space-x-2"
              } px-4 py-2.5 rounded-lg
              transition-colors duration-200
              ${
                isActive
                  ? isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-indigo-50 text-indigo-600"
                  : isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span>{t(item.label)}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
