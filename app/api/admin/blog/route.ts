import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";
import { getAllBlogs, createBlog } from "@/controllers/blogController";

//resource: ["projects", "blogs", "services", "users", "inquiries"];
//Action = "create" | "read" | "update" | "delete";

//route to get all the blog
export const GET = async (request: NextRequest) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  //here in this array i will pass object that includes two values
  //{source: "", action: ""}
  const roleCheck = authorizeRoles(user, { resource: "blogs", action: "read" });
  if (roleCheck) {
    return roleCheck;
  }

  return getAllBlogs(request);
};

//route to post new blog
export const POST = async (request: NextRequest) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, {
    resource: "blogs",
    action: "create",
  });

  if (roleCheck) {
    return roleCheck;
  }

  return createBlog(request, user.username);
};
