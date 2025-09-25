import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { createApiResponse, createApiError } from "../utils";

const prisma = new PrismaClient();

/**
 * Security middleware for validating user permissions
 */
export class SecurityMiddleware {
  /**
   * Check if user has module access with specific permissions
   */
  static checkModuleAccess = (
    moduleName: string,
    submoduleName?: string,
    requiredPermissions?: string[]
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
        // ADMIN users have full access
        if (req.user.role_value === "ADMIN") {
          return next();
        }

        // Get module security for the user's role
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

        // Check specific permissions
        if (requiredPermissions) {
          for (const permission of requiredPermissions) {
            if (!moduleSecurity[permission as keyof typeof moduleSecurity]) {
              return res
                .status(403)
                .json(
                  createApiResponse(
                    false,
                    null,
                    createApiError(
                      "PERMISSION_DENIED",
                      `Permission denied: ${permission}`
                    )
                  )
                );
            }
          }
        }

        // Check HTTP method permissions
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
        console.error("Security check error:", error);
        return res
          .status(500)
          .json(
            createApiResponse(
              false,
              null,
              createApiError(
                "SECURITY_CHECK_ERROR",
                "Failed to verify permissions"
              )
            )
          );
      }
    };
  };

  /**
   * Check communication permissions (SMS, Email, WhatsApp, Call)
   */
  static checkCommunicationPermissions = (
    communicationType: "sms" | "mail" | "whatsapp" | "call"
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
        // ADMIN users have all communication permissions
        if (req.user.role_value === "ADMIN") {
          return next();
        }

        // Get user's module security for communication
        const moduleSecurity = await prisma.module_security.findMany({
          where: {
            role_uuid: req.user.role_uuid,
            status: "ACTIVE",
            show_module: true,
            [`send_${communicationType}`]: true,
          },
        });

        if (moduleSecurity.length === 0) {
          return res
            .status(403)
            .json(
              createApiResponse(
                false,
                null,
                createApiError(
                  "COMMUNICATION_DENIED",
                  `${communicationType.toUpperCase()} permission denied`
                )
              )
            );
        }

        next();
      } catch (error) {
        console.error("Communication permission check error:", error);
        return res
          .status(500)
          .json(
            createApiResponse(
              false,
              null,
              createApiError(
                "PERMISSION_CHECK_ERROR",
                "Failed to verify communication permissions"
              )
            )
          );
      }
    };
  };

  /**
   * Validate user data access based on filter values
   */
  static validateDataAccess = (tableName: string) => {
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
        // ADMIN users have access to all data
        if (req.user.role_value === "ADMIN") {
          return next();
        }

        // Get module security for the table
        const moduleSecurity = await prisma.module_security.findFirst({
          where: {
            role_uuid: req.user.role_uuid,
            table_name: tableName,
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
                  "DATA_ACCESS_DENIED",
                  `Access denied to ${tableName} data`
                )
              )
            );
        }

        // Apply filter values if they exist
        if (moduleSecurity.filter_values) {
          try {
            const filterValues = JSON.parse(
              moduleSecurity.filter_values as string
            );
            req.dataFilters = filterValues;
          } catch (parseError) {
            console.error("Error parsing filter values:", parseError);
          }
        }

        next();
      } catch (error) {
        console.error("Data access validation error:", error);
        return res
          .status(500)
          .json(
            createApiResponse(
              false,
              null,
              createApiError(
                "DATA_ACCESS_ERROR",
                "Failed to validate data access"
              )
            )
          );
      }
    };
  };

  /**
   * Check if user can perform specific actions
   */
  static checkActionPermission = (action: string) => {
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
        // ADMIN users can perform all actions
        if (req.user.role_value === "ADMIN") {
          return next();
        }

        // Check if user has permission for the specific action
        // This would need to be implemented based on your specific action system
        const hasPermission = await this.checkUserActionPermission(
          req.user.user_uuid,
          action
        );

        if (!hasPermission) {
          return res
            .status(403)
            .json(
              createApiResponse(
                false,
                null,
                createApiError(
                  "ACTION_DENIED",
                  `Permission denied for action: ${action}`
                )
              )
            );
        }

        next();
      } catch (error) {
        console.error("Action permission check error:", error);
        return res
          .status(500)
          .json(
            createApiResponse(
              false,
              null,
              createApiError(
                "PERMISSION_CHECK_ERROR",
                "Failed to verify action permission"
              )
            )
          );
      }
    };
  };

  /**
   * Helper method to check user action permissions
   */
  private static async checkUserActionPermission(
    userUuid: string,
    action: string
  ): Promise<boolean> {
    // Implement your action permission logic here
    // This is a placeholder - you'll need to implement based on your requirements
    return true;
  }
}

/**
 * Rate limiting middleware
 */
export const rateLimit = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || req.connection.remoteAddress || "unknown";
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < windowStart) {
        requests.delete(key);
      }
    }

    const clientRequests = requests.get(clientId);

    if (!clientRequests || clientRequests.resetTime < windowStart) {
      requests.set(clientId, { count: 1, resetTime: now });
      return next();
    }

    if (clientRequests.count >= maxRequests) {
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

    clientRequests.count++;
    next();
  };
};

/**
 * Request logging middleware for security
 */
export const securityLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
      userId: req.user?.user_uuid || "anonymous",
    };

    // Log security-relevant events
    if (res.statusCode >= 400) {
      console.warn("Security Event:", logData);
    } else {
      console.log("Request:", logData);
    }
  });

  next();
};
