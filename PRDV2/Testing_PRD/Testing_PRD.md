# Testing PRD - AI-Powered Project Management Platform (PRDV2)

**Version:** 2.0  
**Date:** January 2025  
**Author:** Sakshi Jadhav  
**Stakeholders:** Pravin Luthada, Development Team  
**Based on:** Nove_Frontend Project Structure & Meeting Requirements

---

## 1. Executive Summary

### 1.1 Testing Overview

This document outlines the comprehensive testing strategy for the AI-Powered Project Management Platform (PRDV2), built on the proven Nove_Frontend architecture with enhanced project management capabilities. The testing approach ensures reliability, performance, and user satisfaction for the 20-person team.

### 1.2 Key Testing Requirements

- **Human Resource Optimization:** Verify daily task generation works correctly
- **Google Integration:** Test seamless integration with Google ecosystem
- **Mobile SDK:** Ensure mobile app functions properly for daily users
- **Performance:** Validate system performance under load
- **Security:** Comprehensive security testing
- **User Experience:** Test simplified interfaces for different user roles

---

## 2. Testing Strategy

### 2.1 Testing Pyramid

```
                    ┌─────────────────┐
                    │   E2E Tests     │ ← 10% (Critical user journeys)
                    │   (Cypress)     │
                    └─────────────────┘
                ┌─────────────────────────┐
                │   Integration Tests     │ ← 20% (API & Service integration)
                │   (Jest + Supertest)   │
                └─────────────────────────┘
        ┌─────────────────────────────────────────┐
        │           Unit Tests                    │ ← 70% (Components & Functions)
        │        (Jest + React Testing Library)   │
        └─────────────────────────────────────────┘
```

### 2.2 Testing Types

#### 2.2.1 Unit Testing

- **Frontend Components:** React components with React Testing Library
- **Backend Functions:** API endpoints and business logic
- **Database Operations:** Prisma queries and migrations
- **Utility Functions:** Helper functions and calculations

#### 2.2.2 Integration Testing

- **API Integration:** End-to-end API testing
- **Database Integration:** Database operations and transactions
- **Google APIs:** Google Drive, Calendar, Chat integration
- **Authentication:** OAuth flow and session management

#### 2.2.3 End-to-End Testing

- **User Journeys:** Complete user workflows
- **Cross-browser:** Chrome, Firefox, Safari, Edge
- **Mobile Testing:** iOS and Android devices
- **Performance:** Load and stress testing

---

## 3. Frontend Testing

### 3.1 Component Testing

#### 3.1.1 Testing Setup

```typescript
// setupTests.ts
import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";
import { server } from "./mocks/server";

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

configure({ testIdAttribute: "data-testid" });
```

#### 3.1.2 Component Test Examples

```typescript
// TaskCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../store";
import TaskCard from "./TaskCard";

const mockTask = {
  id: "1",
  title: "Implement user authentication",
  projectName: "Customer Portal",
  priority: "high",
  status: "todo",
  dueDate: "2025-01-15",
};

describe("TaskCard", () => {
  it("renders task information correctly", () => {
    render(
      <Provider store={store}>
        <TaskCard task={mockTask} />
      </Provider>
    );

    expect(
      screen.getByText("Implement user authentication")
    ).toBeInTheDocument();
    expect(screen.getByText("Customer Portal")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
  });

  it("calls onComplete when complete button is clicked", () => {
    const onComplete = jest.fn();

    render(
      <Provider store={store}>
        <TaskCard task={mockTask} onComplete={onComplete} />
      </Provider>
    );

    fireEvent.click(screen.getByText("Complete"));
    expect(onComplete).toHaveBeenCalledWith("1");
  });

  it("displays timer when task is in progress", () => {
    const inProgressTask = { ...mockTask, status: "in_progress" };

    render(
      <Provider store={store}>
        <TaskCard task={inProgressTask} />
      </Provider>
    );

    expect(screen.getByText("00:00:00")).toBeInTheDocument();
    expect(screen.getByText("Stop Timer")).toBeInTheDocument();
  });
});
```

