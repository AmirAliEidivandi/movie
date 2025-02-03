import { useTranslation } from "react-i18next";
import { Home } from "../components/home/Home";
import { HomeHeader } from "../components/home/HomeHeader";
import { PageContainer } from "../components/layout/PageContainer";
import { useTheme } from "../contexts/ThemeContext";

export default function HomePage() {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <PageContainer>
      <HomeHeader />
      <Home />
    </PageContainer>
  );
}
