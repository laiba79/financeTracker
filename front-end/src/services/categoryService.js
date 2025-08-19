import API from "./api";

export const getCategories = () => API.get("/categories");
export const addCategory = (data) => API.post("/categories", data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// New: with color/icon
export const addCategoryWithIcon = (data) =>
  API.post("/categories/with-icon", data);

// Predefined categories (Food, Rent, Shopping, etc.)
export const getPredefinedCategories = () =>
  API.get("/categories/predefined");