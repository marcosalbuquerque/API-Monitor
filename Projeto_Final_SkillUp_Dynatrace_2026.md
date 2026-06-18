# Desafio Final SkillUp Dynatrace 2026
**Observabilidade aplicada em uma aplicação web funcional**

> **Objetivo principal:** aplicar observabilidade na prática com Dynatrace.

---

## 1. Contexto do desafio

Este material complementa o escopo final do programa SkillUp Dynatrace. O desafio é a criação de um projeto com uma orientação simples, prática e detalhada para conectar desenvolvimento de software com observabilidade.

A proposta é que cada grupo crie uma aplicação web funcional, gere interações reais de usuário e demonstre como o Dynatrace ajuda a monitorar experiência digital, performance, erros e comportamento da aplicação.

---

## 2. Objetivo principal: observabilidade em primeiro lugar

O foco do desafio não é avaliar somente quem fez o app mais bonito ou mais complexo. O app será o meio para gerar dados, eventos, ações e evidências que permitam aplicar conceitos de observabilidade.

- Aplicar na prática os conceitos de observabilidade aprendidos durante a trilha.
- Instrumentar uma aplicação web para capturar experiência do usuário, performance e erros.
- Analisar no Dynatrace dados de sessões, User Actions, carregamento, falhas e comportamento de navegação.
- Construir evidências de monitoramento por meio de dashboard, notebooks e prints explicativos.
- Desenvolver visão crítica: o que está acontecendo, por que acontece e como melhorar a experiência do usuário.

---

## 3. Liberdade de tecnologia, IA e Vibe Coding

A tecnologia utilizada fica a cargo do grupo. O importante é que a aplicação funcione, gere interação real e seja possível instrumentar o front-end com Dynatrace.

| | |
|---|---|
| **Tecnologias permitidas** | HTML, CSS, JavaScript, React, Vue, Angular, Next.js ou outro framework que o grupo domine. |
| **Uso de IA** | É permitido usar ferramentas de IA para apoiar ideação, código, layout, textos, testes e documentação. |
| **Vibe Coding** | O grupo pode usar abordagem de vibe coding, desde que entenda o projeto, consiga explicar o código e demonstre a observabilidade. |
| **Responsabilidade técnica** | Mesmo usando IA, o grupo deve validar, testar, corrigir e explicar o funcionamento da solução. |

---

## 4. Escopo mínimo da aplicação

Cada grupo deverá escolher uma ideia simples, com uma jornada clara e ações suficientes para gerar dados observáveis no Dynatrace.

- Página inicial com proposta clara do produto, serviço ou solução.
- Pelo menos uma jornada de uso real: navegar, buscar, clicar, cadastrar, filtrar, enviar formulário ou simular pedido.
- Mensagens de sucesso, validação ou erro para enriquecer a experiência e facilitar análise.
- Código versionado no GitHub.
- Execução local obrigatória e publicação pública como diferencial (ex: Vercel ou GitHub Pages).
- Instrumentação Dynatrace no front-end para coleta de acessos, User Actions, performance e erros JavaScript.

---

## 5. Ideias de projetos com foco em empreendedorismo

As ideias abaixo servem como inspiração. O grupo pode criar outras propostas, desde que a aplicação tenha utilidade, interação e seja monitorável.

| Ideia | Descrição |
|---|---|
| **Loja de maquiagem ou beleza** | Vitrine de produtos, busca por categoria, carrinho fictício, formulário de interesse, cupom simulado e checkout demonstrativo. |
| **Mini shopping online** | Catálogo com categorias, produtos patrocinados, ranking de mais acessados, filtros e página de detalhes do produto. |
| **Rede social ou influência digital** | Landing page para influenciador, vitrine de publis, links patrocinados, formulário de parceria e métricas de acesso por página. |
| **Serviço local** | Barbearia, salão, manicure, delivery, oficina, academia ou agenda de serviços com formulário de agendamento. |
| **Educação e produtividade** | Agenda de estudos, quiz, flashcards, lista de tarefas, painel de produtividade ou recomendação de conteúdos. |
| **IA aplicada** | Chatbot simples, recomendador de produtos, assistente de estudos, gerador de ideias de post ou busca inteligente. |

---

## 6. Requisitos de ambiente

| Item | Necessidade | Link oficial |
|---|---|---|
| VS Code | Instalar no PC | https://code.visualstudio.com/download |
| Git | Instalar no PC | https://git-scm.com/downloads |
| Node.js | Instalar no PC | https://nodejs.org/en/download |
| GitHub Desktop | Instalar no PC | https://desktop.github.com/download/ |
| GitHub | Criar conta pessoal ou do grupo | https://github.com/signup |
| Vercel | Criar conta para publicação | https://vercel.com/ |

---

## 7. Entregáveis obrigatórios

A entrega final deve deixar claro que o grupo não apenas desenvolveu uma aplicação, mas aplicou observabilidade e soube analisar os dados gerados.

| Entregável | Descrição |
|---|---|
| **Aplicação funcional** | Site rodando localmente e, se possível, publicado em ambiente público. |
| **Repositório GitHub** | Código organizado, com README explicando objetivo, tecnologias e como executar. |
| **Integração Dynatrace** | Evidência da aplicação instrumentada e recebendo dados no Dynatrace. |
| **Dashboard da aplicação** | Dashboard com visão executiva/técnica da aplicação: acessos, performance, erros, ações e principais páginas. |
| **Notebook de análise** | Notebook com investigação guiada: o que foi analisado, quais evidências foram encontradas e quais conclusões o grupo tirou. |
| **Evidências de monitoramento** | Prints ou links mostrando sessões, User Actions, tempo de carregamento, erros JavaScript e comportamento da experiência. |
| **Apresentação final** | Resumo da ideia, jornada do usuário, arquitetura simples, integração, dashboard, notebook, dificuldades e aprendizados. |

