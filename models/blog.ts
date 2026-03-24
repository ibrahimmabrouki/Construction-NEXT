import { Schema, model, models } from "mongoose";

export const categoryOptions = [
  "Technology",
  "Sustainability",
  "Guide",
  "Design",
  "News",
  "Lifestyle",
];

const BlogSchema = new Schema(
  {
    slug: { type: String, unique: true },

    title: { type: String, required: true },

    date: { type: String, required: true, index: true },

    category: {
      type: String,
      required: true,
      enum: categoryOptions,
    },

    image: { type: String, required: true },

    excerpt: { type: String, required: true },

    content: { type: String, required: true },
  },
  { timestamps: true }
);


// delete models.Blog;

// export default model("Blog", BlogSchema);

export default models.Blog || model("Blog", BlogSchema);