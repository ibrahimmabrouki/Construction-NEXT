import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import { findAllBlogs, findBlogBySlug } from "@/server-services/blogServices";
import Blog from "@/models/blog";

//controller to get All Blogs
export async function getAllBlogs(request: NextRequest) {
  try {
    await connect();
    const blogs = await findAllBlogs();
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching blogs" },
      { status: 500 },
    );
  }
}

//controller to get the project by slug
export async function getBlogtBySlug(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ message: "Slug undefined" }, { status: 400 });
    }

    await connect();

    console.log("Slug received in controller:", slug);

    const blog = await findBlogBySlug(slug);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error("getBlogBySlug error:", error);

    return NextResponse.json(
      { success: false, message: "Error fetching blog" },
      { status: 500 },
    );
  }
}

export interface BlogType {
  title: string;
  slug?: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  content: string[];
}

//controller to create the blog
export async function createBlog(request: NextRequest) {
  try {
    await connect();
    const body: BlogType = await request.json();

    const { title, date, category, image, excerpt, content } = body;

    if (!title || !date || !category || !image || !excerpt || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    body.slug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const blog = await Blog.create(body);
    return NextResponse.json(
      {
        message: "Blog created successfully",
        data: blog,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Create Blog Error:", error);

    return NextResponse.json(
      {
        message: "Error creating blog",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

//controller to update the blog
export async function updateBlog(request: NextRequest, slug: string) {
  try {
    await connect();

    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 },
      );
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

    const blog = await Blog.findOneAndUpdate(
      { slug },
      { ...data },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Blog updated successfully",
        data: blog,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Update Blog Error:", error);

    return NextResponse.json(
      {
        message: "Error updating blog",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

//controller to delete the blog
export async function deleteBlog(request: NextRequest, slug: string) {
  try {
    await connect();

    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 },
      );
    }

    const blog = await Blog.findOneAndDelete({ slug });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Blog deleted successfully",
        data: blog,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Delete Blog Error:", error);

    return NextResponse.json(
      {
        message: "Error deleting blog",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
