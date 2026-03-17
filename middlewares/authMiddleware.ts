// services/userService.ts
import User from "@/models/user";

//get all users
export async function getUsers() {
  return await User.find();
}

//create user
export async function createUser(data: any) {
  return await User.create(data);
}

//update the user 
export async function updateUser(userId: string, username: string) {
  return await User.findByIdAndUpdate(
    userId,
    { username },
    { new: true }
  );
}

//delete the user
export async function deleteUser(userId: string) {
  return await User.findByIdAndDelete(userId);
}