import { create } from "zustand";

type Action = "create" | "read" | "update" | "delete";

type Permission = {
  resource: string;
  actions: Action[];
};

type AuthRole = {
  _id: string;
  name: string;
  permissions: Permission[];
};

type AuthStore = {
  roles: AuthRole[];
  username: string;

  setAuth: (roles: AuthRole[], username: string) => void;

  // checks specific action on resource
  hasAccess: (resource: string, action: Action) => boolean;

  // checks if user has access to resource at all
  hasPermission: (resource: string) => boolean;

  // checks if user has a role name
  hasRole: (resource: string) => boolean;

};

export const useAuthStore = create<AuthStore>((set, get) => ({
  roles: [],
  username: "",

  setAuth: (roles, username) => set({ roles, username }),

  hasAccess: (resource, action) => {
    const roles = get().roles;

    return roles.some((role) =>
      role.permissions.some(
        (p) =>
          p.resource === resource &&
          p.actions.includes(action)
      )
    );
  },

  hasPermission: (resource) => {
    const roles = get().roles;

    return roles.some((role) =>
      role.permissions.some(
        (p) => p.resource === resource
      )
    );
  },

   hasRole: (roleName) => {
    const roles = get().roles;

    return roles.some((role) => role.name === roleName);
  },
}));
