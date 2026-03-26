import { deleteProject, updateProject } from "@/controllers/projectController";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";

//resource: ["projects", "blogs", "services", "users", "inquiries"];
//Action = "create" | "read" | "update" | "delete";


// route to update the project
export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, {resource: "projects", action: "update"});

  if (roleCheck) {
    return roleCheck;
  }

  const { slug } = await params;

  return updateProject(request, slug, user.username);
};

// route to delete the project
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const user = await authenticateUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roleCheck = authorizeRoles(user, {resource: "projects", action: "delete"});

  if (roleCheck) {
    return roleCheck;
  }

  const { slug } = await params;

  return deleteProject(request, slug, user.username);
};