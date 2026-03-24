import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";
import {
  deleteUserById, updateUserById,
} from "@/controllers/userController";


//route to update user by ID
export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  //   const user = await authenticateUser(request);

  //   if (!user) {
  //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  //   }

  //   const roleCheck = authorizeRoles(user, ["admin", "inquiryeditor", "manager"]);

  //   if (roleCheck) {
  //     return roleCheck;
  //   }

  const { id } = await params;

  return updateUserById(request, id);
};

//route to delete already created user by ID
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  //   const user = await authenticateUser(request);

  //   if (!user) {
  //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  //   }

  //   const roleCheck = authorizeRoles(user, ["admin", "inquiryeditor", "manager"]);

  //   if (roleCheck) {
  //     return roleCheck;
  //   }

  const { id } = await params;

  return deleteUserById(request, id);
};
