import api from "./axios";

// client service to get dashboard stats
export const getDashboardStats = async () => {
  try {
    const response = await api.get(`${process.env.NEXT_PUBLIC_ADMIN_USER_URL}`);

    return response.data.data;
  } catch (error: any) {
    console.error("Get Dashboard Stats Error:", error.message);
    throw error;
  }
};
