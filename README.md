# API Monitor

> Dashboard de monitoramento de APIs públicas com integração Dynatrace.

Aplicação web que lista APIs públicas selecionadas, permite testar a disponibilidade delas com um clique (**Try Out**), exibe métricas de tempo de resposta coletadas pelo backend, e instrumenta o serviço com **Dynatrace (RUM ou OpenTelemetry)**.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| HTTP Client | axios |
| Monitoramento | Dynatrace (OneAgent ou OpenTelemetry SDK) |
| Documentação | Swagger UI (`swagger-ui-express`) |
| Deploy (sugestão) | Docker Compose / Vercel |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) **v18+**
- [npm](https://www.npmjs.com/) v9+ (vem com o Node)
- _(Opcional)_ [Docker](https://www.docker.com/) e Docker Compose

Verifique as versões instaladas:

```bash
node -v   # deve ser >= 18
npm -v    # deve ser >= 9
```

---

## Instalação das dependências

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## Rodando localmente

### Opção 1 — Separado (recomendado para desenvolvimento)

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
# Servidor iniciado em http://localhost:3001
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
# App disponível em http://localhost:5173
```

O Vite já está configurado com **proxy** para redirecionar `/api/*` ao backend. Nenhuma configuração extra necessária.

### Opção 2 — Docker Compose

```bash
docker-compose up --build
# Backend em http://localhost:3001
# Frontend em http://localhost:5173
```

---

## Variáveis de ambiente

Copie o template e preencha com seus dados:

```bash
cp backend/.env.example backend/.env
```

| Variável | Descrição | Obrigatória |
|---|---|---|
| `PORT` | Porta do backend (padrão: 3001) | Não |
| `DYNATRACE_OTLP_ENDPOINT` | URL OTLP do seu ambiente Dynatrace | Só se usar OTel |
| `DYNATRACE_API_TOKEN` | Token da API do Dynatrace | Só se usar OTel |

---

## Endpoints do backend

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Health check do próprio backend |
| `GET` | `/api/apis` | Lista de APIs do catálogo |
| `POST` | `/api/probe/:id` | Dispara health check em uma API |
| `GET` | `/api/metrics` | Histórico de checagens da sessão |

---

## Integração Dynatrace

### Opção A — OneAgent (zero código)

Instale o OneAgent no servidor ou container onde o backend roda. Ele instrumenta automaticamente o Node.js — nenhuma mudança de código necessária.

### Opção B — OpenTelemetry SDK

Instale as dependências:

```bash
cd backend
npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-otlp-http
```

Crie `backend/src/otel.js` e importe-o **antes de tudo** no `src/index.js`:

```js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-otlp-http');

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.DYNATRACE_OTLP_ENDPOINT,
    headers: {
      Authorization: `Api-Token ${process.env.DYNATRACE_API_TOKEN}`,
    },
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: 'api-monitor-backend',
});

sdk.start();
```

Preencha `backend/.env` com as credenciais Dynatrace.

### Opção C — RUM no Frontend (para deploy Vercel)

> Melhor opção para ambientes serverless como Vercel.

1. Acesse **Dynatrace → Deploy → Install Dynatrace → Set up RUM → Single Page Application**
2. Copie o snippet JavaScript gerado
3. Cole em `frontend/index.html`, dentro do `<head>`

---

## Deploy no Vercel

1. Faça push do repositório pro GitHub
2. Acesse [vercel.com](https://vercel.com/) → **Add New Project**
3. Selecione o repositório (Root Directory: `/`)
4. O Vercel detecta o `vercel.json` automaticamente
5. Clique em **Deploy**

Não são necessárias variáveis de ambiente obrigatórias para o deploy básico.

---

## Estrutura de pastas

```
api-monitor/
├── frontend/                    # React + Vite
│   └── src/
│       ├── components/
│       │   ├── ApiCard.jsx
│       │   ├── MetricsPanel.jsx
│       │   └── StatusBadge.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   └── ApiDetail.jsx
│       ├── services/
│       │   └── api.js           # Funções de fetch
│       └── App.jsx
│
├── backend/                     # Node.js + Express
│   └── src/
│       ├── routes/
│       │   ├── apis.js          # GET /api/apis
│       │   ├── probe.js         # POST /api/probe/:id
│       │   └── metrics.js       # GET /api/metrics
│       ├── data/
│       │   └── catalog.json     # Catálogo de APIs
│       ├── services/
│       │   └── probeService.js  # Health check com axios
│       └── index.js             # Entry point
│
├── docker-compose.yml
├── vercel.json
└── README.md
```

---

## Referências

- [public-apis/public-apis](https://github.com/public-apis/public-apis)
- [Dynatrace OpenTelemetry Docs](https://www.dynatrace.com/support/help/extend-dynatrace/opentelemetry)
- [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- [OpenTelemetry Node.js](https://opentelemetry.io/docs/languages/js/getting-started/nodejs/)
