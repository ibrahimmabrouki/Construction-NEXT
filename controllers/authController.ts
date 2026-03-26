import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { FindExistingUser } from "@/server-services/authServices";
import Role from "@/models/roles";

type Action = "create" | "read" | "update" | "delete";

type Permission = {
  resource: string;
  actions: Action[];
};

type Role = {
  name: string;
  _id: string;
  permissions: Permission[];
};

//logging in into the rolebased admin dashboard.
export async function Login(request: Request) {
  try {
    const { username, password } = await request.json();
    await connect();
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 },
      );
    }
    const existingUser = await FindExistingUser(username);
    if (!existingUser) {
      return NextResponse.json(
        { message: "Invalid credentials - username" },
        { status: 401 },
      );
    }
    if (existingUser.password !== password) {
      return NextResponse.json(
        { message: "Invalid credentials - password" },
        { status: 401 },
      );
    }

    let full_Roles: Role[] = [];
    const roleIds: string[] = existingUser.roles;

    full_Roles = await Role.find({
      _id: { $in: roleIds },
    }).lean();

    full_Roles = full_Roles.map((r: any) => ({
      name: r.name,
      _id: r._id.toString(),
      permissions: r.permissions.map((p: any) => ({
        resource: p.resource,
        actions: [...p.actions],
      })),
    }));

    const sessionData = {
      userId: existingUser._id,
      username: existingUser.username,
      roles: full_Roles,
    };

    const response = NextResponse.json({ success: true });
    response.cookies.set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: "An error occurred during login", error: error.message },
      { status: 500 },
    );
  }
}

//looging out of the admin dashboard by clearing the session cookie.
//here we dont need to send anything from the client through the request body, we just need to clear the cookie.
//the browser will automatically include the cookie in the request, as it automatically recieves the and saves the cookies upon login.
export async function logout() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("session", "", {
    httpOnly: true,
    expires: new Date(0), 
    path: "/",
  });

  return response;
}
