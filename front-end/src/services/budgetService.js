import API from "./api";

export const getBudgets = () => API.get("/budgets");
export const addBudget = (data) => API.post("/budgets", data);
export const updateBudget = (id, data) => API.put(`/budgets/${id}`, data);
export const deleteBudget = (id) => API.delete(`/budgets/${id}`);

// New: get budget progress & warnings
export const getBudgetProgress = () => API.get("/budgets/progress");
export const getCategoryBudgets = () => API.get("/budgets/categories");