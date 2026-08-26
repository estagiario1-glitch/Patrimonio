import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "viewer" | "admin" | "sala" | "aprovacao";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;       
  role: UserRole;
  localizacao?: string;    
  image?: string;        
  createdAt: Date;
  updatedAt: Date;
}

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
    },
    role: {
      type: String,
      required: true,
      enum: ["viewer", "admin", "sala", "aprovacao"],
      default: "aprovacao",
    },
    localizacao: {
      type: String,
    },
    image: { type: String },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;