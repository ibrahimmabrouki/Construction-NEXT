// controllers/userController.ts
import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/db";
import User from "@/models/user";

//getting all the users to the admin page.
export async function getAllUsers(request: NextRequest) {
  try {
    await connect();

    const users = await User.find();

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

//create new user to be added
export async function createUser(request: NextRequest) {
  try {
    await connect();

    const data = await request.json();

    if (!data.username || !data.password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ username: data.username });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const newUser = await User.create({
      username: data.username,
      password: data.password, 
      roles: data.roles || []
    });

    return NextResponse.json(
      { success: true, data: newUser },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 },
    );
  }
}


//update user controller that is used by the admin in order to update the user
export async function updateUserById(
  request: NextRequest,
  id: string,
) {
  try {
    await connect();

    const data = await request.json();

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found!" },
        { status: 404 },
      );
    }

    // if the username which is passed and it does not match the existing username
    // which means that the username is changed => we need to check whether the username is used or not
    if (data.username && data.username !== existingUser.username) {
      const duplicate = await User.findOne({ username: data.username });
      if (duplicate) {
        return NextResponse.json(
          { message: "Username already exists" },
          { status: 400 },
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        //?? which means that if any of the feild is passed change is to the new one
        username: data.username ?? existingUser.username,
        password: data.password ?? existingUser.password,
        roles: data.roles ?? existingUser.roles,
      },
      { new: true },
    );

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 },
    );
  }
}


//delete user controller which is used by the admin in order to delete any of the existing user.
export async function deleteUserById(
  request: NextRequest,
  id: string,
) {
  try {
    await connect();

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found!" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: user },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 },
    );
  }
}
