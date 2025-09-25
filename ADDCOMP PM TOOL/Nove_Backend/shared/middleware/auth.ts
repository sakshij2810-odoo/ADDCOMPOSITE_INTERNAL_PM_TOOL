import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { createApiResponse, createApiError } from "../utils";

const prisma = new PrismaClient();

// Extend Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        user_uuid: string;
        email: string;
        role_value: string;
        role_uuid: string;
        first_name: string;
        last_name: string;
        full_name: string;
        status: string;
      };
    }
  }
}

/**
 * JWT Authentication Middleware
 * Verifies JWT token and extracts user information
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "Access token is required")
          )
        );
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, jwtSecret) as any;

    if (!decoded.user_uuid) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("INVALID_TOKEN", "Invalid token payload")
          )
        );
    }

    // Fetch user details from database
    const user = await prisma.users.findFirst({
      where: {
        user_uuid: decoded.user_uuid,
        status: "ACTIVE",
      },
      select: {
        user_uuid: true,
        email: true,
        role_value: true,
        role_uuid: true,
        first_name: true,
        last_name: true,
        full_name: true,
        status: true,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("USER_NOT_FOUND", "User not found or inactive")
          )
        );
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("INVALID_TOKEN", "Invalid or malformed token")
          )
        );
    }

    if (error instanceof jwt.TokenExpiredError) {
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

    return res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("AUTH_ERROR", "Authentication failed")
        )
      );
  }
};

/**
 * Role-based Authorization Middleware
 * Checks if user has required role
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User not authenticated")
          )
        );
    }

    if (!allowedRoles.includes(req.user.role_value)) {
      return res
        .status(403)
        .json(
          createApiResponse(
            false,
            null,
            createApiError(
              "FORBIDDEN",
              `Access denied. Required roles: ${allowedRoles.join(", ")}`
            )
          )
        );
    }

    next();
  };
};

/**
 * Module Security Middleware
 * Checks if user has access to specific module
 */
export const requireModuleAccess = (
  moduleName: string,
  submoduleName?: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User not authenticated")
          )
        );
    }

    try {
      // For ADMIN users, allow all module access
      if (req.user.role_value === "ADMIN") {
        return next();
      }

      // Check module security for non-ADMIN users
      const moduleSecurity = await prisma.module_security.findFirst({
        where: {
          role_uuid: req.user.role_uuid,
          module_name: moduleName,
          ...(submoduleName && { submodule_name: submoduleName }),
          status: "ACTIVE",
          show_module: true,
        },
      });

      if (!moduleSecurity) {
        return res
          .status(403)
          .json(
            createApiResponse(
              false,
              null,
              createApiError(
                "MODULE_ACCESS_DENIED",
                `Access denied to ${moduleName}${
                  submoduleName ? ` - ${submoduleName}` : ""
                }`
              )
            )
          );
      }

      // Check view access for GET requests
      if (req.method === "GET" && !moduleSecurity.view_access) {
        return res
          .status(403)
          .json(
            createApiResponse(
              false,
              null,
              createApiError(
                "VIEW_ACCESS_DENIED",
                `View access denied to ${moduleName}`
              )
            )
          );
      }

      // Check edit access for POST, PUT, DELETE requests
      if (
        ["POST", "PUT", "DELETE"].includes(req.method) &&
        !moduleSecurity.edit_access
      ) {
        return res
          .status(403)
          .json(
            createApiResponse(
              false,
              null,
              createApiError(
                "EDIT_ACCESS_DENIED",
                `Edit access denied to ${moduleName}`
              )
            )
          );
      }

      next();
    } catch (error) {
      console.error("Module security check error:", error);
      return res
        .status(500)
        .json(
          createApiResponse(
            false,
            null,
            createApiError(
              "SECURITY_CHECK_ERROR",
              "Failed to verify module access"
            )
          )
        );
    }
  };
};

/**
 * Admin Only Middleware
 * Restricts access to ADMIN users only
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res
      .status(401)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("UNAUTHORIZED", "User not authenticated")
        )
      );
  }

  if (req.user.role_value !== "ADMIN") {
    return res
      .status(403)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("ADMIN_REQUIRED", "Admin access required")
        )
      );
  }

  next();
};

/**
 * Optional Authentication Middleware
 * Authenticates user if token is provided, but doesn't require it
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
      const decoded = jwt.verify(token, jwtSecret) as any;

      if (decoded.user_uuid) {
        const user = await prisma.users.findFirst({
          where: {
            user_uuid: decoded.user_uuid,
            status: "ACTIVE",
          },
          select: {
            user_uuid: true,
            email: true,
            role_value: true,
            role_uuid: true,
            first_name: true,
            last_name: true,
            full_name: true,
            status: true,
          },
        });

        if (user) {
          req.user = user;
        }
      }
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log("Optional auth failed:", error.message);
  }

  next();
};