#### 3.1.3 Mobile Component Testing

```typescript
// MobileTaskCard.test.tsx
import { render, screen } from "@testing-library/react-native";
import MobileTaskCard from "./MobileTaskCard";

const mockTask = {
  id: "1",
  title: "Implement user authentication",
  projectName: "Customer Portal",
  priority: "high",
  timeSpent: 25.5,
};

describe("MobileTaskCard", () => {
  it("renders mobile task card correctly", () => {
    render(<MobileTaskCard task={mockTask} />);

    expect(screen.getByText("Implement user authentication")).toBeTruthy();
    expect(screen.getByText("Customer Portal")).toBeTruthy();
    expect(screen.getByText("25.5%")).toBeTruthy();
  });

  it("shows timer controls for active task", () => {
    const activeTask = { ...mockTask, isActive: true };
    render(<MobileTaskCard task={activeTask} />);

    expect(screen.getByText("Stop Timer")).toBeTruthy();
  });
});
```

### 3.2 Redux Testing

#### 3.2.1 Store Testing

```typescript
// store.test.ts
import { store } from "./store";
import { fetchDailyTasks, completeTask } from "./slices/tasksSlice";

describe("Tasks Store", () => {
  it("should handle fetchDailyTasks.pending", () => {
    const action = { type: fetchDailyTasks.pending.type };
    const state = store.getState();

    expect(state.tasks.isLoading).toBe(false);

    store.dispatch(action);
    const newState = store.getState();

    expect(newState.tasks.isLoading).toBe(true);
  });

  it("should handle completeTask", () => {
    const initialState = {
      tasks: {
        dailyTasks: [
          { id: "1", title: "Task 1", status: "pending" },
          { id: "2", title: "Task 2", status: "pending" },
        ],
      },
    };

    store.dispatch(completeTask("1"));
    const state = store.getState();

    expect(state.tasks.dailyTasks[0].status).toBe("completed");
    expect(state.tasks.dailyTasks[1].status).toBe("pending");
  });
});
```

### 3.3 API Integration Testing

#### 3.3.1 API Service Testing

```typescript
// api.test.ts
import { taskApi, projectApi } from "../services/api";
import { server } from "./mocks/server";
import { rest } from "msw";

describe("API Services", () => {
  it("fetches daily tasks successfully", async () => {
    const mockTasks = [
      { id: "1", title: "Task 1", status: "pending" },
      { id: "2", title: "Task 2", status: "pending" },
    ];

    server.use(
      rest.get("/api/v1/daily-tasks", (req, res, ctx) => {
        return res(ctx.json({ data: mockTasks }));
      })
    );

    const result = await taskApi.fetchDailyTasks("2025-01-15");
    expect(result.data).toEqual(mockTasks);
  });

  it("handles API errors gracefully", async () => {
    server.use(
      rest.get("/api/v1/daily-tasks", (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: "Internal Server Error" })
        );
      })
    );

    await expect(taskApi.fetchDailyTasks("2025-01-15")).rejects.toThrow();
  });
});
```

---

## 4. Backend Testing

### 4.1 API Endpoint Testing

#### 4.1.1 Express Route Testing

```typescript
// routes/tasks.test.ts
import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Tasks API", () => {
  beforeEach(async () => {
    // Clean up database
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/v1/tasks", () => {
    it("creates a new task successfully", async () => {
      const taskData = {
        title: "Test Task",
        description: "Test Description",
        projectId: "project-id",
        assignedTo: "user-id",
        priority: "high",
      };

      const response = await request(app)
        .post("/api/v1/tasks")
        .send(taskData)
        .expect(201);

      expect(response.body.data.title).toBe("Test Task");
      expect(response.body.data.priority).toBe("high");
    });

    it("validates required fields", async () => {
      const response = await request(app)
        .post("/api/v1/tasks")
        .send({})
        .expect(400);

      expect(response.body.error.message).toContain("validation");
    });
  });

  describe("GET /api/v1/daily-tasks", () => {
    it("returns daily tasks for user", async () => {
      // Setup test data
      const user = await prisma.user.create({
        data: {
          googleId: "test-google-id",
          email: "test@example.com",
          name: "Test User",
          role: "employee",
        },
      });

      const project = await prisma.project.create({
        data: {
          name: "Test Project",
          projectManagerId: user.id,
          googleDriveFolderId: "folder-id",
        },
      });

      const task = await prisma.task.create({
        data: {
          title: "Daily Task",
          projectId: project.id,
          assignedTo: user.id,
          priority: "high",
        },
      });

      const response = await request(app)
        .get("/api/v1/daily-tasks")
        .query({ date: "2025-01-15" })
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe("Daily Task");
    });
  });
});
```

