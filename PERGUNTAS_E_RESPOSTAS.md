# ❓ Perguntas & Respostas — Apresentação Final
## API Monitor · Squad 14 · SkillUp Dynatrace 2026

> Guia de apoio para responder perguntas técnicas durante a apresentação.

---

## 📦 Sobre a Aplicação

---

**O que é o API Monitor?**

É um dashboard web que monitora a disponibilidade de APIs públicas em tempo real. O usuário clica em "Try Out" em qualquer API cadastrada, o backend faz a requisição real, mede o tempo de resposta e retorna se está UP ou DOWN. Todo esse comportamento é instrumentado com Dynatrace, que captura a experiência do usuário.

---

**Por que monitorar APIs públicas?**

Aplicações modernas dependem de serviços externos. Se uma API de terceiro cai, o usuário é impactado. Sem monitoramento, ninguém sabe que o problema existe até alguém reclamar. O API Monitor demonstra como observabilidade resolve isso: você vê o problema antes do usuário reportar.

---

**Como o "Try Out" funciona por dentro?**

1. O usuário clica no botão no frontend (React)
2. O frontend chama `POST /api/probe/{id}` — uma Vercel Function (serverless)
3. Essa função faz um `fetch` para a URL real da API externa (ex: `https://dog.ceo/api/breeds/list/all`)
4. Mede o tempo entre o início e o fim da requisição (latência em ms)
5. Retorna `{ ok: true, status: 200, latencyMs: 143 }` para o frontend
6. O frontend atualiza o badge (UP/DOWN) e o histórico na tela

---

**O que é uma Vercel Function?**

É uma função serverless — um arquivo `.js` na pasta `api/` do projeto que o Vercel transforma automaticamente em um endpoint HTTP. Não é um servidor sempre ligado: ela só existe enquanto está processando uma requisição. Cada chamada pode ser um processo diferente.

---

**Por que o histórico some quando a página recarrega?**

Porque não usamos banco de dados — o histórico fica na memória do React (estado local). Isso foi uma decisão proposital para manter o projeto simples. Uma melhoria futura seria persistir em banco.

---

**Qual a diferença entre o `backend/` e o `api/`?**

- `backend/` → Express completo, para rodar **localmente** com `npm run dev`
- `api/` → Vercel Functions, para rodar **em produção** no Vercel

Os dois fazem a mesma coisa, mas têm formatos diferentes. O Vercel não suporta um servidor Express sempre ligado — por isso existe a pasta `api/` com funções serverless.

---

## 📡 Sobre o Dynatrace

---

**O que é o Dynatrace RUM?**

RUM = Real User Monitoring. É uma tecnologia que monitora a experiência real dos usuários no navegador. Um pequeno script JavaScript é inserido no `index.html` da aplicação. Ele captura automaticamente: carregamento de página, cliques, navegação, requisições HTTP, erros JavaScript e métricas de performance.

---

**Como o Dynatrace foi instalado no projeto?**

Com uma única linha no `frontend/index.html`:

```html
<script src="https://js-cdn.dynatrace.com/jstag/.../4e0aaf618ae6162a_complete.js"></script>
```

Esse script é gerado pelo próprio Dynatrace (menu Deploy → Install → RUM → Single Page Application). Não precisa mexer no código React para que sessões e page loads sejam capturados.

---

**O que é o `dtrum`?**

É o objeto JavaScript que o script do Dynatrace injeta no `window` do navegador. Através dele é possível chamar funções como:
- `dtrum.enterAction()` → abre uma User Action personalizada
- `dtrum.leaveAction()` → fecha a User Action
- `dtrum.reportError()` → reporta um erro manualmente
- `dtrum.sendCustomEvent()` → envia um evento customizado

No projeto, o arquivo `dynatrace.js` encapsula essas chamadas com verificação de disponibilidade (`if typeof window.dtrum !== 'undefined'`) para não quebrar quando o script não está carregado (ex: ambiente de desenvolvimento).

---

**O que é uma User Action no Dynatrace?**

É um registro de uma interação do usuário com a aplicação. O Dynatrace cria User Actions automaticamente para cliques em links e navegação entre páginas. No projeto, criamos **Custom Actions** manualmente para cada clique em "Try Out":

```js
// Abre a action — Dynatrace começa a cronometrar
const actionId = dynatrace.enterAction("Try Out API - Dog CEO", "Custom Action");

// ... faz a requisição ...

// Fecha a action — Dynatrace para o cronômetro e registra tudo
dynatrace.leaveAction(actionId);
```

Isso aparece no Dynatrace como `Try Out API - Dog CEO` na lista de User Actions, com duração e status.

---

**O que é OpenTelemetry e como foi usado?**

OpenTelemetry é um padrão aberto para instrumentação. No projeto, usamos o SDK de browser do OpenTelemetry para criar "spans" (rastreamentos) nas chamadas de API:
- `getApis` → span quando carrega o catálogo
- `probeApi` → span quando faz o Try Out, com atributos como `probe.ok`, `probe.latency_ms`
- `getMetrics` → span quando busca o histórico

Esses spans são enviados ao Dynatrace via OTLP (OpenTelemetry Protocol). É uma camada adicional sobre o RUM — enquanto o RUM captura tudo automaticamente, o OTel dá controle manual e semântico.

---

**Qual a diferença entre RUM e OpenTelemetry no projeto?**

