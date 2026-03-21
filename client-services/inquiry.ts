import axios from "axios";

interface InquiryData {
  name: string;
  email: string;
  budget: string;
  message: string;
  projectTitle: string;
}

export const submitInquiry = async (data: InquiryData, slug: string) => {
  try {
    const response = await axios.post(`/api/projects/${slug}/inquiry`, data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to submit inquiry");
  }
};