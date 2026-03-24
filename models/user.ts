import { Schema, model, models } from "mongoose";

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
      required: true,
    },
  },
  { timestamps: true },
);

const User = models.User || model("User", UserSchema);

export default User;