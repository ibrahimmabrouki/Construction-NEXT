import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";

import Role from "../models/roles";
import User from "../models/user";
import Project from "../models/project";
import Blog from "../models/blog";
import Inquiry from "../models/inquiry";
import Activity from "../models/activity";

type Action = "create" | "read" | "update" | "delete";

type Permission = {
  resource: string;
  actions: Action[];
};

const ROOT_DIR = process.cwd();
loadEnvConfig(ROOT_DIR);

const MONGODB_URI = process.env.MONGODB_URI;
const SHOULD_RESET = process.env.SEED_RESET === "true";

const CRUD_ACTIONS: Action[] = ["create", "read", "update", "delete"];

const ADMIN_PERMISSIONS: Permission[] = [
  { resource: "roles", actions: CRUD_ACTIONS },
  { resource: "projects", actions: CRUD_ACTIONS },
  { resource: "blogs", actions: CRUD_ACTIONS },
  { resource: "services", actions: CRUD_ACTIONS },
  { resource: "inquiries", actions: CRUD_ACTIONS },
  { resource: "activities", actions: CRUD_ACTIONS },
  // Included for this codebase because admin user CRUD routes authorize on "users".
  { resource: "users", actions: CRUD_ACTIONS },
];

async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Add it to .env or .env.local");
  }

  const connectionState = mongoose.connection.readyState;
  if (connectionState === 1) {
    console.log("[seed] Already connected to MongoDB");
    return;
  }

  console.log("[seed] Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, {
    dbName: "Construction",
    bufferCommands: true,
  });
  console.log("[seed] Connected");
}

async function clearCollectionsIfRequested() {
  if (!SHOULD_RESET) {
    console.log("[seed] SEED_RESET is false -> skipping destructive cleanup");
    return;
  }

  console.log("[seed] SEED_RESET=true -> clearing seed collections");
  await Promise.all([
    Activity.deleteMany({}),
    Inquiry.deleteMany({}),
    Blog.deleteMany({}),
    Project.deleteMany({}),
    mongoose.connection.collection("services").deleteMany({}),
    User.deleteMany({}),
    Role.deleteMany({}),
  ]);
  console.log("[seed] Cleanup complete");
}

async function seedRoles() {
  console.log("[seed] Seeding roles...");

  await Role.updateOne(
    { name: "admin" },
    {
      $set: {
        name: "admin",
        description: "Full system access",
        permissions: ADMIN_PERMISSIONS,
      },
    },
    { upsert: true }
  );

  const adminRole = await Role.findOne({ name: "admin" });
  if (!adminRole) {
    throw new Error("Failed to seed admin role");
  }

  console.log(`[seed] Role ready: admin (${adminRole._id.toString()})`);
  return adminRole;
}

async function seedUsers(adminRoleId: mongoose.Types.ObjectId) {
  console.log("[seed] Seeding users...");

  // User.roles schema is [String], so we store role ObjectId as string.
  // This preserves role linkage while matching the current schema.
  await User.updateOne(
    { username: "admin" },
    {
      $set: {
        username: "admin",
        password: "admin",
        roles: [adminRoleId.toString()],
      },
    },
    { upsert: true }
  );

  const adminUser = await User.findOne({ username: "admin" });
  if (!adminUser) {
    throw new Error("Failed to seed admin user");
  }

  console.log(`[seed] User ready: admin (${adminUser._id.toString()})`);
}

async function seedProjects() {
  console.log("[seed] Seeding projects...");

  await Project.updateOne(
    { slug: "villa-azure" },
    {
      $set: {
        title: "Villa Azure",
        slug: "villa-azure",
        location: "Marbella, Spain",
        price: "$2.4M",
        status: "Completed",
        style: "Mediterranean",
        description:
          "Luxury coastal villa project with modern amenities and premium finishes.",
        images: [
          "https://i.ibb.co/8DK6w3x/project-1.jpg",
          "https://i.ibb.co/6gdm2VJ/project-2.jpg",
        ],
      },
    },
    { upsert: true }
  );

  await Project.updateOne(
    { slug: "skyline-penthouse" },
    {
      $set: {
        title: "Skyline Penthouse",
        slug: "skyline-penthouse",
        location: "Dubai, UAE",
        price: "$5.1M",
        status: "In Progress",
        style: "Modern",
        description:
          "High-rise penthouse construction with smart home integration.",
        images: ["https://i.ibb.co/3N0L6gM/project-3.jpg"],
      },
    },
    { upsert: true }
  );

  console.log("[seed] Projects seeded");
}

