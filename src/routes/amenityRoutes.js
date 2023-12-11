import { Router } from "express";
import { verifyToken } from "../auth/authorization.js";
import {
  createAmenity,
  getAllAmenity,
  deleteAmenity,
  getAllAmenitiesOfProject,
  addAmenityToProject,
  removeAmenityFromProject,
} from "../controllers/amenitiesController.js";
const router = Router();

router.route("/amenity").post(verifyToken, createAmenity);
router.route("/amenity").get(getAllAmenity);
router.route("/amenity/project/:projectId").get(getAllAmenitiesOfProject);

router.route("/amenity/add/project").put(verifyToken, addAmenityToProject);
router.route("/amenity/removeproject").delete(verifyToken, removeAmenityFromProject);

router.route("/amenity/delete/:amenityId").delete(verifyToken, deleteAmenity);

const amenityRoutes = router;
export default amenityRoutes;
