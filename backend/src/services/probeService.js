const axios = require('axios');
const catalog = require('../data/catalog.json');

// Histórico em memória da sessão
const metricsHistory = [];

/**
 * Executa o health check de uma API pelo ID
 * @param {string} id - ID da API no catálogo
 * @returns {Promise<object>} Resultado do probe
 */
async function probe(id) {
  const api = catalog.find((a) => a.id === id);

  if (!api) {
    return null;
  }

  const start = Date.now();

  try {
    const response = await axios.get(api.probeUrl, { timeout: 8000 });

    const result = {
      id,
      status: response.status,
      latencyMs: Date.now() - start,
      ok: true,
      checkedAt: new Date().toISOString(),
    };

    metricsHistory.push(result);
    return result;
  } catch (err) {
    const result = {
      id,
      status: err.response ? err.response.status : null,
      latencyMs: null,
      ok: false,
      error: err.code || err.message,
      checkedAt: new Date().toISOString(),
    };

    metricsHistory.push(result);
    return result;
  }
}

/**
 * Retorna o histórico de métricas da sessão
 */
function getMetrics() {
  return metricsHistory;
}

module.exports = { probe, getMetrics };
