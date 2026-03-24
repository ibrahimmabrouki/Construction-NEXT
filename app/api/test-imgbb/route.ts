import { NextRequest, NextResponse } from "next/server";
import { uploadToImgBB } from "@/utils/uploadToImgBB";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 },
      );
    }

    const imageUrl = await uploadToImgBB(file);

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
