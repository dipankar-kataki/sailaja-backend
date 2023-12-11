import { Router } from "express";
import { verifyToken } from "../auth/authorization.js";
import { createAdmin, login } from "../controllers/adminController.js";
const router = Router();

router.route("/admin").post( createAdmin);
router.route("/admin/login").post( login);

const adminRoutes = router;
export default adminRoutes;
