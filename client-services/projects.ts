import api from "./axios";

interface Project {
    title: string;
    slug: string;
    location: string;
    price: string;
    status: "Planning" | "In Progress" | "Completed";
    style: "Mediterranean" | "Modern" | "Tropical" | "Contemporary";
    description: string;
    images: string[];
}

export const getAllProject = async (): Promise<Project[]> => {
    const response = await api.get("/projects");
    return response.data.projects;
}

export const getProjectBySlug = async (slug :string): Promise<Project> =>{
    const response = await api.get(`/projects/${slug}`)
    return response.data.projects;
}