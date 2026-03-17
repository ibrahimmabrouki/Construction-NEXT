import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Types } from "mongoose";
import { findUserById } from "@/services/userServices";
import { findCategory } from "@/services/categoriesServices";

export async function getCategories(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing user Id" }),
        { status: 400 }
      );
    }

    await connect();

    const objectId = new Types.ObjectId(userId);

    const user = await findUserById(objectId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const categories = findCategory(objectId);

    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ message: "Error in fetching categories" }),
      { status: 500 }
    );
  }
};
