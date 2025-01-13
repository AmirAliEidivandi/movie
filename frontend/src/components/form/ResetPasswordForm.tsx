import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../api/auth";
import { useTheme } from "../../contexts/ThemeContext";
import { LockIcon } from "../icons";
import { FormInput } from "./FormInput";

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

export function ResetPasswordForm() {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = searchParams.get("token");
    if (!token) {
      setErrors({ submit: t("errors.invalidToken") });
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword({ token, ...formData });
      toast.success(t("auth.passwordResetSuccess"));
      navigate("/login");
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || t("errors.general"),
      });
      toast.error(t("errors.general"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white/80"
      } backdrop-blur-sm py-8 px-4 shadow-lg sm:rounded-lg sm:px-10`}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          label={t("auth.newPassword")}
          id="password"
          name="password"
          type="password"
          required
          icon={<LockIcon />}
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          error={errors.password}
          placeholder={t("placeholders.enterNewPassword")}
        />

        <FormInput
          label={t("auth.confirmPassword")}
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          icon={<LockIcon />}
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          error={errors.confirmPassword}
          placeholder={t("placeholders.confirmNewPassword")}
        />

        {errors.submit && (
          <p className="text-sm text-red-600 mt-1">{errors.submit}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white ${
            isDarkMode
              ? "bg-indigo-500 hover:bg-indigo-600"
              : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors`}
        >
          {isSubmitting ? t("auth.resetting") : t("auth.resetPassword")}
        </button>
      </form>
    </div>
  );
}
