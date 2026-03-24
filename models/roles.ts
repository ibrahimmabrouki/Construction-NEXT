import { Schema, model, models } from "mongoose";

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    permissions: [
      {
        resource: {
          type: String,
          required: true,
        },
        actions: [
          {
            type: String,
            enum: ["create", "read", "update", "delete"],
            default: ["read"],
          },
        ],
      },
    ], //end of the permissions array
  },
  {
    timestamps: true,
  },
);

const Role = models.Role || model("Role", RoleSchema);
export default Role;
