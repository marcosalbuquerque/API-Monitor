'use strict';

/**
 * Inicializa o SDK OpenTelemetry apontando para o Dynatrace.
 *
 * DEVE ser chamado como primeira linha do processo (antes de qualquer
 * require de express / axios), pois o SDK precisa fazer o monkey-patch
 * das libs HTTP antes que elas sejam carregadas.
 *
 * Se as variáveis de ambiente não estiverem configuradas o servidor sobe
 * normalmente, sem telemetria — não quebra em desenvolvimento local.
 */

const { NodeSDK }                    = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter }          = require('@opentelemetry/exporter-trace-otlp-http');

let _sdk = null;

function initTelemetry() {
  const endpoint = process.env.DYNATRACE_OTLP_ENDPOINT || '';
  const token    = process.env.DYNATRACE_API_TOKEN     || '';

  // Detecta se está realmente configurado (não é o placeholder do .env.example)
  const isConfigured =
    endpoint.length > 0 &&
    !endpoint.includes('{seu-environment') &&
    token.length > 0 &&
    !token.startsWith('dt0c01.XXX');

  if (!isConfigured) {
    console.log('⚡ [Telemetria] Dynatrace não configurado — rodando sem traces.');
    console.log('   → Preencha DYNATRACE_OTLP_ENDPOINT e DYNATRACE_API_TOKEN no .env para ativar.');
    return;
  }

  const exporter = new OTLPTraceExporter({
    url: endpoint,
    headers: {
      // Formato exigido pelo Dynatrace SaaS
      Authorization: `Api-Token ${token}`,
    },
  });

  _sdk = new NodeSDK({
    serviceName: process.env.OTEL_SERVICE_NAME || 'api-monitor-backend',
    traceExporter: exporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        // Instrumenta automaticamente: HTTP (Express), axios (outbound), DNS, etc.
        '@opentelemetry/instrumentation-http':    { enabled: true },
        '@opentelemetry/instrumentation-express': { enabled: true },
        // Desativa instrumentação de filesystem — gera ruído sem valor
        '@opentelemetry/instrumentation-fs':      { enabled: false },
      }),
    ],
  });

  _sdk.start();

  console.log(`📡 [Telemetria] Dynatrace OpenTelemetry ativo`);
  console.log(`   → Endpoint : ${endpoint}`);
  console.log(`   → Serviço  : ${process.env.OTEL_SERVICE_NAME || 'api-monitor-backend'}`);

  // Flush gracioso para garantir envio dos últimos spans antes de encerrar
  process.on('SIGTERM', () => _sdk.shutdown().finally(() => process.exit(0)));
  process.on('SIGINT',  () => _sdk.shutdown().finally(() => process.exit(0)));
}

module.exports = { initTelemetry };
