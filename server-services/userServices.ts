// services/userService.ts
import User from "@/models/user";
import { Types } from "mongoose";

export async function getUsers() {
  return await User.find();
}

export async function createUser(data: any) {
  return await User.create(data);
}

export async function updateUser(userId: string, username: string) {
  return await User.findByIdAndUpdate({_id: userId}, { username }, { new: true });
}

export async function deleteUser(userId: string) {
  return await User.findByIdAndDelete({_id: userId});
}

export async function findUserById(userId: Types.ObjectId) {
  return await User.findById({_id: userId});
}
