// Export all security middleware
export * from "./auth";
export * from "./security";

// Re-export commonly used middleware with shorter names
export {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireModuleAccess,
  optionalAuth,
} from "./auth";

export { SecurityMiddleware, rateLimit, securityLogger } from "./security";