| | RUM (dtrum) | OpenTelemetry |
|---|---|---|
| **Configuração** | Script no `index.html` | SDK instalado + `initTelemetry()` no `main.jsx` |
| **O que captura** | Sessões, page loads, cliques, erros, Web Vitals | Spans manuais nas chamadas de API |
| **Controle** | Automático | Manual — você define o que rastrear |
| **Quando ativa** | Sempre (script carregado) | Só com variáveis de ambiente configuradas |

---

**O que é Apdex?**

Application Performance Index — um índice de 0 a 1 que mede a satisfação dos usuários com o desempenho:
- **0,94 a 1,0** → Excelente (usuários satisfeitos)
- **0,85 a 0,93** → Bom
- **0,70 a 0,84** → Regular
- **< 0,70** → Ruim

O projeto registrou **Apdex 0,98** — quase perfeito. Significa que a aplicação respondeu dentro do tempo esperado na esmagadora maioria das interações.

---

## 📊 Sobre o Dashboard

---

**O que é DQL?**

DQL = Dynatrace Query Language. É a linguagem de consulta do Dynatrace, similar ao SQL, mas projetada para dados de observabilidade. Permite filtrar eventos, agregar métricas e construir visualizações.

Exemplo do projeto:

```dql
fetch user.events
| filter dt.rum.application.entity == "APPLICATION-4E0AAF618AE6162A"
| summarize session.count = countDistinct(dt.rum.session.id)
```

---

**Por que o `fetch logs` mostra dados de outros projetos?**

Porque `fetch logs` busca logs de toda a infraestrutura do ambiente Dynatrace — não só do API Monitor. Para filtrar só os dados do projeto, usa-se `fetch user.events` com o filtro `dt.rum.application.entity == "APPLICATION-4E0AAF618AE6162A"`, que é o ID da aplicação RUM do API Monitor.

---

**O que são Core Web Vitals?**

São métricas definidas pelo Google para medir a qualidade da experiência do usuário no navegador:

| Métrica | Significado | Valor do projeto | Meta Google |
|---|---|---|---|
| **LCP** | Tempo para o maior elemento visível aparecer | 1,72 s | < 2,5 s ✅ |
| **INP** | Tempo de resposta a uma interação do usuário | 146 ms | < 200 ms ✅ |
| **CLS** | Quanto o layout "pula" visualmente durante o carregamento | 0,04 | < 0,1 ✅ |
| **TTFB** | Tempo até o primeiro byte chegar do servidor | — | < 800 ms ✅ |

---

**O que são as 9 falhas registradas?**

São requisições HTTP que retornaram erro (4xx ou 5xx) durante os testes. A causa: algumas APIs públicas ficaram temporariamente fora do ar. O frontend capturou o erro, exibiu o badge DOWN para o usuário, e o `dynatrace.reportError()` enviou o erro como JS Exception para o Dynatrace. A taxa foi de apenas **0,42%** — muito baixa.

---

## 📓 Sobre o Notebook

---

**O que é um Notebook no Dynatrace?**

É um documento interativo dentro do Dynatrace onde você pode misturar texto explicativo com queries DQL e visualizações. Funciona como um Jupyter Notebook — serve para documentar análises, investigar problemas e compartilhar evidências.

---

**Qual foi a análise feita no Notebook?**

A pergunta investigada foi: *"As falhas registradas são consequência da instabilidade das APIs externas ou de problemas no próprio frontend?"*

A resposta, baseada nos dados do Dynatrace: as falhas ocorreram em views específicas (páginas de APIs instáveis), não em todas as páginas. Isso indica que o frontend estava funcionando corretamente — ele capturou os erros das APIs externas e os tratou como esperado.

---

## 🛠️ Sobre a Arquitetura

---

**Como o projeto está organizado?**

```
API Monitor
├── api/              ← Vercel Functions (produção)
│   ├── apis.js       ← GET /api/apis — retorna o catálogo
│   ├── metrics.js    ← GET /api/metrics — retorna histórico
│   └── probe/
│       └── [id].js   ← POST /api/probe/:id — faz o health check
├── backend/          ← Express (desenvolvimento local)
└── frontend/         ← React + Vite
    └── src/
        ├── utils/dynatrace.js  ← wrapper do dtrum
        ├── utils/logger.js     ← logger com integração Dynatrace
        └── telemetry.js        ← OpenTelemetry SDK
```

---

**Por que React e não HTML puro?**

React facilita o gerenciamento de estado (ex: atualizar só o card da API que foi testada, sem recarregar a página inteira). Também é mais próximo do que o mercado usa em aplicações reais — o que torna o projeto mais representativo para demonstrar observabilidade em produção.

---

**Como foi feito o deploy?**

1. Código no GitHub (`main` branch)
2. Vercel conectado ao repositório
3. A cada `git push origin main`, o Vercel faz deploy automático
4. O `vercel.json` configura o build do frontend e o roteamento das Vercel Functions

---

**Foi usado IA no projeto? Como?**

Sim — a ferramenta **Antigravity** (Google DeepMind) foi usada para:
- Scaffolding inicial do projeto (estrutura de pastas, package.json)
- Implementação das Vercel Functions
- Configuração do proxy Vite e do roteamento
- Criação da documentação (README, APRESENTACAO.md)

O código foi revisado, testado e validado pela equipe — inclusive foram feitas correções específicas, como o bug do histórico sendo apagado pelo polling no ambiente serverless do Vercel.

---

> **Squad 14 — Boa apresentação amanhã! 🚀**
