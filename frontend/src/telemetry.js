/**
 * telemetry.js — Instrumentação OpenTelemetry para o browser (Dynatrace)
 *
 * Inicialize chamando initTelemetry() UMA vez, na primeira linha de main.jsx,
 * antes de qualquer import de componente React.
 *
 * O SDK intercepta automaticamente todos os fetch/XHR feitos pelo axios e
 * gera spans filhos dentro do trace da ação que os originou.
 *
 * Para criar spans manuais em qualquer lugar da aplicação:
 *   import { getTracer } from './telemetry';
 *   const span = getTracer().startSpan('minha-operacao');
 *   // ... lógica ...
 *   span.end();
 */

import { WebTracerProvider }          from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter }          from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor }         from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager }         from '@opentelemetry/context-zone';
import { registerInstrumentations }   from '@opentelemetry/instrumentation';
import { FetchInstrumentation }       from '@opentelemetry/instrumentation-fetch';
import { Resource }                   from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME,
         ATTR_SERVICE_VERSION }       from '@opentelemetry/semantic-conventions';
import { trace }                      from '@opentelemetry/api';

// Nome interno do tracer — usado em getTracer()
const TRACER_NAME = 'api-monitor-frontend';

let _initialized = false;

/**
 * Lê as variáveis de ambiente injetadas pelo Vite (prefixo VITE_).
 * Retorna null se não estiverem configuradas.
 */
function getConfig() {
  const endpoint = import.meta.env.VITE_DYNATRACE_OTLP_ENDPOINT || '';
  const token    = import.meta.env.VITE_DYNATRACE_API_TOKEN     || '';

  const isConfigured =
    endpoint.length > 0 &&
    !endpoint.includes('{seu-environment') &&
    token.length > 0 &&
    !token.startsWith('dt0c01.XXX');

  if (!isConfigured) return null;
  return { endpoint, token };
}

/**
 * Inicializa o SDK. Chame uma única vez em main.jsx.
 */
export function initTelemetry() {
  if (_initialized) return;
  _initialized = true;

  const config = getConfig();

  if (!config) {
    console.log('⚡ [Telemetria] Dynatrace não configurado — rodando sem traces.');
    console.log('   → Preencha VITE_DYNATRACE_OTLP_ENDPOINT e VITE_DYNATRACE_API_TOKEN no .env');
    return;
  }

  // ── Resource: identifica o serviço no Dynatrace ──────────────────────────
  const resource = new Resource({
    [ATTR_SERVICE_NAME]:    import.meta.env.VITE_OTEL_SERVICE_NAME || 'api-monitor-frontend',
    [ATTR_SERVICE_VERSION]: import.meta.env.VITE_APP_VERSION       || '1.0.0',
    'deployment.environment': import.meta.env.MODE || 'development',
  });

  // ── Exporter: envia traces para o Dynatrace via OTLP/HTTP ────────────────
  const exporter = new OTLPTraceExporter({
    url: config.endpoint,
    headers: {
      Authorization: `Api-Token ${config.token}`,
    },
  });

  // ── Provider: gerencia o ciclo de vida dos spans ─────────────────────────
  const provider = new WebTracerProvider({
    resource,
    spanProcessors: [
      new BatchSpanProcessor(exporter, {
        // Exporta em lotes a cada 2s ou quando acumular 20 spans
        scheduledDelayMillis: 2000,
        maxExportBatchSize:   20,
      }),
    ],
  });

  // ZoneContextManager propaga contexto corretamente em código async/await
  provider.register({
    contextManager: new ZoneContextManager(),
  });

  // ── Auto-instrumentação: captura todos os fetch/XHR do axios ─────────────
  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        // Propaga trace context nos headers das requisições ao backend
        propagateTraceHeaderCorsUrls: [/.*/],
        // Ignora o endpoint do próprio Dynatrace para não criar loops
        ignoreUrls: [config.endpoint],
        // Adiciona URL e método como atributos do span
        applyCustomAttributesOnSpan: (span, request, result) => {
          if (request instanceof Request) {
            span.setAttribute('http.request.url',    request.url);
            span.setAttribute('http.request.method', request.method);
          }
          if (result instanceof Response) {
            span.setAttribute('http.response.status_code', result.status);
          }
        },
      }),
    ],
  });

  console.log(`📡 [Telemetria] Dynatrace OpenTelemetry ativo (frontend)`);
  console.log(`   → Endpoint : ${config.endpoint}`);
  console.log(`   → Serviço  : ${import.meta.env.VITE_OTEL_SERVICE_NAME || 'api-monitor-frontend'}`);
}

/**
 * Retorna o tracer para criar spans manuais.
 * Retorna um NoopTracer quando o SDK não está ativo (dev sem .env).
 */
export function getTracer() {
  return trace.getTracer(TRACER_NAME);
}
