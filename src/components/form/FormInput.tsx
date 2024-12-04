import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { InputHTMLAttributes, ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion } from 'framer-motion';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
}

export function FormInput({
  label,
  icon,
  error,
  showPasswordToggle,
  onTogglePassword,
  showPassword,
  ...props
}: FormInputProps) {
  const { isDarkMode } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label
        htmlFor={props.id}
        className={`block text-sm font-medium mb-2 ${
          isDarkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {label}
      </label>
      <div className="relative group">
        <div className={`relative rounded-lg shadow-sm transition-all duration-200 ${
          error ? 'shadow-red-100' : 'group-hover:shadow-md'
        }`}>
          {icon && (
            <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} 
              flex items-center pointer-events-none transition-colors
              ${error ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {icon}
            </div>
          )}
          <input
            {...props}
            autoComplete="off"
            className={`
              block w-full rounded-lg
              ${icon ? (isRTL ? 'pr-10' : 'pl-10') : (isRTL ? 'pr-3' : 'pl-3')}
              ${showPasswordToggle ? (isRTL ? 'pl-10' : 'pr-10') : (isRTL ? 'pl-3' : 'pr-3')}
              py-2.5
              ${isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
              }
              border
              focus:outline-none focus:ring-2 
              ${error 
                ? 'focus:ring-red-500 focus:border-red-500' 
                : 'focus:ring-indigo-500 focus:border-indigo-500'
              }
              transition-all duration-200
              text-sm
              ${!isDarkMode && !error ? 'shadow-sm' : ''}
            `}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={onTogglePassword}
              className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} 
                flex items-center transition-colors hover:text-indigo-500
                ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: showPassword ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </motion.div>
            </button>
          )}
        </div>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
          id={`${props.id}-error`}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
