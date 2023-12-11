import Joi from "joi";
import dotenv from "dotenv";
import path from "path";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import url from "url";
import { baseUrl } from "../../env.js";
import userModel from "../models/userModel.js";
import projectModel from "../models/projectModel.js";
import adminModel from "../models/adminModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { generateToken } from "../auth/authorization.js";
import AppError from "../utils/appError.js";
import galleryModel from "../models/galleryModel.js";
import amenityModel from "../models/amenitiesModel.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

export const createAmenity = async (req, res, next) => {
  try {
    const { amenityName } = req.body;
    const schema = Joi.object({
      amenityName: Joi.string().required(),
    });
    let data = {
      amenityName,
    };
    const { error, value } = await schema.validateAsync(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: 400 });
    }

    const amenity = await amenityModel.create(data);

    const projectFolder = `/public/amenities/`;
    const folder = join(__dirname, `../../${projectFolder}`);
    const file = req.files[0];
    const buffer = Buffer.from(file.buffer, "utf-8");
    const fileName = `/${amenity._id}.${file.mimetype.split("/")[1]}`;
    const fullName = join(folder, `/${fileName}`);
    await fs.mkdir(folder, { recursive: true });
    await fs.writeFile(fullName, buffer, "utf-8");
    const filePath = projectFolder + fileName;

    const updatedAmenity = await amenityModel.findByIdAndUpdate(
      amenity._id,
      {
        amenityPath: filePath,
      },
      { new: true }
    );

    return res.status(201).send({ data: updatedAmenity, status: 201 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const addAmenityToProject = async (req, res, next) => {
  try {
    let { amenityId, projectId } = req.body;

    const schema = Joi.object({
      amenityId: Joi.array().required(),
      projectId: Joi.string().required(),
    });
    let data = {
      amenityId,
      projectId,
    };
    const { error, value } = await schema.validateAsync(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: 400 });
    }
    const addAmenity = await projectModel.findByIdAndUpdate(
      projectId,
      {
        amenities: amenityId,
      },
      { new: true }
    );
    if (!addAmenity) {
      return res.status(200).send({ message: "No amenity added", status: 200 });
    }
    return res.status(200).send({ data: addAmenity, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const removeAmenityFromProject = async (req, res, next) => {
  try {
    let { amenityId, projectId } = req.body;
    amenityId = amenityId.toString();
    projectId = projectId.toString();

    const schema = Joi.object({
      amenityId: Joi.string().required(),
      projectId: Joi.string().required(),
    });
    let data = {
      amenityId,
      projectId,
    };
    const { error, value } = await schema.validateAsync(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: 400 });
    }

    const addAminity = await projectModel.findByIdAndUpdate(projectId, {
      $pull: { amenities: amenityId },
    });
    if (!addAminity) {
      return res
        .status(200)
        .send({ message: "No amenity removed", status: 200 });
    }
    return res.status(200).send({ data: addAminity, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const getAllAmenity = async (req, res, next) => {
  try {
    const amenity = await amenityModel.find({});
    if (!amenity) {
      return res.status(200).send({ message: "no amenity found", status: 200 });
    }
    return res.status(200).send({ data: amenity, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const getAllAmenitiesOfProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res
        .status(400)
        .send({ message: "Invalid request.Please send projectId" });
    }
    const amenity = await projectModel
      .findById({ _id: projectId })
      .populate({ path: "amenities", model: amenityModel })
      .select({ amenities: 1 });

    if (!amenity) {
      return res.status(200).send({ message: "no amenity found", status: 200 });
    }
    return res.status(200).send({ data: amenity, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const deleteAmenity = async (req, res, next) => {
  try {
    const { amenityId } = req.params;
    if (!amenityId) {
      return res
        .status(400)
        .send({ message: "Invalid request. Please send gallery image path" });
    }
    const amenity = await amenityModel.findByIdAndDelete(amenityId);
    if (!amenity) {
      return res.status(200).send({ message: "no amenity found", status: 200 });
    }
    return res.status(200).send({ data: amenity, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};
