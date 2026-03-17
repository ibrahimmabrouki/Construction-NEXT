// app/api/users/route.ts
import {
    getUsersController,
    createUserController,
    updateUserController,
    deleteUserController,
  } from "@/controllers/userController";
  
  export const GET = getUsersController;
  export const POST = createUserController;
  export const PATCH = updateUserController;
  export const DELETE = deleteUserController;