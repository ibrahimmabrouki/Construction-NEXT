import { getLatestActivities } from "@/controllers/activityController";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/middlewares/authMiddleware";

//route to get all latest activities the roles
export const GET = async (request: NextRequest) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return getLatestActivities(request);
};