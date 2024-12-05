import { Menu, Transition } from "@headlessui/react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";

const languages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
  },
  {
    code: "fa",
    name: "فارسی",
    nativeName: "فارسی",
  },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { isDarkMode } = useTheme();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    document.dir = langCode === "fa" ? "rtl" : "ltr";
  };

  return (
    <Menu as="div" className="relative inline-block text-left z-50">
      <Menu.Button
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
          isDarkMode
            ? "text-gray-300 hover:text-white hover:bg-gray-700"
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        } transition-colors`}
      >
        <GlobeAltIcon className="w-5 h-5" />
        <span>{i18n.language === "fa" ? "فارسی" : "English"}</span>
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
          className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 ${
            isDarkMode
              ? "bg-gray-800 ring-1 ring-gray-700"
              : "bg-white ring-1 ring-gray-200"
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
                    {lang.nativeName}
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
