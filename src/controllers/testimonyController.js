import * as EmailValidator from "email-validator";
import Joi from "joi";
import fs from "fs/promises";
import { catchAsync } from "../utils/catchAsync.js";
import testimonyModel from "../models/testimonyModel.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import projectModel from "../models/projectModel.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

export const createTestimony = async (req, res, next) => {
  try {
    let schema;
    let data;
    console.log(req.body.isGlobal);
    const { isGlobal } = req.body;
    if (isGlobal === "true") {
      const { name, review, isGlobal } = req.body;
      console.log("in if");
      schema = Joi.object({
        name: Joi.string().min(6).required(),
        review: Joi.string().min(10).max(250).required(),
        isGlobal: Joi.boolean().required(),
      });
      data = { name, review, isGlobal };
    } else {
      const { name, review, projectId, isGlobal } = req.body;
      console.log("in else");
      schema = Joi.object({
        name: Joi.string().min(6).required(),
        review: Joi.string().min(10).max(250).required(),
        projectId: Joi.string().required(),
        isGlobal: Joi.boolean().required(),
      });
      data = { name, review, projectId, isGlobal };
    }

    const { error, value } = await schema.validateAsync(data);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    if (!req.files.length > 0) {
      return res
        .status(400)
        .send({ message: "invalid request. send file", status: 400 });
    }

    const testimony = await testimonyModel.create(data);

    const projectFolder = `/public/testimony/${testimony._id}`;
    const folder = join(__dirname, `../../${projectFolder}`);
    const file = req.files[0];
    const buffer = Buffer.from(file.buffer, "utf-8");
    const fileName = `/${file.fieldname}${Math.random() * 1000}.${
      file.mimetype.split("/")[1]
    }`;
    const fullName = join(folder, `/${fileName}`);
    await fs.mkdir(folder, { recursive: true });
    await fs.writeFile(fullName, buffer, "utf-8");
    const filePath = projectFolder + fileName;

    const updatedTestimony = await testimonyModel.findByIdAndUpdate(
      testimony._id,
      {
        userImage: filePath,
      },
      { new: true }
    );

    // const newTestimony = await testimonyModel.findById(testimony._id);

    return res.status(201).send({ data: updatedTestimony, status: 201 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const getTestimony = async (req, res, next) => {
  try {
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 12;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";
    const { isGlobal } = req.query;
    let testimony;
    if (isGlobal == true) {
      testimony = await testimonyModel
        .find({ isGlobal })
        .skip(skip)
        .limit(limit)
        .sort(sort);
    } else {
      const { projectId } = req.query;
      testimony = await testimonyModel
        .find({ projectId })
        .populate({ path: "projectId", model: projectModel })
        .skip(skip)
        .limit(limit)
        .sort(sort);
    }

    return res.status(201).send({ data: testimony, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const updateTestimony = async (req, res, next) => {
  try {
    const { testimonyId } = req.params;
    const updateObj = req.body;
    if (!testimonyId) {
      return res
        .status(400)
        .send({ message: "Invalid testimony id", status: 400 });
    }
    if (!updateObj || Object.keys(updateObj).length === 0) {
      return res.status(400).send({ message: "Invalid request.", status: 400 });
    }
    console.log(updateObj);
    const updateSchema = Joi.object({
      name: Joi.string().min(6),
      email: Joi.string().min(11),
      subject: Joi.string().min(10).max(250),
      project: Joi.string(),
      isGlobal: Joi.boolean(),
    });
    const { error, value } = updateSchema.validateAsync(updateObj);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: 400 });
    }
    const testimony = await testimonyModel.findById(testimonyId);

    if (!testimonyId) {
      return res
        .status(404)
        .send({ message: "Testimony not found.", status: 404 });
    }
    if (req.file) {
      const buffer = Buffer.from(req.files[0].buffer, "utf-8");
      await fs.writeFile(testimony.userImage, buffer, "utf-8");
    }

    const updatedProject = await projectModel.findByIdAndUpdate(
      testimonyId,
      { $set: updateObj }, // Use updates directly here
      { new: true }
    );

    return res.status(200).send({ data: updatedProject, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const deleteTestimony = async (req, res, next) => {
  try {
    const { testimonyId } = req.params;
    const testimony = await testimonyModel.findByIdAndDelete(testimonyId);
    if (!testimony) {
      return res.status(401).send({ messge: "user not deleted" });
    }
    await fs.unlink(join(__dirname, "../..", testimony.userImage));

    return res.status(200).send({
      data: testimony,
      message: "Item deleted succesfully",
      status: 200,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
