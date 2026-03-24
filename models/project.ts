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
      enum: [
        "Mediterranean",
        "Modern",
        "Tropical",
        "Contemporary",
        "Minimalist",
        "Industrial",
      ],
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

//  delete models.Project;

// export default model("Project", ProjectSchema);

const Project = models.Project || model("Project", ProjectSchema);

export default Project;
