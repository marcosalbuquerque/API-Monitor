const swaggerJsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 3001;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Monitor - SkillUp Dynatrace 2026',
      version: '1.0.0',
      description: 'Backend para monitoramento de health checks de APIs públicas',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor local',
      },
    ],
    paths: {
      '/health': {
        get: {
          summary: 'Verifica saúde do backend',
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      timestamp: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/apis': {
        get: {
          summary: 'Lista todas as APIs cadastradas',
          responses: {
            200: {
              description: 'Lista de APIs',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        category: { type: 'string' },
                        description: { type: 'string' },
                        probeUrl: { type: 'string' },
                        docsUrl: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/probe/{id}': {
        post: {
          summary: 'Dispara um health check para uma API específica',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID da API (ex: dog-ceo, pokeapi)',
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: {
              description: 'Resultado do probe',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      status: { type: 'number', nullable: true },
                      latencyMs: { type: 'number', nullable: true },
                      ok: { type: 'boolean' },
                      checkedAt: { type: 'string', format: 'date-time' },
                      error: { type: 'string', nullable: true },
                    },
                  },
                },
              },
            },
            404: {
              description: 'API não encontrada',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { error: { type: 'string' } },
                  },
                },
              },
            },
          },
        },
      },
      '/api/metrics': {
        get: {
          summary: 'Retorna todo o histórico de probes realizados',
          responses: {
            200: {
              description: 'Array com histórico',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        status: { type: 'number', nullable: true },
                        latencyMs: { type: 'number', nullable: true },
                        ok: { type: 'boolean' },
                        checkedAt: { type: 'string', format: 'date-time' },
                        error: { type: 'string', nullable: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [], // não usamos anotações nos arquivos de rota, então vazio
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerSpec };
