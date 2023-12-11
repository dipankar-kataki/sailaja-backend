import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { MONGODB_URI } from "../env.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
// dotenv.config({ path: path.join(__dirname, "../.env") });
// const mongo_host = process.env.MONGO_HOST;
// const mongo_admin = process.env.MONGO_ADMIN;
// const mongo_password = process.env.MONGO_PASSWORD;
// const mongo_database = process.env.MONGO_DATABASE;

// const uri = `mongodb+srv://sailaja-mongodb-5ef9d468.mongo.ondigitalocean.com`;

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    maxPoolSize: 100,
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

mongoose.connection
  .syncIndexes()
  .then(() => {
    console.log("Indexes synchronized successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing indexes:", error);
  });

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
