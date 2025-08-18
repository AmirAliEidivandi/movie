import api from "./axios";

export const WalletApi = {
  getBalance: async () => (await api.get("/wallet/balance")).data,
  init: async () => (await api.post("/wallet/init", {})).data,
  depositZarinpal: async (amount: number, description?: string) =>
    (await api.post("/wallet/deposit/zarinpal", { amount, description })).data,
  transactions: async () => (await api.get("/wallet/transactions")).data,
};
