import axios from 'axios';
import { SpanStatusCode } from '@opentelemetry/api';
import { getTracer } from '../telemetry';

const BASE_URL = '/api';

/**
 * Utilitário: executa fn dentro de um span OTel.
 * Se o SDK não estiver ativo, o tracer é Noop — sem overhead algum.
 */
async function withSpan(spanName, attributes, fn) {
  const span = getTracer().startSpan(spanName, { attributes });
  try {
    const result = await fn(span);
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (err) {
    span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span.recordException(err);
    throw err;
  } finally {
    span.end();
  }
}

/**
 * Busca a lista de APIs do catálogo
 */
export async function getApis() {
  return withSpan(
    'getApis',
    { 'http.method': 'GET', 'http.url': `${BASE_URL}/apis` },
    async () => {
      const response = await axios.get(`${BASE_URL}/apis`);
      return response.data;
    }
  );
}

/**
 * Dispara um health check para uma API específica
 * @param {string} id - ID da API
 */
export async function probeApi(id) {
  return withSpan(
    `probeApi ${id}`,
    {
      'http.method':  'POST',
      'http.url':     `${BASE_URL}/probe/${id}`,
      'probe.api.id': id,
    },
    async (span) => {
      const response = await axios.post(`${BASE_URL}/probe/${id}`);
      const result   = response.data;

      // Enriquece o span com o resultado real retornado pelo backend
      span.setAttributes({
        'probe.api.name':     result.name      ?? id,
        'probe.api.category': result.category  ?? '',
        'probe.ok':           result.ok        ?? false,
        'probe.latency_ms':   result.latencyMs ?? 0,
        'http.status_code':   result.status    ?? response.status,
      });

      return result;
    }
  );
}

/**
 * Busca o histórico de métricas da sessão
 */
export async function getMetrics() {
  return withSpan(
    'getMetrics',
    { 'http.method': 'GET', 'http.url': `${BASE_URL}/metrics` },
    async () => {
      const response = await axios.get(`${BASE_URL}/metrics`);
      return response.data;
    }
  );
}
