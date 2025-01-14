import {
  AtSymbolIcon,
  BriefcaseIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { getProfile, updateProfile } from "../../api/auth";
import { useTheme } from "../../contexts/ThemeContext";
import { FormInput } from "../form/FormInput";
import { GenreCheckbox } from "../form/GenreCheckbox";

interface ProfileData {
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  occupation: string;
  location: string;
  bio: string;
  favoriteGenres: string[];
}

export function ProfileForm() {
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    nickname: "",
    email: "",
    phoneNumber: "",
    occupation: "",
    location: "",
    bio: "",
    favoriteGenres: [],
  });

  const [originalProfileData, setOriginalProfileData] =
    useState<ProfileData | null>(null);

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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getProfile(localStorage.getItem("accessToken") || "");
      setProfileData(data);
      setOriginalProfileData(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (JSON.stringify(profileData) === JSON.stringify(originalProfileData)) {
      console.log("No changes detected, skipping update.");
      return;
    }

    try {
      setIsSaving(true);
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        occupation: profileData.occupation,
        location: profileData.location,
        nickname: profileData.nickname,
        bio: profileData.bio,
        favoriteGenres: profileData.favoriteGenres,
      };

      await updateProfile(
        localStorage.getItem("accessToken") || "",
        updateData
      );
      setOriginalProfileData(profileData);
      toast.success(t("profile.updateSuccess"));
    } catch (error) {
      console.log("Showing error toast");
      toast.error(t("profile.updateError"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto pb-8">
      {/* Basic Information */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-gray-50"
        } p-6 rounded-lg shadow-sm`}
      >
        <h2
          className={`text-lg font-medium mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {t("profile.basicInfo")}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label={t("profile.firstName")}
            id="firstName"
            name="firstName"
            type="text"
            value={profileData.firstName}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, firstName: e.target.value }))
            }
            icon={<UserIcon className="w-5 h-5" />}
            className={`${isRTL ? "text-right" : "text-left"}`}
          />

          <FormInput
            label={t("profile.lastName")}
            id="lastName"
            name="lastName"
            type="text"
            value={profileData.lastName}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, lastName: e.target.value }))
            }
            icon={<UserIcon className="w-5 h-5" />}
            className={`${isRTL ? "text-right" : "text-left"}`}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-gray-50"
        } p-6 rounded-lg shadow-sm`}
      >
        <h2
          className={`text-lg font-medium mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {t("profile.contactInfo")}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label={t("profile.email")}
            id="email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, email: e.target.value }))
            }
            icon={<AtSymbolIcon className="w-5 h-5" />}
            className={`${isRTL ? "text-right" : "text-left"}`}
            readOnly
            disabled
          />

          <FormInput
            label={t("profile.phone")}
            id="phone"
            name="phone"
            type="tel"
            value={profileData.phoneNumber}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }))
            }
            icon={<PhoneIcon className="w-5 h-5" />}
            className={`${isRTL ? "text-right" : "text-left"}`}
          />
        </div>
      </div>

      {/* Additional Information */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-gray-50"
        } p-6 rounded-lg shadow-sm`}
      >
        <h2
          className={`text-lg font-medium mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {t("profile.additionalInfo")}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            label={t("profile.occupation")}
            id="occupation"
            name="occupation"
            type="text"
            value={profileData.occupation}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                occupation: e.target.value,
              }))
            }
            icon={<BriefcaseIcon className="w-5 h-5" />}
            className={`${isRTL ? "text-right" : "text-left"}`}
          />

          <FormInput
            label={t("profile.location")}
            id="location"
            name="location"
            type="text"
            value={profileData.location}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, location: e.target.value }))
            }
            icon={<MapPinIcon className="w-5 h-5" />}
            className={`${isRTL ? "text-right" : "text-left"}`}
          />

          <FormInput
            label={t("profile.nickname")}
            id="nickname"
            name="nickname"
            type="text"
            value={profileData.nickname}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, nickname: e.target.value }))
            }
            icon={<UserIcon className="w-5 h-5" />}
            className={`${isRTL ? "text-right" : "text-left"}`}
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="bio"
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {t("profile.bio")}
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            dir={isRTL ? "rtl" : "ltr"}
            className={`block w-full rounded-lg shadow-sm resize-none
              ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }
              ${isRTL ? "text-right px-3" : "text-left px-3"}
              focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
            `}
            value={profileData.bio}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, bio: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Favorite Genres */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-gray-50"
        } p-6 rounded-lg shadow-sm`}
      >
        <h2
          className={`text-lg font-medium mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {t("profile.favoriteGenres")}
        </h2>
        <div
          className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {genres.map((genre) => (
            <GenreCheckbox
              key={genre}
              label={t(`genres.${genre.toLowerCase()}`)}
              checked={profileData.favoriteGenres.includes(genre)}
              onChange={(checked) => handleGenreChange(genre, checked)}
              className={isRTL ? "space-x-reverse" : ""}
            />
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium text-white
            ${
              isDarkMode
                ? "bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400"
                : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
            }
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition-colors duration-200 disabled:cursor-not-allowed
          `}
        >
          {isSaving ? t("common.saving") : t("common.saveChanges")}
        </button>
      </div>
    </form>
  );
}
