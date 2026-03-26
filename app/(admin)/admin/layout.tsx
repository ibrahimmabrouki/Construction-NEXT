import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../../components/admin/Sidebar/Sidebar";
import AuthProvider from "@/app/components/admin/AuthProvider";
import Role from "../../../models/roles";

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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/login");
  }

  let roles: Role[] = [];
  let username = "Admin";

  try {
    const sessionData = JSON.parse(session.value);
    roles = sessionData.roles || [];

    // console.log("rrrroles", roles);
    username = sessionData.username || "Admin";
  } catch (error) {
    // console.log(error);
    console.error("Invalid session format");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <AuthProvider roles={roles} username={username} />
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: "24px",
          paddingTop: "88px",
          background: "#f8f6f2",
          width: "100%",
          minWidth: 0,
        }}
      >
        {children}
      </main>
    </div>
  );
}
