import { updateInquiry, deleteInquiry } from "@/controllers/inquiryController";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";

//route to update the inquiry from new to viewed.
export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, ["admin", "inquiryeditor", "manager"]);

  if (roleCheck) {
    return roleCheck;
  }

  const { id } = await params;

  return updateInquiry(request, id);
};

//route to delete the inquiry
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, ["admin", "inquiryeditor", "manager"]);

  if (roleCheck) {
    return roleCheck;
  }

  const { id } = await params;

  return deleteInquiry(request, id);
};
