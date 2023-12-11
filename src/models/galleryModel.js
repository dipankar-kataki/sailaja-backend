import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
    },
    filePath: { type: String },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
  },
  { timestamps: true }
);

const galleryModel = mongoose.model("gallery", gallerySchema, "gallery");

export default galleryModel;
