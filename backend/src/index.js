// ─── Telemetria: DEVE vir antes de qualquer outro require ────────────────────
require('dotenv').config();
const { initTelemetry } = require('./config/telemetry');
initTelemetry();

// ─── A partir daqui o monkey-patch do OTel já está ativo ────────────────────
const express    = require('express');
const cors       = require('cors');
const swaggerUi  = require('swagger-ui-express');
const { swaggerSpec } = require('./config/swagger');

const apisRouter    = require('./routes/apis');
const probeRouter   = require('./routes/probe');
const metricsRouter = require('./routes/metrics');
const swaggerRouter = require('./routes/swagger');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/apis',    apisRouter);
app.use('/api/probe',   probeRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/swagger', swaggerRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Monitor backend rodando em http://localhost:${PORT}`);
  console.log(`📚 Swagger UI disponível em http://localhost:${PORT}/api-docs`);
});

module.exports = app;
