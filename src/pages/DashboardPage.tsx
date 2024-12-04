import { Outlet } from "react-router-dom";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { useTheme } from "../contexts/ThemeContext";

export function DashboardPage() {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
