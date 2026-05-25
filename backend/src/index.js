require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./config/swagger');

// ─── Rotas ───────────────────────────────────
const apisRouter = require('./routes/apis');
const probeRouter = require('./routes/probe');
const metricsRouter = require('./routes/metrics');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares globais ─────────────────────
app.use(cors());
app.use(express.json());

// ─── Swagger UI ──────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Health check do próprio backend ─────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Rotas da API ─────────────────────────────
app.use('/api/apis', apisRouter);
app.use('/api/probe', probeRouter);
app.use('/api/metrics', metricsRouter);

// ─── 404 handler ─────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Error handler ────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 API Monitor backend rodando em http://localhost:${PORT}`);
  console.log(`📚 Swagger UI disponível em http://localhost:${PORT}/api-docs`);
});

module.exports = app;
