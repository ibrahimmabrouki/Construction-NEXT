// controllers/userController.ts
import { NextResponse } from "next/server";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/userServices";
import connect from "@/lib/db";

// GET
export async function getUsersController() {
  await connect();
  const users = await getUsers();
  return NextResponse.json(users);
}

// POST
export async function createUserController(request: Request) {
  const body = await request.json();
  await connect();

  const user = await createUser(body);

  return NextResponse.json(user, { status: 201 });
}

// PATCH
export async function updateUserController(request: Request) {
  const { userId, username } = await request.json();
  await connect();

  if (!userId || !username) {
    return NextResponse.json({ message: "Missing data" }, { status: 400 });
  }

  const updated = await updateUser(userId, username);

  if (!updated) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE
export async function deleteUserController(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  await connect();

  if (!userId) {
    return NextResponse.json({ message: "User ID missing" }, { status: 400 });
  }

  const deleted = await deleteUser(userId);

  if (!deleted) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Deleted" });
}
