import { Menu, Transition } from "@headlessui/react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import { DarkModeToggle } from "../layout/DarkModeToggle";
import { LanguageSwitcher } from "../layout/LanguageSwitcher";

export function DashboardHeader() {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <header
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } shadow-sm fixed w-full top-0 z-10`}
    >
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            MovieHub
          </h1>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <BellIcon className="w-6 h-6" />
          </button>

          <DarkModeToggle />
          <LanguageSwitcher />

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button
              className={`flex items-center space-x-2 p-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <UserCircleIcon className="w-6 h-6" />
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
                className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 ${
                  isDarkMode
                    ? "bg-gray-800 ring-1 ring-gray-700"
                    : "bg-white ring-1 ring-black ring-opacity-5"
                }`}
              >
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/dashboard/profile"
                      className={`${
                        active
                          ? isDarkMode
                            ? "bg-gray-700"
                            : "bg-gray-100"
                          : ""
                      } ${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      } block px-4 py-2 text-sm`}
                    >
                      {t("dashboard.profile")}
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/login"
                      className={`${
                        active
                          ? isDarkMode
                            ? "bg-gray-700"
                            : "bg-gray-100"
                          : ""
                      } ${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      } block px-4 py-2 text-sm`}
                    >
                      {t("dashboard.signOut")}
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
