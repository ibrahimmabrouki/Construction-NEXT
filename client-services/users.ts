import api from "./axios";

type User = {
  _id: string;
  username: string;
  password?: string;
  roles: string[];
};

type NewUser = {
  username: string;
  password: string;
  roles: string[];
};

type Role = {
  _id: string;
  name: string;
};

//client service to fetch the users from the database
export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get(`${process.env.NEXT_PUBLIC_ADMIN_USER_URL}`);
  const users = response.data.data;
  return users;
};

//client service to fetch the roles from the database
export const getAllRoles = async (): Promise<Role[]> => {
  const response = await api.get(`${process.env.NEXT_PUBLIC_ADMIN_ROLE_URL}`);
  const roles = response.data.data;

  return roles.map((r: any) => ({
    _id: r._id,
    name: r.name,
  }));
};

//client service in order to create new user
export const createUser = async (data: NewUser) => {
  try {
    const newUser: NewUser = {
      username: data.username,
      password: data.password,
      roles: data.roles,
    };

    const response = await api.post(
      `${process.env.NEXT_PUBLIC_ADMIN_USER_URL}`,
      newUser,
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Create User Error:", error.message);
    throw error;
  }
};

//client service in order to update existing user
export const updateUser = async (data: NewUser, id: string) => {
  try {
    const updatedUser: NewUser = {
      username: data.username,
      password: data.password,
      roles: data.roles,
    };

    const response = await api.patch(
      `${process.env.NEXT_PUBLIC_ADMIN_USER_URL}/${id}`,
      updatedUser,
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Update User Error:", error.message);
    throw error;
  }
};

//client service in order to delete existing user
export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(
      `${process.env.NEXT_PUBLIC_ADMIN_USER_URL}/${id}`,
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Delete User Error:", error.message);
    throw error;
  }
};