### 4.2 Database Testing

#### 4.2.1 Prisma Testing

```typescript
// database/tasks.test.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Task Database Operations", () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
  });

  it("creates task with valid data", async () => {
    const user = await prisma.user.create({
      data: {
        googleId: "test-id",
        email: "test@example.com",
        name: "Test User",
        role: "employee",
      },
    });

    const project = await prisma.project.create({
      data: {
        name: "Test Project",
        projectManagerId: user.id,
        googleDriveFolderId: "folder-id",
      },
    });

    const task = await prisma.task.create({
      data: {
        title: "Test Task",
        projectId: project.id,
        assignedTo: user.id,
        priority: "high",
      },
    });

    expect(task.id).toBeDefined();
    expect(task.title).toBe("Test Task");
    expect(task.priority).toBe("high");
  });

  it("prevents duplicate daily tasks", async () => {
    const user = await prisma.user.create({
      data: {
        googleId: "test-id",
        email: "test@example.com",
        name: "Test User",
        role: "employee",
      },
    });

    const task = await prisma.task.create({
      data: {
        title: "Test Task",
        projectId: "project-id",
        assignedTo: user.id,
        priority: "high",
      },
    });

    // Create first daily task
    await prisma.dailyTask.create({
      data: {
        userId: user.id,
        taskId: task.id,
        date: new Date("2025-01-15"),
        status: "pending",
      },
    });

    // Attempt to create duplicate
    await expect(
      prisma.dailyTask.create({
        data: {
          userId: user.id,
          taskId: task.id,
          date: new Date("2025-01-15"),
          status: "pending",
        },
      })
    ).rejects.toThrow();
  });
});
```

### 4.3 Google Integration Testing

#### 4.3.1 Google APIs Testing

```typescript
// integrations/google.test.ts
import { googleDriveService, googleCalendarService } from "../services/google";

// Mock Google APIs
jest.mock("googleapis", () => ({
  google: {
    drive: jest.fn(() => ({
      files: {
        list: jest.fn().mockResolvedValue({
          data: {
            files: [
              {
                id: "1",
                name: "Project Folder",
                mimeType: "application/vnd.google-apps.folder",
              },
            ],
          },
        }),
      },
    })),
    calendar: jest.fn(() => ({
      freebusy: {
        query: jest.fn().mockResolvedValue({
          data: {
            calendars: {
              "user@example.com": {
                busy: [
                  {
                    start: "2025-01-15T09:00:00Z",
                    end: "2025-01-15T17:00:00Z",
                  },
                ],
              },
            },
          },
        }),
      },
    })),
  },
}));

describe("Google Integration", () => {
  it("fetches Google Drive folders", async () => {
    const folders = await googleDriveService.getFolders();

    expect(folders.data.files).toHaveLength(1);
    expect(folders.data.files[0].name).toBe("Project Folder");
  });

  it("checks user availability", async () => {
    const availability = await googleCalendarService.getAvailability(
      "user@example.com",
      {
        start: new Date("2025-01-15T00:00:00Z"),
        end: new Date("2025-01-15T23:59:59Z"),
      }
    );

    expect(availability.data.calendars["user@example.com"].busy).toHaveLength(
      1
    );
  });
});
```

---

## 5. End-to-End Testing

### 5.1 Cypress Testing

#### 5.1.1 E2E Test Setup

