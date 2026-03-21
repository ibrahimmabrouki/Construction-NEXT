import { Schema, model, models } from "mongoose";
import { AVAILABLE_ICONS } from "@/lib/iconMap";

const ServiceSchema = new Schema(
  {
    icon: {
      type: String,
      required: true,
      enum: AVAILABLE_ICONS, 
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// delete models.Service;
// const Service = model("Service", ServiceSchema);

const Service = models.Service || model("Service", ServiceSchema);
export default Service;