import { NextRequest, NextResponse } from "next/server";
import { insertInquiry } from "@/server-services/inquiryServices";
import connect from "@/lib/db";
import Inquiry from "@/models/inquiry";

interface InquiryData {
  name: string;
  email: string;
  budget: string;
  message: string;
  projectTitle: string;
}

//submiitting Inquiry form data to the database from the vistor.
export async function addInquiry(request: NextRequest) {
  try {
    const data: InquiryData = await request.json();

    const newInquiry = {
      ...data,
    };

    const createdInquiry = await insertInquiry(newInquiry);
    if (!createdInquiry) {
      return NextResponse.json(
        { message: "Failed to add inquiry" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Inquiry received", data: createdInquiry },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add inquiry" },
      { status: 500 },
    );
  }
}

//controller to get all the inquires
export async function getAllInquiries(request: NextRequest) {
  try {
    await connect();
    const inqiuries = await Inquiry.find();
    return NextResponse.json({ success: true, data: inqiuries });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add inquiry" },
      { status: 500 },
    );
  }
}

//controller to make the inquiry viewed
export async function updateInquiry(request: NextRequest, id: string) {
  try {
    await connect();
    if (!id) {
      return NextResponse.json(
        { message: "Inquiry ID is required" },
        { status: 400 },
      );
    }

    await connect();

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status: "Reviewed" },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedInquiry) {
      return NextResponse.json(
        { message: "Inquiry not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Inquiry updated successfully",
        data: updatedInquiry,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update the inquiry" },
      { status: 500 },
    );
  }
}

//controller to delete the inquiry
export async function deleteInquiry(request: NextRequest, id: string) {
  try {
    if (!id) {
      return NextResponse.json(
        { message: "Inquiry ID is required" },
        { status: 400 },
      );
    }

    await connect();

    const deletedInquiry = await Inquiry.findByIdAndDelete(id);
    if (!deletedInquiry) {
      return NextResponse.json(
        { message: "Inquiry not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Inquiry deleted successfully",
        data: deletedInquiry,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update the inquiry" },
      { status: 500 },
    );
  }
}
