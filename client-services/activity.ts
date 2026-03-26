import api from "./axios";

export const getLatestActivities = async () => {
  const res = await api.get(`${process.env.NEXT_PUBLIC_ADMIN_ACTIVITY_URL}`);
  return res.data.data;
};

export const deleteActivity = async (id: string) => {
  await api.delete(`${process.env.NEXT_PUBLIC_ADMIN_ACTIVITY_URL}/${id}`);
};
