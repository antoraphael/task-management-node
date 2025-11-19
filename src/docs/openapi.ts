import { OpenAPIV3 } from 'openapi-types';

const components: OpenAPIV3.ComponentsObject = {
  schemas: {
    User: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        _id: { type: 'string' },
        name: { type: 'string', example: 'Jane Doe' },
        email: { type: 'string', format: 'email' },
        role: { type: 'string', enum: ['member', 'manager', 'admin'], default: 'member' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    },
    Project: {
      type: 'object',
      required: ['name'],
      properties: {
        _id: { type: 'string' },
        name: { type: 'string', example: 'Platform Revamp' },
        description: { type: 'string' },
        teamMembers: {
          type: 'array',
          items: { type: 'string', description: 'User ID' }
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    },
    TimeEntry: {
      type: 'object',
      required: ['hours'],
      properties: {
        hours: { type: 'number', example: 2.5 },
        note: { type: 'string' },
        loggedBy: { type: 'string', description: 'User ID' },
        loggedAt: { type: 'string', format: 'date-time' }
      }
    },
    Task: {
      type: 'object',
      required: ['title'],
      properties: {
        _id: { type: 'string' },
        title: { type: 'string', example: 'Implement auth flow' },
        description: { type: 'string' },
        status: {
          type: 'string',
          enum: ['todo', 'in_progress', 'completed'],
          default: 'todo'
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical'],
          default: 'medium'
        },
        assignee: { $ref: '#/components/schemas/User' },
        project: { $ref: '#/components/schemas/Project' },
        estimatedHours: { type: 'number' },
        actualHours: { type: 'number' },
        dueDate: { type: 'string', format: 'date-time' },
        completedAt: { type: 'string', format: 'date-time' },
        timeEntries: {
          type: 'array',
          items: { $ref: '#/components/schemas/TimeEntry' }
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    },
    ApiError: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        details: {}
      }
    },
    UserCreatePayload: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: { type: 'string', example: 'Jane Doe' },
        email: { type: 'string', format: 'email', example: 'james@example.com' },
        role: { type: 'string', enum: ['member', 'manager', 'admin'], default: 'member' }
      }
    },
    ProjectCreatePayload: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', example: 'Platform Revamp' },
        description: { type: 'string' },
        teamMembers: {
          type: 'array',
          items: { type: 'string', description: 'User ID' }
        }
      }
    },
    ProjectUpdatePayload: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Platform Revamp' },
        description: { type: 'string' },
        teamMembers: {
          type: 'array',
          items: { type: 'string', description: 'User ID' }
        }
      },
      minProperties: 1,
      description: 'Provide at least one project field to update'
    },
    TaskCreatePayload: {
      type: 'object',
      required: ['title'],
      properties: {
        title: { type: 'string', example: 'Implement auth flow' },
        description: { type: 'string' },
        completedAt: { type: 'string', format: 'date-time', description: 'Set when forcing completion' },
        status: {
          type: 'string',
          enum: ['todo', 'in_progress', 'completed'],
          default: 'todo'
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical'],
          default: 'medium'
        },
        assignee: { type: 'string', description: 'User ID' },
        project: { type: 'string', description: 'Project ID' },
        estimatedHours: { type: 'number' },
        actualHours: { type: 'number' },
        dueDate: { type: 'string', format: 'date-time' }
      }
    },
    TaskUpdatePayload: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Implement auth flow' },
        description: { type: 'string' },
        completedAt: { type: 'string', format: 'date-time' },
        status: {
          type: 'string',
          enum: ['todo', 'in_progress', 'completed']
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical']
        },
        assignee: { type: 'string', description: 'User ID' },
        project: { type: 'string', description: 'Project ID' },
        estimatedHours: { type: 'number' },
        actualHours: { type: 'number' },
        dueDate: { type: 'string', format: 'date-time' }
      },
      minProperties: 1,
      description: 'Provide at least one task field to update'
    },
    AssignTaskPayload: {
      type: 'object',
      required: ['assigneeId'],
      properties: {
        assigneeId: { type: 'string', description: 'User ID to assign' }
      }
    },
    TaskStatusPayload: {
      type: 'object',
      required: ['status'],
      properties: {
        status: {
          type: 'string',
          enum: ['todo', 'in_progress', 'completed']
        }
      }
    },
    LogTimeEntryPayload: {
      type: 'object',
      required: ['hours'],
      properties: {
        hours: { type: 'number', minimum: 0.1, example: 2.5 },
        note: { type: 'string' },
        loggedBy: { type: 'string', description: 'Optional user ID' }
      }
    },
    LoginPayload: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', format: 'email', example: 'james@example.com' }
      }
    },
    VerifyOtpPayload: {
      type: 'object',
      required: ['email', 'otp'],
      properties: {
        email: { type: 'string', format: 'email', example: 'james@example.com' },
        otp: { type: 'string', example: '123456', minLength: 6, maxLength: 6 }
      }
    }
  },
  parameters: {
    TaskIdParam: {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'Task ID'
    },
    ProjectIdParam: {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'Project ID'
    },
    UserIdParam: {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'User ID'
    }
  },
  securitySchemes: {
    CookieAuth: {
      type: 'apiKey',
      in: 'cookie',
      name: 'token'
    }
  }
};

