import mongoose, { Schema } from "mongoose";

type UserRole = "admin" | "organization" | "student" | "normal";

export interface User {
  name: string;
  email: string;
  image?: string;
  role?: UserRole;
  organization?: mongoose.Schema.Types.ObjectId;
  points?: number;
}

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  role: {
    type: String,
    enum: ["admin", "organization", "student", "normal"],
    required: true,
  },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
  points: { type: Number, default: 0 },
});

const UserModel =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;
