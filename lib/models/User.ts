import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "viewer" | "admin";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;       // undefined para usuários OAuth
  role: UserRole;
  image?: string;          // avatar vindo do Google
  createdAt: Date;
  updatedAt: Date;
}

// @ts-ignore
const UserSchema: Schema = new Schema(
  {
    name: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Opcional: usuários OAuth não têm senha local
    },
    role: {
      type: String,
      required: true,
      enum: ["viewer", "admin"],
      default: "viewer",
    },
    image: { type: String },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;