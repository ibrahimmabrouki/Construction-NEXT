import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, authorizeRoles } from "@/middlewares/authMiddleware";
import { createUser, getAllUsers } from "@/controllers/userController";

//route to get all the roles
export const GET = getAllUsers;

//route to create/add new role
export const POST = createUser;
