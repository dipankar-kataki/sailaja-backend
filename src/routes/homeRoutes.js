import { Router } from "express";
import { verifyToken } from "../auth/authorization.js";
import {
  homePage
} from "../controllers/homeController.js";
const router = Router();

router.route("/home").get(homePage);
// router.route("/amenity/project/:projectId").get(getAllAmenity);
// router.route("/amenity/:amenitieId").delete(deleteAmenity);

const homeRoutes = router;
export default homeRoutes;