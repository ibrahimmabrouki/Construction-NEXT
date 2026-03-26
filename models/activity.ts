import { Schema, model, models } from "mongoose";

const ActivitySchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true, // "created", "updated", "deleted"
    },
    resource: {
      type: String,
      required: true, // "project", "blog", "service"
    },
    title: {
      type: String,
      required: true, // "Project Alpha"
    },
  },
  { timestamps: true },
);

const Activity = models.Activity || model("Activity", ActivitySchema);
export default Activity;