const jsonResponse = (
  schemaRef: string | OpenAPIV3.SchemaObject,
  description = 'Successful response'
): OpenAPIV3.ResponseObject => ({
  description,
  content: {
    'application/json': {
      schema: typeof schemaRef === 'string' ? { $ref: schemaRef } : schemaRef
    }
  }
});

const listResponse = (schemaRef: string): OpenAPIV3.ResponseObject =>
  jsonResponse({
    type: 'array',
    items: { $ref: schemaRef }
  });

const errorResponse = (status: string, description: string): [string, OpenAPIV3.ResponseObject] => [
  status,
  {
    description,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiError' }
      }
    }
  }
];

const taskPaths: OpenAPIV3.PathsObject = {
  '/api/v1/tasks': {
    get: {
      tags: ['Tasks'],
      summary: 'List tasks',
      parameters: [
        {
          name: 'project',
          in: 'query',
          description: 'Filter by project ID',
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': listResponse('#/components/schemas/Task')
      }
    },
    post: {
      tags: ['Tasks'],
      summary: 'Create task',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/TaskCreatePayload' }
          }
        }
      },
      responses: {
        '201': jsonResponse('#/components/schemas/Task'),
        ...Object.fromEntries([errorResponse('400', 'Validation error')])
      }
    }
  },
  '/api/v1/tasks/{id}': {
    get: {
      tags: ['Tasks'],
      summary: 'Get task',
      parameters: [components.parameters?.TaskIdParam as OpenAPIV3.ParameterObject],
      responses: {
        '200': jsonResponse('#/components/schemas/Task'),
        ...Object.fromEntries([errorResponse('404', 'Task not found')])
      }
    },
    put: {
      tags: ['Tasks'],
      summary: 'Update task',
      parameters: [components.parameters?.TaskIdParam as OpenAPIV3.ParameterObject],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/TaskUpdatePayload' }
          }
        }
      },
      responses: {
        '200': jsonResponse('#/components/schemas/Task')
      }
    },
    delete: {
      tags: ['Tasks'],
      summary: 'Delete task',
      parameters: [components.parameters?.TaskIdParam as OpenAPIV3.ParameterObject],
      responses: {
        '204': { description: 'Deleted' }
      }
    }
  },
  '/api/v1/tasks/{id}/assign': {
    post: {
      tags: ['Tasks'],
      summary: 'Assign a task to a user',
      parameters: [components.parameters?.TaskIdParam as OpenAPIV3.ParameterObject],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AssignTaskPayload' }
          }
        }
      },
      responses: {
        '200': jsonResponse('#/components/schemas/Task'),
        ...Object.fromEntries([errorResponse('404', 'Task not found')])
      }
    }
  },
  '/api/v1/tasks/{id}/status': {
    patch: {
      tags: ['Tasks'],
      summary: 'Update task status',
      parameters: [components.parameters?.TaskIdParam as OpenAPIV3.ParameterObject],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/TaskStatusPayload' }
          }
        }
      },
      responses: {
        '200': jsonResponse('#/components/schemas/Task'),
        ...Object.fromEntries([
          errorResponse('400', 'Invalid status transition'),
          errorResponse('404', 'Task not found')
        ])
      }
    }
  },
  '/api/v1/tasks/{id}/time-entries': {
    post: {
      tags: ['Tasks'],
      summary: 'Log time for a task',
      parameters: [components.parameters?.TaskIdParam as OpenAPIV3.ParameterObject],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LogTimeEntryPayload' }
          }
        }
      },
      responses: {
        '200': jsonResponse('#/components/schemas/Task'),
        ...Object.fromEntries([errorResponse('400', 'Invalid payload')])
      }
    }
  }
};

