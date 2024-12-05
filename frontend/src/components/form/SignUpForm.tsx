import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../api/auth";
import { useTheme } from "../../contexts/ThemeContext.tsx";
import { EmailIcon, LockIcon, UserIcon } from "../icons/index.ts";
import { Notification } from "../ui/Notification";
import { FormInput } from "./FormInput.tsx";
import { PasswordRequirements } from "./PasswordRequirements";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

export function SignUpForm() {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = t("errors.usernameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("errors.emailInvalid");
    }

    if (!formData.password.trim()) {
      newErrors.password = t("errors.passwordRequired");
    } else if (formData.password.length < 6) {
      newErrors.password = t("errors.passwordLength");
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = t("errors.confirmPasswordRequired");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("errors.passwordsDoNotMatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        const response = await signUp({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", response.token);

        setShowNotification(true);

        navigate("/dashboard");
      } catch (error: any) {
        setErrors({
          ...errors,
          submit: error.response?.data?.message || "Signup failed",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white/80"
      } backdrop-blur-sm py-8 px-4 shadow-lg sm:rounded-lg sm:px-10`}
    >
      {showNotification && (
        <Notification
          message={t("auth.registrationSuccess")}
          onClose={() => setShowNotification(false)}
        />
      )}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          label={t("auth.username")}
          id="username"
          name="username"
          type="text"
          required
          icon={<UserIcon />}
          value={formData.username}
          onChange={handleInputChange}
          error={errors.username}
          placeholder={t("placeholders.enterUsername")}
        />

        <FormInput
          label={t("auth.email")}
          id="email"
          name="email"
          type="email"
          required
          icon={<EmailIcon />}
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          placeholder={t("placeholders.enterEmail")}
        />

        <FormInput
          label={t("auth.password")}
          id="password"
          name="password"
          type="password"
          required
          icon={<LockIcon />}
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          placeholder={t("placeholders.enterPassword")}
        />

        <PasswordRequirements password={formData.password} />

        <FormInput
          label={t("auth.confirmPassword")}
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          icon={<LockIcon />}
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          placeholder={t("placeholders.confirmPassword")}
        />

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
            {isSubmitting ? t("auth.signingUp") : t("auth.signUp")}
          </button>
        </div>
      </form>
    </div>
  );
}
