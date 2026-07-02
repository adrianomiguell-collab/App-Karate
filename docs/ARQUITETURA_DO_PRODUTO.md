# Arquitetura Do Produto - Atarashii App

## Objetivo

Definir uma arquitetura de produto que permita comecar simples no MVP, mas evoluir sem reescrever tudo quando chegarem trilhas por faixa, Katas, Kihon, videos, Sensei Online e area do instrutor.

## Principio Central

Toda decisao deve respeitar o roadmap.

O MVP pode ser simples, mas nao deve:

- misturar conteudo com dados do usuario;
- prender o app a uma unica tela ou arquivo;
- dificultar videos oficiais no futuro;
- dificultar trilhas por faixa;
- dificultar Sensei Online com base validada;
- exigir login antes de ser necessario;
- impedir uma versao Android e iOS.

## Compatibilidade Obrigatoria

O Atarashii App deve ser compativel com Android e iOS.

Essa decisao afeta tecnologia, design, navegacao, assets e persistencia de dados.

Diretrizes:

- projetar mobile-first;
- evitar dependencias exclusivas de navegador desktop;
- manter componentes e telas preparados para toque;
- usar assets otimizados para telas pequenas;
- manter dados em uma camada separada para facilitar uso em app mobile;
- escolher tecnologia que permita publicar futuramente na Google Play e App Store;
- garantir que videos externos funcionem bem em Android e iOS;
- evitar recursos que dependam de APIs instaveis ou nao suportadas nos dois sistemas.

## Camadas Do Produto

### 1. Conteudo

Responsavel por conteudos estaticos e educacionais:

- temas;
- tecnicas;
- bases;
- katas;
- regras;
- glossario;
- imagens;
- videos;
- referencias oficiais.

No MVP, essa camada pode ser JSON. Futuramente, pode migrar para banco de dados ou CMS sem mudar a logica do app.

### 2. Aprendizado

Responsavel por organizar a jornada do aluno:

- trilhas por faixa;
- conteudos recomendados;
- checklist de estudo;
- progresso por modulo;
- preparacao para exame.

No MVP, existe apenas progresso simples.

### 3. Revisao

Responsavel por fixacao:

- quiz;
- simulados;
- gabarito;
- revisao de erros;
- historico de pontuacao.

No MVP, usa o quiz da apostila.

### 4. Usuario

Responsavel por dados pessoais e preferencias:

- nome;
- faixa atual;
- progresso;
- historico;
- favoritos.

No MVP, esses dados podem ficar locais. Futuramente, podem ir para login e banco.

### 5. Instrutor

Responsavel por recursos de sensei e academia:

- turmas;
- alunos;
- recomendacoes;
- avaliacoes;
- comunicados;
- quizzes proprios.

Nao entra no MVP.

### 6. Sensei Online

Responsavel por perguntas e respostas com IA:

- base de conhecimento validada;
- respostas baseadas no conteudo do app;
- indicacao de limites da IA;
- historico de perguntas, se houver login futuro.

Nao entra no MVP. A arquitetura deve manter essa camada separada para evitar IA misturada diretamente nos conteudos principais.

## Modulos Futuros De Primeira Classe

### Katas

Katas devem evoluir para uma area exclusiva.

Entidade recomendada:

```json
{
  "id": "heian-shodan",
  "name": "Heian Shodan",
  "slug": "heian-shodan",
  "meaning": "Paz e tranquilidade nivel 1",
  "classification": "basico",
  "level": "iniciante",
  "beltLevel": null,
  "kyodos": 21,
  "idealTime": "30 a 40 segundos",
  "kiai": "Movimentos 9 e 17",
  "description": "",
  "diagramUrl": "",
  "videoUrl": null,
  "videoProvider": null,
  "associationVideoUrl": null,
  "instructorNotes": null,
  "practiceChecklist": [],
  "relatedIds": []
}
```

### Kihon

Kihon deve evoluir para uma area exclusiva.

Entidade recomendada:

```json
{
  "id": "oi-zuki",
  "name": "Oi-Zuki",
  "slug": "oi-zuki",
  "type": "soco",
  "level": "iniciante",
  "beltLevel": null,
  "description": "",
  "safetyNote": "Pratique com orientacao do sensei.",
  "videoUrl": null,
  "videoProvider": null,
  "associationVideoUrl": null,
  "instructorNotes": null,
  "practiceChecklist": [],
  "relatedIds": []
}
```

## Politica Para Videos

Videos devem ser tratados como referencias externas ou embeds autorizados.

Regras:

- usar preferencialmente videos oficiais da Associacao Atarashii;
- linkar ou incorporar YouTube quando permitido;
- nao baixar videos do YouTube para republicar no app;
- manter origem do video clara;
- permitir que o campo fique vazio;
- nunca depender do video para explicar o conteudo principal.

## Decisoes Tecnicas Recomendadas

### MVP

- App mobile-first com tecnologia compativel com Android e iOS.
- Dados em JSON.
- Assets locais para imagens autorizadas.
- Progresso local.
- Quiz local.
- Sem login obrigatorio.
- Sem IA.

Recomendacao tecnica atual:

- usar Expo/React Native para a versao real do MVP, pois permite Android e iOS com uma base de codigo;
- manter o prototipo web atual apenas como validacao de produto e UX;
- reaproveitar dados JSON, assets e regras de navegacao no app real;
- considerar web/PWA apenas como canal complementar, nao como destino principal.

### Evolucao

- Migrar dados para CMS ou banco quando houver necessidade de edicao frequente.
- Adicionar login apenas quando progresso multi-dispositivo, instrutor ou turmas forem prioridade.
- Criar API apenas quando houver dados dinamicos, IA ou area do instrutor.
- Manter front-end desacoplado da fonte de dados.

## O Que Evitar

- Um arquivo unico com todos os dados.
- Acoplar quiz diretamente a telas.
- Colocar progresso dentro dos conteudos.
- Colocar respostas de IA dentro dos JSONs principais.
- Criar login antes de validar o MVP.
- Fazer Katas e Kihon como casos especiais impossiveis de expandir.
- Usar videos como conteudo obrigatorio.

## Decisao Atual

Manter o prototipo web responsivo como ferramenta de validacao, mas construir o MVP real com foco em Android e iOS.

A recomendacao atual e seguir para uma base Expo/React Native, preservando a arquitetura modular para CMS, area de instrutor e Sensei Online.
