import { Schema, model, models } from "mongoose";

//here we created the schema
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    roles: {
      type: [String],
      enum: ["admin", "projecteditor", "blogeditor", "newseditor", "manager"],
      default: ["manager"],
    },
  },
  { timestamps: true },
);

const User = models.User || model("User", UserSchema);

export default User;