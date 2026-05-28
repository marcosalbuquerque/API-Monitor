const express = require('express');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const catalog = require('../data/catalog.json');

const router = express.Router();

const swaggerDir = path.join(__dirname, '..', 'data', 'swagger');

function buildSpec(api) {
  try {
    const probeUrl = new URL(api.probeUrl);
    const serverUrl = `${probeUrl.protocol}//${probeUrl.host}`;
    const pathKey = probeUrl.pathname || '/';

    const parameters = Array.from(probeUrl.searchParams.entries()).map(
      ([name, value]) => ({
        name,
        in: 'query',
        required: false,
        schema: { type: 'string', example: value },
      })
    );

    return {
      openapi: '3.0.0',
      info: {
        title: `${api.name} API`,
        version: '1.0.0',
        description: api.description,
      },
      servers: [{ url: serverUrl }],
      paths: {
        [pathKey]: {
          get: {
            summary: `Probe ${api.name}`,
            description: `Endpoint utilizado pelo monitor para verificar a disponibilidade de ${api.name}.`,
            parameters,
            responses: {
              200: { description: 'OK' },
              400: { description: 'Bad request' },
              500: { description: 'Server error' },
            },
          },
        },
      },
    };
  } catch (err) {
    return null;
  }
}

function loadSpec(api) {
  const filePath = path.join(swaggerDir, `${api.id}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  return buildSpec(api);
}

router.use('/:id', (req, res, next) => {
  const { id } = req.params;
  const api = catalog.find((entry) => entry.id === id);
  if (!api) {
    return res.status(404).json({ error: 'Spec not found' });
  }

  const spec = loadSpec(api);
  if (!spec) {
    return res.status(404).json({ error: 'Spec not found' });
  }

  req.swaggerDoc = spec;
  next();
}, swaggerUi.serve, swaggerUi.setup());

module.exports = router;
