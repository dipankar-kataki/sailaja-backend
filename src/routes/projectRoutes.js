import { Router } from "express";
import { verifyToken } from "../auth/authorization.js";
import {
  createProject,
  getAllProjectweb,
  getProject,
  deleteProject,
  updateProject,
  getListProject,
  getAllProjectsAdmin,
  softDelete,
} from "../controllers/projectController.js";
import {
  addAmenityToProject,
  removeAmenityFromProject,
} from "../controllers/amenitiesController.js";
import { multerFilter } from "../middleware/imageCheck.js";
const router = Router();

router.route("/project").post(verifyToken, createProject);
router.route("/project/web").get(getAllProjectweb);
router.route("/project/all/admin").get(getAllProjectsAdmin);

router.route("/project/projectId/:projectId").get(getProject);

router.route("/project/list").get(getListProject);


router.route("/project/delete/:projectId").delete(verifyToken, softDelete);

router.route("/project/:projectId").put(verifyToken, updateProject);


router.route("/project/:projectId").delete(verifyToken, deleteProject);

const projectRoutes = router;
export default projectRoutes;
