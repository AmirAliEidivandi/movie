import { Outlet } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { DashboardHeader } from "../dashboard/DashboardHeader";
import { DashboardSidebar } from "../dashboard/DashboardSidebar";

export function DashboardLayout() {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8 mt-16 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
