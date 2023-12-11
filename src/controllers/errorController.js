import AppError from "./../utils/appError.js";

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const handleUnHandledError = (err) => new AppError(`${err}`, 401);

const sendError = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) RENDERED WEBSITE
  console.error("ERROR 💥", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

// const sendErrorProd = (err, req, res) => {
//   // A) API
//   if (req.originalUrl.startsWith("/api")) {
//     // A) Operational, trusted error: send message to client
//     if (err.isOperational) {
//       return res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//       });
//     }
//     // B) Programming or other unknown error: don't leak error details
//     // 1) Log error
//     console.error("ERROR 💥", err);
//     // 2) Send generic message
//     return res.status(500).json({
//       status: "error",
//       message: "Something went very wrong!",
//     });
//   }

//   // B) RENDERED WEBSITE
//   // A) Operational, trusted error: send message to client
//   if (err.isOperational) {
//     return res.status(err.statusCode).render("error", {
//       title: "Something went wrong!",
//       msg: err.message,
//     });
//   }
//   // B) Programming or other unknown error: don't leak error details
//   // 1) Log error
//   console.error("ERROR 💥", err);
//   // 2) Send generic message
//   return res.status(err.statusCode).render("error", {
//     title: "Something went wrong!",
//     msg: "Please try again later.",
//   });
// };

const error = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = 400;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;

  if (error.name === "CastError") {
    error = handleCastErrorDB(error);
  } else if (error.name == "MongoError") {
    error = handleDuplicateFieldsDB(error);
  } else if (error.name === "ValidationError") {
    error = handleValidationErrorDB(error);
  } else if (error.name === "JsonWebTokenError") {
    error = handleJWTError(error);
  } else if (error.name === "TokenExpiredError") {
    error = handleJWTExpiredError(error);
  } else {
    error = handleUnHandledError(error);
  }
  sendError(error, req, res);
};
export default error;
