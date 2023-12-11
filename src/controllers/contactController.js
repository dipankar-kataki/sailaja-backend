import Joi from "joi";
import EmailValidator from "email-validator";
import userModel from "../models/userModel.js";
import projectModel from "../models/projectModel.js";
import adminModel from "../models/adminModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import contactModel from "../models/contactModel.js";
import { mobileValidator } from "../utils/validators.js";

export const createContactRequest = async (req, res, next) => {
  try {
    const { name, email, message, subject } = req.body;
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      message: Joi.string().required(),
      subject: Joi.string().required(),
    });
    const data = { name, email, message, subject };
    const { error, value } = schema.validateAsync(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: 400 });
    }

    const contact = await contactModel.create(data);
    return res.status(201).send({ data: contact, status: 201 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

// export const getContactRequest = catchAsync(async (req, res, next) => {

// });

export const getAllContactRequest = async (req, res, next) => {
  try {
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 12;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";
    const contacts = await contactModel
      .find({})
      .sort({ status: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return res.status(200).send({ data: contacts, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const updateContactRequest = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateContact = await contactModel.findByIdAndUpdate(
      contactId,
      { madeContact: true },
      { new: true }
    );
    return res.status(200).send({ data: updateContact, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const deleteContactRequest = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateContact = await contactModel.findByIdAndDelete(contactId);
    return res.status(200).send({ data: updateContact, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};
