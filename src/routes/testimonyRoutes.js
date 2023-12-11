import { Router } from "express";
import { verifyToken } from "../auth/authorization.js";
import {
  createTestimony,
  getTestimony,
  updateTestimony,
  deleteTestimony,
} from "../controllers/testimonyController.js";
const router = Router();

router.route("/testimony").post(verifyToken, createTestimony);
router.route("/testimony").get( getTestimony);
router.route("/testimony/:testimonyId").put(verifyToken, updateTestimony);
router.route("/testimony/:testimonyId").delete(verifyToken, deleteTestimony);

const testimonyRoutes = router;
export default testimonyRoutes;
