import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 25,
      required: "please provide name",
    },
    mobile: { type: Number, required: "please provide mobile", unique: true },
    email: { type: String, required: "please provide email", unique: true },
    password: { type: String, required: "please provide email", unique: true },
  },
  { timestamps: true }
);

const adminModel = mongoose.model("admin", adminSchema, "admin");

export default adminModel;
