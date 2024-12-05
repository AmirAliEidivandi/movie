import { Outlet } from "react-router-dom";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

export function DashboardPage() {
  const { isDarkMode } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <DashboardHeader />
      <div className="flex h-screen pt-16">
        <DashboardSidebar />
        <main className={`flex-1 p-8 overflow-y-auto ${
          isRTL ? 'mr-64' : 'ml-64'
        }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
