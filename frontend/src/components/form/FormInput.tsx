import { InputHTMLAttributes, ReactNode } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion } from 'framer-motion';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
}

export function FormInput({
  label,
  icon,
  error,
  ...props
}: FormInputProps) {
  const { isDarkMode } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div className="relative">
      <label
        htmlFor={props.id}
        className={`block text-sm font-medium mb-2 ${
          isDarkMode ? "text-gray-200" : "text-gray-700"
        } ${isRTL ? 'text-right' : 'text-left'}`}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div 
            className={`absolute inset-y-0 ${isRTL ? 'right-0 mr-3' : 'left-0 ml-3'} 
              flex items-center pointer-events-none
              ${error ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {icon}
          </div>
        )}
        <input
          {...props}
          autoComplete="off"
          dir={isRTL ? 'rtl' : 'ltr'}
          className={`
            block w-full rounded-lg
            ${isRTL 
              ? `text-right ${icon ? 'pr-10 pl-3' : 'px-3'}`
              : `text-left ${icon ? 'pl-10 pr-3' : 'px-3'}`
            }
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
          `}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 text-sm text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
