import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import { findAllBlogs, findBlogBySlug } from "@/server-services/blogServices";
import Blog from "@/models/blog";
import Activity from "@/models/activity";

import { uploadToImgBB } from "@/utils/uploadToImgBB";

//controller to get All Blogs
export async function getAllBlogs(request: NextRequest) {
  try {
    await connect();
    const blogs = await findAllBlogs();
    return NextResponse.json({ success: true, data: blogs });
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
export async function createBlog(request: NextRequest, username: string) {
  try {
    await connect();

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const category = formData.get("category") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const file = formData.get("image") as File;

    if (!title || !date || !category || !excerpt || !content || !file) {
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

    const existingBlog = await Blog.findOne({ slug });

    if (existingBlog) {
      return NextResponse.json(
        { message: "A blog with this title already exists" },
        { status: 409 },
      );
    }

    const imageUrl = await uploadToImgBB(file);

    const blog = await Blog.create({
      title,
      date,
      category,
      image: imageUrl,
      excerpt,
      content,
      slug,
    });

    //here we are logging the activity
    await Activity.create({
      user: username,
      action: "created",
      resource: "blog",
      title: blog.title,
    });

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
export async function updateBlog(
  request: NextRequest,
  slug: string,
  username: string,
) {
  try {
    await connect();

    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 },
      );
    }

    const formData = await request.formData();

    const title = formData.get("title") as string | null;
    const date = formData.get("date") as string | null;
    const category = formData.get("category") as string | null;
    const excerpt = formData.get("excerpt") as string | null;
    const content = formData.get("content") as string | null;
    const file = formData.get("image") as File | null;

    const existingBlog = await Blog.findOne({ slug });

    if (!existingBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    let imageUrl = existingBlog.image;

    if (file && file.size > 0) {
      imageUrl = await uploadToImgBB(file);
    }

    const updateData: any = {};

    if (title) {
      updateData.title = title;

      updateData.slug = title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    }

    if (date) updateData.date = date;
    if (category) updateData.category = category;
    if (excerpt) updateData.excerpt = excerpt;
    if (content) updateData.content = content;

    updateData.image = imageUrl;

    const blog = await Blog.findOneAndUpdate({ slug }, updateData, {
      new: true,
      runValidators: true,
    });

    //logging the activity
    await Activity.create({
      user: username,
      action: "updated",
      resource: "blog",
      title: blog.title,
    });

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
        { success: false, message: "Slug is required" },
        { status: 400 },
      );
    }

    const blog = await Blog.findOneAndDelete({ slug });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: blog,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Delete Blog Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error deleting blog",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