---

## 8. O que observar e demonstrar no Dynatrace

- Aplicação criada no Dynatrace e recebendo dados de front-end.
- Sessões de usuários com acessos reais ou simulados.
- User Actions geradas por cliques, navegação, formulários, busca e botões.
- Tempo de carregamento, experiência digital e performance das páginas.
- Erros JavaScript, falhas simuladas ou comportamentos inesperados capturados.
- Dashboard consolidando os principais indicadores da aplicação.
- Notebook explicando uma análise, hipótese ou investigação feita com os dados coletados.

---

## 9. Passo a passo para execução

1. **Definir a ideia:** Escolher tema, público-alvo, problema e jornada principal.
2. **Planejar funcionalidades:** Listar telas, botões, formulários, filtros, mensagens e fluxos.
3. **Criar repositório:** Subir o projeto no GitHub e manter commits organizados.
4. **Desenvolver a aplicação:** Construir a interface e as interações mínimas.
5. **Validar localmente:** Rodar no PC e testar a jornada principal.
6. **Instrumentar com Dynatrace:** Adicionar o script/agente no front-end e confirmar ingestão de dados.
7. **Gerar massa de uso:** Simular acessos, cliques, erros, navegação e diferentes comportamentos.
8. **Criar dashboard:** Montar uma visão clara para acompanhar saúde, experiência e erros da aplicação.
9. **Criar notebook:** Registrar a análise: pergunta, evidências, interpretação e conclusão.
10. **Publicar e apresentar:** Publicar se possível, organizar evidências e demonstrar o valor da observabilidade.

---

## 10. Calendário e divisão das aulas

| Aula / Semana | Foco | Instruções de aula | Checkpoint esperado |
|---|---|---|---|
| **05/05** | Abertura do desafio e preparação | Apresentar objetivo, formar grupos, validar instalação dos requisitos, criar contas GitHub/Vercel e escolher a ideia do projeto. | Ambiente pronto, ideia aprovada e repositório criado. Checklist do ambiente, tema escolhido e repositório criado. |
| **12/05** | App funcional e jornada do usuário | Equipe desenhar fluxo, telas e interações, definir telas, jornada do usuário, funcionalidades mínimas. Apoiar dúvidas e sugestões. | Protótipo rodando localmente com jornada mínima. |
| **19/05** | Dynatrace, testes e evidências | Orientação instrumentação do front-end, gerar acessos, User Actions, erros e analisar performance. Introduzir estrutura de dashboard e notebook e análise inicial no Dynatrace. | Dados chegando no Dynatrace e primeiras evidências coletadas. Aplicação aparecendo no Dynatrace com sessões, ações, performance e possíveis erros. |
| **26/05** | Deploy, Dashboard, notebook e apresentação | Finalizar dashboard, notebook, deploy, prints e definição da apresentação final. Apoiar publicação na Vercel, revisão do projeto. | Validação geral para entrega: app, GitHub, evidências, dashboard, notebook e apresentação. Projeto pronto para apresentação com link, repositório e evidências de monitoramento. |

---

## 11. Critérios de avaliação

| Critério | O que será avaliado |
|---|---|
| **Observabilidade aplicada** | O grupo demonstrou dados reais no Dynatrace e explicou o que eles significam. |
| **Dashboard** | Existe uma visão organizada com indicadores úteis da aplicação. |
| **Notebook** | Existe uma análise guiada, com evidências e conclusão. |
| **Funcionamento do sistema** | A aplicação roda e permite uma jornada mínima completa. |
| **Interatividade e usabilidade** | O usuário executa ações reais: cliques, navegação, busca, formulário ou cadastro. |
| **Clareza da apresentação** | O grupo explica a ideia, a construção, a instrumentação e os aprendizados. |
| **Diferenciais** | Deploy público, melhor experiência visual, uso criativo de IA, erros simulados e riqueza de monitoramento. |

---

## 12. Estrutura da apresentação final

- Problema ou oportunidade escolhida pelo grupo.
- Demonstração rápida da aplicação e da jornada do usuário.
- Tecnologias usadas, incluindo ferramentas de IA, se utilizadas.
- Como foi feita a instrumentação com Dynatrace.
- Dashboard criado e principais indicadores acompanhados.
- Notebook criado e análise realizada.
- Erros, performance ou comportamentos identificados.
- Aprendizados, dificuldades e melhorias futuras.

---

## 13. Entregáveis obrigatórios - resumo final

Para evitar dúvidas no momento da entrega, todo grupo deve apresentar obrigatoriamente os quatro itens abaixo:

| Entregável | O que precisa ser entregue |
|---|---|
| **APP / Site** | Aplicação funcional rodando localmente ou publicada, com jornada de uso demonstrável e interações reais. |
| **DASHBOARD** | Dashboard no Dynatrace com indicadores da aplicação, como acessos, ações de usuário, performance, erros e páginas principais. |
| **NOTEBOOK** | Notebook com análise guiada das evidências: pergunta investigada, dados observados, interpretação e conclusão. |
| **APRESENTAÇÃO** | Apresentação final explicando a ideia, a aplicação, a instrumentação, o dashboard, o notebook, aprendizados e dificuldades. |

**Checklist final: APP/Site + DASHBOARD + NOTEBOOK + APRESENTAÇÃO**