```typescript
// cypress/support/commands.ts
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/auth/sign-in");
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="sign-in-button"]').click();
  cy.url().should("include", "/dashboard");
});

Cypress.Commands.add("createProject", (projectData: any) => {
  cy.visit("/projects/create");
  cy.get('[data-testid="project-name"]').type(projectData.name);
  cy.get('[data-testid="project-description"]').type(projectData.description);
  cy.get('[data-testid="project-priority"]').select(projectData.priority);
  cy.get('[data-testid="submit-button"]').click();
  cy.url().should("include", "/projects/");
});
```

#### 5.1.2 Critical User Journeys

```typescript
// cypress/e2e/daily-task-flow.cy.ts
describe("Daily Task Flow", () => {
  beforeEach(() => {
    cy.login("employee@addcomposites.com", "password");
  });

  it("completes daily task workflow", () => {
    // Navigate to daily tasks
    cy.visit("/mobile/tasks/today");

    // Verify task is displayed
    cy.get('[data-testid="task-card"]').should("have.length.at.least", 1);
    cy.get('[data-testid="task-title"]').first().should("contain", "Implement");

    // Start timer
    cy.get('[data-testid="start-timer"]').first().click();
    cy.get('[data-testid="timer-display"]').should("be.visible");

    // Complete task
    cy.get('[data-testid="complete-task"]').first().click();
    cy.get('[data-testid="task-status"]').should("contain", "completed");

    // Verify task is marked as completed
    cy.get('[data-testid="completed-tasks"]').should("contain", "Implement");
  });

  it("requests task reallocation", () => {
    cy.visit("/mobile/tasks/reallocate");

    // Select current task
    cy.get('[data-testid="current-task"]').first().click();

    // Provide reason
    cy.get('[data-testid="reallocation-reason"]').type(
      "Need different type of work"
    );

    // Submit request
    cy.get('[data-testid="submit-request"]').click();

    // Verify success message
    cy.get('[data-testid="success-message"]').should(
      "contain",
      "Request submitted"
    );
  });
});
```

#### 5.1.3 Project Management Flow

```typescript
// cypress/e2e/project-management.cy.ts
describe("Project Management", () => {
  beforeEach(() => {
    cy.login("manager@addcomposites.com", "password");
  });

  it("creates and manages project", () => {
    // Create new project
    cy.createProject({
      name: "Test Project",
      description: "Test project description",
      priority: "high",
    });

    // Add tasks to project
    cy.get('[data-testid="add-task"]').click();
    cy.get('[data-testid="task-title"]').type("Implement authentication");
    cy.get('[data-testid="task-assignee"]').select(
      "employee@addcomposites.com"
    );
    cy.get('[data-testid="task-priority"]').select("high");
    cy.get('[data-testid="save-task"]').click();

    // Verify task is created
    cy.get('[data-testid="task-list"]').should(
      "contain",
      "Implement authentication"
    );

    // Allocate resources
    cy.visit("/projects/test-project-id/resources");
    cy.get('[data-testid="allocate-resource"]').click();
    cy.get('[data-testid="resource-user"]').select(
      "employee@addcomposites.com"
    );
    cy.get('[data-testid="allocation-percentage"]').type("50");
    cy.get('[data-testid="save-allocation"]').click();

    // Verify allocation
    cy.get('[data-testid="resource-matrix"]').should("contain", "50%");
  });
});
```

### 5.2 Mobile Testing

#### 5.2.1 React Native Testing

```typescript
// mobile/__tests__/MobileApp.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import MobileApp from "../App";

const MockedMobileApp = () => (
  <NavigationContainer>
    <MobileApp />
  </NavigationContainer>
);

describe("Mobile App", () => {
  it("navigates between screens", async () => {
    const { getByText } = render(<MockedMobileApp />);

    // Navigate to tasks
    fireEvent.press(getByText("Tasks"));
    await waitFor(() => {
      expect(getByText("Today's Tasks")).toBeTruthy();
    });

    // Navigate to profile
    fireEvent.press(getByText("Profile"));
    await waitFor(() => {
      expect(getByText("User Profile")).toBeTruthy();
    });
  });

  it("handles offline mode", async () => {
    // Mock offline state
    jest.spyOn(navigator, "onLine", "get").mockReturnValue(false);

    const { getByText } = render(<MockedMobileApp />);

    expect(getByText("Offline Mode")).toBeTruthy();
  });
});
```

