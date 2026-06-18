# 🛰️ API Monitor — Apresentação Final
## Desafio SkillUp Dynatrace 2026 · Squad 14

**Porto Digital · Universidade Extreme**

**Equipe:** Marcos Albuquerque · Victor Hugo Lito · Hugo Oliveira · Lara Ketlin · Izabel Matos · Gustavo Alves · Tarso Vieira · Pedro Silva · Lucas Rodrigues

---

## 🔗 Links de Acesso Rápido

| Recurso | Link |
|---|---|
| 🌐 **Aplicação (Vercel)** | https://api-monitor-alpha.vercel.app |
| 📓 **Notebook (Dynatrace)** | https://ejc20690.apps.dynatrace.com/ui/document/v0/#share=8ce77e11-0f00-4413-b684-48b8c625108c |
| 📊 **Dashboard (Dynatrace)** | https://ejc20690.apps.dynatrace.com/ui/document/v0/#share=6c73e4f9-e9d2-4372-8e84-24f5e80eaaaa |
| 💻 **Repositório (GitHub)** | https://github.com/marcosalbuquerque/API-Monitor |

---

## 1. 🎯 Problema e Oportunidade

### O problema
Aplicações modernas dependem de dezenas de APIs externas.
Quando uma dessas APIs cai ou fica lenta, o usuário sofre — e muitas vezes **ninguém percebe até ser tarde demais**.

### A oportunidade
Criar um dashboard que monitore APIs públicas em tempo real, meça latência e disponibilidade, e seja **ele mesmo instrumentado com Dynatrace** — transformando a aplicação em um laboratório vivo de observabilidade.

### A proposta
> **API Monitor** — um dashboard que testa a disponibilidade de APIs públicas com um clique, exibe o tempo de resposta em milissegundos e registra o histórico da sessão, enquanto o Dynatrace monitora toda a experiência do usuário por trás das cenas.

---

## 2. 🖥️ Demonstração da Aplicação

**Abrir:** https://api-monitor-alpha.vercel.app

### Jornada do usuário (roteiro de demo)

1. **Home** — mostrar o catálogo com as 10 APIs públicas cadastradas
2. **Filtro por categoria** — filtrar por "Weather", "Finance", "Animals"
3. **Try Out** — clicar em 3 ou 4 APIs diferentes e mostrar:
   - Badge **UP** (verde) com latência em ms
   - Badge **DOWN** (vermelho) se a API estiver fora
   - Loading state no botão durante a requisição
4. **Histórico** — mostrar o painel "Últimas checagens" acumulando resultados
5. **Ver detalhes** — navegar para a página de detalhe de uma API
6. **Swagger** — mostrar a documentação Swagger integrada

### APIs no catálogo

| API | Categoria |
|---|---|
| Dog CEO | Animals |
| Open Notify (ISS) | Science |
| CoinGecko | Finance |
| PokeAPI | Games |
| Open Meteo | Weather |
| JokeAPI | Entertainment |
| GitHub API | Development |
| REST Countries | Geography |
| Advice Slip | Misc |
| Numbers API | Education |

---

## 3. 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia | Papel |
|---|---|---|
| **Frontend** | React + Vite | Interface do usuário |
| **Backend** | Node.js + Express | Vercel Functions (serverless) |
| **HTTP Client** | Axios | Requisições às APIs externas |
| **Observabilidade** | Dynatrace RUM + Custom Actions | Monitoramento de experiência |
| **Tracing** | OpenTelemetry (browser) | Spans nas chamadas de API |
| **Documentação** | Swagger UI | Exploração dos endpoints |
| **Deploy** | Vercel | Hospedagem pública |
| **Versionamento** | GitHub | Código organizado com commits |
| **IA utilizada** | Antigravity (Google DeepMind) | Apoio ao desenvolvimento e código |

---

## 4. 📡 Instrumentação com Dynatrace

### Como foi feita

