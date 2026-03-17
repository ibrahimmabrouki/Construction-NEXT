import { Schema, model, models } from "mongoose";

//here we created the schema
const UserSchema = new Schema(
  {
    email: { type: "string", required: true, unique: true },
    username: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
  },
  {
    timestamps: true,
  }
);

const User = models.users || model("users", UserSchema);

export default User;
