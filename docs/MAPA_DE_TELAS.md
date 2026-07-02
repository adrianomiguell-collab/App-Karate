# Mapa Detalhado De Telas - MVP Atarashii App

## Objetivo

Este documento define as telas do MVP do Atarashii App, sua hierarquia, fluxos principais, conteudos exibidos e acoes esperadas do usuario.

O foco do MVP e atender alunos iniciantes com uma experiencia simples, consultiva e facil de estudar.

As telas devem ser desenhadas mobile-first para Android e iOS.

## Arquitetura De Navegacao

O app sera organizado em quatro areas principais:

1. Aprender
2. Treinar
3. Consultar
4. Revisar

Fluxo geral:

```text
Home
  -> Aprender
      -> Lista de temas
      -> Detalhe de conteudo
  -> Treinar
      -> Tecnicas basicas
      -> Bases
      -> Katas iniciais
      -> Detalhe tecnico
  -> Consultar
      -> Glossario
      -> Regras
      -> Detalhe de termo/regra
  -> Revisar
      -> Quiz
      -> Resultado
      -> Revisao de erros
  -> Busca
      -> Resultados
      -> Detalhe do item
  -> Progresso
```

## Navegacao Principal

### Barra Principal

Sugestao para MVP mobile-first:

- Home
- Aprender
- Treinar
- Consultar
- Revisar

Alternativa:

- usar Home como tela inicial;
- manter 4 abas fixas: Aprender, Treinar, Consultar e Revisar;
- deixar busca e progresso acessiveis pela Home.

Recomendacao:

- MVP com abas fixas para as quatro areas principais;
- Home como primeira tela com atalhos e resumo.

## Tela 1 - Home

### Objetivo

Ser a entrada principal do app e orientar o aluno iniciante para o proximo passo de estudo.

### Conteudo

- Nome do app: Atarashii App;
- logo da Associacao Atarashii;
- mensagem curta de boas-vindas;
- progresso geral;
- card "Continuar estudando";
- atalho para Quiz;
- campo ou botao de busca;
- cards das quatro areas principais:
  - Aprender;
  - Treinar;
  - Consultar;
  - Revisar.

### Componentes

- cabecalho;
- indicador de progresso;
- card de continuidade;
- cards de modulo;
- botao ou campo de busca.

### Acoes Do Usuario

- tocar em uma area;
- continuar ultimo conteudo;
- iniciar quiz;
- pesquisar termo;
- abrir progresso.

### Estados

- primeiro acesso: sem progresso;
- com progresso: mostra conteudo em andamento;
- sem resultado de quiz: mostra convite para revisar;
- com resultado de quiz: mostra ultimo desempenho.

### Prioridade

MVP.

## Tela 2 - Aprender

### Objetivo

Concentrar conteudos historicos, conceituais e formativos.

### Conteudo

Secoes:

- Historia;
- Fundamentos;
- Conduta;
- Graduacao.

Temas iniciais:

- Historia do Karate;
- Okinawa e Reino de Ryukyu;
- Proibicao de armas e Kobudo;
- Mestres precursores;
- Gichin Funakoshi;
- Shotokan;
- Karate no Brasil;
- Karate esportivo;
- Organizacao mundial;
- Kihon, Kata, Kumite e Kiai;
- Dojo Kun;
- Niju Kun;
- Cumprimento;
- OSS;
- Mokusou;
- Karate-gui;
- Graduacao.

### Componentes

- lista de secoes;
- cards de conteudo;
- etiqueta de nivel: iniciante;
- marcador de estudado;
- filtro por categoria.

### Acoes Do Usuario

- abrir conteudo;
- filtrar por categoria;
- marcar conteudo como estudado;
- acessar quiz relacionado.

### Prioridade

MVP.

## Tela 3 - Detalhe De Conteudo

### Objetivo

Apresentar um tema da apostila em formato curto, organizado e amigavel.

