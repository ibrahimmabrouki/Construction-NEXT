import Blog from "@/models/blog";
//service to find all the blogs in the data base
export async function findAllBlogs() {
  const blogs = await Blog.find();
  return blogs;
}

//service to find the blog by slug
export async function findBlogBySlug(slug: string) {
  const blog = await Blog.findOne({ slug: slug });
  return blog;
}
