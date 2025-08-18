import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "../pages/DashboardPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import HomePage from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import PaymentResultPage from "../pages/PaymentResultPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { SettingsPage } from "../pages/SettingsPage";
import { SignUpPage } from "../pages/SignUpPage";
import WalletPage from "../pages/WalletPage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route path="settings" element={<SettingsPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="/" element={<HomePage />} />
        <Route path="/payment/result" element={<PaymentResultPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