#### Passo 1 — RUM Script no `index.html`
```html
<script type="text/javascript"
  src="https://js-cdn.dynatrace.com/jstag/.../4e0aaf618ae6162a_complete.js"
  crossorigin="anonymous">
</script>
```
Captura automaticamente: carregamento de página, cliques, navegação, XHR/fetch, erros JavaScript e Core Web Vitals.

#### Passo 2 — Custom Actions com `dtrum`
Cada clique em "Try Out" gera uma **User Action nomeada** no Dynatrace:

```js
const actionId = dynatrace.enterAction(`Try Out API - ${api.name}`, "Custom Action");
// ... executa o probe ...
dynatrace.leaveAction(actionId);
```

#### Passo 3 — Erros reportados ao Dynatrace
```js
dynatrace.reportError(errorObj, message);
```
Erros de rede são enviados como **JS Exceptions** para o Dynatrace.

#### Passo 4 — OpenTelemetry (spans manuais)
O `telemetry.js` cria spans para `getApis`, `probeApi` e `getMetrics` com atributos como `probe.ok`, `probe.latency_ms` e `http.status_code`.

### O que o Dynatrace captura automaticamente
- ✅ Sessões de usuário com replay
- ✅ User Actions nomeadas por clique em "Try Out"
- ✅ Tempo de carregamento de cada página
- ✅ Core Web Vitals (LCP, INP, CLS)
- ✅ Erros JavaScript e falhas de rede
- ✅ Waterfall de requisições HTTP

---

## 5. 📊 Dashboard — Principais Indicadores

**Abrir:** https://ejc20690.apps.dynatrace.com/ui/document/v0/#share=6c73e4f9-e9d2-4372-8e84-24f5e80eaaaa

### Estrutura do Dashboard

| Tile | O que mostra |
|---|---|
| **Active users & sessions** | Linha do tempo de usuários e sessões ativos (últimos 30 dias) |
| **Error rate** | Taxa de erros por tipo em gráfico de barras |
| **Views** | LCP, FID, CLS, INP, TTFB e load por página em tabela |
| **Errors per endpoint** | Donut com erros agrupados por view |
| **Logs** | Tabela de logs raw dos últimos 7 dias |

### Números evidenciados

| Indicador | Valor | Interpretação |
|---|---|---|
| Apdex | **0,98** | Excelente — usuários muito satisfeitos |
| Sessões | **236** | Acessos reais durante os testes |
| Usuários únicos | **181** | Diferentes navegadores/dispositivos |
| User Actions | **2.184** | Cliques, navegação, Try Out registrados |
| Requests HTTP | **5.032** | Maioria 200 OK |
| Falhas | **9** (0,42%) | Baixíssima taxa de erro |
| Tempo médio de carga | **1,31 s** | Dentro do aceitável |

---

## 6. 📓 Notebook — Análise de Observabilidade

**Abrir:** https://ejc20690.apps.dynatrace.com/ui/document/v0/#share=8ce77e11-0f00-4413-b684-48b8c625108c

### Estrutura do Notebook (12 seções)

1. Introdução ao projeto
2. Objetivo principal e específicos
3. Descrição da aplicação
4. Necessidade do projeto
5. Conceitos de Observabilidade (métricas, logs, traces, eventos)
6. Explicação detalhada de cada métrica do dashboard
7. Uso do Dynatrace no projeto
8. Análise do dashboard — o que foi observado
9. Aprendizados da equipe
10. Ganhos obtidos
11. Conclusão
12. Melhorias futuras

### Core Web Vitals analisados

| Métrica | Valor medido | Referência Google | Status |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | 1,72 s | < 2,5 s | ✅ Bom |
| **INP** (Interaction to Next Paint) | 146 ms | < 200 ms | ✅ Bom |
| **CLS** (Cumulative Layout Shift) | 0,04 | < 0,1 | ✅ Bom |
| **Page Load** | 1,31 s | — | ✅ Bom |

