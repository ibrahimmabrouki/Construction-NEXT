import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";
import {
  deleteRoleById,
  getRoleById,
  updateRoleById,
} from "@/controllers/roleController";

//resource: ["projects", "blogs", "services", "users", "inquiries"];
//Action = "create" | "read" | "update" | "delete";

//route to get single role by ID
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  return getRoleById(request, id);
};

//route to update role by ID
export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, {
    resource: "roles",
    action: "update",
  });

  if (roleCheck) {
    return roleCheck;
  }

  const { id } = await params;

  return updateRoleById(request, id);
};

//route to delete already creaeted Role by ID
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, {
    resource: "roles",
    action: "delete",
  });

  if (roleCheck) {
    return roleCheck;
  }

  const { id } = await params;

  return deleteRoleById(request, id);
};
