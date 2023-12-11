import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 25,
      required: "please provide name",
    },
    mobile: {
      type: Number,
      required: "please provide mobile",
      validate: {
        validator: (v) => v.toString().length == 10,
        message: "enter 10 digit number",
      },
    },
    email: { type: String, required: "please provide email" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
    madeEnquiry: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const enquiryModel = mongoose.model("enquiry", enquirySchema, "enquiry");
export default enquiryModel;
