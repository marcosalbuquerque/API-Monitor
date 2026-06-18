# ❓ Perguntas & Respostas — Apresentação Final
## API Monitor · Squad 14 · SkillUp Dynatrace 2026

---

## 📊 Sobre o Dashboard

**O que esse dashboard mostra?**

Mostra a saúde da nossa aplicação em tempo real. Dá pra ver quantos usuários estão acessando, se está dando erro, quanto tempo a página demora pra carregar e quais páginas são mais visitadas. É como um painel de controle — se algo quebrar, aparece aqui primeiro.

---

**O que é esse gráfico de "Active users & sessions"?**

Mostra a linha do tempo de quantas pessoas estavam usando a aplicação ao mesmo tempo. Cada pico no gráfico representa um momento em que a equipe estava testando. Sessions são as visitas completas, users são os dispositivos/navegadores distintos que acessaram.

---

**O que significa "Error rate"?**

É a taxa de erros que aconteceram na aplicação ao longo do tempo. No nosso caso ficou em **0,42%** — muito baixo. Os erros que aconteceram foram de APIs externas que ficaram fora do ar temporariamente, não bugs no nosso código.

---

**O que é a tabela de "Views"?**

Mostra cada página da aplicação e como ela se comportou. Para cada página dá pra ver: quantas visitas teve, quantos usuários diferentes, quantos erros, e as métricas de performance como LCP, CLS e tempo de carregamento. É útil pra saber qual página está com problema.

---

**O que é o gráfico de rosca (donut) de erros?**

Mostra a distribuição dos erros por página. Se uma página tem mais erro que as outras, ela vai aparecer maior no gráfico. Ajuda a identificar rapidinho onde está o problema sem precisar analisar tabela por tabela.

---

**Por que tem um tile de Logs?**

Para ver os registros brutos de eventos da aplicação — é como um histórico de tudo que aconteceu. No nosso caso os logs vêm do Dynatrace RUM e mostram as interações dos usuários com a aplicação.

---

**Esses dados são em tempo real?**

Sim. O Dynatrace captura e processa os dados em tempo real. Se alguém abrir o site agora e clicar em "Try Out", em segundos o clique aparece como uma User Action no painel.

---

**Por que o dashboard tem esse período de 30 dias?**

Configuramos assim pra mostrar todo o histórico dos nossos testes. Dá pra mudar o período facilmente — se quiser ver só hoje ou só a última hora, é só ajustar o filtro de tempo.

---

## 📓 Sobre o Notebook

**O que é esse Notebook e pra que serve?**

O Notebook é um documento de análise dentro do próprio Dynatrace. Em vez de só ver os números, a gente explica o que eles significam — conta a história dos dados. É como um relatório interativo onde as consultas ficam junto com a explicação.

---

**O que vocês analisaram no Notebook?**

A gente investigou uma pergunta específica: *os erros que aconteceram foram culpa do nosso código ou das APIs externas que monitoramos?*

A resposta, baseada nos dados: foram das APIs externas. O Dynatrace mostrou que os erros aconteceram em momentos isolados, em APIs específicas (como Numbers API que usa HTTP puro), e o frontend tratou tudo corretamente exibindo o badge DOWN para o usuário.

---

**O que é o Apdex 0,98 que aparece no Notebook?**

Apdex é uma nota de 0 a 1 que mede o quanto os usuários ficaram satisfeitos com a velocidade da aplicação. **0,98 é quase nota máxima** — significa que em quase todas as interações a aplicação respondeu dentro do tempo esperado pelo usuário. Acima de 0,94 já é considerado excelente.

---

**O que são essas 2.184 User Actions?**

São todas as interações dos usuários registradas pelo Dynatrace: cada clique em "Try Out", cada navegação entre páginas, cada abertura de detalhe de API. O Dynatrace registrou cada uma com nome, duração e resultado. Isso prova que a instrumentação funcionou — cada ação do usuário virou um dado observável.

---

**O que é LCP, INP e CLS que aparecem no Notebook?**

São as **Core Web Vitals** — métricas do Google pra medir experiência do usuário:

| Sigla | O que mede | Nosso resultado | Meta Google |
|---|---|---|---|
| LCP | Tempo pro conteúdo principal aparecer | 1,72 s | < 2,5 s ✅ |
| INP | Tempo de resposta a um clique do usuário | 146 ms | < 200 ms ✅ |
| CLS | Se a página "pula" enquanto carrega | 0,04 | < 0,1 ✅ |

Os três no verde — significa que a experiência do usuário foi considerada boa pelo padrão do Google.

---

## 🖥️ Sobre a Aplicação

**Como a aplicação sabe se a API está UP ou DOWN?**

O usuário clica em "Try Out", o frontend chama nosso backend, o backend faz uma requisição real pra URL da API (por exemplo `https://dog.ceo/api/breeds/list/all`), mede quanto tempo demorou e retorna se deu 200 OK ou deu erro. Tudo isso em segundos.

---

**O que acontece quando uma API está DOWN?**

O backend captura o erro, retorna `{ ok: false, error: "ECONNREFUSED" }` pro frontend. O frontend mostra o badge vermelho DOWN, registra no histórico da sessão e o Dynatrace captura o evento como um erro HTTP.

---

**Por que o histórico some quando a página recarrega?**

Porque não usamos banco de dados — o histórico fica na memória do navegador. Uma melhoria futura seria salvar em banco. Isso foi uma decisão consciente pra manter o projeto simples para o prazo.

---

**A aplicação está no ar agora?**

Sim: **https://api-monitor-alpha.vercel.app** — qualquer pessoa pode acessar.

---

**Como foi feito o deploy?**

A cada vez que fazemos `git push` pro GitHub, o Vercel detecta automaticamente e publica a nova versão em menos de 1 minuto. Não precisamos fazer nada manualmente.

---

## 📡 Sobre o Dynatrace

**Como o Dynatrace sabe o que está acontecendo na aplicação?**

Inserimos um pequeno script JavaScript no `index.html` da aplicação — gerado pelo próprio Dynatrace. Quando alguém abre o site, esse script carrega junto e começa a observar tudo: cliques, tempo de carregamento, erros, requisições. É invisível pro usuário mas registra tudo.

---

**O que são as User Actions personalizadas que vocês criaram?**

Quando o usuário clica em "Try Out", além do que o Dynatrace captura automaticamente, abrimos uma action com o nome da API:

> `Try Out API - Dog CEO`, `Try Out API - CoinGecko`...

Isso aparece no Dynatrace com o nome exato, quanto tempo durou e se deu certo. Sem isso, o Dynatrace só registraria "click" — genérico demais pra analisar.

---

**Como vocês sabem que o Dynatrace está funcionando?**

Dá pra ver ao vivo no painel: se abrir o site agora e clicar em "Try Out", em segundos aparece uma nova sessão e uma nova User Action no Dynatrace. Durante os testes registramos 236 sessões e 2.184 ações — prova de que estava capturando tudo.

---

**O Dynatrace afeta a velocidade do site?**

Não de forma perceptível. O script é assíncrono — carrega em paralelo sem bloquear a página. O LCP de 1,72s que medimos já inclui o script do Dynatrace rodando, e ainda ficou bem dentro da meta do Google.

---

> **Squad 14 — Boa apresentação! 🚀**
