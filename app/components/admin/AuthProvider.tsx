"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/auth";

type Action = "create" | "read" | "update" | "delete";

type Permission = {
  resource: string;
  actions: Action[];
};

type Role = {
  name: string;
  _id: string;
  permissions: Permission[];
};

export default function AuthProvider({
  roles,
  username,
}: {
  roles: Role[];
  username: string;
}) {
  // console.log("from auth provide", roles);
  const setAuth = useAuthStore((s) => s.setAuth);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      setAuth(roles, username);
      initialized.current = true;
    }
  }, [roles, username, setAuth]);

  return null;
}