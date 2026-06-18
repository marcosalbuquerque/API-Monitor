# Arquitetura e estrutura de pastas

## Visão geral

- **Frontend (React + Vite):** UI, chamadas para `/api/*`, RUM Dynatrace via script tag.
- **Backend (Express):** usado localmente para desenvolvimento e API completa.
- **Vercel Functions (`/api`):** rotas serverless para deploy (espelham as rotas do backend).

## Fluxo de runtime

```
Browser (React/Vite)
  └─ /api/apis, /api/probe/:id, /api/metrics
        ├─ Local: backend/ (Express)
        └─ Deploy: api/ (Vercel Functions)
```

## Estrutura do repositório (principal)

```
api/                           # Vercel Functions (deploy)
  _metricsStore.js             # Histórico em memória (serverless)
  apis.js                      # GET /api/apis
  metrics.js                   # GET /api/metrics
  probe/
    [id].js                    # POST /api/probe/:id

backend/                       # Express (dev/local)
  package.json
  .env.example
  src/
    index.js                   # Bootstrap do servidor
    config/
      swagger.js               # Swagger spec global
      telemetry.js             # Telemetria backend (local)
    data/
      catalog.json             # Catálogo de APIs
    routes/
      apis.js                  # GET /api/apis
      metrics.js               # GET /api/metrics
      probe.js                 # POST /api/probe/:id
      swagger.js               # GET /api/swagger/:id
    services/
      probeService.js          # Lógica de probe com axios

frontend/                      # React + Vite
  index.html                   # Entry HTML + RUM Dynatrace
  vite.config.js               # Proxy /api -> backend local
  package.json
  .env.example
  src/
    App.jsx
    main.jsx
    index.css
    telemetry.js               # Telemetria frontend (opcional)
    components/
      ApiCard/
      ApiList/
      CategoryBadge/
      CategoryFilter/
      Header/
      Hero/
      MetricsDashboard/
      MetricsHistory/
      Notification/
      ReactiveBackground/
      StatusBadge/
    hooks/
      useChangeTheme.js
      useMetrics.js
      useNotifications.js
    pages/
      Home.jsx
      ApiDetail.jsx
    services/
      api.js                   # Client HTTP para o backend

vercel.json                    # Configuração de deploy
README.md                      # Guia de uso
API Monitor — Especificação do Projeto.md
```
