import { Router } from "express";
import { verifyToken } from "../auth/authorization.js";
import {
  createContactRequest,
  getAllContactRequest,
  updateContactRequest,
  deleteContactRequest,
} from "../controllers/contactController.js";
const router = Router();

router.route("/contact").post( createContactRequest);
router.route("/contact").get( getAllContactRequest);
router.route("/contact/:contactId").put( updateContactRequest);
router.route("/contact/:contactId").delete( deleteContactRequest);

const contactRoutes = router;
export default contactRoutes;
