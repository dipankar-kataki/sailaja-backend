import { Router } from "express";
import { verifyToken } from "../auth/authorization.js";
import {
  createEnquiry,
  getAllEnquiry,
  updateEnquiry,
  deleteEnquiry,
} from "../controllers/enquiryController.js";
const router = Router();

router.route("/enquiry").post( createEnquiry);
router.route("/enquiry").get( getAllEnquiry);
router.route("/enquiry/:enquiryId").put( updateEnquiry);
router.route("/enquiry/:enquiryId").delete( deleteEnquiry);

const enquiryRoutes = router;
export default enquiryRoutes;
