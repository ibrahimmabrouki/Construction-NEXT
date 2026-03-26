import { updateInquiry, deleteInquiry } from "@/controllers/inquiryController";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";

//resource: ["projects", "blogs", "services", "users", "inquiries"];
//Action = "create" | "read" | "update" | "delete";

//route to update the inquiry from new to viewed.
export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, {
    resource: "inquiries",
    action: "update",
  });

  if (roleCheck) {
    return roleCheck;
  }

  const { id } = await params;

  return updateInquiry(request, id, user.username);
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

  const roleCheck = authorizeRoles(user, {
    resource: "inquiries",
    action: "delete",
  });

  if (roleCheck) {
    return roleCheck;
  }

  const { id } = await params;

  return deleteInquiry(request, id, user.username);
};
