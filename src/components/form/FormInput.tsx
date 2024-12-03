import { InputHTMLAttributes } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from 'react-i18next';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon: React.ReactNode;
}

export function FormInput({ label, error, icon, ...props }: FormInputProps) {
  const { isDarkMode } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  return (
    <div>
      <label
        htmlFor={props.id}
        className={`block text-sm font-medium ${
          isDarkMode ? "text-gray-200" : "text-gray-700"
        } ${isRTL ? 'text-right' : 'text-left'}`}
      >
        {label}
      </label>
      <div className="mt-1 relative min-h-[40px]">
        <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
          {icon}
        </div>
        <input
          {...props}
          dir={isRTL ? 'rtl' : 'ltr'}
          className={`appearance-none block w-full ${
            isRTL ? 'pr-10 text-right' : 'pl-10 text-left'
          } px-3 py-2.5 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          } ${
            error ? "border-red-500" : ""
          } border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`}
        />
      </div>
      {error && (
        <p className={`mt-2 text-sm text-red-600 ${isRTL ? 'text-right' : 'text-left'}`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
