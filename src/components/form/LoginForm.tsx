import { FormEvent, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../contexts/ThemeContext";
import { EmailIcon, LockIcon } from "../icons";
import { FormInput } from "./FormInput";

interface LoginData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }

    if (!loginData.password.trim()) {
      newErrors.password = t('errors.passwordRequired');
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
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        console.log("Login form submitted:", loginData);
        // Add your login API call here
        setLoginData({
          email: "",
          password: "",
        });
      } catch (error) {
        console.error("Login error:", error);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } py-8 px-4 shadow sm:rounded-lg sm:px-10`}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          label={t('auth.email')}
          id="email"
          name="email"
          type="email"
          required
          icon={<EmailIcon />}
          value={loginData.email}
          onChange={handleInputChange}
          error={errors.email}
          placeholder={t('placeholders.enterEmail')}
        />

        <FormInput
          label={t('auth.password')}
          id="password"
          name="password"
          type="password"
          required
          icon={<LockIcon />}
          value={loginData.password}
          onChange={handleInputChange}
          error={errors.password}
          placeholder={t('placeholders.enterPassword')}
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
            {isSubmitting ? t('auth.loggingIn') : t('auth.login')}
          </button>
        </div>
      </form>
    </div>
  );
}
