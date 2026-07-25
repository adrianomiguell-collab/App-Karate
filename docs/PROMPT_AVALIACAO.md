# Prompt de Avaliação Completa do Projeto

Este é o prompt estruturado pronto para ser enviado ao Claude. Ele instrui a IA a analisar a arquitetura, design, protótipo e código do aplicativo **Atarashii App** sem realizar alterações nos arquivos reais, utilizando papéis especializados (agentes e skills).

---

```markdown
Você é um comitê de especialistas em engenharia de software e design de produtos de tecnologia, atuando como múltiplos agentes especializados trabalhando em conjunto para revisar este projeto. 

Seu objetivo é analisar todo o repositório do projeto **Atarashii App** (um aplicativo móvel educativo sobre Karate Shotokan), destacar pontos positivos, pontos negativos de design e código, e propor melhorias detalhadas, **sem alterar nada no código por enquanto**.

Para isso, divida sua análise utilizando as seguintes especialidades (Agentes/Skills):

1. 💻 **Agente de Arquitetura e Engenharia Mobile (React Native / Expo)**
   - Avaliar a estrutura e organização do código no diretório `/mobile`.
   - Analisar o arquivo principal `/mobile/App.js` (atualmente monolítico com ~765 linhas), verificando modularidade, escalabilidade, gerenciamento de estado, consumo de dados locais (JSONs) e performance.
   - Avaliar a configuração do Expo (`app.json`, dependências em `package.json`).

2. 🎨 **Agente de Design de Interface, Experiência do Usuário (UI/UX) e Front-End**
   - Avaliar o protótipo web (/prototype/index.html, /prototype/app.js, /prototype/styles.css) e a fidelidade visual/usabilidade sugerida no código mobile.
   - Analisar consistência de navegação, acessibilidade (a11y), ergonomia móvel, fontes, paleta de cores e uso de componentes.
   - Avaliar a organização e responsividade visual.

3. 📖 **Agente de Negócio, Conteúdo e Domínio (Karate Shotokan)**
   - Cruzar os arquivos de documentação em `/docs` (Diretriz, Escopo MVP, Backlog, Roadmap, Mapa de Telas) com a implementação atual de dados em `/mobile/src/data/` (katas, glossário, técnicas, bases, quiz).
   - Identificar lacunas de conteúdo em relação ao escopo definido e à base de conhecimento de Karate.

---

### INSTRUÇÕES DE EXECUÇÃO DA ANÁLISE

Por favor, execute os seguintes passos de leitura e análise no repositório:
1. Leia a documentação em `/docs` para entender o contexto do produto, arquitetura e escopo.
2. Examine `/mobile/App.js` e a estrutura de dados em `/mobile/src/data`.
3. Examine o protótipo sob `/prototype/`.

---

### ESTRUTURA DO RELATÓRIO REQUERIDO

Gere um relatório detalhado dividido em:

#### 1. Visão Geral da Arquitetura e Estrutura
- Resumo do estado atual do projeto (estrutura física, maturidade tecnológica, preparação para MVP).

#### 2. Avaliação de Código (Pontos Positivos & Oportunidades de Melhoria)
- **Pontos Positivos:** O que está bem feito, limpo e adequado às boas práticas (Ex: React hooks bem aplicados, separação de dados locais, uso correto de Expo Video).
- **Oportunidades de Melhoria / Gargalos:** Code smells, dependências inadequadas, problemas de performance potenciais, riscos do arquivo `App.js` monolítico.

#### 3. Avaliação de UI/UX e Design (Pontos Positivos & Oportunidades de Melhoria)
- **Pontos Positivos:** Feedback sobre o protótipo e estilo atual (uso de tabs, layout de navegação).
- **Oportunidades de Melhoria:** Detalhes de espaçamento, consistência visual, usabilidade do player de vídeo, acessibilidade e adaptabilidade para telas de diferentes tamanhos (iOS/Android).

#### 4. Proposta de Ajustes e Refatoração (Sem alterar código por enquanto)
Apresente um plano de ação estruturado em:
- **Ações Imediatas (Quick Wins):** Ajustes simples no código ou design que trazem grande retorno com baixo esforço.
- **Refatorações de Código Recomendadas:** Como dividir o `App.js` monolítico em componentes menores e modularizados, estruturando melhores práticas de navegação (ex: Expo Router ou React Navigation).
- **Evolução do Design/Componentização:** Recomendações para melhorar a UI/UX de acordo com as especificações do projeto.

> ⚠️ **IMPORTANTE:** Não modifique nenhum arquivo do projeto ainda. Apenas forneça o relatório detalhado e as propostas de refatoração para validação.
```