### Conteudo

- titulo;
- categoria;
- resumo;
- texto principal;
- pontos importantes;
- pagina de origem da apostila, quando disponivel;
- conteudos relacionados;
- status de estudo.

### Componentes

- cabecalho com voltar;
- titulo;
- chips de categoria/nivel;
- bloco de resumo;
- texto dividido em secoes;
- lista de relacionados;
- botao "Marcar como estudado".

### Acoes Do Usuario

- ler conteudo;
- marcar como estudado;
- abrir conteudo relacionado;
- voltar para lista;
- pesquisar termo relacionado.

### Estados

- nao estudado;
- estudado;
- conteudo com relacionados;
- conteudo sem relacionados.

### Prioridade

MVP.

## Tela 4 - Treinar

### Objetivo

Reunir conteudos praticos e tecnicos para consulta antes ou depois do treino.

### Conteudo

Secoes:

- Tecnicas basicas;
- Bases;
- Katas iniciais.

Observacao de evolucao:

- Katas e Kihon devem poder virar areas exclusivas em versoes futuras.
- A tela Treinar do MVP nao deve impedir essa separacao futura.

### Componentes

- cards de secao;
- atalhos para tecnicas, bases e katas;
- destaque para conteudos iniciais;
- aviso curto: "Pratique com orientacao do sensei."

### Acoes Do Usuario

- abrir lista de tecnicas;
- abrir lista de bases;
- abrir lista de katas;
- pesquisar item tecnico.

### Prioridade

MVP.

## Tela 5 - Lista De Tecnicas

### Objetivo

Permitir consulta rapida das tecnicas basicas da apostila.

### Conteudo

Tecnicas iniciais:

- Oi-Zuki;
- Gyaku-Zuki;
- Mae-Geri;
- Yoko-Geri;
- Mawashi-Geri;
- Ushiro-Geri;
- Age-Uke;
- Soto-Uke;
- Uchi-Uke;
- Gedan-Barai;
- Shuto-Uke;
- Empi-Uchi;
- Kizami-Zuki;
- Tate-Zuki;
- Uraken-Uchi;
- Nukite.

### Componentes

- busca local;
- filtros por tipo:
  - soco;
  - chute;
  - defesa;
  - golpe;
- lista de cards;
- etiqueta de nivel.

### Acoes Do Usuario

- filtrar por tipo;
- abrir tecnica;
- marcar como estudada no detalhe.

### Prioridade

MVP.

## Tela 6 - Detalhe De Tecnica

### Objetivo

Explicar uma tecnica de forma simples e segura.

### Conteudo

- nome;
- tipo;
- descricao;
- pontos de atencao;
- observacao de seguranca;
- termos relacionados.

### Componentes

- titulo;
- chip de tipo;
- bloco de descricao;
- alerta discreto de pratica segura;
- relacionados.

### Acoes Do Usuario

- marcar como estudada;
- voltar para lista;
- abrir termo relacionado.

### Prioridade

MVP.

## Tela 7 - Lista De Bases

### Objetivo

Apresentar as bases/Dachi como biblioteca visual e textual.

### Conteudo

Bases iniciais:

- Heisoku Dachi;
- Musubi Dachi;
- Heiko Dachi;
- Hachiji Dachi;
- Kosa Dachi;
- Kake Dachi;
- Kiba Dachi;
- Shiko Dachi;
- Kokutsu Dachi;
- Neko Ashi Dachi;
- Zenkutsu Dachi;
- Fudo Dachi;
- Sanchin Dachi;
- Teiji Dachi;
- Renoji Dachi.

### Componentes

- grid ou lista de bases;
- imagem ou placeholder;
- nome da base;
- filtro por nivel ou categoria, se necessario.

### Acoes Do Usuario

- abrir base;
- pesquisar base;
- marcar como estudada no detalhe.

### Prioridade

MVP.

