import { getAllInquiries } from "@/controllers/inquiryController";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";

//route to get all the inquires 
// export const GET = getAllInquiries;
export const GET = async (request: NextRequest) => {
  const user = await authenticateUser(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2. Authorize
  const roleCheck = authorizeRoles(user, ["admin", "inquiryeditor", "manager"]);

  if (roleCheck) {
    return roleCheck; // returns 401 or 403
  }

  return getAllInquiries(request);
};
