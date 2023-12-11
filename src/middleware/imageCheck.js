import multer from "multer";
import AppError from "./../utils/appError.js";
import error from "../controllers/errorController.js";
const multerStorage = multer.memoryStorage();

export const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
