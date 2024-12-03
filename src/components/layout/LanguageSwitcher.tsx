import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";

const languages = [
  { code: "en", name: "English", countryCode: "us", display: "us English" },
  { code: "fa", name: "فارسی", countryCode: "ir", display: "ir فارسی" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { isDarkMode } = useTheme();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    document.dir = langCode === "fa" ? "rtl" : "ltr";
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-md ${
          isDarkMode
            ? "text-gray-300 hover:text-white hover:bg-gray-700"
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        } transition-colors`}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
            isDarkMode
              ? "bg-gray-800 ring-1 ring-black ring-opacity-5"
              : "bg-white ring-1 ring-black ring-opacity-5"
          } focus:outline-none`}
        >
          <div className="py-1">
            {languages.map((lang) => (
              <Menu.Item key={lang.code}>
                {({ active }) => (
                  <button
                    onClick={() => changeLanguage(lang.code)}
                    className={`
                      ${active && isDarkMode ? "bg-gray-700" : ""}
                      ${active && !isDarkMode ? "bg-gray-100" : ""}
                      ${isDarkMode ? "text-gray-300" : "text-gray-900"}
                      ${i18n.language === lang.code ? "font-semibold" : ""}
                      group flex items-center w-full px-4 py-2 text-sm
                    `}
                  >
                    <span className="lowercase text-gray-500 mr-2">
                      {lang.countryCode}
                    </span>
                    <span className="whitespace-nowrap">{lang.name}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
