import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
    },
    username: {
      type: String,
      required: [true, "Username is required!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
