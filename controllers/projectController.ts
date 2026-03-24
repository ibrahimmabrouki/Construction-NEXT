import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import {
  findAllProjects,
  findProjectBySlug,
  insertProject,
} from "@/server-services/projectServices";
import Project from "@/models/project";
import { uploadToImgBB } from "@/utils/uploadToImgBB";

//conroller to get all the projects
export async function getAllProjects(request: NextRequest) {
  await connect();
  // Implementation for fetching all projects
  try {
    const projects = await findAllProjects();
    return NextResponse.json({ success: true, data: projects });
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

//contorller to add new project to the database
export async function AddProject(req: NextRequest) {
  try {
    await connect();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const price = formData.get("price") as string;
    const status = formData.get("status") as string;
    const style = formData.get("style") as string;
    const description = formData.get("description") as string;
    const files = formData.getAll("images") as File[];

    console.log({
      title,
      location,
      price,
      status,
      style,
      description,
    });

    console.log("FILES:", files);
    console.log("FILES LENGTH:", files.length);

    if (
      !title ||
      !location ||
      !price ||
      !style ||
      !description ||
      !files ||
      files.length === 0
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const existingProject = await Project.findOne({ slug });

    if (existingProject) {
      return NextResponse.json(
        { message: "A Project with this title already exists" },
        { status: 409 },
      );
    }

    const imageUrls: string[] = [];

    for (const file of files) {
      const url = await uploadToImgBB(file);
      imageUrls.push(url);
    }

    const project = await Project.create({
      title,
      location,
      price,
      status,
      style,
      description,
      images: imageUrls,
      slug,
    });

    return NextResponse.json(
      {
        message: "Project created successfully",
        data: project,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Create Project Error:", error);

    return NextResponse.json(
      {
        message: "Error creating project",
        error: error.message,
      },
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

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const price = formData.get("price") as string;
    const status = formData.get("status") as string;
    const style = formData.get("style") as string;
    const description = formData.get("description") as string;

    const filesRaw = formData.getAll("images");
    const existingImagesRaw = formData.getAll("existingImages");

    const files = filesRaw.filter(
      (item): item is File => item instanceof File && item.size > 0,
    );

    const existingImages = existingImagesRaw.filter(
      (item): item is string => typeof item === "string",
    );

    let imageUrls: string[] = [];

    if (existingImages.length > 0) {
      imageUrls = [...existingImages];
    }

    if (files.length > 0) {
      const uploadedUrls = await Promise.all(
        files.map((file) => uploadToImgBB(file)),
      );
      imageUrls = [...imageUrls, ...uploadedUrls];
    }

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { message: "At least one image is required" },
        { status: 400 },
      );
    }

    const updateData: any = {
      location,
      price,
      status,
      style,
      description,
      images: imageUrls,
    };

    if (title) {
      updateData.title = title;
      updateData.slug = title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    }

    const project = await Project.findOneAndUpdate({ slug }, updateData, {
      new: true,
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Project updated successfully",
        data: project,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Update Project Error:", error);

    return NextResponse.json(
      {
        message: "Error updating project",
        error: error.message,
      },
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
      {
        success: true,
        data: project,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting project" },
      { status: 500 },
    );
  }
}
