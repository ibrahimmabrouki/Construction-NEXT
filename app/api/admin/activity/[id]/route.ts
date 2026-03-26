import { deleteActivity } from "@/controllers/activityController";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";

//route to delete the activity
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, {
    resource: "activities",
    action: "delete",
  });

  if (roleCheck) {
    return roleCheck;
  }

  const { id } = await params;

  return deleteActivity(request, id);
};