async function seedBlogs() {
  console.log("[seed] Seeding blogs...");

  await Blog.updateOne(
    { slug: "smart-home-trends-2026" },
    {
      $set: {
        slug: "smart-home-trends-2026",
        title: "Smart Home Trends in 2026",
        date: new Date().toISOString(),
        category: "Technology",
        image: "https://i.ibb.co/2sM4n3w/blog-1.jpg",
        excerpt:
          "A quick look at practical smart construction technologies used in premium builds.",
        content:
          "Smart construction is reshaping project planning, safety tracking, and client experience.",
      },
    },
    { upsert: true }
  );

  await Blog.updateOne(
    { slug: "sustainable-luxury-construction" },
    {
      $set: {
        slug: "sustainable-luxury-construction",
        title: "Sustainable Luxury Construction",
        date: new Date().toISOString(),
        category: "Sustainability",
        image: "https://i.ibb.co/0Vx5vDk/blog-2.jpg",
        excerpt:
          "How high-end residential projects can reduce environmental impact.",
        content:
          "Material choice, passive design, and energy systems are key to long-term sustainability.",
      },
    },
    { upsert: true }
  );

  console.log("[seed] Blogs seeded");
}

async function seedServices() {
  console.log("[seed] Seeding services...");

  const servicesCollection = mongoose.connection.collection("services");

  await servicesCollection.updateOne(
    { title: "Luxury Villa Construction" },
    {
      $set: {
        icon: "Building2",
        title: "Luxury Villa Construction",
        desc: "End-to-end construction for premium residential villas.",
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
      $currentDate: {
        updatedAt: true,
      },
    },
    { upsert: true }
  );

  await servicesCollection.updateOne(
    { title: "Renovation & Remodeling" },
    {
      $set: {
        icon: "Wrench",
        title: "Renovation & Remodeling",
        desc: "Structural and design-focused upgrades for existing properties.",
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
      $currentDate: {
        updatedAt: true,
      },
    },
    { upsert: true }
  );

  console.log("[seed] Services seeded");
}

async function seedInquiries() {
  console.log("[seed] Seeding inquiries...");

  await Inquiry.updateOne(
    {
      name: "John Carter",
      email: "john.carter@example.com",
      projectTitle: "Villa Azure",
    },
    {
      $set: {
        name: "John Carter",
        email: "john.carter@example.com",
        budget: "$2M - $3M",
        message: "I am interested in a similar project timeline and scope.",
        projectTitle: "Villa Azure",
        status: "New",
      },
    },
    { upsert: true }
  );

  console.log("[seed] Inquiries seeded");
}

async function seedActivities() {
  console.log("[seed] Seeding activities...");

  await Activity.updateOne(
    {
      user: "admin",
      action: "created",
      resource: "project",
      title: "Villa Azure",
    },
    {
      $set: {
        user: "admin",
        action: "created",
        resource: "project",
        title: "Villa Azure",
      },
    },
    { upsert: true }
  );

  await Activity.updateOne(
    {
      user: "admin",
      action: "created",
      resource: "blog",
      title: "Smart Home Trends in 2026",
    },
    {
      $set: {
        user: "admin",
        action: "created",
        resource: "blog",
        title: "Smart Home Trends in 2026",
      },
    },
    { upsert: true }
  );

  console.log("[seed] Activities seeded");
}

async function seed() {
  console.log("[seed] Starting seed process...");
  console.log(`[seed] Working directory: ${ROOT_DIR}`);

  await connectToDatabase();
  await clearCollectionsIfRequested();

  const adminRole = await seedRoles();
  await seedUsers(adminRole._id);

  await seedProjects();
  await seedBlogs();
  await seedServices();
  await seedInquiries();
  await seedActivities();

  console.log("[seed] Seed completed successfully");
}

seed()
  .catch((error) => {
    console.error("[seed] Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("[seed] MongoDB connection closed");
    }
  });
