import Inquiry from "../models/inquiry";


interface InquiryData {
  name: string;
  email: string;
  budget: string;
  message: string;
  projectTitle: string;
}
//service to insert the inquiry data into the database.
export async function insertInquiry(data: InquiryData) {
  try {
    const newInquiry = Inquiry.create({
      ...data,
    });
    return newInquiry;
  } catch (error) {
    throw new Error("Failed to add inquiry");
  }
}