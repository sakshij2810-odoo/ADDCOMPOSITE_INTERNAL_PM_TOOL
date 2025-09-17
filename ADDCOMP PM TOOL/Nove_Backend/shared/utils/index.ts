// Shared utility functions for all microservices

import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ApiResponse, ApiError } from "../types";

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return uuidv4();
}

/**
 * Generate a JWT token
 */
export function generateJwtToken(
  payload: any,
  secret: string,
  expiresIn: string
): string {
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verify a JWT token
 */
export function verifyJwtToken(token: string, secret: string): any {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare a password with its hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a standardized API response
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  error?: ApiError,
  message?: string
): ApiResponse<T> {
  return {
    success,
    data,
    error,
    message,
    timestamp: new Date().toISOString(),
    requestId: generateRequestId(),
  };
}

/**
 * Create a standardized API error
 */
export function createApiError(
  code: string,
  message: string,
  details?: Record<string, any>
): ApiError {
  return {
    code,
    message,
    details,
    timestamp: new Date().toISOString(),
    requestId: generateRequestId(),
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

/**
 * Sanitize string input to prevent injection attacks
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove HTML tags
    .replace(/['"]/g, "") // Remove quotes
    .replace(/[;]/g, "") // Remove semicolons
    .trim();
}

/**
 * Generate a random string
 */
export function generateRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Format date to ISO string
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toISOString();
}

/**
 * Parse date from string
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Check if date is valid
 */
export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100; // Round to 2 decimal places
}

/**
 * Validate allocation percentage (0-100)
 */
export function isValidAllocationPercentage(percentage: number): boolean {
  return percentage >= 0 && percentage <= 100;
}

/**
 * Calculate time difference in hours
 */
export function calculateTimeDifference(
  startTime: Date,
  endTime: Date
): number {
  const diffMs = endTime.getTime() - startTime.getTime();
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
}

/**
 * Generate OTP code
 */
export function generateOTP(length: number = 6): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

/**
 * Check if string is UUID
 */
export function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge objects deeply
 */
export function deepMerge(target: any, source: any): any {
  const result = { ...target };

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

/**
 * Remove undefined values from object
 */
export function removeUndefined(obj: any): any {
  const result: any = {};

  for (const key in obj) {
    if (obj[key] !== undefined) {
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        result[key] = removeUndefined(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }

  return result;
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Generate slug from string
 */
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Check if array is empty
 */
export function isEmptyArray(arr: any[]): boolean {
  return !arr || arr.length === 0;
}

/**
 * Check if object is empty
 */
export function isEmptyObject(obj: any): boolean {
  return !obj || Object.keys(obj).length === 0;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (i === maxRetries - 1) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Sleep function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate pagination metadata
 */
export function generatePaginationMetadata(
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page?: number, limit?: number) {
  const validPage = Math.max(1, page || 1);
  const validLimit = Math.min(100, Math.max(1, limit || 10));

  return {
    page: validPage,
    limit: validLimit,
    offset: (validPage - 1) * validLimit,
  };
}

/**
 * Mask sensitive data
 */
export function maskSensitiveData(data: any, fields: string[]): any {
  const masked = deepClone(data);

  fields.forEach((field) => {
    if (masked[field]) {
      const value = masked[field].toString();
      if (value.length > 4) {
        masked[field] =
          value.substring(0, 2) +
          "*".repeat(value.length - 4) +
          value.substring(value.length - 2);
      } else {
        masked[field] = "*".repeat(value.length);
      }
    }
  });

  return masked;
}

/**
 * Calculate business days between two dates
 */
export function calculateBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not Sunday (0) or Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Check if value is null or undefined
 */
export function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}

/**
 * Get nested property value safely
 */
export function getNestedProperty(
  obj: any,
  path: string,
  defaultValue?: any
): any {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue;
  }, obj);
}

/**
 * Set nested property value safely
 */
export function setNestedProperty(obj: any, path: string, value: any): void {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    return current[key];
  }, obj);

  target[lastKey] = value;
}
