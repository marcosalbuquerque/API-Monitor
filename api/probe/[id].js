const catalog = require('../../backend/src/data/catalog.json');
const { metricsHistory } = require('../_metricsStore');

const TIMEOUT_MS = 8000;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { id } = req.query;
  const api = catalog.find((entry) => entry.id === id);

  if (!api) {
    return res.status(404).json({ error: 'API not found' });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const start = Date.now();

  try {
    const response = await fetch(api.probeUrl, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const latencyMs = Date.now() - start;
    const result = {
      id,
      name: api.name,
      category: api.category,
      status: response.status,
      latencyMs,
      ok: true,
      checkedAt: new Date().toISOString(),
    };

    metricsHistory.push(result);
    res.json(result);
  } catch (err) {
    const httpStatus = err.status ?? null;
    const errorMessage = err.name === 'AbortError'
      ? 'ETIMEDOUT'
      : err.code || err.message;

    const result = {
      id,
      name: api.name,
      category: api.category,
      status: httpStatus,
      latencyMs: null,
      ok: false,
      error: errorMessage,
      checkedAt: new Date().toISOString(),
    };

    metricsHistory.push(result);
    res.json(result);
  } finally {
    clearTimeout(timeoutId);
  }
};
