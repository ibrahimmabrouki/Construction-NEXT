import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";
import { updateService, deleteService } from "@/controllers/serviceController";

//resource: ["projects", "blogs", "services", "users", "inquiries"];
//Action = "create" | "read" | "update" | "delete";


// route to update the service
export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, {
    resource: "services",
    action: "update",
  });

  if (roleCheck) {
    return roleCheck;
  }

  const { id } = await params;

  console.log("ID:", id);

  return updateService(request, id, user.username);
};

//route to delete the serive
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, {
    resource: "services",
    action: "delete",
  });

  if (roleCheck) {
    return roleCheck;
  }

  const { id } = await params;

  return deleteService(request, id, user.username);
};
