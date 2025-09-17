import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { createApiResponse, createApiError } from "../../../shared/utils";
import { logger } from "../utils/logger";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = req.headers["x-request-id"] || "unknown";

  // Log the error
  logger.error("Unhandled error:", {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    requestId,
  });

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return res
          .status(409)
          .json(
            createApiResponse(
              false,
              null,
              createApiError(
                "DUPLICATE_ENTRY",
                "A record with this information already exists",
                { field: error.meta?.target }
              )
            )
          );

      case "P2025":
        return res
          .status(404)
          .json(
            createApiResponse(
              false,
              null,
              createApiError("RECORD_NOT_FOUND", "Record not found")
            )
          );

      case "P2003":
        return res
          .status(400)
          .json(
            createApiResponse(
              false,
              null,
              createApiError(
                "FOREIGN_KEY_CONSTRAINT",
                "Invalid reference to related record"
              )
            )
          );

      default:
        return res
          .status(500)
          .json(
            createApiResponse(
              false,
              null,
              createApiError("DATABASE_ERROR", "Database operation failed")
            )
          );
    }
  }

  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return res
      .status(400)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("VALIDATION_ERROR", "Invalid data provided", {
            details: error.message,
          })
        )
      );
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    return res
      .status(401)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("INVALID_TOKEN", "Invalid token provided")
        )
      );
  }

  if (error.name === "TokenExpiredError") {
    return res
      .status(401)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("TOKEN_EXPIRED", "Token has expired")
        )
      );
  }

  // Handle validation errors
  if (error.name === "ValidationError") {
    return res
      .status(400)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("VALIDATION_ERROR", "Invalid request data", {
            details: error.message,
          })
        )
      );
  }

  // Handle rate limit errors
  if (error.message.includes("Too many requests")) {
    return res
      .status(429)
      .json(
        createApiResponse(
          false,
          null,
          createApiError(
            "RATE_LIMIT_EXCEEDED",
            "Too many requests, please try again later"
          )
        )
      );
  }

  // Handle CORS errors
  if (error.message.includes("CORS")) {
    return res
      .status(403)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("CORS_ERROR", "CORS policy violation")
        )
      );
  }

  // Default error response
  res
    .status(500)
    .json(
      createApiResponse(
        false,
        null,
        createApiError("INTERNAL_ERROR", "Internal server error", { requestId })
      )
    );
}
