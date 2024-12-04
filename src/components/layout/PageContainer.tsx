import { ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      } flex flex-col justify-center py-12 sm:px-6 lg:px-8`}
    >
      {children}
    </div>
  );
}
