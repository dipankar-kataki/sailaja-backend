import express from "express";
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import dotenv from "dotenv";
import { xss } from "express-xss-sanitizer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import morgan from "morgan";
import adminRoutes from "./routes/adminRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import testimonyRoutes from "./routes/testimonyRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import amenityRoutes from "./routes/amenityRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);

dotenv.config({ path: join(__dirName, ".env") });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const logger = morgan("combined");

app.use(multer().any());
const corsOptions = {
  origin: ["*", "http://localhost:5174", "http://127.0.0.1:5174"],  // Replace with your React app's domain
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  exposedHeaders: ["x-forwarded-for"], // Add any custom headers here
};

app.use(cors());
app.options("*", cors());

app.use(xss());

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60* 1000,
  message: "Too many requests from this Ip, please try again in an hour",
  keyGenerator: (req) =>
    req.headers["x-forwarded-for"] || req.connection.remoteAddress,
});

app.use("/public", express.static(join(__dirName, "../public")));

app.use("/", limiter);
app.use(compression());

app.use("/backend", amenityRoutes);
app.use("/backend", adminRoutes);
app.use("/backend", projectRoutes);
app.use("/backend", testimonyRoutes);
app.use("/backend", contactRoutes);
app.use("/backend", enquiryRoutes);
app.use("/backend", galleryRoutes);
app.use("/backend", homeRoutes);

app.all("*", (req, res, next) => {
  return res
    .status(404)
    .send({ message: `Can't find ${req.originalUrl} on this server!` });
});

export default app;
