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
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

export const createGallery = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    // const { fileName, filePath } = req.body;
    const schema = Joi.object({
      projectId: Joi.string().required(),
    });
    let data = {
      projectId,
    };
    const { error, value } = await schema.validateAsync(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: 400 });
    }

    if (req.files.length == 0) {
      return res.status(400).send({
        message: "Invalid request. please send files",
        status: 400,
      });
    }

    const projectFolder = `/public/project/${projectId}`;
    const folder = join(__dirname, `../../${projectFolder}`);
    let gallery;
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const buffer = Buffer.from(file.buffer, "utf-8");
      const fileName = `/${file.fieldname}${Math.random * 1000}${i}.${
        file.mimetype.split("/")[1]
      }`;
      const fullName = join(folder, `/${fileName}`);
      await fs.mkdir(folder, { recursive: true });
      await fs.writeFile(fullName, buffer, "utf-8");
      const filePath = projectFolder + fileName;
      const data = { fileName, filePath, projectId };
      gallery = await galleryModel.create(data);
    }

    return res.status(201).send({ data: gallery, status: 201 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const getGallery = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res
        .status(400)
        .send({ message: "Invalid request.Please send projectId" });
    }
    const gallery = await galleryModel.find({ projectId });
    if (!gallery) {
      return res
        .status(200)
        .send({ message: "no gallery found", status: 200 });
    }
    return res.status(200).send({ data: gallery, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

// export const deleteGallery = async (req, res, next) => {
//   try {
//     let page = req.query.page * 1 || 1;
//     let limit = req.query.limit * 1 || 12;
//     const skip = (page - 1) * limit;
//     const sort = req.query.sort || "-createdAt";
//     const { status } = req.query;
//     let project;
//     if (!status) {
//       project = await projectModel
//         .find({})
//         .skip(skip)
//         .limit(limit)
//         .sort(sort)
//         .populate({ path: "gallery", model: galleryModel });
//     } else {
//       project = await projectModel
//         .find({ status })
//         .skip(skip)
//         .limit(limit)
//         .sort(sort)
//         .populate({ path: "gallery", model: galleryModel });
//     }

//     return res.status(200).send({ data: project, status: 200 });
//   } catch (err) {
//     return res.status(500).send({ message: err.message, status: 500 });
//   }
// };

export const deleteGallery = async (req, res, next) => {
  try {
    const { galleryId } = req.params;
    if (!galleryId) {
      return res
        .status(400)
        .send({ message: "Invalid request. Please send gallery image path" });
    }
    const gallery = await galleryModel.findByIdAndDelete(galleryId);
    if (!gallery) {
      return res
        .status(200)
        .send({ message: "no gallery found", status: 200 });
    }
    await fs.unlink(join(__dirname, "../..", gallery.filePath));
    return res.status(200).send({ data: gallery, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};
