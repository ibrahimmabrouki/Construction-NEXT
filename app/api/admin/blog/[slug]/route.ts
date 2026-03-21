import { deleteBlog, updateBlog } from "@/controllers/blogController";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";

// route to update the blog
export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, ["admin", "blogeditor"]);

  if (roleCheck) {
    return roleCheck;
  }

  const { slug } = await params;

  return updateBlog(request, slug);
};

// route to delete the blog
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, ["admin", "blogeditor"]);

  if (roleCheck) {
    return roleCheck;
  }

  const { slug } = await params;

  return deleteBlog(request, slug);
};
