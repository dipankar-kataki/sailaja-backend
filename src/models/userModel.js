import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 25,
      required: "please provide name",
    },
    mobile: { type: Number, required: "please provide mobile", unique: true },
    email: { type: Number, required: "please provide email", unique: true },
    message: { type: String, minlength: 3, maxlength: 250 },
    subject: { type: String, minlength: 3, maxlength: 250 },
    project: [{ type: mongoose.Schema.Types.ObjectId, ref: "project" }],
    testimony: { type: Boolean, default: false },
    feedback: { type: String, minlength: 5 },
    address: { type: String, minlength: 10 },
    picture: { type: String },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema, "user");

export default userModel;
