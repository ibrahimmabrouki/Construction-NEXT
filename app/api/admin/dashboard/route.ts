import { getDashboardStats } from "@/controllers/generalController";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/middlewares/authMiddleware";

//route to get all Dashboard stats 
export const GET = async (request: NextRequest) => {
  const user = await authenticateUser(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return getDashboardStats(request);
};
