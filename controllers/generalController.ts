import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import blog from "@/models/blog";
import Project from "@/models/project";
import Service from "@/models/services";
import inquiry from "@/models/inquiry";

//controller to get total number of projects, blogs and services, inquires

export async function getDashboardStats(request: NextRequest) {
  try {
    await connect();
    const [numProjects, numBlogs, numServices, numInquiries] =
      await Promise.all([
        Project.countDocuments(),
        blog.countDocuments(),
        Service.countDocuments(),
        inquiry.countDocuments({ status: "New" }),
      ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          projects: numProjects,
          blogs: numBlogs,
          services: numServices,
          inquiries: numInquiries,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching Dashbord data" },
      { status: 500 },
    );
  }
}
