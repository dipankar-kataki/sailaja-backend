import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      minlength: 3,
      maxlength: 25,
      required: { value: true, message: "Please provide a project name" },
      unique: true,
    },
    projectImage: { type: String },
    gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: "gallery" }],
    description: { type: String },
    location: { type: String },
    approvedPlan: { type: String },
    brochure: { type: String },
    startDate: {type: String},
    endDate: {type:String},
    status: {
      type: String,
      enum: ["completed", "ongoing", "upcoming"],
      required: [true, "Please provide a status"],
      message: "{VALUE} is not a valid status",
    },
    projectNoc: { type: String },
    reraNoc: {type: String},
    isActive: { type: Boolean, default: true },
    amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: "amenity" }],
  },
  { timestamps: true }
);

projectSchema.index({ _id: 1, "amenities._id": 1 });

const projectModel = mongoose.model("project", projectSchema, "project");

export default projectModel;
