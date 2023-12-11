import mongoose from "mongoose";

const testimonySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 25,
      required: { value: true, message: "Please provide a testimony name" },
    },
    // mobile: { type: Number, required: "please provide mobile", unique: true },
    // message: { type: String, minlength: 3, maxlength: 250 },
    review: { type: String, minlength: 3, maxlength: 250 },

    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
    isGlobal: { type: Boolean, default: false },
    userImage: { type: String },
  },
  { timestamps: true }
);

const testimonyModel = mongoose.model(
  "testimony",
  testimonySchema,
  "testimony"
);

export default testimonyModel;
