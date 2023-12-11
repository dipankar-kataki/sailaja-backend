import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema(
  {
    amenityName: {
      type: String,
      unique:true,
    },
    amenityPath: { type: String },
  },
  { timestamps: true }
);

const amenityModel = mongoose.model("amenity", amenitySchema, "amenity");

export default amenityModel;
