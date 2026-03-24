import api from "./axios";

interface blogDataRecieved {
  slug: string;
  image: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
}

interface UploadedPost {
  image: File | null;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
}

//client service in order to get all the posts from the database
export const getAllBlogs = async (): Promise<blogDataRecieved[]> => {
  try {
    const response = await api.get(`${process.env.NEXT_PUBLIC_ADMIN_BLOG_URL}`);
    return response.data.data;
  } catch (error: any) {
    console.error("Get Blogs Error:", error.message);
    throw error;
  }
};

//cleint service in order to create a new blog
export const createBlog = async (
  data: UploadedPost,
): Promise<blogDataRecieved> => {
  try {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("date", data.date);
    formData.append("category", data.category);
    formData.append("excerpt", data.excerpt);
    formData.append("content", data.content);

    if (!data.image) {
      throw new Error("Image is required");
    }

    formData.append("image", data.image);

    const response = await api.post(
      `${process.env.NEXT_PUBLIC_ADMIN_BLOG_URL}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Create Blogs Error:", error.message);
    throw error;
  }
};

//client service to update the posts
export const updateBlog = async (slug: string, data: UploadedPost) => {
  try {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("date", data.date);
    formData.append("category", data.category);
    formData.append("excerpt", data.excerpt);
    formData.append("content", data.content);

    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.patch(
      `${process.env.NEXT_PUBLIC_ADMIN_BLOG_URL}/${slug}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Update Blog Error:", error.message);
    throw error;
  }
};

//cleint service in order to delete a post
export const deletePost = async (slug: string) => {
  try {
    const response = await api.delete(
      `${process.env.NEXT_PUBLIC_ADMIN_BLOG_URL}/${slug}`
    );

    return response.data.data; 
  } catch (error: any) {
    console.error("Delete Blog Error:", error.message);
    throw error;
  }
};
