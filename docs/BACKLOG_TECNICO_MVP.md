# Backlog Tecnico Do MVP - Atarashii App

## Objetivo

Organizar o trabalho tecnico necessario para sair do prototipo navegavel e chegar a um MVP simples, evolutivo e alinhado ao roadmap.

## Principios

- MVP simples para iniciantes.
- Estrutura preparada para Katas, Kihon, videos, trilhas, Sensei Online e area do instrutor.
- Compatibilidade obrigatoria com Android e iOS.
- Sem login obrigatorio no MVP.
- Sem IA no MVP.
- Dados separados por dominio.
- Conteudo separado de progresso do usuario.

## Epico 1 - Base Do App

### Feature: Estrutura do projeto real

User Story:

- Como equipe do produto, quero uma base organizada de app mobile para evoluir sem depender do prototipo estatico.

Criterios de aceite:

- projeto com pastas claras para componentes, dados, assets e telas;
- app roda localmente em ambiente de desenvolvimento;
- app pode ser testado em Android e iOS via Expo ou fluxo equivalente;
- README explica como iniciar;
- estrutura nao mistura dados, UI e regras de negocio em um unico arquivo.

Prioridade: Alta.

### Feature: Compatibilidade Android e iOS

User Story:

- Como aluno, quero usar o Atarashii App em Android ou iPhone.

Criterios de aceite:

- tecnologia escolhida suporta Android e iOS;
- navegacao, botoes e textos funcionam bem em telas pequenas;
- imagens e videos sao exibidos de forma compativel nos dois sistemas;
- nao ha recurso exclusivo de uma plataforma no MVP.

Prioridade: Alta.

### Feature: Navegacao principal

User Story:

- Como aluno iniciante, quero navegar entre Aprender, Treinar, Consultar e Revisar.

Criterios de aceite:

- navegacao funciona em celular e desktop;
- area ativa fica clara;
- Home permite voltar ao caminho principal.

Prioridade: Alta.

## Epico 2 - Conteudo E Dados

### Feature: Carregamento dos JSONs

User Story:

- Como app, quero carregar conteudos de arquivos estruturados para facilitar evolucao futura.

Criterios de aceite:

- app carrega conteudos, tecnicas, bases, katas, glossario, regras e quiz;
- erros de carregamento sao tratados;
- dados ficam separados por dominio.

Prioridade: Alta.

### Feature: Modelo preparado para videos

User Story:

- Como equipe do produto, quero que Katas e Kihon aceitem videos oficiais no futuro sem refatoracao grande.

Criterios de aceite:

- katas e tecnicas possuem campos opcionais para videoUrl, videoProvider e associationVideoUrl;
- telas ignoram campos vazios;
- quando houver video, a tela consegue mostrar link oficial.

Prioridade: Alta.

### Feature: Assets visuais autorizados

User Story:

- Como aluno, quero ver imagens e diagramas para compreender bases e katas.

Criterios de aceite:

- assets ficam em pasta propria;
- dados apontam para os assets;
- imagens aparecem nas telas de detalhe;
- app funciona mesmo quando um item nao tem imagem.

Prioridade: Alta.

## Epico 3 - Aprender

### Feature: Lista de conteudos

User Story:

- Como aluno iniciante, quero acessar historia, fundamentos, conduta e graduacao.

Criterios de aceite:

- lista exibe titulo, resumo e categoria;
- conteudo abre em tela de detalhe;
- usuario consegue marcar como estudado.

Prioridade: Alta.

### Feature: Detalhe de conteudo

User Story:

- Como aluno, quero ler conteudos curtos e organizados para estudar sem depender do PDF.

Criterios de aceite:

- detalhe mostra titulo, resumo, texto e metadados;
- conteudos relacionados podem ser exibidos quando existirem;
- texto e legivel no celular.

Prioridade: Alta.

## Epico 4 - Treinar

### Feature: Tecnicas de Kihon

User Story:

- Como aluno iniciante, quero consultar tecnicas basicas de Kihon.

Criterios de aceite:

- lista de tecnicas aparece por categoria;
- detalhe mostra descricao, tipo e aviso de pratica com sensei;
- estrutura aceita videos futuros.

Prioridade: Alta.

### Feature: Bases

User Story:

- Como aluno, quero consultar bases/Dachi com apoio visual.

Criterios de aceite:

- lista de bases aparece no app;
- detalhe exibe imagem quando disponivel;
- app nao quebra se imagem estiver ausente.

Prioridade: Alta.

### Feature: Katas iniciais

User Story:

- Como aluno iniciante, quero consultar os katas iniciais com ficha tecnica.

Criterios de aceite:

- lista exibe Heian Shodan, Heian Nidan, Heian Sandan, Heian Yondan, Heian Godan e Tekki Shodan;
- detalhe mostra significado, kyodos, tempo, kiai e diagrama;
- estrutura aceita videos, notas e checklist futuros.

