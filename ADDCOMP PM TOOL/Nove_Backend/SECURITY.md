# 🔐 Backend Security Implementation

This document outlines the comprehensive security implementation for the PM Platform backend services.

## 🛡️ Security Features

### 1. **JWT Authentication**

- **Token-based authentication** using JSON Web Tokens
- **Automatic token verification** on protected routes
- **Token expiration handling** (24 hours default)
- **Secure token generation** with configurable secrets

### 2. **Role-Based Access Control (RBAC)**

- **ADMIN role** has full system access
- **Module-specific permissions** for non-ADMIN users
- **Granular access control** based on user roles
- **Dynamic permission checking** against database

### 3. **Module Security**

- **25+ module permissions** for comprehensive access control
- **View/Edit permissions** based on HTTP methods
- **Communication permissions** (SMS, Email, WhatsApp, Call)
- **Data filtering** based on user permissions

### 4. **Request Security**

- **CORS protection** enabled
- **Request logging** for security monitoring
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization

## 🚀 Quick Start

### Start Secure Services

```bash
cd ADDCOMP\ PM\ TOOL/Nove_Backend
./start-secure-services.sh
```

### Stop Secure Services

```bash
./stop-secure-services.sh
```

## 📋 Service Endpoints

### Authentication Service (Port 3001)

- `POST /api/v1/authentication/login` - User login
- `GET /api/v1/authentication/profile` - Get user profile (Protected)
- `GET /api/v1/authentication/users` - Get all users (Admin only)
- `GET /api/v1/authentication/module-security` - Get module permissions (Protected)
- `PUT /api/v1/authentication/logout` - User logout (Protected)

### User Service (Port 3002)

- `GET /api/v1/user/get-user` - Get user data (Protected)
- `GET /api/v1/user/profile` - Get user profile (Protected)
- `PUT /api/v1/user/profile` - Update user profile (Protected)
- `GET /api/v1/user/all` - Get all users (Admin only)
- `PUT /api/v1/user/role` - Update user role (Admin only)

## 🔑 Authentication Flow

### 1. Login Process

```javascript
// 1. User sends credentials
POST /api/v1/authentication/login
{
  "email": "developer2haleetech@gmail.com",
  "password": "12345678"
}

// 2. Server validates credentials and returns JWT token
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_uuid": "2d479924-9581-4f5d-abda-e73b7e9d8d83",
      "email": "developer2haleetech@gmail.com",
      "role_value": "ADMIN",
      "module_security": [...]
    }
  }
}
```

### 2. Protected Request

```javascript
// Include JWT token in Authorization header
GET /api/v1/user/profile
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🛡️ Security Middleware

### Authentication Middleware

```typescript
import { authenticateToken } from "../shared/middleware/auth";

// Protect routes with authentication
app.get("/protected-route", authenticateToken, (req, res) => {
  // req.user contains authenticated user data
  res.json({ user: req.user });
});
```

### Role-Based Authorization

```typescript
import { requireAdmin, requireRole } from "../shared/middleware/auth";

// Admin only routes
app.get("/admin-only", authenticateToken, requireAdmin, (req, res) => {
  // Only ADMIN users can access
});

// Multiple roles
app.get(
  "/manager-or-admin",
  authenticateToken,
  requireRole(["ADMIN", "MANAGER"]),
  (req, res) => {
    // ADMIN or MANAGER users can access
  }
);
```

### Module Security

```typescript
import { requireModuleAccess } from "../shared/middleware/auth";

// Module-specific access
app.get(
  "/users",
  authenticateToken,
  requireModuleAccess("Users", "Users"),
  (req, res) => {
    // Only users with Users module access can reach here
  }
);
```

## 🔒 Module Security Configuration

### Available Modules

1. **Tasks** - Taskboard
2. **Users** - Users, Change Role, Assignee
3. **Security** - Security, Role Group
4. **Data Management** - Branch, Zone
5. **LEAD** - LEAD, All Leads
6. **COMPANY INFORMATION** - Company Information
7. **NOC CODE** - NOC Code
8. **CUSTOMER** - Customer, Personal Information, Invoice & Payment, Services, Retainer
9. **QUESTIONNAIRE** - Questions, Options, Answers, Questionnaire
10. **Conversation** - Conversation, Chat Messages, Participants
11. **Setting** - Customer Automation, Template, Workflow
12. **Service** - Service

### Permission Types

- **show_module**: Can see the module in UI
- **view_access**: Can view data (GET requests)
- **edit_access**: Can create/update/delete data (POST/PUT/DELETE)
- **send_sms**: Can send SMS notifications
- **send_mail**: Can send email notifications
- **send_whatsapp**: Can send WhatsApp messages
- **send_call**: Can make phone calls

## 🚨 Error Handling

### Authentication Errors

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Access token is required"
  }
}
```

