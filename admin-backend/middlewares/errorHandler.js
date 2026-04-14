import logger from "../utils/logger.js";

function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.url} - ${err.message}`);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

export default errorHandler;
