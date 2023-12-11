import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../../.env") });

export const generateToken = (data) => {
  const token = jsonwebtoken.sign(
    {
      id: data,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXP || `1d` }
  );
  return token;
};

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ");
    if (!token) {
      return res.redirect("/api/admin/login");
    }
    const isvalid = jsonwebtoken.verify(token[1], process.env.JWT_SECRET);
    if (!isvalid) {
      return res.redirect("/api/admin/login");
    }
    req.id = isvalid.id;
    next();
  } catch (err) {
    console.log(err);
    return res.redirect("/api/admin/login");
  }
};
