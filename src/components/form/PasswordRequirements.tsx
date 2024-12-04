import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const requirements = [
    {
      label: t("passwordRequirements.minLength"),
      isValid: password.length >= 8,
    },
    { label: t("passwordRequirements.number"), isValid: /\d/.test(password) },
    {
      label: t("passwordRequirements.specialChar"),
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  return (
    <motion.ul
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 space-y-2"
    >
      {requirements.map((req, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="mr-2"
          >
            {req.isValid ? (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            ) : (
              <XCircleIcon className="w-5 h-5 text-red-500" />
            )}
          </motion.span>
          <span className={req.isValid ? "text-green-500" : "text-red-500"}>
            {req.label}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
