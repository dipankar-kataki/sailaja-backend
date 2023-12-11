import Joi from "joi";
import userModel from "../models/userModel.js";
import projectModel from "../models/projectModel.js";
import adminModel from "../models/adminModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import enquiryModel from "../models/enquiryModel.js";

export const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, mobile, projectId } = req.body;
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      mobile: Joi.string().required(),
      projectId: Joi.string().required(),
    });
    const data = { name, email, mobile, projectId };
    const { error, value } = schema.validateAsync(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: 400 });
    }
    const projectExist = await projectModel.findById(projectId);
    if (!projectExist) {
      return res
        .status(404)
        .send({ message: "Project not found", status: 404 });
    }
    const contact = await enquiryModel.create(data);
    return res.status(201).send({ data: contact, status: 201 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

// export const getEnquiry = catchAsync(async (req, res, next) => {
// });

export const getAllEnquiry = async (req, res, next) => {
  try {
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 12;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";
    const enquiries = await enquiryModel
      .find({})
      .sort({ status: -1 })
      .skip(skip)
      .limit(limit).populate({path:"projectId", model:projectModel});
    return res.status(200).send({ data: enquiries, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const updateEnquiry = async (req, res, next) => {
  try {
    const { enquiryId } = req.params;
    const updateEnquiry = await enquiryModel.findByIdAndUpdate(
      enquiryId,
      { madeEnquiry: true },
      { new: true }
    );
    return res.status(200).send({ data: updateEnquiry, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const { enquiryId } = req.params;
    const updateEnquiry = await enquiryModel.findByIdAndDelete(enquiryId);
    return res.status(200).send({ data: updateEnquiry, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};
