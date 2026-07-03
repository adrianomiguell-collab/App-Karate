# Roadmap - App Karate Shotokan

## Estrategia De Distribuicao

Diretriz: validar e evoluir o produto evitando custo recorrente desnecessario no inicio.

Caminho recomendado:

- manter o Web App/PWA como canal principal de validacao e acesso via link;
- publicar a versao Android na Google Play quando o MVP estiver maduro, aproveitando o custo menor de publicacao;
- atender usuarios iOS inicialmente com Web App/PWA instalado na tela inicial;
- considerar publicacao na App Store apenas quando o produto justificar o custo anual do Apple Developer Program;
- manter a arquitetura preparada para Android e iOS, mesmo que a distribuicao inicial seja Google Play + PWA.

Motivo:

- Google Play tem custo inicial menor e sem recorrencia anual obrigatoria;
- App Store exige custo anual para manter novos downloads disponiveis;
- PWA permite testar o produto com usuarios reais sem custo de loja;
- a estrategia preserva a evolucao futura para app nativo completo em Android e iOS.

## Fase 1 - MVP Iniciante

Objetivo: lancar uma primeira versao simples, util e focada em alunos iniciantes.

Compatibilidade obrigatoria:

- Android;
- iOS.

Escopo:

- Home com modulos principais;
- Aprender;
- Treinar;
- Consultar;
- Revisar;
- historia do Karate;
- fundamentos: Kihon, Kata, Kumite e Kiai;
- conduta: Dojo Kun, Niju Kun, OSS, cumprimento e Mokusou;
- tecnicas basicas;
- bases principais;
- katas iniciais;
- glossario;
- regras essenciais;
- quiz da apostila;
- progresso simples.

Resultado esperado:

- o aluno consegue estudar a base da apostila dentro do app;
- o conteudo fica mais facil de consultar do que no PDF;
- o app ja entrega valor sem precisar de IA, videos ou area do instrutor.
- a base tecnica permite evoluir para publicacao em Android e iOS.

## Fase 2 - Trilhas Por Faixa

Objetivo: organizar o aprendizado por nivel do aluno.

Escopo:

- escolha de faixa atual;
- trilha recomendada por faixa;
- checklist de estudo;
- preparacao para exame;
- conteudo recomendado por etapa.

Sugestao de trilha:

- faixa branca: historia, etiqueta, OSS, Kihon basico, Heian Shodan;
- faixa amarela: revisao, Heian Nidan, tecnicas adicionais;
- faixas seguintes: progressao dos Heian, Tekki e katas superiores conforme orientacao validada.

## Fase 3 - Biblioteca Visual

Objetivo: melhorar a consulta pratica.

Escopo:

- imagens de bases;
- diagramas/embusen de katas;
- fichas visuais de tecnicas;
- area dedicada de Katas;
- area dedicada de Kihon;
- suporte a links ou incorporacao de videos oficiais da Associacao Atarashii, quando permitido;
- suporte a GIFs demonstrativos para tecnicas, defesas, ataques, chutes e bases;
- filtros por nivel;
- favoritos;
- possivel substituicao gradual das imagens da apostila por materiais proprios.

Observacao:

- Katas e Kihon devem ser tratados como modulos proprios na evolucao do produto, nao apenas como listas dentro de Treinar.
- Videos devem preferencialmente apontar para canais ou paginas oficiais da associacao.
- O MVP pode manter esses campos vazios, desde que a estrutura de dados ja aceite referencias futuras.

## Fase 4 - Quiz E Revisao

Objetivo: fortalecer a fixacao do conteudo.

Escopo:

- quiz por tema;
- simulado geral;
- revisao de erros;
- historico de pontuacao;
- perguntas por faixa;
- recomendacao de revisao com base nos erros.

## Fase 5 - Sensei Online

Objetivo: permitir que o aluno tire duvidas sobre Karate Shotokan.

Escopo:

- area ou botao "Sensei Online";
- perguntas e respostas sobre conteudo do app;
- base de conhecimento validada;
- possivel integracao com API de IA;
- avisos de seguranca e limites da IA.

Cuidados:

- evitar respostas inventadas;
- nao substituir orientacao presencial;
- limitar respostas a conteudos validados;
- avaliar custo e limite de APIs gratuitas.

## Fase 6 - Area Da Associacao

Objetivo: manter o app publico para qualquer praticante de Karate Shotokan e criar uma area privada exclusiva para alunos da Associacao Atarashii.

Posicionamento:

- conteudo educativo publico: qualquer praticante pode acessar Aprender, Treinar, Consultar, Revisar, Katas, Kihon, Glossario e Regras;
- area do aluno: acesso restrito aos alunos da associacao, estimado inicialmente entre 30 e 50 alunos;
- area do Sensei/Admin: acesso restrito para gerenciamento interno da associacao.

Escopo Inicial Da Area Do Aluno:

- login do aluno;
- perfil pessoal;
- faixa atual;
- historico de graduacao;
- frequencia e numero de faltas;
- feedbacks do Sensei;
- objetivos para a proxima faixa;
- observacoes de treino;
- comunicados da associacao.

Escopo Inicial Da Area Do Sensei/Admin:

- cadastro e edicao de alunos;
- lista de alunos ativos;
- registro de presenca;
- controle de faltas;
- registro de feedback individual;
- atualizacao de faixa;
- historico do aluno;
- comunicados simples.

Requisitos Tecnicos:

- autenticacao com e-mail/senha, magic link ou login social;
- banco de dados para alunos, faixas, presencas, feedbacks, turmas e usuarios;
- regras de permissao para que cada aluno veja apenas seus proprios dados;
- permissao especial para Sensei/Admin;
- estrutura preparada para Android e iOS via Expo/React Native.

Custo Inicial:

- para 30 a 50 alunos, a area privada deve ser viavel inicialmente em plano gratuito de ferramentas como Supabase ou Firebase;
- evitar SMS pago, uploads pesados e uso intenso de IA nesta fase;
- validar limites gratuitos antes da implementacao.

Prioridade Dentro Da Fase:

1. login;
2. perfil do aluno;
3. faixa atual;
4. frequencia/faltas;
5. feedbacks do Sensei;
6. painel simples do Sensei/Admin.

## Fase 7 - Plataforma Completa

Objetivo: evoluir de app individual para ecossistema de aprendizado.

Possibilidades:

- modo infantil;
- conteudo para pais;
- calendario de exames e eventos;
- diario de treino;
- videos;
- certificados internos;
- modo competicao;
- planos de treino;
- recursos premium;
- personalizacao por academia.

## Requisitos Futuros Registrados

### Modulo De Katas

Evolucao prevista para uma sessao exclusiva de Katas com:

- lista de katas por nivel, faixa ou classificacao;
- ficha tecnica;
- significado;
- numero de movimentos/kyodos;
- pontos de Kiai;
- tempo ideal;
- embusen/diagrama;
- video oficial da associacao via link ou embed, se permitido;
- observacoes do instrutor;
- checklist de estudo;
- relacao com faixa/trilha.

### Modulo De Kihon

Evolucao prevista para uma sessao exclusiva de Kihon com:

- tecnicas por categoria;
- bases;
- golpes;
- defesas;
- chutes;
- combinacoes;
- videos oficiais da associacao via link ou embed, se permitido;
- erros comuns;
- pontos de atencao;
- checklist de pratica.

## Prioridade Atual

A prioridade atual e a Fase 1: MVP Iniciante.

Tudo que for criado agora deve respeitar esta ordem:

1. organizar conteudo;
2. facilitar consulta;
3. apoiar estudo;
4. medir aprendizado;
5. preparar evolucao.
