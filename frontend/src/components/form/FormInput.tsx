import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  dir?: "rtl" | "ltr";
}

export function FormInput({
  label,
  error,
  icon,
  dir = "ltr",
  className = "",
  ...props
}: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className={`block text-sm font-medium ${
          error ? "text-red-500" : "text-gray-700 dark:text-gray-300"
        }`}
        dir={dir}
      >
        {label}
      </label>
      <div className="mt-1 relative">
        <div
          className={`absolute inset-y-0 ${
            dir === "rtl" ? "right-0 pr-3" : "left-0 pl-3"
          } flex items-center pointer-events-none text-gray-400`}
        >
          {icon}
        </div>
        <input
          {...props}
          dir={dir}
          className={`block w-full ${
            dir === "rtl" ? "pr-10 pl-3" : "pl-10 pr-3"
          } py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300"
          } ${className} dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500" dir={dir}>
          {error}
        </p>
      )}
    </div>
  );
}