### Pergunta investigada no Notebook
> *"As falhas registradas são consequência da instabilidade das APIs externas ou de problemas no próprio frontend?"*

**Resposta:** As 9 falhas (0,42%) ocorreram por **indisponibilidade temporária de APIs públicas externas**, não por bugs da aplicação. O frontend capturou e exibiu os erros corretamente, e o Dynatrace os registrou — evidenciando que a observabilidade funcionou como esperado.

---

## 7. ⚠️ Erros e Performance Identificados

### Erros encontrados

| Tipo | Quantidade | Causa | Resolução |
|---|---|---|---|
| HTTP errors (APIs down) | 9 | APIs públicas instáveis | Exibido como DOWN + badge vermelho |
| JS Exceptions | 2 | Bugs durante desenvolvimento | Corrigidos antes da entrega |

### Comportamentos observados
- **Pico de requisições** durante os testes da equipe (visível no gráfico de sessões)
- **Tempo de resposta** das APIs: entre 80ms e 800ms dependendo da API
- **APIs mais lentas:** Open Meteo e REST Countries (maior payload)
- **APIs mais rápidas:** GitHub API e Advice Slip (< 150ms)
- **Navegador predominante:** Google Chrome · Desktop · Brasil

### Demonstração de erro ao vivo *(diferencial)*
> Clicar em "Try Out" em uma API instável e mostrar no Dynatrace o erro sendo capturado em tempo real: **User Sessions → erros / JS Exceptions**

---

## 8. 📚 Aprendizados, Dificuldades e Melhorias Futuras

### Aprendizados técnicos
- Instrumentação RUM em aplicação React real
- Custom Actions com `dtrum.enterAction` / `leaveAction`
- Diferença entre métricas, logs e traces na prática
- Análise de Core Web Vitals e impacto na experiência do usuário
- DQL para consultas customizadas no Dynatrace

### Aprendizados sobre observabilidade
> *"Observabilidade não é só detectar quando algo quebra — é entender por que quebrou, quem foi afetado e o que sentiu."*

### Dificuldades encontradas
- Ambiente **serverless** (Vercel) não mantém estado entre requisições → histórico de métricas perdido entre chamadas → resolvido com merge local no frontend
- Validar que os dados chegavam ao Dynatrace após configurar o snippet RUM
- Configurar Vercel Functions com caminhos relativos ao `catalog.json`

### Melhorias futuras propostas
- 🔔 Alertas automáticos para indisponibilidade das APIs
- 🗄️ Persistir histórico em banco de dados
- 📈 Definir SLOs formais de disponibilidade e latência
- 📡 Monitorar APIs brasileiras (ViaCEP, BrasilAPI)
- 🔍 Traces distribuídos completos (frontend → backend → API externa)
- 📊 Logs estruturados com correlação por `traceId`

---

## ✅ Checklist Final de Entregáveis

| Entregável | Status | Link / Local |
|---|---|---|
| **APP / Site** | ✅ Publicado | https://api-monitor-alpha.vercel.app |
| **Dashboard** | ✅ 6 tiles com dados reais | https://ejc20690.apps.dynatrace.com/ui/document/v0/#share=6c73e4f9-e9d2-4372-8e84-24f5e80eaaaa |
| **Notebook** | ✅ 12 seções de análise | https://ejc20690.apps.dynatrace.com/ui/document/v0/#share=8ce77e11-0f00-4413-b684-48b8c625108c |
| **Repositório** | ✅ Organizado com README | https://github.com/marcosalbuquerque/API-Monitor |
| **JSONs Dynatrace** | ✅ Versionados no repo | `API Monitor - SQUAD 14.json` + `API Monitor - Squad 14 (1).json` |
| **Apresentação** | ✅ Este documento | `APRESENTACAO.md` |

---

> **Squad 14 — Porto Digital · Universidade Extreme · SkillUp Dynatrace 2026**
