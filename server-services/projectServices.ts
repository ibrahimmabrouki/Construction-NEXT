import Project from "@/models/project";

//service to find all projects in the database.
export async function findAllProjects() {
    const projects = await Project.find();
    return projects;
}

//service to find the project by slug

export async function findProjectBySlug(slug: string){
    const project = await Project.findOne({slug: slug});
    return project;
}

export interface ProjectType {
  title: string;
  slug?: string;
  location: string;
  price: string;
  status?: "Planning" | "In Progress" | "Completed";
  style: "Mediterranean" | "Modern" | "Tropical" | "Contemporary";
  description: string;
  images: string[];
}

//service to insert a new project into the database.
export const insertProject = async (data: ProjectType) => {
    const project = await Project.create(data);
    return project;
};