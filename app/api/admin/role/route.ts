import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";
import { createRole, getAllRoles } from "@/controllers/roleController";

//route to get all the roles
export const GET = getAllRoles;

//route to create/add new role
export const POST = createRole;
