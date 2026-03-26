import { deleteBlog, updateBlog } from "@/controllers/blogController";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";

//resource: ["projects", "blogs", "services", "users", "inquiries"];
//Action = "create" | "read" | "update" | "delete";

// route to update the blog
export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, {
    resource: "blogs",
    action: "update",
  });

  if (roleCheck) {
    return roleCheck;
  }

  const { slug } = await params;

  return updateBlog(request, slug, user.username);
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

  const roleCheck = authorizeRoles(user, {
    resource: "blogs",
    action: "delete",
  });

  if (roleCheck) {
    return roleCheck;
  }

  const { slug } = await params;

  return deleteBlog(request, slug);
};
