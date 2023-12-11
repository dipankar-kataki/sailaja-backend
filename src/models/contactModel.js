import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 25,
      required: "please provide name",
    },
    subject: {
      type: String,
      required: "please provide subject",
      minlength: 10,
      maxlength: 250,
    },
    email: { type: String, required: "please provide email" },
    message: {
      type: String,
      required: "please provide message",
      unique: true,
      minlength:8,
      cast: `value is not a {value}`,
    },
    madeContact: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const contactModel = mongoose.model("contact", contactSchema, "contact");
export default contactModel;
