import API from "./api";

export const getTransactions = () => API.get("/transactions");
export const addTransaction = (data) => API.post("/transactions", data);
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);
export const getStats = () => API.get("/transactions/stats/summary");

// New: filtering & search
export const getFilteredTransactions = (filters) =>
  API.post("/transactions/filter", filters);
export const searchTransactions = (keyword) =>
  API.get(`/transactions/search?keyword=${encodeURIComponent(keyword)}`);

// New: recurring transactions
export const addRecurringTransaction = (data) =>
  API.post("/transactions/recurring", data);

// Dashboard stats (monthly/yearly trends)
export const getMonthlyYearlyStats = () =>
  API.get("/transactions/stats/monthly-yearly");