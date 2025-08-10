import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { forgotPassword } from "../../api/auth";
import { useTheme } from "../../contexts/ThemeContext";
import { EmailIcon } from "../icons";
import { FormInput } from "./FormInput";

interface FormErrors {
  email?: string;
  submit?: string;
}

export function ForgotPasswordForm() {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = t("errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("errors.emailInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        await forgotPassword(email);
        setIsEmailSent(true);
        toast.success(t("auth.resetEmailSent"));
      } catch (error: any) {
        setErrors({
          submit: error.response?.data?.message || t("errors.general"),
        });
        toast.error(t("errors.general"));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isEmailSent) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white/80"
        } backdrop-blur-sm p-8 shadow-lg sm:rounded-lg text-center`}
      >
        <h3
          className={`text-xl font-semibold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {t("auth.checkEmail")}
        </h3>
        <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          {t("auth.resetInstructions")}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white/80"
      } backdrop-blur-sm py-8 px-4 shadow-lg sm:rounded-lg sm:px-10`}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          label={t("auth.email")}
          id="email"
          name="email"
          type="email"
          required
          icon={<EmailIcon />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder={t("placeholders.enterEmail")}
        />

        {errors.submit && (
          <p className="text-sm text-red-600 mt-1">{errors.submit}</p>
        )}

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
            {isSubmitting
              ? t("auth.sendingInstructions")
              : t("auth.sendInstructions")}
          </button>
        </div>
      </form>
    </div>
  );
}
