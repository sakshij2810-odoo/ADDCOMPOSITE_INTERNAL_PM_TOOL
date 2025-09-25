// Shared configuration for all microservices

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export interface Config {
  // Environment
  nodeEnv: string;
  port: number;

  // Database
  database: {
    url: string;
    maxConnections: number;
    ssl: boolean;
  };

  // Redis
  redis: {
    url: string;
    password?: string;
    db: number;
  };

  // Google OAuth
  google: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string[];
  };

  // Nova World Group API
  nova: {
    baseUrl: string;
    apiKey: string;
    timeout: number;
  };

  // JWT
  jwt: {
    secret: string;
    expiresIn: string;
  };

  // Service Discovery
  consul: {
    host: string;
    port: number;
  };

  // API Gateway
  apiGateway: {
    url: string;
  };

  // Microservices
  services: {
    auth: string;
    user: string;
    project: string;
    task: string;
    analytics: string;
    file: string;
    notification: string;
    integration: string;
    reporting: string;
  };

  // Google APIs
  googleApis: {
    drive: {
      apiKey: string;
    };
    calendar: {
      apiKey: string;
    };
    chat: {
      apiKey: string;
    };
  };

  // File Storage
  storage: {
    googleCloud: {
      bucket: string;
    };
    aws: {
      bucket: string;
      accessKeyId: string;
      secretAccessKey: string;
    };
  };

  // Email
  email: {
    sendgrid: {
      apiKey: string;
    };
    fromEmail: string;
  };

  // Monitoring
  monitoring: {
    prometheus: {
      port: number;
    };
    grafana: {
      port: number;
    };
  };

  // Logging
  logging: {
    level: string;
    format: string;
  };

  // Security
  security: {
    corsOrigin: string;
    rateLimit: {
      windowMs: number;
      maxRequests: number;
    };
  };

  // Feature Flags
  features: {
    googleIntegration: boolean;
    novaIntegration: boolean;
    realTimeNotifications: boolean;
    analytics: boolean;
  };
}

const config: Config = {
  // Environment
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),

  // Database
  database: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://user:password@localhost:5432/pm_platform",
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || "10", 10),
    ssl: process.env.DB_SSL === "true",
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || "0", 10),
  },

  // Google OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ||
      "http://localhost:3000/auth/google/callback",
    scopes: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/chat.readonly",
    ],
  },

  // Local API Gateway
  nova: {
    baseUrl: process.env.NOVA_API_BASE_URL || "http://localhost:3000",
    apiKey: process.env.NOVA_API_KEY || "",
    timeout: parseInt(process.env.NOVA_API_TIMEOUT || "10000", 10),
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },

  // Service Discovery
  consul: {
    host: process.env.CONSUL_HOST || "localhost",
    port: parseInt(process.env.CONSUL_PORT || "8500", 10),
  },

  // API Gateway
  apiGateway: {
    url: process.env.API_GATEWAY_URL || "http://localhost:8000",
  },

  // Microservices
  services: {
    auth: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    user: process.env.USER_SERVICE_URL || "http://localhost:3002",
    project: process.env.PROJECT_SERVICE_URL || "http://localhost:3003",
    task: process.env.TASK_SERVICE_URL || "http://localhost:3004",
    analytics: process.env.ANALYTICS_SERVICE_URL || "http://localhost:3005",
    file: process.env.FILE_SERVICE_URL || "http://localhost:3006",
    notification:
      process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3007",
    integration: process.env.INTEGRATION_SERVICE_URL || "http://localhost:3008",
    reporting: process.env.REPORTING_SERVICE_URL || "http://localhost:3009",
  },

  // Google APIs
  googleApis: {
    drive: {
      apiKey: process.env.GOOGLE_DRIVE_API_KEY || "",
    },
    calendar: {
      apiKey: process.env.GOOGLE_CALENDAR_API_KEY || "",
    },
    chat: {
      apiKey: process.env.GOOGLE_CHAT_API_KEY || "",
    },
  },

  // File Storage
  storage: {
    googleCloud: {
      bucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET || "",
    },
    aws: {
      bucket: process.env.AWS_S3_BUCKET || "",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  },

  // Email
  email: {
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || "",
    },
    fromEmail: process.env.FROM_EMAIL || "noreply@addcomposites.com",
  },

  // Monitoring
  monitoring: {
    prometheus: {
      port: parseInt(process.env.PROMETHEUS_PORT || "9090", 10),
    },
    grafana: {
      port: parseInt(process.env.GRAFANA_PORT || "3000", 10),
    },
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "json",
  },

  // Security
  security: {
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
    },
  },

  // Feature Flags
  features: {
    googleIntegration: process.env.ENABLE_GOOGLE_INTEGRATION === "true",
    novaIntegration: process.env.ENABLE_NOVA_INTEGRATION === "true",
    realTimeNotifications:
      process.env.ENABLE_REAL_TIME_NOTIFICATIONS === "true",
    analytics: process.env.ENABLE_ANALYTICS === "true",
  },
};

// Validation function
export function validateConfig(): void {
  const requiredEnvVars = [
    "DATABASE_URL",
    "JWT_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  // Validate URLs
  try {
    new URL(config.database.url);
  } catch (error) {
    throw new Error("Invalid DATABASE_URL format");
  }

  try {
    new URL(config.redis.url);
  } catch (error) {
    throw new Error("Invalid REDIS_URL format");
  }

  // Validate numeric values
  if (config.port < 1 || config.port > 65535) {
    throw new Error("Invalid PORT value");
  }

  if (config.database.maxConnections < 1) {
    throw new Error("Invalid DB_MAX_CONNECTIONS value");
  }

  if (config.redis.db < 0) {
    throw new Error("Invalid REDIS_DB value");
  }
}

// Service configuration helper
export function getServiceConfig(serviceName: string) {
  const serviceUrl =
    config.services[serviceName as keyof typeof config.services];

  if (!serviceUrl) {
    throw new Error(`Unknown service: ${serviceName}`);
  }

  return {
    name: serviceName,
    url: serviceUrl,
    healthCheckPath: "/health",
  };
}

// Database configuration helper
export function getDatabaseConfig() {
  return {
    url: config.database.url,
    maxConnections: config.database.maxConnections,
    ssl: config.database.ssl,
  };
}

// Redis configuration helper
export function getRedisConfig() {
  return {
    url: config.redis.url,
    password: config.redis.password,
    db: config.redis.db,
  };
}

// Google configuration helper
export function getGoogleConfig() {
  return {
    clientId: config.google.clientId,
    clientSecret: config.google.clientSecret,
    redirectUri: config.google.redirectUri,
    scopes: config.google.scopes,
  };
}

// Nova configuration helper
export function getNovaConfig() {
  return {
    baseUrl: config.nova.baseUrl,
    apiKey: config.nova.apiKey,
    timeout: config.nova.timeout,
  };
}

// JWT configuration helper
export function getJwtConfig() {
  return {
    secret: config.jwt.secret,
    expiresIn: config.jwt.expiresIn,
  };
}

// Feature flag helper
export function isFeatureEnabled(
  feature: keyof typeof config.features
): boolean {
  return config.features[feature];
}

export default config;
