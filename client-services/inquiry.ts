import api from "./axios";

interface InquiryDataSent {
  name: string;
  email: string;
  budget: string;
  message: string;
  projectTitle: string;
}

interface InquiryDataRecieved {
  _id: string;
  name: string;
  email: string;
  budget: string;
  message: string;
  projectTitle: string;
  date: string;
  status: string;
}

//to be used in the home page
//when the client wants to inquiry about one of the projects
export const submitInquiry = async (data: InquiryDataSent, slug: string) => {
  try {
    const response = await api.post(`/projects/${slug}/inquiry`, data);
    return response.data;
  } catch (error: any) {
    console.log({ error: error.message });
    throw error;
  }
};

//to be used in the admin page
//when the admin want to view all the inquiries.
export const getAllInquires = async (): Promise<InquiryDataRecieved[]> => {
  try {
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_ADMIN_INQUIRY_URL}`,
    );

    return response.data.data.map((s: any) => ({
      _id: s._id,
      name: s.name,
      email: s.email,
      budget: s.budget,
      message: s.message,
      projectTitle: s.projectTitle,
      date: new Date(s.createdAt).toLocaleDateString(),
      status: s.status,
    }));
  } catch (error: any) {
    console.log({ error: error.message });
    throw error;
  }
};

//to be used in the admin page
//when the admin want to Review a certain inquiries.
export const reviewInquiry = async (
  id: string,
): Promise<InquiryDataRecieved> => {
  try {
    const response = await api.patch(
      `${process.env.NEXT_PUBLIC_ADMIN_INQUIRY_URL}/${id}`,
    );
    const updatedInquiry = response.data.data;
    return {
      ...updatedInquiry,
      date: new Date(updatedInquiry.createdAt).toLocaleDateString(),
    };
  } catch (error: any) {
    console.log({ error: error.message });
    throw error;
  }
};

//to be used in the admin page
//when the admin want to delete a certain inquiries.

export const deleteInquiry = async (id: string) => {
  try {
    const response = await api.delete(
      `${process.env.NEXT_PUBLIC_ADMIN_INQUIRY_URL}/${id}`,
    );
    const deletedInquiry = response.data.data;
    return {
      _id: deletedInquiry._id,
    };
  } catch (error: any) {
    console.log({ error: error.message });
    throw error;
  }
};
