import { Schema, model, models } from "mongoose";

const InquirySchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true },

    budget: { type: String, required: true },

    message: { type: String },

    projectTitle: { type: String },

    status: {
      type: String,
      enum: ["New", "Reviewed"],
      default: "New",
    },
  },
  { timestamps: true },
);

// delete models.Inquiry;

// export default model("Inquiry", InquirySchema);

export default models.Inquiry || model("Inquiry", InquirySchema);
