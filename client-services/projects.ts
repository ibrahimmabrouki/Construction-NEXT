import api from "./axios";

export interface Project {
  _id: string;
  title: string;
  slug: string;
  location: string;
  price: string;
  status: "Planning" | "In Progress" | "Completed";
  style:
    | "Mediterranean"
    | "Modern"
    | "Tropical"
    | "Contemporary"
    | "Minimalist"
    | "Industrial";
  description: string;
  images: string[];
}

// Payload sent TO backend (update)
export interface UpdateProjectPayload {
  title: string;
  location: string;
  price: string;
  status: "Planning" | "In Progress" | "Completed";
  style:
    | "Mediterranean"
    | "Modern"
    | "Tropical"
    | "Contemporary"
    | "Minimalist"
    | "Industrial";
  description: string;

  existingImages: string[];
  newImages: File[];
}

// Payload for creating project
export interface CreateProjectPayload {
  title: string;
  location: string;
  price: string;
  status: "Planning" | "In Progress" | "Completed";
  style:
    | "Mediterranean"
    | "Modern"
    | "Tropical"
    | "Contemporary"
    | "Minimalist"
    | "Industrial";
  description: string;
  images: File[];
}

// Get all projects (public)
export const getAllProject = async (): Promise<Project[]> => {
  const response = await api.get("/projects");
  return response.data.data;
};

// Get project by slug
export const getProjectBySlug = async (slug: string): Promise<Project> => {
  const response = await api.get(`/projects/${slug}`);
  return response.data.project;
};

//the service below are used in the admin page
// Get all projects (admin)
export const getAllProjectAdmin = async (): Promise<Project[]> => {
  try {
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_ADMIN_PROJECT_URL}`,
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Get Projects Error:", error.message);
    throw error;
  }
};

//client service to allow the admin to create new project
export const createProject = async (
  data: CreateProjectPayload,
): Promise<Project> => {
  try {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("location", data.location);
    formData.append("price", data.price);
    formData.append("status", data.status);
    formData.append("style", data.style);
    formData.append("description", data.description);

    data.images.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.post(
      `${process.env.NEXT_PUBLIC_ADMIN_PROJECT_URL}`,
      formData,
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Create Project Error:", error.message);
    throw error;
  }
};

//client service to allow the admin to update exiting project
export const updateProject = async (
  data: UpdateProjectPayload,
  slug: string,
): Promise<Project> => {
  try {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("location", data.location);
    formData.append("price", data.price);
    formData.append("status", data.status);
    formData.append("style", data.style);
    formData.append("description", data.description);

    data.existingImages.forEach((img) => {
      formData.append("existingImages", img);
    });

    data.newImages.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.patch(
      `${process.env.NEXT_PUBLIC_ADMIN_PROJECT_URL}/${slug}`,
      formData,
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Updating Project Error:", error.message);
    throw error;
  }
};

//client service to allow the admin delete the project
export const deleteProject = async (slug: string): Promise<Project> => {
  try {
    const response = await api.delete(
      `${process.env.NEXT_PUBLIC_ADMIN_PROJECT_URL}/${slug}`,
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Deleting Project Error:", error.message);
    throw error;
  }
};