### Authorization Errors

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied. Required roles: ADMIN"
  }
}
```

### Module Access Errors

```json
{
  "success": false,
  "error": {
    "code": "MODULE_ACCESS_DENIED",
    "message": "Access denied to Users - Users"
  }
}
```

## 🔧 Configuration

### Environment Variables

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/pm_platform_db

# Service Ports
AUTH_SERVICE_PORT=3001
USER_SERVICE_PORT=3002
TASK_SERVICE_PORT=3003
PROJECT_SERVICE_PORT=3004
LEADS_SERVICE_PORT=3005
COMPANY_SERVICE_PORT=3006
ANALYTICS_SERVICE_PORT=3007
API_GATEWAY_PORT=3008
```

## 📊 Monitoring & Logging

### Security Logs

- **Authentication attempts** (success/failure)
- **Authorization failures** (access denied)
- **Module access violations**
- **Rate limiting triggers**
- **Suspicious activity patterns**

### Log Locations

- `logs/secure-auth-server.log` - Authentication service logs
- `logs/secure-user-server.log` - User service logs
- `logs/working-task-server.log` - Task service logs
- `logs/working-project-server.log` - Project service logs

## 🧪 Testing Security

### Test Authentication

```bash
# Test login
curl -X POST http://localhost:3001/api/v1/authentication/login \
  -H "Content-Type: application/json" \
  -d '{"email":"developer2haleetech@gmail.com","password":"12345678"}'

# Test protected endpoint
curl -X GET http://localhost:3001/api/v1/authentication/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Authorization

```bash
# Test admin endpoint (should work for ADMIN users)
curl -X GET http://localhost:3002/api/v1/user/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test non-admin endpoint (should work for all authenticated users)
curl -X GET http://localhost:3002/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Deployment

### Production Considerations

1. **Change JWT_SECRET** to a strong, random value
2. **Use HTTPS** for all communications
3. **Configure proper CORS** for your domain
4. **Set up monitoring** and alerting
5. **Regular security audits** of logs
6. **Database security** with proper user permissions

### Docker Deployment

```dockerfile
# Example Dockerfile for secure services
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001-3008
CMD ["./start-secure-services.sh"]
```

## 🔍 Troubleshooting

### Common Issues

1. **"UNAUTHORIZED" errors**

   - Check if JWT token is included in Authorization header
   - Verify token hasn't expired
   - Ensure JWT_SECRET matches between services

2. **"FORBIDDEN" errors**

   - Verify user has correct role
   - Check if user has module permissions
   - Ensure user is active in database

3. **"MODULE_ACCESS_DENIED" errors**
   - Check module_security table for user's role
   - Verify module_name and submodule_name match
   - Ensure status is 'ACTIVE'

### Debug Mode

```bash
# Enable debug logging
export DEBUG=security:*
./start-secure-services.sh
```

## 📚 API Documentation

For complete API documentation, see:

- Authentication API: `http://localhost:3001/health`
- User API: `http://localhost:3002/health`
- All services provide health check endpoints

## 🛡️ Security Best Practices

1. **Always use HTTPS** in production
2. **Rotate JWT secrets** regularly
3. **Monitor failed login attempts**
4. **Implement rate limiting** on sensitive endpoints
5. **Log all security events** for audit trails
6. **Regular security updates** of dependencies
7. **Database connection encryption**
8. **Input validation** on all endpoints
9. **SQL injection prevention** with parameterized queries
10. **XSS protection** with proper headers

---

**🛡️ Security is a shared responsibility. Keep your secrets safe and monitor your logs regularly!**
