import Joi from "joi";
import dotenv from "dotenv";
import path from "path";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import url from "url";
import { isValidFieldName, isValidFileType } from "../utils/validators.js";
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

const viewGallery = async (projectId) => {
  const galleries = await galleryModel.find({ projectId });
  return galleries;
};

export const createProject = async (req, res, next) => {
  try {
    console.log(req.body)
    const { projectName, description, location, status, startDate, endDate } = req.body;
    const schema = Joi.object({
      projectName: Joi.string().required(),
      description: Joi.any().allow(''),
      location: Joi.string().required(),
      status: Joi.string().required(),
      startDate: Joi.string().allow(''),
      endDate: Joi.string().allow('')
    });
    let data = {
      projectName,
      status,
      description,
      location,
      startDate,
      endDate
    };
    const { error, value } = await schema.validateAsync(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: 400 });
    }
 

    const projectExist = await projectModel.findOne({ projectName });
    if (projectExist) {
      return res.status(400).send({
        message: "Project name alraedy taken. Please use another project name",
        status: 400,
      });
    }

    const project = await projectModel.create(data);
    if (!project) {
      return res
        .status(400)
        .send({ message: "Invalid api request", status: 400 });
    }
    const projectFolder = `/public/project/${project._id}`;
    const folder = join(__dirname, `../../${projectFolder}`);

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      console.log("fileName", file.fieldname)
      console.log("file", req.files[i])
      const fieldNames = [
        "approvedPlan",
        "brochure",
        "projectNoc",
        "projectImage",
        "reraNoc"
      ];
      const fileTypes = ["png", "jpg", "jpeg", "webp", "pdf", "doc"];
      if (!isValidFieldName(file.fieldname, fieldNames)) {
        return res.status(400).send({
          message: "Invalid file. Please send valid file",
          status: 400,
        });
      }

      if (!isValidFileType(file, fileTypes)) {
        return res.status(400).send({
          message:
            'Invalid file format. Please send file in "png", "jpg", "jpeg" or "webp" format',
          status: 400,
        });
      }

      const buffer = Buffer.from(file.buffer, "utf-8");
      const fileName = `/${file.fieldname}.${file.mimetype.split("/")[1]}`;
      const fullName = join(folder, `/${fileName}`);
      await fs.mkdir(folder, { recursive: true });
      await fs.writeFile(fullName, buffer, "utf-8");
      const filePath = projectFolder + fileName;
      const projectUpdate = await projectModel.findByIdAndUpdate(project._id, {
        [file.fieldname]: filePath,
      });
    }

    return res.status(201).send({ data: project, status: 201 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const getProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res
        .status(400)
        .send({ message: "Invalid request.Please send projectId" });
    }
    const project = await projectModel
      .findById(projectId)
      .populate({ path: "gallery", model: galleryModel });
    return res.status(200).send({ data: project, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const getAllProjectsAdmin = async (req, res, next) => {
  try {
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";
    const { status } = req.query;
    let project;
    if (!status) {
      project = await projectModel
        .find({})
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate({ path: "gallery", model: galleryModel });
    } else {
      project = await projectModel
        .find({ status })
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate({ path: "gallery", model: galleryModel });
    }

    return res.status(200).send({ data: project, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const getAllProjectweb = async (req, res, next) => {
  try {
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";
    const { status } = req.query;
    let project;
    if (!status) {
      project = await projectModel
        .find({ isActive: true })
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate({ path: "gallery", model: galleryModel });
    } else {
      project = await projectModel
        .find({ status, isActive: true })
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate({ path: "gallery", model: galleryModel });
    }

    return res.status(200).send({ data: project, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const getListProject = async (req, res, next) => {
  try {
    const project = await projectModel
      .find({ isActive: true })
      .select({ projectName: 1 });

    return res.status(200).send({ data: project, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const getGalleryImagesProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await viewGallery(projectId);
    return res.status(200).send({ data: project, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const updates = req.body;
    const schema = Joi.object({
      projectId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      updates: Joi.object().required(),
    });

    const updateSchema = Joi.object({
      projectName: Joi.string(),
      description: Joi.string(),
      location: Joi.string(),
    });
    let { error, value } = schema.validate({ projectId, updates });

    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: 400 });
    }
    const { errors, values } = updateSchema.validate(updates);

    if (errors) {
      return res
        .status(400)
        .send({ message: errors.details[0].message, status: 400 });
    }

    const updatedProject = await projectModel.findByIdAndUpdate(
      projectId,
      { $set: updates }, // Use updates directly here
      { new: true }
    );   
    if (!updatedProject) {
      return res
        .status(404)
        .send({ message: "Project not found", status: 404 });
    }

    const projectFolder = `/public/project/${updatedProject._id}`;
    const folder = join(__dirname, `../../${projectFolder}`);
    await fs.mkdir(folder, { recursive: true }); 
    if (req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        
        const file = req.files[i];
        const field = file.fieldname;
        
        if(updatedProject.field){
          await fs.unlink(join(__dirname, updatedProject.field ))
        }
        const fileName = `/${file.fieldname}.${file.mimetype.split("/")[1]}`;
        const path = `${projectFolder}${fileName}`
        const fullName = join(folder, `/${fileName}`);
        const buffer = Buffer.from(file.buffer, "utf-8");
        await fs.writeFile(fullName, buffer, "utf-8");
        const update = { [field]:path}
        await projectModel.findByIdAndUpdate(updatedProject._id, {$set:update});      
      }
    }
    const newProject = await projectModel.findById(updatedProject._id)

    return res.status(200).send({ data: newProject, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const softDelete = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { isActive } = req.body;
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res
        .status(400)
        .send({ message: "invalid project id", status: 400 });
    }

    const projectInactive = await projectModel.findByIdAndUpdate(
      projectId,
      {
        isActive: isActive,
      },
      { new: true }
    );

    return res.status(200).send({ data: projectInactive, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await projectModel.findById(projectId);
    if (!project) {
      return res
        .status(400)
        .send({ message: "invalid project id", status: 400 });
    }

    if (project.architectureMap) {
      await fs.unlink(join(__dirname, "../..", project.architectureMap));
    }
    if (project.projectPdf) {
      await fs.unlink(join(__dirname, "../..", project.projectPdf));
    }

    if (project.projectImage) {
      await fs.unlink(join(__dirname, "../..", project.projectImage));
    }

    if (project.gallery) {
      for (const imagePath of project.gallery) {
        await fs.unlink(join(__dirname, "../..", imagePath));
      }
    }
    await fs.rmdir(join(__dirname, `../../public/project/${projectId}`));

    const deleteProject = await projectModel.findByIdAndDelete(projectId);
    if (!deleteProject) {
      return res
        .status(400)
        .send({ message: "invalid project id", status: "fail" });
    }
    return res.status(200).send({ data: deleteProject, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
  }
};
