import { useSearchParams } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export default function PaymentResultPage() {
  const [params] = useSearchParams();
  const { isDarkMode } = useTheme();
  const status = params.get("status");
  const refId = params.get("refId");
  const amount = params.get("amount");

  const ok = status === "ok";

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } p-8 rounded-lg shadow-md w-full max-w-md text-center`}
      >
        <h1
          className={`text-2xl font-bold mb-2 ${
            ok ? "text-green-500" : "text-red-500"
          }`}
        >
          {ok ? "Payment Successful" : "Payment Failed"}
        </h1>
        {ok ? (
          <p className="mb-4">
            Ref ID: {refId} — Amount: {Number(amount).toLocaleString()} IRR
          </p>
        ) : (
          <p className="mb-4">Please try again.</p>
        )}
        <a
          href="/dashboard"
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
