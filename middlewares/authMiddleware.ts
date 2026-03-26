import { NextRequest, NextResponse } from "next/server";

//this first middleware is used in order to make sure that the user has active session and
//his/her cookie still valid and not expired.
//it will first look into the cookie session that is sent by the client implicitly, then if session available it means that it is still not expired,
//then we will parse the session to get the user that is offered this cookie upon login. this user will be returned. to be used in the next middleware.

export const authenticateUser = async (request: NextRequest) => {
  const session = request.cookies.get("session");

  if (!session) return null;

  try {
    const user = JSON.parse(session.value);
    console.log("Roles from authnticatUser middleware: ", user.roles)
    return user;
  } catch (error) {
    return null;
  }
};

//this is the second middleware, this middleware is used to make sure that the API assigned this middleware allowed to be 
//accessed by the users who have the same roles passed as parameters.

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
type UserSession = {
  userId: string;
  username: string;
  roles: Role[];
};


export const authorizeRoles = (
  user: UserSession | null,
  required: { resource: string; action: Action } // ✅ FIXED HERE
) => {
  if (!user || !user.roles) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const hasPermission = user.roles.some((role) =>
    role.permissions.some(
      (perm) =>
        perm.resource === required.resource &&
        perm.actions.includes(required.action)
    )
  );

  if (!hasPermission) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  return null;
};
