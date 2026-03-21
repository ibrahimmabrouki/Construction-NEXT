import api from "./axios";

interface LoginData {
  username: string;
  password: string;
}
export const loginAdmin = async (data: LoginData) => {
  const response = await api.post("/users/login", data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const logoutAdmin = async () => {
  const response = await api.post("/users/logout");
  return response.data;
};