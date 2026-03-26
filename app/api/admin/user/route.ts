import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";
import { createUser, getAllUsers } from "@/controllers/userController";

//resource: ["projects", "blogs", "services", "users", "inquiries"];
//Action = "create" | "read" | "update" | "delete";

//route to get all the users
export const GET = async (request: NextRequest) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, { resource: "users", action: "read" });

  if (roleCheck) {
    return roleCheck;
  }

  return getAllUsers(request);
};

//route to post new user
export const POST = async (request: NextRequest) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, {
    resource: "users",
    action: "create",
  });

  if (roleCheck) {
    return roleCheck;
  }

  return createUser(request);
};