---

## 6. Performance Testing

### 6.1 Load Testing

#### 6.1.1 Artillery Configuration

```yaml
# artillery-load-test.yml
config:
  target: "https://api.pm.addcomposites.com"
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 10
  variables:
    userId: "user-{{ $randomString() }}"
    projectId: "project-{{ $randomString() }}"

scenarios:
  - name: "Daily Task Flow"
    weight: 40
    flow:
      - post:
          url: "/api/v1/auth/google"
          json:
            token: "{{ $randomString() }}"
      - get:
          url: "/api/v1/daily-tasks"
          qs:
            date: "2025-01-15"
      - post:
          url: "/api/v1/daily-tasks/1/timer"
          json:
            action: "start"
      - post:
          url: "/api/v1/daily-tasks/1/complete"

  - name: "Project Management"
    weight: 30
    flow:
      - get:
          url: "/api/v1/projects"
      - post:
          url: "/api/v1/projects"
          json:
            name: "Load Test Project {{ $randomString() }}"
            description: "Test project"
            priority: "medium"
      - get:
          url: "/api/v1/projects/{{ projectId }}/tasks"

  - name: "Resource Allocation"
    weight: 30
    flow:
      - get:
          url: "/api/v1/resources/availability"
      - post:
          url: "/api/v1/resources/allocate"
          json:
            projectId: "{{ projectId }}"
            userId: "{{ userId }}"
            allocationPercentage: 50
```

### 6.2 Stress Testing

#### 6.2.1 K6 Stress Test

```javascript
// stress-test.js
import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "2m", target: 100 },
    { duration: "5m", target: 100 },
    { duration: "2m", target: 200 },
    { duration: "5m", target: 200 },
    { duration: "2m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<200"],
    http_req_failed: ["rate<0.1"],
  },
};

export default function () {
  // Test daily tasks endpoint
  let response = http.get(
    "https://api.pm.addcomposites.com/api/v1/daily-tasks?date=2025-01-15"
  );
  check(response, {
    "status is 200": (r) => r.status === 200,
    "response time < 200ms": (r) => r.timings.duration < 200,
  });

  // Test project creation
  let projectData = {
    name: `Stress Test Project ${Math.random()}`,
    description: "Stress test project",
    priority: "medium",
  };

  response = http.post(
    "https://api.pm.addcomposites.com/api/v1/projects",
    JSON.stringify(projectData),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(response, {
    "project created successfully": (r) => r.status === 201,
  });

  sleep(1);
}
```

---

## 7. Security Testing

### 7.1 Authentication Testing

#### 7.1.1 OAuth Testing

```typescript
// security/auth.test.ts
import request from "supertest";
import app from "../app";

describe("Authentication Security", () => {
  it("rejects invalid tokens", async () => {
    const response = await request(app)
      .get("/api/v1/projects")
      .set("Authorization", "Bearer invalid-token")
      .expect(401);

    expect(response.body.error.message).toContain("Invalid token");
  });

  it("requires authentication for protected routes", async () => {
    await request(app).get("/api/v1/projects").expect(401);
  });

  it("validates Google OAuth tokens", async () => {
    // Mock Google OAuth verification
    const mockGoogleUser = {
      sub: "google-user-id",
      email: "user@example.com",
      name: "Test User",
    };

    const response = await request(app)
      .post("/api/v1/auth/google")
      .send({ token: "valid-google-token" })
      .expect(200);

    expect(response.body.data.user.email).toBe("user@example.com");
  });
});
```

### 7.2 Authorization Testing

#### 7.2.1 Role-Based Access Control

