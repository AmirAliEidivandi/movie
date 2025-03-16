import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { useTheme } from "../../contexts/ThemeContext";
import { EmailIcon, LockIcon } from "../icons";
import { FormInput } from "./FormInput";

interface LoginData {
  emailOrUsername: string;
  password: string;
}

interface LoginErrors {
  emailOrUsername?: string;
  password?: string;
  submit?: string;
}

export function LoginForm() {
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  const [loginData, setLoginData] = useState<LoginData>({
    emailOrUsername: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isRTL = i18n.language === "fa";

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!loginData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = t("validation.required", {
        field: t("auth.emailOrUsername"),
      });
    }

    if (!loginData.password.trim()) {
      newErrors.password = t("validation.required", {
        field: t("auth.password"),
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        const response = await login({
          emailOrUsername: loginData.emailOrUsername,
          password: loginData.password,
        });

        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        navigate("/dashboard");
      } catch (error: any) {
        setErrors({
          ...errors,
          submit: error.response?.data?.message || t("errors.general"),
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white/80"
      } backdrop-blur-sm py-8 px-4 shadow-lg sm:rounded-lg sm:px-10`}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          label={t("auth.emailOrUsername")}
          id="emailOrUsername"
          name="emailOrUsername"
          type="text"
          required
          icon={<EmailIcon />}
          value={loginData.emailOrUsername}
          onChange={handleInputChange}
          error={errors.emailOrUsername}
          placeholder={t("placeholders.enterEmailOrUsername")}
          dir={isRTL ? "rtl" : "ltr"}
        />

        <FormInput
          label={t("auth.password")}
          id="password"
          name="password"
          type="password"
          required
          icon={<LockIcon />}
          value={loginData.password}
          onChange={handleInputChange}
          error={errors.password}
          placeholder={t("placeholders.enterPassword")}
          dir={isRTL ? "rtl" : "ltr"}
        />

        <div
          className={`flex items-center ${
            isRTL ? "justify-start" : "justify-end"
          }`}
        >
          <Link
            to="/forgot-password"
            className={`text-sm font-medium ${
              isDarkMode
                ? "text-indigo-400 hover:text-indigo-300"
                : "text-indigo-600 hover:text-indigo-500"
            }`}
          >
            {t("auth.forgotPassword")}
          </Link>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white ${
              isDarkMode
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors`}
          >
            {isSubmitting ? t("auth.loggingIn") : t("auth.login")}
          </button>
        </div>
      </form>
    </div>
  );
}