const projectPaths: OpenAPIV3.PathsObject = {
  '/api/v1/projects': {
    get: {
      tags: ['Projects'],
      summary: 'List projects',
      responses: {
        '200': listResponse('#/components/schemas/Project')
      }
    },
    post: {
      tags: ['Projects'],
      summary: 'Create project',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ProjectCreatePayload' }
          }
        }
      },
      responses: {
        '201': jsonResponse('#/components/schemas/Project')
      }
    }
  },
  '/api/v1/projects/{id}': {
    get: {
      tags: ['Projects'],
      summary: 'Get project',
      parameters: [components.parameters?.ProjectIdParam as OpenAPIV3.ParameterObject],
      responses: {
        '200': jsonResponse('#/components/schemas/Project'),
        ...Object.fromEntries([errorResponse('404', 'Project not found')])
      }
    },
    put: {
      tags: ['Projects'],
      summary: 'Update project',
      parameters: [components.parameters?.ProjectIdParam as OpenAPIV3.ParameterObject],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ProjectUpdatePayload' }
          }
        }
      },
      responses: {
        '200': jsonResponse('#/components/schemas/Project')
      }
    },
    delete: {
      tags: ['Projects'],
      summary: 'Delete project',
      parameters: [components.parameters?.ProjectIdParam as OpenAPIV3.ParameterObject],
      responses: {
        '204': { description: 'Deleted' }
      }
    }
  },
  '/api/v1/projects/{id}/completion': {
    get: {
      tags: ['Projects'],
      summary: 'Get project completion percentage',
      parameters: [components.parameters?.ProjectIdParam as OpenAPIV3.ParameterObject],
      responses: {
        '200': jsonResponse({
          type: 'object',
          properties: {
            projectId: { type: 'string' },
            completionPercentage: { type: 'number', example: 42 }
          }
        })
      }
    }
  }
};

const userPaths: OpenAPIV3.PathsObject = {
  '/api/v1/users': {
    get: {
      tags: ['Users'],
      summary: 'List users',
      responses: {
        '200': listResponse('#/components/schemas/User')
      }
    },
    post: {
      tags: ['Users'],
      summary: 'Create user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UserCreatePayload' }
          }
        }
      },
      responses: {
        '201': jsonResponse('#/components/schemas/User')
      }
    }
  },
  '/api/v1/users/{id}': {
    get: {
      tags: ['Users'],
      summary: 'Get user',
      parameters: [components.parameters?.UserIdParam as OpenAPIV3.ParameterObject],
      responses: {
        '200': jsonResponse('#/components/schemas/User'),
        ...Object.fromEntries([errorResponse('404', 'User not found')])
      }
    }
  }
};