```typescript
// security/rbac.test.ts
describe("Role-Based Access Control", () => {
  let employeeToken: string;
  let managerToken: string;
  let adminToken: string;

  beforeEach(async () => {
    // Setup test users and tokens
    employeeToken = await createTestUser("employee");
    managerToken = await createTestUser("project_manager");
    adminToken = await createTestUser("admin");
  });

  it("allows employees to access their own tasks", async () => {
    const response = await request(app)
      .get("/api/v1/daily-tasks")
      .set("Authorization", `Bearer ${employeeToken}`)
      .expect(200);

    expect(response.body.data).toBeDefined();
  });

  it("prevents employees from accessing admin functions", async () => {
    await request(app)
      .get("/api/v1/admin/users")
      .set("Authorization", `Bearer ${employeeToken}`)
      .expect(403);
  });

  it("allows managers to create projects", async () => {
    const projectData = {
      name: "Test Project",
      description: "Test Description",
      priority: "medium",
    };

    await request(app)
      .post("/api/v1/projects")
      .set("Authorization", `Bearer ${managerToken}`)
      .send(projectData)
      .expect(201);
  });

  it("allows admins to manage users", async () => {
    await request(app)
      .get("/api/v1/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
  });
});
```

### 7.3 Data Validation Testing

#### 7.3.1 Input Sanitization

```typescript
// security/validation.test.ts
describe("Input Validation", () => {
  it("sanitizes SQL injection attempts", async () => {
    const maliciousInput = "'; DROP TABLE users; --";

    const response = await request(app)
      .post("/api/v1/projects")
      .send({
        name: maliciousInput,
        description: "Test",
        priority: "medium",
      })
      .expect(400);

    expect(response.body.error.message).toContain("validation");
  });

  it("validates email format", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        email: "invalid-email",
        name: "Test User",
        role: "employee",
      })
      .expect(400);

    expect(response.body.error.message).toContain("email");
  });

  it("validates allocation percentage", async () => {
    const response = await request(app)
      .post("/api/v1/resources/allocate")
      .send({
        projectId: "project-id",
        userId: "user-id",
        allocationPercentage: 150, // Invalid: > 100%
      })
      .expect(400);

    expect(response.body.error.message).toContain("allocation");
  });
});
```

---

## 8. Accessibility Testing

### 8.1 WCAG Compliance Testing

#### 8.1.1 Automated Accessibility Testing

```typescript
// accessibility/a11y.test.tsx
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import TaskCard from "../components/TaskCard";

expect.extend(toHaveNoViolations);

describe("Accessibility", () => {
  it("TaskCard should not have accessibility violations", async () => {
    const { container } = render(
      <TaskCard
        task={{
          id: "1",
          title: "Test Task",
          projectName: "Test Project",
          priority: "high",
          status: "todo",
        }}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have proper ARIA labels", () => {
    const { getByLabelText } = render(
      <TaskCard
        task={{
          id: "1",
          title: "Test Task",
          projectName: "Test Project",
          priority: "high",
          status: "todo",
        }}
      />
    );

    expect(getByLabelText("Complete task: Test Task")).toBeInTheDocument();
  });
});
```

### 8.2 Keyboard Navigation Testing

#### 8.2.1 Keyboard Accessibility

```typescript
// accessibility/keyboard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "../components/TaskCard";

describe("Keyboard Navigation", () => {
  it("should be navigable with keyboard", () => {
    render(
      <TaskCard
        task={{
          id: "1",
          title: "Test Task",
          projectName: "Test Project",
          priority: "high",
          status: "todo",
        }}
      />
    );

    const taskCard = screen.getByRole("button");

    // Focus the task card
    taskCard.focus();
    expect(taskCard).toHaveFocus();

    // Press Enter to activate
    fireEvent.keyDown(taskCard, { key: "Enter" });
    // Verify action is triggered
  });

  it("should support Tab navigation", () => {
    render(
      <div>
        <TaskCard task={task1} />
        <TaskCard task={task2} />
      </div>
    );

    const firstCard = screen.getAllByRole("button")[0];
    const secondCard = screen.getAllByRole("button")[1];

    firstCard.focus();
    expect(firstCard).toHaveFocus();

    fireEvent.keyDown(firstCard, { key: "Tab" });
    expect(secondCard).toHaveFocus();
  });
});
```

