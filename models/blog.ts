import { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    slug: { type: String, unique: true },
    title: { type: String, required: true },
    date: { type: String, required: true, index: true },

    category: { type: String, required: true },

    image: { type: String, required: true },

    excerpt: { type: String, required: true },

    content: [{ type: String, required: true }],
  },
  { timestamps: true },
);


export default models.Blog || model("Blog", BlogSchema);
