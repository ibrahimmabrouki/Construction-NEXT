import { AddProject, getAllProjects } from "@/controllers/projectController";
import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";

//resource: ["projects", "blogs", "services", "users", "inquiries"];
//Action = "create" | "read" | "update" | "delete";

//route to get all projects
// export const GET = getAllProjects;
export const GET = async (request: NextRequest) => {
  const user = await authenticateUser(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2. Authorize
  const roleCheck = authorizeRoles(user, {
    resource: "projects",
    action: "read",
  });

  if (roleCheck) {
    return roleCheck; // returns 401 or 403
  }

  return getAllProjects(request);
};

//route to create new project
// export const POST = AddProject;
export const POST = async (request: NextRequest) => {
  const user = await authenticateUser(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2. Authorize
  const roleCheck = authorizeRoles(user, {
    resource: "projects",
    action: "create",
  });

  if (roleCheck) {
    return roleCheck; // returns 401 or 403
  }

  // 3. Call your controller
  return AddProject(request, user.username);
};
