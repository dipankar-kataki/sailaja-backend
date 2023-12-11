import { Router } from "express";
import { verifyToken } from "../auth/authorization.js";
import {
  createGallery,
  deleteGallery,
  getGallery,
} from "../controllers/galleryController.js";
const router = Router();

router.route("/gallery/:projectId").post(verifyToken, createGallery);

router.route("/gallery/:galleryId").delete(verifyToken, deleteGallery);
router.route("/gallery/project/:projectId").get(getGallery);

const galleryRoutes = router;
export default galleryRoutes;
