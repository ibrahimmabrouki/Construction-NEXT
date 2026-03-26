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
      required: true,
    },
  },
  { timestamps: true },
);

// delete models.User;
// const User = model("User", UserSchema);

const User = models.User || model("User", UserSchema);

export default User;



