import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";
import { updateService, deleteService } from "@/controllers/serviceController";

// route to update the service
export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, ["admin", "serviceeditor"]);

  if (roleCheck) {
    return roleCheck;
  }

  const { id } = await params;

  console.log("ID:", id);

  return updateService(request, id);
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

  const roleCheck = authorizeRoles(user, ["admin", "serviceeditor"]);

  if (roleCheck) {
    return roleCheck;
  }

  const { id } = await params;

  return deleteService(request, id);
};
