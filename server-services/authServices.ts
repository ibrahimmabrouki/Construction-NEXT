import User from "@/models/user";
import { NextResponse } from "next/server";

export async function FindExistingUser(username: string) {
  return await User.findOne({ username });
}