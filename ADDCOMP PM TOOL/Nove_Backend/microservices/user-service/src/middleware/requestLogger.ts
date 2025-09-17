import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const requestId = req.headers["x-request-id"] || "unknown";

  // Log request
  logger.info("Incoming request", {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (body: any) {
    const duration = Date.now() - start;

    logger.info("Outgoing response", {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize: JSON.stringify(body).length,
    });

    return originalJson.call(this, body);
  };

  next();
}
