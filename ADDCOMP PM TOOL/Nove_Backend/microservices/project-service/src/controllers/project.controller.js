const { PrismaClient } = require("@prisma/client");
const { logger } = require("../utils/logger");
const { createApiResponse, createApiError } = require("../../../shared/utils");
const {
  ProjectStatus,
  Priority,
  ProjectType,
} = require("../../../shared/types");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} = require("../services/project.service");

const prisma = new PrismaClient();

/**
 * Get all projects with filtering and pagination
 */
const getAllProjects = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const {
      page,
      limit,
      status,
      priority,
      projectType,
      search,
      projectManagerId,
    } = req.query;

    if (!userId) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User ID not provided")
          )
        );
    }

    const result = await getProjects({
      userId,
      page: Number(page),
      limit: Number(limit),
      status,
      priority,
      projectType,
      search,
      projectManagerId,
    });

    logger.info(`Projects retrieved: ${result.projects.length} projects`);

    res.json(createApiResponse(true, result));
  } catch (error) {
    logger.error("Get projects error:", error);
    res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("INTERNAL_ERROR", "Internal server error")
        )
      );
  }
};

/**
 * Create a new project
 */
const createNewProject = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const projectData = req.body;

    if (!userId) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User ID not provided")
          )
        );
    }

    const project = await createProject({
      ...projectData,
      createdBy: userId,
      updatedBy: userId,
    });

    logger.info(`Project created: ${project.name} by ${userId}`);

    res.status(201).json(createApiResponse(true, { project }));
  } catch (error) {
    logger.error("Create project error:", error);
    res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("INTERNAL_ERROR", "Internal server error")
        )
      );
  }
};

/**
 * Get project by ID
 */
const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User ID not provided")
          )
        );
    }

    const project = await getProjectById(id);

    if (!project) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("PROJECT_NOT_FOUND", "Project not found")
          )
        );
    }

    logger.info(`Project retrieved: ${project.name}`);

    res.json(createApiResponse(true, { project }));
  } catch (error) {
    logger.error("Get project by ID error:", error);
    res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("INTERNAL_ERROR", "Internal server error")
        )
      );
  }
};

/**
 * Update project
 */
const updateProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];
    const updateData = req.body;

    if (!userId) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User ID not provided")
          )
        );
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("PROJECT_NOT_FOUND", "Project not found")
          )
        );
    }

    const updatedProject = await updateProject(id, {
      ...updateData,
      updatedBy: userId,
      updatedAt: new Date(),
    });

    logger.info(`Project updated: ${updatedProject.name} by ${userId}`);

    res.json(createApiResponse(true, { project: updatedProject }));
  } catch (error) {
    logger.error("Update project error:", error);
    res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("INTERNAL_ERROR", "Internal server error")
        )
      );
  }
};

/**
 * Delete project
 */
const deleteProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User ID not provided")
          )
        );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("PROJECT_NOT_FOUND", "Project not found")
          )
        );
    }

    await deleteProject(id, userId);

    logger.info(`Project archived: ${project.name} by ${userId}`);

    res.json(
      createApiResponse(true, {
        message: "Project archived successfully",
      })
    );
  } catch (error) {
    logger.error("Delete project error:", error);
    res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("INTERNAL_ERROR", "Internal server error")
        )
      );
  }
};

/**
 * Add member to project
 */
const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId: memberId } = req.body;
    const requestingUserId = req.headers["x-user-id"];

    if (!requestingUserId) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User ID not provided")
          )
        );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("PROJECT_NOT_FOUND", "Project not found")
          )
        );
    }

    await addProjectMember(id, memberId, requestingUserId);

    logger.info(`Member added to project: ${memberId} to ${project.name}`);

    res.json(
      createApiResponse(true, {
        message: "Member added to project successfully",
      })
    );
  } catch (error) {
    logger.error("Add member to project error:", error);
    res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("INTERNAL_ERROR", "Internal server error")
        )
      );
  }
};

/**
 * Remove member from project
 */
const removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const requestingUserId = req.headers["x-user-id"];

    if (!requestingUserId) {
      return res
        .status(401)
        .json(
          createApiResponse(
            false,
            null,
            createApiError("UNAUTHORIZED", "User ID not provided")
          )
        );
    }

    await removeProjectMember(id, memberId);

    logger.info(`Member removed from project: ${memberId} from ${id}`);

    res.json(
      createApiResponse(true, {
        message: "Member removed from project successfully",
      })
    );
  } catch (error) {
    logger.error("Remove member from project error:", error);
    res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          createApiError("INTERNAL_ERROR", "Internal server error")
        )
      );
  }
};

module.exports = {
  getAllProjects,
  createNewProject,
  getProject,
  updateProjectById,
  deleteProjectById,
  addMember,
  removeMember,
};