const analyticsPaths: OpenAPIV3.PathsObject = {
  '/api/v1/analytics/team-productivity': {
    get: {
      tags: ['Analytics'],
      summary: 'Team productivity metrics',
      responses: {
        '200': jsonResponse({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              assignee: { $ref: '#/components/schemas/User' },
              totalTasks: { type: 'number' },
              completedTasks: { type: 'number' },
              inProgressTasks: { type: 'number' },
              averageCycleTime: { type: 'number', description: 'Hours' }
            }
          }
        })
      }
    }
  },
  '/api/v1/analytics/project-completion': {
    get: {
      tags: ['Analytics'],
      summary: 'Project completion rates',
      responses: {
        '200': jsonResponse({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              project: { $ref: '#/components/schemas/Project' },
              completionRate: { type: 'number' }
            }
          }
        })
      }
    }
  },
  '/api/v1/analytics/average-time-by-priority': {
    get: {
      tags: ['Analytics'],
      summary: 'Average cycle time per priority',
      responses: {
        '200': jsonResponse({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', description: 'Priority' },
              avgCycleTimeHours: { type: 'number' },
              totalTasks: { type: 'number' }
            }
          }
        })
      }
    }
  },
  '/api/v1/analytics/overdue-tasks': {
    get: {
      tags: ['Analytics'],
      summary: 'List overdue tasks',
      responses: {
        '200': listResponse('#/components/schemas/Task')
      }
    }
  },
  '/api/v1/analytics/user-workload': {
    get: {
      tags: ['Analytics'],
      summary: 'User workload distribution',
      responses: {
        '200': jsonResponse({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              assignee: { $ref: '#/components/schemas/User' },
              totalTasks: { type: 'number' },
              todo: { type: 'number' },
              inProgress: { type: 'number' },
              completed: { type: 'number' }
            }
          }
        })
      }
    }
  },
  '/api/v1/analytics/bottlenecks': {
    get: {
      tags: ['Analytics'],
      summary: 'Tasks stuck longer than threshold hours',
      parameters: [
        {
          name: 'thresholdHours',
          in: 'query',
          schema: { type: 'number', default: 72 }
        }
      ],
      responses: {
        '200': listResponse('#/components/schemas/Task')
      }
    }
  },
  '/api/v1/analytics/estimation-accuracy': {
    get: {
      tags: ['Analytics'],
      summary: 'Estimation accuracy metrics',
      responses: {
        '200': jsonResponse({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', description: 'Priority' },
              averageEstimated: { type: 'number' },
              averageActual: { type: 'number' },
              accuracyPercent: { type: 'number' },
              samples: { type: 'number' }
            }
          }
        })
      }
    }
  },
  '/api/v1/analytics/project/{projectId}/estimation-insights': {
    get: {
      tags: ['Analytics'],
      summary: 'Estimation deltas for a project',
      parameters: [
        {
          name: 'projectId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': jsonResponse({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', description: 'Priority' },
              averageDelta: { type: 'number' },
              averageEstimated: { type: 'number' },
              averageActual: { type: 'number' },
              samples: { type: 'number' }
            }
          }
        })
      }
    }
  }
};

const authPaths: OpenAPIV3.PathsObject = {
  '/api/v1/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Request login OTP',
      description:
        'Validates the email address and emails a one-time password. OTPs expire in 24 hours, allow 5 attempts, and can only be re-sent every 2 minutes.',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginPayload' }
          }
        }
      },
      responses: {
        '200': jsonResponse({
          type: 'object',
          properties: {
            message: { type: 'string' },
            resendAvailableInSeconds: { type: 'number' }
          }
        }),
        ...Object.fromEntries([
          errorResponse('404', 'User not found'),
          errorResponse('429', 'OTP recently sent. Please wait before requesting again.')
        ])
      }
    }
  },
  '/api/v1/auth/verify-otp': {
    post: {
      tags: ['Auth'],
      summary: 'Verify OTP and receive JWT cookie',
      description: 'Checks the submitted OTP. On success, a JWT is issued as an HTTP-only cookie.',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/VerifyOtpPayload' }
          }
        }
      },
      responses: {
        '200': jsonResponse({
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: { $ref: '#/components/schemas/User' }
          }
        }),
        ...Object.fromEntries([
          errorResponse('400', 'Missing or invalid OTP'),
          errorResponse('401', 'Incorrect OTP'),
          errorResponse('404', 'User not found'),
          errorResponse('410', 'OTP expired'),
          errorResponse('423', 'Maximum OTP attempts exceeded')
        ])
      }
    }
  }
};

const openApiDocument: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'Task Management & Analytics API',
    version: '1.0.0',
    description:
      'REST API for managing tasks, projects, users, and analytics insights for delivery teams.'
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Local development'
    }
  ],
  tags: [
    { name: 'Auth', description: 'OTP-based authentication workflows' },
    { name: 'Tasks', description: 'Task CRUD, assignment, status, and time-logging' },
    { name: 'Projects', description: 'Project CRUD and progress tracking' },
    { name: 'Users', description: 'User directory' },
    { name: 'Analytics', description: 'Productivity, workload, and SLA insights' }
  ],
  components,
  security: [{ CookieAuth: [] }],
  paths: {
    ...taskPaths,
    ...projectPaths,
    ...userPaths,
    ...analyticsPaths,
    ...authPaths
  }
};

export default openApiDocument;

