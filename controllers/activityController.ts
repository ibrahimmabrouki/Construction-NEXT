import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Activity from "@/models/activity";

export async function getLatestActivities(request: NextRequest) {
  try {
    await connect();

    const activities = await Activity.find().sort({ createdAt: -1 });
    //.sort({ createdAt: -1 }) sort the result descending from latest to the oldest
    //using the created add feild

    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching activities" },
      { status: 500 },
    );
  }
}

export async function deleteActivity(request: NextRequest, id: string) {
  try {
    await connect();

    const deleted = await Activity.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Activity not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Activity deleted",
      data: deleted,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting activity" },
      { status: 500 },
    );
  }
}
