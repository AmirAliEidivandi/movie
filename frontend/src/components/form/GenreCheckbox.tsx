import { useTheme } from "../../contexts/ThemeContext";

interface GenreCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function GenreCheckbox({ label, checked, onChange, className = '' }: GenreCheckboxProps) {
  const { isDarkMode } = useTheme();

  return (
    <label className={`inline-flex items-center cursor-pointer group ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className={`
          w-4 h-4 rounded 
          border-2 transition-all duration-200
          ${checked 
            ? isDarkMode 
              ? 'bg-indigo-500 border-indigo-500' 
              : 'bg-indigo-600 border-indigo-600'
            : isDarkMode
              ? 'border-gray-600 bg-gray-700'
              : 'border-gray-300 bg-gray-100'
          }
          peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2
          ${isDarkMode ? 'peer-focus:ring-offset-gray-800' : 'peer-focus:ring-offset-white'}
        `}>
          {checked && (
            <svg
              className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className={`mx-2 text-sm ${
        isDarkMode ? 'text-gray-200' : 'text-gray-700'
      } group-hover:text-indigo-500 transition-colors`}>
        {label}
      </span>
    </label>
  );
} 