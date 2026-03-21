import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import {
  findAllProjects,
  findProjectBySlug,
  insertProject,
} from "@/server-services/projectServices";
import Project from "@/models/project";

//conroller to get all the projects
export async function getAllProjects(request: NextRequest) {
  await connect();
  // Implementation for fetching all projects
  try {
    const projects = await findAllProjects();
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching projects" },
      { status: 500 },
    );
  }
}

//controller to get the project by slug
export async function getProjectBySlug(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ message: "Slug undefined" }, { status: 400 });
    }

    await connect();
    const project = await findProjectBySlug(slug);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching project" },
      { status: 500 },
    );
  }
}

//get the first 3 projects for the home page
export async function getFeaturedProjects(request: NextRequest) {
  try {
    await connect();
    const projects = await findAllProjects();
    const featuredProjects = projects.slice(0, 3);
    return NextResponse.json({ success: true, projects: featuredProjects });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching featured projects" },
      { status: 500 },
    );
  }
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

//contorller to add new project to the database
export async function AddProject(req: NextRequest) {
  try {
    await connect();

    const body: ProjectType = await req.json();

    const { title, location, price, style, description, images } = body;

    if (!title || !location || !price || !style || !description || !images) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    body.slug = body.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const project = await insertProject(body);

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error creating project" },
      { status: 500 },
    );
  }
}

//controller to update the project by slug
export async function updateProject(request: NextRequest, slug: string) {
  try {
    await connect();

    if (!slug) {
      return NextResponse.json({ message: "Slug undefined" }, { status: 400 });
    }

    const data = await request.json();

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No data provided for update" },
        { status: 400 },
      );
    }

    if (data.title) {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    }

    const project = await Project.findOneAndUpdate(
      { slug },
      { ...data },
      { new: true },
    );

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating project" },
      { status: 500 },
    );
  }
}

//delete the project by slug
export async function deleteProject(request: NextRequest, slug: string) {
  try {
    await connect();

    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 },
      );
    }

    const project = await Project.findOneAndDelete({ slug });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting project" },
      { status: 500 },
    );
  }
}