---

## 9. Test Data Management

### 9.1 Test Fixtures

#### 9.1.1 Mock Data

```typescript
// fixtures/mockData.ts
export const mockUsers = [
  {
    id: "1",
    googleId: "google-1",
    email: "employee@addcomposites.com",
    name: "John Employee",
    role: "employee",
    isActive: true,
  },
  {
    id: "2",
    googleId: "google-2",
    email: "manager@addcomposites.com",
    name: "Jane Manager",
    role: "project_manager",
    isActive: true,
  },
];

export const mockProjects = [
  {
    id: "1",
    name: "Customer Portal",
    description: "Web application for customers",
    status: "active",
    priority: "high",
    projectManagerId: "2",
    googleDriveFolderId: "folder-1",
  },
];

export const mockTasks = [
  {
    id: "1",
    projectId: "1",
    assignedTo: "1",
    title: "Implement user authentication",
    description: "Add login and registration functionality",
    status: "todo",
    priority: "high",
    dueDate: "2025-01-15",
  },
];
```

### 9.2 Database Seeding

#### 9.2.1 Test Database Setup

```typescript
// scripts/seedTestData.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTestData() {
  // Create test users
  const employee = await prisma.user.create({
    data: {
      googleId: "test-employee-google-id",
      email: "employee@test.com",
      name: "Test Employee",
      role: "employee",
    },
  });

  const manager = await prisma.user.create({
    data: {
      googleId: "test-manager-google-id",
      email: "manager@test.com",
      name: "Test Manager",
      role: "project_manager",
    },
  });

  // Create test project
  const project = await prisma.project.create({
    data: {
      name: "Test Project",
      description: "Test project for testing",
      projectManagerId: manager.id,
      googleDriveFolderId: "test-folder-id",
    },
  });

  // Create test tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Test Task 1",
        projectId: project.id,
        assignedTo: employee.id,
        priority: "high",
        status: "todo",
      },
      {
        title: "Test Task 2",
        projectId: project.id,
        assignedTo: employee.id,
        priority: "medium",
        status: "in_progress",
      },
    ],
  });

  console.log("Test data seeded successfully");
}

seedTestData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 10. Test Automation

### 10.1 CI/CD Integration

#### 10.1.1 GitHub Actions Test Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: pm_platform_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - run: npm ci
      - run: npm run build
      - run: npm run test:e2e

      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
```

### 10.2 Test Reporting

#### 10.2.1 Test Results Dashboard

```typescript
// test-reporter.ts
import { createHtmlReport } from "axe-html-reporter";
import { writeFileSync } from "fs";

export function generateTestReport(results: any) {
  const htmlReport = createHtmlReport({
    results,
    options: {
      projectKey: "PM-Platform",
      reportFileName: "accessibility-report.html",
    },
  });

  writeFileSync("test-results/accessibility-report.html", htmlReport);
}
```

---

## 11. Test Metrics and KPIs

### 11.1 Test Coverage Metrics

- **Unit Test Coverage:** Target 90%+
- **Integration Test Coverage:** Target 80%+
- **E2E Test Coverage:** Target 70%+ of critical paths
- **Code Coverage:** Target 85%+ overall

### 11.2 Quality Metrics

- **Bug Detection Rate:** Track bugs found per test cycle
- **Test Execution Time:** Monitor test suite performance
- **Flaky Test Rate:** Target <5% flaky tests
- **Test Maintenance Effort:** Track time spent on test maintenance

### 11.3 Performance Metrics

- **API Response Time:** <200ms for 95% of requests
- **Page Load Time:** <2 seconds for initial load
- **Mobile App Performance:** <1 second for task operations
- **Database Query Time:** <100ms for 90% of queries

---

**Document Status:** Testing Focus - PRDV2  
**Next Review:** After test implementation  
**Approval Required:** Pravin Luthada, Technical Lead  
**Based on:** Nove_Frontend Architecture & Meeting Requirements
