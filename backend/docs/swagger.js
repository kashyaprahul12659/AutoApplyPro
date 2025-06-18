const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AutoApplyPro API',
      version: '1.0.0',
      description: 'A comprehensive job application automation platform with AI-powered resume optimization and cover letter generation',
      contact: {
        name: 'AutoApplyPro Support',
        email: 'support@autoapplypro.tech'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.autoapplypro.tech' 
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        ClerkAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'Clerk JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier'
            },
            name: {
              type: 'string',
              description: 'User full name',
              minLength: 2,
              maxLength: 50
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            isProUser: {
              type: 'boolean',
              description: 'Whether user has Pro subscription'
            },
            aiCredits: {
              type: 'integer',
              description: 'Available AI credits',
              minimum: 0
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            token: {
              type: 'string',
              description: 'JWT authentication token'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object'
            }
          }
        },
        CoverLetter: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            userId: {
              type: 'string'
            },
            jobTitle: {
              type: 'string'
            },
            companyName: {
              type: 'string'
            },
            content: {
              type: 'string'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        JobAnalysis: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            userId: {
              type: 'string'
            },
            jobDescription: {
              type: 'string'
            },
            analysis: {
              type: 'object',
              properties: {
                matchScore: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100
                },
                requiredSkills: {
                  type: 'array',
                  items: { type: 'string' }
                },
                recommendations: {
                  type: 'array',
                  items: { type: 'string' }
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    security: [
      {
        ClerkAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = specs;
