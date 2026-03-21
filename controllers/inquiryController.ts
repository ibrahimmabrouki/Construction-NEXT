import { NextRequest, NextResponse } from "next/server";
import { insertInquiry } from "@/server-services/inquiryServices";

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
    if(!createdInquiry) {
        return NextResponse.json(
          { message: "Failed to add inquiry" },
          { status: 500 }
        );
    }

    return NextResponse.json(
      { message: "Inquiry received", data: createdInquiry },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add inquiry" },
      { status: 500 }
    );
  }
}