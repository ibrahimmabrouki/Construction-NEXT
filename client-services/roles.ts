import api from "./axios";

type Action = "create" | "read" | "update" | "delete";

type Permission = {
  resource: string;
  actions: Action[];
};

type Role = {
  _id: string;
  name: string;
  description?: string;
  permissions: Permission[];
};

type NewRole = {
  name: string;
  description: string;
  permissions: Permission[];
};

//client service to fetch the roles from the database
export const getAllRoles = async (): Promise<Role[]> => {
  const response = await api.get(`${process.env.NEXT_PUBLIC_ADMIN_ROLE_URL}`);
  const roles = response.data.data;

  return roles.map((r: Role) => ({
    _id: r._id,
    name: r.name,
    description: r.description,
    permissions: r.permissions,
  }));
};

//client service in order to create new role
export const createRole = async (data: NewRole) => {
  try {
    const newRole: NewRole = {
      name: data.name,
      description: data.description,
      permissions: data.permissions,
    };

    const response = await api.post(
      `${process.env.NEXT_PUBLIC_ADMIN_ROLE_URL}`,
      newRole,
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Create Role Error:", error.message);
    throw error;
  }
};

//client service in order to update existing role
export const updateRole = async (data: NewRole, id: string) => {
  try {
    const UpdatedRole: NewRole = {
      name: data.name,
      description: data.description,
      permissions: data.permissions,
    };

    const response = await api.patch(
      `${process.env.NEXT_PUBLIC_ADMIN_ROLE_URL}/${id}`,
      UpdatedRole,
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Update Role Error:", error.message);
    throw error;
  }
};

//client service in order to delete existing role
export const deleteRole = async (id: string) => {
  try {
    const response  = await api.delete(
      `${process.env.NEXT_PUBLIC_ADMIN_ROLE_URL}/${id}`,
    );
    return response .data.data;
  } catch (error: any) {
    console.error("Delete Role Error:", error.message);
    throw error;
  }
};
