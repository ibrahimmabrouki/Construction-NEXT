import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "Completed"],
      default: "Planning",
      required: true,
      index: true,
    },
    style: {
      type: String,
      enum: ["Mediterranean", "Modern", "Tropical", "Contemporary"],
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  },
);


const Project = models.Project || model("Project", ProjectSchema);

export default Project;
