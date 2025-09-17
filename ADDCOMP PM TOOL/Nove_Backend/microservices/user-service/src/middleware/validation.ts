import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { createApiResponse, createApiError } from "../../../shared/utils";
import { logger } from "../utils/logger";

export function validateRequest(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
        value: detail.context?.value,
      }));

      logger.warn("Validation error:", {
        path: req.path,
        method: req.method,
        errors: errorDetails,
      });

      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("VALIDATION_ERROR", "Invalid request data", {
              errors: errorDetails,
            })
          )
        );
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
}

export function validateQuery(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
        value: detail.context?.value,
      }));

      logger.warn("Query validation error:", {
        path: req.path,
        method: req.method,
        errors: errorDetails,
      });

      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("VALIDATION_ERROR", "Invalid query parameters", {
              errors: errorDetails,
            })
          )
        );
    }

    req.query = value;
    next();
  };
}

export function validateParams(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
        value: detail.context?.value,
      }));

      logger.warn("Params validation error:", {
        path: req.path,
        method: req.method,
        errors: errorDetails,
      });

      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("VALIDATION_ERROR", "Invalid path parameters", {
              errors: errorDetails,
            })
          )
        );
    }

    req.params = value;
    next();
  };
}
