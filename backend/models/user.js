// backend/models/User.js
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, 
    },
    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active", 
    },
  },
  { timestamps: true } 
);

const User = model("User", userSchema);
export default User;