## Tela 8 - Detalhe De Base

### Objetivo

Permitir que o aluno reconheca visualmente uma base e consulte seu nome.

### Conteudo

- nome da base;
- imagem, se liberada para uso;
- descricao curta;
- observacoes;
- conteudos relacionados.

### Componentes

- imagem principal ou placeholder;
- bloco de descricao;
- botao "Marcar como estudado";
- relacionados.

### Acoes Do Usuario

- marcar como estudada;
- voltar para lista;
- abrir conteudo relacionado.

### Prioridade

MVP com imagem ou placeholder.

## Tela 9 - Lista De Katas Iniciais

### Objetivo

Organizar os katas mais importantes para iniciantes.

### Conteudo

Katas do MVP:

- Heian Shodan;
- Heian Nidan;
- Heian Sandan;
- Heian Yondan;
- Heian Godan;
- Tekki Shodan.

Possivel lista secundaria:

- demais katas Shotokan apenas como "conteudo futuro" ou lista simples.

Evolucao prevista:

- transformar em uma area completa de Katas;
- adicionar videos oficiais da Associacao Atarashii por kata;
- adicionar checklist de estudo e observacoes de instrutor.

### Componentes

- lista de katas;
- classificacao;
- nivel;
- numero de movimentos;
- status de estudado.

### Acoes Do Usuario

- abrir kata;
- filtrar por nivel;
- marcar estudo no detalhe.

### Prioridade

MVP.

## Tela 10 - Detalhe De Kata

### Objetivo

Apresentar as informacoes essenciais de cada kata inicial.

### Conteudo

- nome;
- significado;
- classificacao;
- numero de movimentos/kyodos;
- tempo ideal;
- pontos de Kiai;
- descricao;
- embusen/diagrama, se disponivel e permitido;
- video oficial da associacao, em fase futura;
- observacoes do instrutor, em fase futura;
- checklist de estudo, em fase futura;
- conteudos relacionados.

### Componentes

- cabecalho;
- ficha tecnica;
- bloco de descricao;
- imagem/diagrama ou placeholder;
- relacionados;
- botao "Marcar como estudado".

### Acoes Do Usuario

- consultar ficha tecnica;
- ampliar imagem, se houver;
- marcar como estudado;
- abrir glossario relacionado.

### Prioridade

MVP.

## Tela 11 - Consultar

### Objetivo

Ser a area de referencia rapida para termos, regras e comandos.

### Conteudo

Secoes:

- Glossario;
- Regras de Kumite;
- Regras de Kata;
- Pontuacao;
- Penalidades;
- Comandos.

### Componentes

- campo de busca;
- cards de secao;
- lista de termos frequentes;
- atalhos para regras.

### Acoes Do Usuario

- pesquisar termo;
- abrir glossario;
- abrir regras;
- abrir pontuacao.

### Prioridade

MVP.

## Tela 12 - Glossario

### Objetivo

Permitir consulta rapida de termos japoneses e conceitos.

### Conteudo

Categorias:

- hierarquia;
- comandos;
- direcoes;
- niveis de altura;
- tecnicas;
- competicao;
- conceitos gerais.

### Componentes

- busca local;
- filtros por categoria;
- lista alfabetica;
- cards de termo.

### Acoes Do Usuario

- buscar termo;
- filtrar categoria;
- abrir termo.

### Prioridade

MVP.

## Tela 13 - Detalhe De Termo

### Objetivo

Explicar um termo de forma curta e consultiva.

### Conteudo

- termo;
- significado;
- categoria;
- exemplo de uso, quando houver;
- relacionados.

### Componentes

- titulo;
- significado em destaque;
- categoria;
- relacionados.

### Acoes Do Usuario

- voltar;
- abrir relacionado;
- marcar como estudado, se fizer sentido.

### Prioridade

MVP.

## Tela 14 - Regras

### Objetivo

Organizar as regras essenciais de Kumite e Kata.

