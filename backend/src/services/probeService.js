'use strict';

const axios   = require('axios');
const catalog = require('../data/catalog.json');

/**
 * @opentelemetry/api expõe um NoopTracer quando o SDK não está ativo,
 * portanto este import é sempre seguro — não quebra em dev local.
 */
const { trace, SpanStatusCode, context, propagation } = require('@opentelemetry/api');
const tracer = trace.getTracer('api-monitor.probe-service', '1.0.0');

// Histórico em memória da sessão
const metricsHistory = [];

/**
 * Executa o health check de uma API pelo ID.
 * Cada probe gera um span OpenTelemetry com atributos de latência, status
 * HTTP e resultado (ok/fail), visível no Dynatrace como trace individual.
 *
 * @param {string} id - ID da API no catálogo
 * @returns {Promise<object|null>}
 */
async function probe(id) {
  const api = catalog.find((a) => a.id === id);
  if (!api) return null;

  // Cria um span pai para todo o ciclo do probe
  return tracer.startActiveSpan(
    `probe ${api.name}`,
    {
      attributes: {
        // Atributos semânticos OpenTelemetry
        'http.method':         'GET',
        'http.url':            api.probeUrl,
        // Atributos customizados do API Monitor
        'probe.api.id':        id,
        'probe.api.name':      api.name,
        'probe.api.category':  api.category,
      },
    },
    async (span) => {
      const start = Date.now();

      try {
        const response = await axios.get(api.probeUrl, { timeout: 8000 });
        const latencyMs = Date.now() - start;

        span.setAttributes({
          'http.status_code':  response.status,
          'probe.latency_ms':  latencyMs,
          'probe.ok':          true,
        });
        span.setStatus({ code: SpanStatusCode.OK });

        const result = {
          id,
          name:      api.name,
          category:  api.category,
          status:    response.status,
          latencyMs,
          ok:        true,
          checkedAt: new Date().toISOString(),
        };

        metricsHistory.push(result);
        return result;

      } catch (err) {
        const latencyMs    = Date.now() - start;
        const httpStatus   = err.response?.status ?? null;
        const errorMessage = err.code || err.message;

        span.setAttributes({
          'http.status_code': httpStatus ?? 0,
          'probe.latency_ms': latencyMs,
          'probe.ok':         false,
          'probe.error':      errorMessage,
        });
        span.setStatus({ code: SpanStatusCode.ERROR, message: errorMessage });
        span.recordException(err);

        const result = {
          id,
          name:      api.name,
          category:  api.category,
          status:    httpStatus,
          latencyMs: null,
          ok:        false,
          error:     errorMessage,
          checkedAt: new Date().toISOString(),
        };

        metricsHistory.push(result);
        return result;

      } finally {
        span.end();
      }
    }
  );
}

/**
 * Retorna o histórico de métricas da sessão
 */
function getMetrics() {
  return metricsHistory;
}

module.exports = { probe, getMetrics };
