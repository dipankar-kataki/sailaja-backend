import Joi from "joi";
import bcrypt from "bcrypt";
import adminModel from "../models/adminModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { generateToken } from "../auth/authorization.js";

export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      mobile: Joi.string().required(),
      password: Joi.string().required(),
    });

    const data = { name, email, mobile, password };
    const { error, value } = schema.validate(data);

    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    data.password = encryptedPassword;
    const admin = await adminModel.create(data);
    admin.password = null;
    return res.status(200).send({ data: admin, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const data = { email, password };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: 400 });
    }

    let user = await adminModel.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .send({ message: "Invalid email or password", status: 400 });
    }
    user.password = null;
    const token = generateToken(user._id);
    return res.status(200).send({ data: user, token: token, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const getAdmin = async (req, res, next) => {
  try {
    const user = await adminModel.findById(req.id);
    return res.status(200).send({ data: user, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const updateAdmin = catchAsync(async (req, res, next) => {
  try {
    const user = await adminModel.findById(req.id);
    return res.status(200).send({ data: user, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
});

export const deleteAdmin = async (req, res, next) => {
  try {
    const user = await adminModel.findById(req.id);
    return res.status(200).send({ data: user, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};