### Conteudo

Secoes:

- Regras de Kumite;
- Regras de Kata;
- Pontuacao;
- Avisos;
- Penalidades;
- Terminologia de arbitragem.

### Componentes

- abas ou filtros por modalidade;
- cards de regra;
- tabela simples de pontuacao;
- lista de penalidades.

### Acoes Do Usuario

- alternar Kumite/Kata;
- abrir regra;
- consultar pontuacao.

### Prioridade

MVP.

## Tela 15 - Detalhe De Regra

### Objetivo

Explicar uma regra especifica de forma direta.

### Conteudo

- titulo;
- modalidade;
- categoria;
- descricao;
- pontuacao ou penalidade, quando aplicavel;
- termos relacionados.

### Componentes

- titulo;
- chips de modalidade/categoria;
- texto explicativo;
- relacionados.

### Acoes Do Usuario

- voltar para regras;
- abrir termos relacionados.

### Prioridade

MVP.

## Tela 16 - Revisar

### Objetivo

Centralizar estudo ativo e revisao.

### Conteudo

- card do quiz geral;
- ultimo resultado;
- quantidade de perguntas;
- botao para iniciar ou refazer;
- acesso a revisao de erros, quando houver.

### Componentes

- card "Quiz da apostila";
- resumo de desempenho;
- botao principal;
- lista de revisoes pendentes.

### Acoes Do Usuario

- iniciar quiz;
- refazer quiz;
- revisar erros.

### Prioridade

MVP.

## Tela 17 - Quiz

### Objetivo

Permitir que o aluno teste conhecimento usando as perguntas da apostila.

### Conteudo

- pergunta atual;
- alternativas;
- progresso do quiz;
- botao proxima;
- opcao finalizar.

### Componentes

- contador de perguntas;
- enunciado;
- alternativas;
- feedback apos resposta, se definido;
- navegacao.

### Acoes Do Usuario

- escolher alternativa;
- avancar;
- finalizar quiz.

### Estados

- pergunta nao respondida;
- pergunta respondida;
- quiz em andamento;
- quiz finalizado.

### Prioridade

MVP.

## Tela 18 - Resultado Do Quiz

### Objetivo

Mostrar desempenho e orientar revisao.

### Conteudo

- total de acertos;
- percentual;
- mensagem de desempenho;
- lista de erros;
- botao refazer;
- botao revisar erros.

### Componentes

- card de resultado;
- indicador visual;
- lista de questoes incorretas;
- acoes.

### Acoes Do Usuario

- revisar erros;
- refazer quiz;
- voltar para Revisar.

### Prioridade

MVP.

## Tela 19 - Revisao De Erros

### Objetivo

Ajudar o aluno a aprender com as perguntas erradas.

### Conteudo

- pergunta;
- resposta escolhida;
- resposta correta;
- explicacao, se disponivel;
- link para conteudo relacionado.

### Componentes

- lista de erros;
- cards por pergunta;
- links de estudo.

### Acoes Do Usuario

- abrir conteudo relacionado;
- voltar para resultado;
- refazer quiz.

### Prioridade

MVP, com explicacao simples quando existir.

## Tela 20 - Busca

### Objetivo

Permitir que o aluno encontre rapidamente qualquer conteudo do app.

### Conteudo

Tipos de resultado:

- conteudos;
- tecnicas;
- bases;
- katas;
- termos;
- regras;
- perguntas de quiz, se desejado.

### Componentes

- campo de busca;
- filtros por tipo;
- lista de resultados;
- estado vazio.

### Acoes Do Usuario

- digitar termo;
- filtrar resultado;
- abrir item.

### Estados

- sem busca;
- carregando;
- com resultados;
- sem resultados.

### Prioridade

MVP.

## Tela 21 - Progresso

### Objetivo

Dar ao aluno uma visao simples do que ja estudou.

### Conteudo

