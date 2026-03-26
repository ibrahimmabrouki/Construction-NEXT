import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";
import { createRole, getAllRoles } from "@/controllers/roleController";

//the permission and action to the roles can't be granted
//they are already hardcoded in the database in one admin role called "admin"


//resource: ["projects", "blogs", "services", "users", "inquiries"];
//Action = "create" | "read" | "update" | "delete";

//route to get all the roles
export const GET = async (request: NextRequest) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // const roleCheck = authorizeRoles(user, { resource: "roles", action: "read" });

  // if (roleCheck) {
  //   return roleCheck;
  // }

  return getAllRoles(request);
};

//route to create/add new role
export const POST = async (request: NextRequest) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, {
    resource: "roles",
    action: "create",
  });

  if (roleCheck) {
    return roleCheck;
  }

  return createRole(request);
};
