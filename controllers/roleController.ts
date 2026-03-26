import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/db";
import Role from "@/models/roles";
import User from "@/models/user";

interface RolePermission {
  resource: string;
  actions: ("create" | "read" | "update" | "delete")[];
}

interface RoleData {
  _id?: string;
  name: string;
  description?: string;
  permissions: RolePermission[];
  createdAt?: string;
  updatedAt?: string;
}

//getting all the roles to display them for the admin
export async function getAllRoles(request: NextRequest) {
  try {
    await connect();

    const roles = await Role.find();
    return NextResponse.json({ success: true, data: roles });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching roles" },
      { status: 500 },
    );
  }
}

//getting a single role by id to used when we want to know what access is give in a single role
export async function getRoleById(request: NextRequest, id: string) {
  try {
    await connect();

    const role = await Role.findById(id);

    if (!role) {
      return NextResponse.json({ message: "Role not found!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: role }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching role by Id" },
      { status: 500 },
    );
  }
}

//creating the Role which is done by the admin
export async function createRole(request: NextRequest) {
  try {
    await connect();

    const data: RoleData = await request.json();

    if (!data.name) {
      return NextResponse.json(
        { message: "Role name is required" },
        { status: 400 },
      );
    }

    const existingRole = await Role.findOne({ name: data.name });
    if (existingRole) {
      return NextResponse.json(
        { message: "Role already exists" },
        { status: 400 },
      );
    }

    // the below code can be used in case i want to force the admin to give permission.
    // if (!data.permissions || data.permissions.length === 0) {
    //   return NextResponse.json(
    //     { message: "At least one permission is required" },
    //     { status: 400 },
    //   );
    // }

    //permission is array of objects
    const permissions =
      data.permissions?.map((perm) => ({
        resource: perm.resource,
        actions:
          perm.actions && perm.actions.length > 0 ? perm.actions : ["read"],
      })) || [];
    //we used optional here so incase the admin created role with no resourses
    //the role could still be created but with no access

    const newRole = await Role.create({
      name: data.name,
      description: data.description || "",
      permissions,
    });

    return NextResponse.json({ success: true, data: newRole }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add Role" },
      { status: 500 },
    );
  }
}

//update the role which is used by the admin
export async function updateRoleById(request: NextRequest, id: string) {
  try {
    await connect();

    const data: RoleData = await request.json();

    //first of all Check if the role alread exists
    const existingRole = await Role.findById(id);
    if (!existingRole) {
      return NextResponse.json({ message: "Role not found!" }, { status: 404 });
    }

    //if the admin provided a new name and it does not match the old name (means it is new name)
    //check if this name aleady used by other roles
    if (data.name && data.name !== existingRole.name) {
      const duplicate = await Role.findOne({ name: data.name });
      if (duplicate) {
        return NextResponse.json(
          { message: "Role name already exists" },
          { status: 400 },
        );
      }
    }

    // normalizing the permissions to get data
    const permissions =
      data.permissions?.map((perm) => ({
        resource: perm.resource,
        actions:
          perm.actions && perm.actions.length > 0 ? perm.actions : ["read"],
      })) || []; //old permissions will always be sent from the frontend. otherwise the admin would have unchecked all the actions and resources.

    //updating the role in the data base
    const updatedRole = await Role.findByIdAndUpdate(
      id,
      {
        name: data.name ?? existingRole.name, //?? means => if data.name is not null or undefined use the value updated, if not use the existing one.
        description: data.description ?? existingRole.description,
        permissions,
      },
      { new: true },
    );

    return NextResponse.json(
      { success: true, data: updatedRole },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update Role" },
      { status: 500 },
    );
  }
}

//deleting the role by ID which is done by the admin
export async function deleteRoleById(request: NextRequest, id: string) {
  try {
    await connect();
    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return NextResponse.json({ message: "Role not found!" }, { status: 404 });
    }

    await User.updateMany({ roles: id }, { $pull: { roles: id } });

    return NextResponse.json({ success: true, data: role }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete Role" },
      { status: 500 },
    );
  }
}
