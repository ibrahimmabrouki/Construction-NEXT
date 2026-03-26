import AdminDashboardClient from "./AdminDashboardClient";
import { cookies } from "next/headers";
import connect from "@/lib/db";
import Project from "@/models/project";
import Blog from "@/models/blog";
import Service from "@/models/services";
import Inquiry from "@/models/inquiry";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  let username = "Admin";

  if (session) {
    const sessionData = JSON.parse(session.value);
    username = sessionData.username || "Admin";
  }

  await connect();

  const [projects, blogs, services, inquiries] = await Promise.all([
    Project.countDocuments(),
    Blog.countDocuments(),
    Service.countDocuments(),
    Inquiry.countDocuments({ status: "New" }),
  ]);

  const stats = { projects, blogs, services, inquiries };

  return <AdminDashboardClient username={username} stats={stats} />;
}