Prioridade: Alta.

## Epico 5 - Consultar

### Feature: Glossario

User Story:

- Como aluno, quero pesquisar termos japoneses usados no dojo.

Criterios de aceite:

- termos aparecem em lista;
- filtro ou busca encontra termos relevantes;
- detalhe mostra significado e categoria.

Prioridade: Alta.

### Feature: Regras essenciais

User Story:

- Como aluno, quero consultar regras basicas de Kumite e Kata.

Criterios de aceite:

- regras aparecem separadas por modalidade;
- pontuacoes Yuko, Waza-Ari e Ippon ficam claras;
- imagens de apoio podem aparecer quando disponiveis.

Prioridade: Alta.

## Epico 6 - Revisar

### Feature: Quiz da apostila

User Story:

- Como aluno, quero responder perguntas para revisar o conteudo.

Criterios de aceite:

- quiz exibe 50 perguntas;
- usuario seleciona alternativas;
- resultado mostra acertos;
- usuario pode refazer.

Prioridade: Alta.

### Feature: Revisao de erros

User Story:

- Como aluno, quero ver o que errei para estudar melhor.

Criterios de aceite:

- resultado lista perguntas erradas;
- mostra resposta correta;
- mostra explicacao quando houver.

Prioridade: Media.

## Epico 7 - Progresso

### Feature: Progresso local

User Story:

- Como aluno, quero marcar conteudos estudados para acompanhar minha evolucao.

Criterios de aceite:

- usuario marca item como estudado;
- progresso geral e atualizado;
- dados persistem localmente no navegador.

Prioridade: Media.

### Feature: Preparacao para progresso com login futuro

User Story:

- Como equipe do produto, quero que o progresso local possa migrar para conta futuramente.

Criterios de aceite:

- progresso usa ids estaveis;
- progresso nao altera arquivos de conteudo;
- estrutura separa itemType, itemId, status e updatedAt em evolucao futura.

Prioridade: Media.

## Epico 8 - Busca

### Feature: Busca global

User Story:

- Como aluno, quero buscar termos, katas, tecnicas e regras rapidamente.

Criterios de aceite:

- busca encontra itens por titulo, nome, termo, descricao e categoria;
- resultados indicam tipo do item;
- usuario abre detalhe a partir do resultado.

Prioridade: Alta.

## Epico 9 - Identidade Visual

### Feature: Marca Atarashii

User Story:

- Como aluno, quero reconhecer que o app pertence a identidade Atarashii.

Criterios de aceite:

- app usa nome Atarashii App;
- logo aparece em pontos nobres;
- visual nao repete a logo em excesso;
- cores respeitam vermelho, preto, branco e neutros.

Prioridade: Alta.

### Feature: UI mobile-first

User Story:

- Como aluno, quero usar o app confortavelmente no celular.

Criterios de aceite:

- telas funcionam em largura mobile;
- textos nao ficam sobrepostos;
- botoes sao faceis de tocar;
- navegacao inferior funciona bem.

Prioridade: Alta.

## Epico 10 - Preparacao Para Roadmap

### Feature: Ganchos para Modulo de Katas

User Story:

- Como produto, quero transformar Katas em modulo exclusivo no futuro.

Criterios de aceite:

- dados de Kata ja possuem campos expansíveis;
- tela atual nao impede uma rota futura `/katas`;
- videos e checklists sao opcionais.

Prioridade: Media.

### Feature: Ganchos para Modulo de Kihon

User Story:

- Como produto, quero transformar Kihon em modulo exclusivo no futuro.

Criterios de aceite:

- tecnicas possuem tipo, nivel e campos de video;
- tela atual nao impede uma rota futura `/kihon`;
- combinacoes podem ser adicionadas em novo arquivo sem quebrar tecnicas.

Prioridade: Media.

### Feature: Ganchos para Sensei Online

User Story:

- Como produto, quero preparar o app para IA futura sem implementa-la no MVP.

Criterios de aceite:

- conteudos possuem ids estaveis;
- textos validados podem servir de base de conhecimento;
- IA nao fica misturada aos JSONs principais.

Prioridade: Baixa no MVP, alta no roadmap futuro.

## Ordem Recomendada De Execucao

1. Confirmar Expo/React Native como tecnologia do app real.
2. Criar estrutura do projeto mobile.
3. Migrar dados e assets.
4. Implementar navegacao.
5. Implementar telas de conteudo.
6. Implementar Treinar com Kihon, Bases e Katas.
7. Implementar Consultar com glossario e regras.
8. Implementar quiz.
9. Implementar progresso local.
10. Refinar identidade visual e responsividade.
11. Validar com usuarios iniciantes.