- progresso geral;
- progresso por area:
  - Aprender;
  - Treinar;
  - Consultar;
  - Revisar;
- ultimo quiz;
- conteudos pendentes.

### Componentes

- barra de progresso;
- cards por area;
- lista de pendencias;
- atalho para continuar.

### Acoes Do Usuario

- abrir pendente;
- continuar estudo;
- refazer quiz.

### Prioridade

MVP simples.

## Fluxos Principais

### Fluxo 1 - Primeiro Estudo

```text
Home
  -> Aprender
  -> Fundamentos
  -> Detalhe: Kihon
  -> Marcar como estudado
  -> Proximo conteudo relacionado
```

### Fluxo 2 - Consulta Rapida

```text
Home
  -> Busca
  -> Digita "OSS"
  -> Resultado: termo OSS
  -> Detalhe do termo
```

### Fluxo 3 - Estudo De Kata Inicial

```text
Home
  -> Treinar
  -> Katas iniciais
  -> Heian Shodan
  -> Consulta ficha tecnica
  -> Marcar como estudado
```

### Fluxo 4 - Revisao Por Quiz

```text
Home
  -> Revisar
  -> Quiz
  -> Responder perguntas
  -> Resultado
  -> Revisar erros
```

### Fluxo 5 - Consulta De Regra

```text
Home
  -> Consultar
  -> Regras
  -> Kumite
  -> Pontuacao
  -> Detalhe: Yuko / Waza-ari / Ippon
```

## Priorizacao Das Telas

### Obrigatorias No MVP

- Home;
- Aprender;
- Detalhe de Conteudo;
- Treinar;
- Lista de Tecnicas;
- Detalhe de Tecnica;
- Lista de Bases;
- Detalhe de Base;
- Lista de Katas Iniciais;
- Detalhe de Kata;
- Consultar;
- Glossario;
- Detalhe de Termo;
- Regras;
- Revisar;
- Quiz;
- Resultado do Quiz;
- Busca.

### Podem Ser Simples No MVP

- Progresso;
- Revisao de Erros;
- Detalhe de Regra;
- imagens de bases;
- diagramas de kata.

### Ficam Para Depois

- Sensei Online;
- Area do Instrutor;
- Login completo;
- Perfil detalhado do aluno;
- trilha por faixa;
- area exclusiva de Katas;
- area exclusiva de Kihon;
- videos oficiais da associacao;
- favoritos;
- notificacoes;
- modo offline completo;
- videos.

## Regras De UX Do MVP

- O aluno deve entender a Home em poucos segundos.
- Cada tela deve ter uma acao principal clara.
- Conteudos longos devem ser quebrados em blocos.
- Termos japoneses devem ter explicacao curta.
- O app deve evitar prometer ensino tecnico sem sensei presencial.
- O visual deve ser limpo, disciplinado e acolhedor.
- A experiencia deve funcionar bem em Android e iOS.
- Areas de toque devem ser confortaveis para uso mobile.
- Layouts nao devem depender de hover ou interacoes exclusivas de desktop.

## Componentes Reutilizaveis

- Card de modulo;
- Card de conteudo;
- Card de tecnica;
- Card de kata;
- Card de termo;
- Chip de categoria;
- Indicador de progresso;
- Botao "Marcar como estudado";
- Campo de busca;
- Lista filtravel;
- Card de quiz;
- Alerta de seguranca/pratica presencial.

## Decisoes Pendentes

- nome final do app: Atarashii App;
- identidade visual baseada na logo Atarashii;
- uso das imagens originais da apostila;
- tecnologia do prototipo;
- se o progresso sera salvo localmente ou em conta;
- se a Home tera abas fixas ou menu inferior.

## Proxima Etapa Recomendada

Depois deste mapa, a proxima etapa e criar o backlog tecnico do MVP ou iniciar a estrutura de dados em JSON para alimentar o prototipo.
