import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";
import { getAllServices, createService } from "@/controllers/serviceController";

//resource: ["projects", "blogs", "services", "users", "inquiries"];
//Action = "create" | "read" | "update" | "delete";

//route to get all the services
export const GET = async (request: NextRequest) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, {
    resource: "services",
    action: "read",
  });

  if (roleCheck) {
    return roleCheck;
  }

  return getAllServices(request);
};

//route to post new service
export const POST = async (request: NextRequest) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, {
    resource: "services",
    action: "create",
  });

  if (roleCheck) {
    return roleCheck;
  }

  return createService(request, user.username);
};
