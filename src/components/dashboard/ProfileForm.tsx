import { CalendarIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import { FormInput } from "../form/FormInput";
import { GenreCheckbox } from "../form/GenreCheckbox";
import { UserIcon } from "../icons";

interface ProfileData {
  firstName: string;
  lastName: string;
  nickname: string;
  birthDate: string;
  bio: string;
  favoriteGenres: string[];
}

export function ProfileForm() {
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    nickname: "",
    birthDate: "",
    bio: "",
    favoriteGenres: [],
  });

  const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Documentary",
  ];

  const handleGenreChange = (genre: string, checked: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      favoriteGenres: checked
        ? [...prev.favoriteGenres, genre]
        : prev.favoriteGenres.filter((g) => g !== genre),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  // Custom input component for the date picker
  const CustomInput = ({
    value,
    onClick,
  }: {
    value?: string;
    onClick?: () => void;
  }) => (
    <div className="relative">
      <div
        className={`absolute ${
          isRTL ? "right-3" : "left-3"
        } top-1/2 -translate-y-1/2 text-gray-400`}
      >
        <CalendarIcon className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={value}
        onClick={onClick}
        readOnly
        className={`w-full rounded-lg ${isRTL ? "pr-10" : "pl-10"} py-2.5 
          ${
            isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-gray-900 border-gray-300"
          } 
          border focus:ring-2 focus:ring-indigo-500 cursor-pointer`}
        placeholder={t("profile.selectDate")}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput
          label={t("profile.firstName")}
          id="firstName"
          name="firstName"
          type="text"
          icon={<UserIcon />}
          value={profileData.firstName}
          onChange={(e) =>
            setProfileData((prev) => ({ ...prev, firstName: e.target.value }))
          }
        />

        <FormInput
          label={t("profile.lastName")}
          id="lastName"
          name="lastName"
          type="text"
          icon={<UserIcon />}
          value={profileData.lastName}
          onChange={(e) =>
            setProfileData((prev) => ({ ...prev, lastName: e.target.value }))
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput
          label={t("profile.nickname")}
          id="nickname"
          name="nickname"
          type="text"
          icon={<UserIcon />}
          value={profileData.nickname}
          onChange={(e) =>
            setProfileData((prev) => ({ ...prev, nickname: e.target.value }))
          }
        />

        <div>
          <label
            className={`block text-sm font-medium ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            } mb-2`}
          >
            {t("profile.birthDate")}
          </label>
          <DatePicker
            selected={
              profileData.birthDate ? new Date(profileData.birthDate) : null
            }
            onChange={(date: Date | null) =>
              setProfileData({
                ...profileData,
                birthDate: date ? date.toISOString() : "",
              })
            }
            customInput={<CustomInput />}
            dateFormat="MM/dd/yyyy"
            showYearDropdown
            yearDropdownItemNumber={100}
            scrollableYearDropdown={true}
            maxDate={new Date()}
            minDate={new Date(1900, 0, 1)}
            showMonthDropdown
            dropdownMode="select"
            className={`w-full rounded-lg ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
            }`}
            wrapperClassName="w-full"
            calendarClassName={isDarkMode ? "dark-theme" : ""}
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div className="flex justify-between px-2 py-2">
                <button
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                  type="button"
                  className={`p-1 ${prevMonthButtonDisabled && 'opacity-50'}`}
                >
                  {"<"}
                </button>
                <select
                  value={date.getFullYear()}
                  onChange={({ target: { value } }) => changeYear(Number(value))}
                  className="bg-transparent mx-2"
                >
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
                <select
                  value={date.getMonth()}
                  onChange={({ target: { value } }) => changeMonth(Number(value))}
                  className="bg-transparent mx-2"
                >
                  {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                    <option key={month} value={month}>
                      {new Date(date.getFullYear(), month).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <button
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  type="button"
                  className={`p-1 ${nextMonthButtonDisabled && 'opacity-50'}`}
                >
                  {">"}
                </button>
              </div>
            )}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="bio"
          className={`block text-sm font-medium ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {t("profile.bio")}
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          className={`mt-1 block w-full rounded-md shadow-sm
            ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }
            focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
          `}
          value={profileData.bio}
          onChange={(e) =>
            setProfileData((prev) => ({ ...prev, bio: e.target.value }))
          }
        />
      </div>

      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {t("profile.favoriteGenres")}
        </label>
        <div
          className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {genres.map((genre) => (
            <GenreCheckbox
              key={genre}
              label={t(`genres.${genre.toLowerCase()}`)}
              checked={profileData.favoriteGenres.includes(genre)}
              onChange={(checked) => handleGenreChange(genre, checked)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-sm font-medium text-white
            ${
              isDarkMode
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          `}
        >
          {t("common.saveChanges")}
        </button>
      </div>
    </form>
  );
}
