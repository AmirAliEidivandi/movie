import { Dialog } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  changePassword,
  deleteAccount,
  getEmailVerificationStatus,
  logout,
  requestEmailVerification,
  verifyEmail,
} from "../../api/auth";
import { useTheme } from "../../contexts/ThemeContext";
import { FormInput } from "../form/FormInput";

interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function SettingsForm() {
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<PasswordData>>({});
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkEmailStatus = async () => {
      if (!mounted) return;

      try {
        setIsCheckingStatus(true);
        const { isVerified } = await getEmailVerificationStatus(
          localStorage.getItem("accessToken") || ""
        );
        if (mounted) {
          setIsEmailVerified(isVerified);
        }
      } catch (error) {
        console.error("Failed to check email status:", error);
      } finally {
        if (mounted) {
          setIsCheckingStatus(false);
        }
      }
    };

    checkEmailStatus();

    return () => {
      mounted = false;
    };
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Partial<PasswordData> = {};
    if (!passwordData.oldPassword) {
      newErrors.oldPassword = t("errors.passwordRequired");
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = t("errors.passwordRequired");
    }
    if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = t("errors.passwordLength");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = t("errors.passwordsDoNotMatch");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword(localStorage.getItem("accessToken") || "", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      toast.success(t("settings.passwordChanged"));
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      if (error.response?.data?.message === "Invalid old password") {
        setErrors({
          oldPassword: t("errors.invalidOldPassword"),
        });
      } else {
        toast.error(t("errors.general"));
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setIsSendingVerification(true);
      await requestEmailVerification(localStorage.getItem("accessToken") || "");
      toast.success(t("settings.verificationEmailSent"));
      setShowVerificationModal(true);
    } catch (error) {
      toast.error(t("errors.general"));
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyEmail(
        localStorage.getItem("accessToken") || "",
        verificationCode
      );
      toast.success(t("settings.emailVerified"));
      setShowVerificationModal(false);
      setVerificationCode("");
      setIsEmailVerified(true); // Update the email verification status immediately
    } catch (error) {
      toast.error(t("errors.invalidVerificationCode"));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setDeleteError("");
      await deleteAccount(localStorage.getItem("accessToken") || "", {
        password: deletePassword,
      });
      toast.success(t("success.user.deleted"));
      logout();
      navigate("/login");
    } catch (error: any) {
      setDeleteError(error.response?.data?.message || t("errors.general"));
      toast.error(t("errors.general"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-8">
      {/* Email Verification */}
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
          {t("settings.emailVerification")}
        </h2>
        {isCheckingStatus ? (
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("common.loading")}
          </p>
        ) : isEmailVerified ? (
          <p
            className={`text-sm ${
              isDarkMode ? "text-green-400" : "text-green-600"
            }`}
          >
            {t("settings.emailAlreadyVerified")}
          </p>
        ) : (
          <>
            <p
              className={`text-sm mb-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t("settings.emailVerificationDescription")}
            </p>
            <button
              onClick={handleVerifyEmail}
              disabled={isSendingVerification}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white
                ${
                  isDarkMode
                    ? "bg-indigo-500 hover:bg-indigo-600"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }
                disabled:opacity-50 transition-colors duration-200
              `}
            >
              {isSendingVerification
                ? t("settings.sendingVerification")
                : t("settings.sendVerification")}
            </button>
          </>
        )}
      </div>

      {/* Change Password */}
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
          {t("settings.changePassword")}
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <FormInput
            label={t("auth.oldPassword")}
            id="oldPassword"
            name="oldPassword"
            type="password"
            icon={<LockClosedIcon className="w-5 h-5" />}
            value={passwordData.oldPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                oldPassword: e.target.value,
              }))
            }
            error={errors.oldPassword}
            placeholder={t("placeholders.enterCurrentPassword")}
          />

          <FormInput
            label={t("auth.newPassword")}
            id="newPassword"
            name="newPassword"
            type="password"
            icon={<LockClosedIcon className="w-5 h-5" />}
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            error={errors.newPassword}
            placeholder={t("placeholders.enterNewPassword")}
          />

          <FormInput
            label={t("auth.confirmNewPassword")}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            icon={<LockClosedIcon className="w-5 h-5" />}
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            error={errors.confirmPassword}
            placeholder={t("placeholders.confirmNewPassword")}
          />

          <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
            <button
              type="submit"
              disabled={isChangingPassword}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium text-white
                ${
                  isDarkMode
                    ? "bg-indigo-500 hover:bg-indigo-600"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }
                disabled:opacity-50 transition-colors duration-200
              `}
            >
              {isChangingPassword
                ? t("settings.changingPassword")
                : t("settings.changePassword")}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Account Section */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-gray-50"
        } p-6 rounded-lg shadow-sm`}
      >
        <div className="space-y-4">
          <h2
            className={`text-lg font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {t("settings.deleteAccount")}
          </h2>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("settings.deleteAccountDescription")}
          </p>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {t("settings.deleteAccountButton")}
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            className={`mx-auto max-w-sm rounded-lg p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              <Dialog.Title
                className={`text-lg font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {t("settings.deleteAccountConfirm")}
              </Dialog.Title>
            </div>

            <div className="mt-4">
              <FormInput
                label={t("settings.enterPasswordToDelete")}
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                error={deleteError}
                disabled={isDeleting}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword}
              >
                {isDeleting
                  ? t("settings.deleting")
                  : t("settings.deleteAccountButton")}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Verification Modal */}
      <Dialog
        open={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            className={`mx-auto max-w-sm rounded-lg p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Dialog.Title
              className={`text-lg font-medium mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("settings.enterVerificationCode")}
            </Dialog.Title>
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {t("settings.verificationCode")}
                </label>
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      className={`w-12 h-12 text-center text-lg font-medium rounded-md
                        ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }
                        border-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                      value={verificationCode[index] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[0-9]?$/.test(value)) {
                          const newCode = verificationCode.split("");
                          newCode[index] = value;
                          setVerificationCode(newCode.join(""));

                          // Auto-focus next input if a digit was entered
                          if (value && index < 5) {
                            const nextInput = e.target.parentElement?.children[
                              index + 1
                            ] as HTMLInputElement;
                            if (nextInput) nextInput.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace to go to previous input
                        if (
                          e.key === "Backspace" &&
                          !verificationCode[index] &&
                          index > 0
                        ) {
                          const prevInput = e.currentTarget.parentElement
                            ?.children[index - 1] as HTMLInputElement;
                          if (prevInput) prevInput.focus();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedData = e.clipboardData
                          .getData("text/plain")
                          .trim();
                        if (/^\d+$/.test(pastedData)) {
                          const digits = pastedData.slice(0, 6).split("");
                          setVerificationCode(
                            digits.join("") +
                              verificationCode.slice(digits.length)
                          );
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium
                    ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                    }
                  `}
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={verificationCode.length !== 6}
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white
                    ${
                      isDarkMode
                        ? "bg-indigo-500 hover:bg-indigo-600"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }
                    disabled:opacity-50
                  `}
                >
                  {t("common.verify")}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
