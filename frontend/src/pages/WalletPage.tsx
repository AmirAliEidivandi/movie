import { useEffect, useMemo, useState } from "react";
import { WalletApi } from "../api/wallet";
import { useTheme } from "../contexts/ThemeContext";

type Tx = {
  _id: string;
  type: "DEPOSIT" | "WITHDRAW" | "PURCHASE" | "REFUND";
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELED";
  amount: number;
  createdAt: string;
};

function StatusBadge({ status }: { status: Tx["status"] }) {
  const map: Record<Tx["status"], string> = {
    SUCCESS:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200/40 dark:border-green-700/40",
    PENDING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200/40 dark:border-yellow-700/40",
    FAILED:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200/40 dark:border-red-700/40",
    CANCELED:
      "bg-gray-200 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300 border border-gray-300/50 dark:border-gray-600/40",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

export default function WalletPage() {
  const { isDarkMode } = useTheme();
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(20000);
  const [loading, setLoading] = useState(false);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const quickAmounts = [10000, 20000, 50000, 100000];

  const currency = useMemo(
    () => ({
      format: (v: number) => `${v.toLocaleString()} IRR`,
    }),
    []
  );

  useEffect(() => {
    (async () => {
      try {
        setIsFetching(true);
        await WalletApi.init();
        const b = await WalletApi.getBalance();
        setBalance(b.balance);
        const list = await WalletApi.transactions();
        setTxs(list);
      } finally {
        setIsFetching(false);
      }
    })();
  }, []);

  const handleDeposit = async () => {
    setLoading(true);
    try {
      const res = await WalletApi.depositZarinpal(amount);
      window.location.href = res.redirect_url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`space-y-6 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}
    >
      {/* Balance & Deposit Card */}
      <div
        className={`${
          isDarkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white border-gray-200"
        } border rounded-xl p-6 shadow-sm`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Wallet</h2>
          <div
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Balance
          </div>
        </div>
        <div
          className={`text-3xl font-extrabold mb-6 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {currency.format(balance)}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 max-w-lg">
          <div className="flex-1">
            <label
              className={`block text-sm mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Amount
            </label>
            <input
              type="number"
              step={1000}
              className={`${
                isDarkMode
                  ? "bg-gray-700/70 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              } w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              value={amount}
              min={1000}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {quickAmounts.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(v)}
                  className={`px-2.5 py-1 rounded-md text-xs border transition ${
                    amount === v
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : isDarkMode
                      ? "border-gray-600 text-gray-200 hover:bg-gray-700/70"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {v.toLocaleString()} IRR
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleDeposit}
            disabled={loading || amount < 1000}
            className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Redirecting..." : "Deposit via Zarinpal"}
          </button>
        </div>
      </div>

      {/* Transactions Card */}
      <div
        className={`${
          isDarkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white border-gray-200"
        } border rounded-xl p-6 shadow-sm`}
      >
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div
          className={`overflow-hidden rounded-lg border ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead
              className={
                isDarkMode
                  ? "bg-gray-900/70 text-gray-200"
                  : "bg-gray-50 text-gray-600"
              }
            >
              <tr>
                <th className="px-4 py-2 text-left font-medium">Date</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-right font-medium">Amount</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDarkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {isFetching && (
                <tr>
                  <td
                    className={`px-4 py-6 text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                    colSpan={4}
                  >
                    Loading...
                  </td>
                </tr>
              )}
              {!isFetching && txs.length === 0 && (
                <tr>
                  <td
                    className={`px-4 py-6 text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                    colSpan={4}
                  >
                    No transactions yet
                  </td>
                </tr>
              )}
              {txs.map((t, idx) => (
                <tr
                  key={t._id}
                  className={`${
                    isDarkMode
                      ? idx % 2 === 0
                        ? "bg-gray-900/30 hover:bg-gray-900/50"
                        : "hover:bg-gray-900/40"
                      : idx % 2 === 0
                      ? "bg-gray-50"
                      : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    {new Date(t.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{t.type}</td>
                  <td className="px-4 py-3 text-right">
                    {currency.format(t.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
