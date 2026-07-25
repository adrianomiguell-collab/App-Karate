# Design: Sistema de Gamificação "Faixas de Estudo"

Data: 2026-07-25
Status: aguardando revisão do usuário

## Contexto

O Atarashii App é um web app (após a decisão de abandonar o app nativo — ver
limpeza de pastas do mesmo dia) que serve de guia de estudo/consulta sobre
Karate Shotokan. Ele é complementar a um outro app já existente, o "App do
Aluno", que trata da graduação real, faltas, eventos e regras da associação.

Hoje o Atarashii App tem 4 áreas de conteúdo (Aprender, Treinar, Kata,
Consultar) mais uma aba "Revisar" com um quiz geral de 50 perguntas, todas
livremente acessíveis sem nenhuma ordem obrigatória.

Objetivo desta feature: transformar a navegação em uma progressão de jogo —
o aluno estuda uma sessão, faz uma mini-prova, e só libera a próxima sessão
se passar. Isso deve reforçar o estudo (repetição, feedback imediato) sem
nunca ser confundido com a graduação oficial do aluno na associação.

## Progressão de faixas

Sequência fixa de 8 estados, cada um só alcançável depois de cumprir o
anterior:

```
Faixa Branca (estado inicial — nenhuma sessão concluída)
  → concluir "Aprender"           → Faixa Amarela
  → concluir "Treinar"            → Faixa Vermelha
  → concluir "Kata – Iniciante"   → Faixa Laranja
  → concluir "Kata – Intermediário" → Faixa Verde
  → concluir "Kata – Avançado"    → Faixa Roxa
  → concluir "Consultar"          → Faixa Marrom
  → concluir "Revisar" (final)    → FAIXA PRETA
```

O bloqueio é **estritamente sequencial**: só é possível tentar a mini-prova
de uma etapa se a etapa anterior já tiver sido concluída (nota ≥ 70%). Não
existe atalho ou pulo de etapa. As etapas bloqueadas aparecem com indicação
visual de cadeado e não são clicáveis.

"Home" e "Contato" ficam fora dessa progressão — continuam sempre
acessíveis, sem bloqueio, já que não são sessões de estudo.

"Revisar" deixa de ser um quiz geral solto e vira o desafio final: só fica
disponível quando as 6 faixas anteriores (Amarela → Marrom) já foram
conquistadas. Ao passar (≥70% nas 50 perguntas), o aluno ganha a Faixa Preta.

## Fluxo dentro de cada sessão

1. Aluno abre a sessão (ex.: "Aprender") e navega pelos itens de conteúdo,
   marcando cada um como estudado (mecanismo que já existe hoje via
   `markStudied`/`isStudied`).
2. O botão "Fazer prova" só fica habilitado depois que **todos** os itens
   daquela sessão estiverem marcados como estudados. Antes disso, aparece
   desabilitado com uma mensagem explicando o que falta.
3. A prova é um mini-quiz (formato igual ao quiz atual: pergunta, 4
   alternativas, próxima/finalizar).
4. Resultado ≥ 70% → tela de resultado mostra a nova faixa conquistada,
   marca a sessão como concluída, e libera a próxima etapa da sequência.
5. Resultado < 70% → tela de resultado mostra o que errou, com botão
   "Tentar novamente" (sem limite de tentativas, sem espera).

Isso vale igualmente para os 3 sub-níveis de Kata (Iniciante, Intermediário,
Avançado), cada um tratado como uma "sessão" própria dentro da área Kata,
na mesma sequência de bloqueio.

## Divisão dos katas em 3 níveis

Usando exatamente a classificação fornecida pelo usuário (substitui a
classificação atual de 4 níveis em `data/katas-shotokan-complete.json`):

- **Iniciante** (5): Heian Shodan, Heian Nidan, Heian Sandan, Heian Yondan,
  Heian Godan
- **Intermediário** (11): Tekki Shodan, Tekki Nidan, Tekki Sandan, Bassai
  Dai, Bassai Sho, Kanku Dai, Kanku Sho, Empi, Hangetsu, Jion, Jiin
- **Avançado** (10): Jitte, Gankaku, Chinte, Sochin, Nijushiho, Gojushiho
  Dai, Gojushiho Sho, Unsu, Meikyo, Wankan

Taikyoku Shodan (kata opcional, já marcado como tal em
`docs/KATAS_BASE_OFICIAL.md`) fica fora da progressão gamificada — pode
continuar acessível como conteúdo extra sem quiz associado.

**Importante:** essa reclassificação altera **apenas** o campo de nível de
cada kata. Confirmado que hoje as 27 katas já têm links reais do YouTube
funcionando (`video.youtube_video_url`) em `data/katas-shotokan-complete.json`
— esses campos não são tocados por essa mudança.

## Origem das perguntas de cada mini-prova

- **Aprender / Treinar / Consultar**: reaproveitar as perguntas já
  existentes em `data/quiz.json`, agrupadas por categoria:
  - Aprender: Historia e Origens, Sistematizacao e Mestres, Funakoshi e
    Shotokan, Karate no Brasil, Expansao Mundial, Esporte e WKF, Conduta,
    Uniforme e Graduacao (23 perguntas)
  - Treinar: Fundamentos, Tecnicas Basicas, Bases e Termos (12 perguntas)
  - Consultar: Regras de Kumite, Regras de Kata (10 perguntas)
- **Kata (3 níveis)**: o banco atual só tem 5 perguntas de kata no total —
  insuficiente para 3 provas. Serão geradas perguntas iniciais a partir dos
  próprios campos de dados de cada kata do nível (significado, história,
  classificação, técnicas) como ponto de partida editável pelo usuário.
- **Revisar (final)**: as 50 perguntas completas de `data/quiz.json`,
  agora como desafio de faixa preta (mesmo critério de 70%).

## Rótulo e separação da graduação real

Toda tela relacionada a faixas/progresso usa o rótulo **"Faixa de Estudos"**
(nunca apenas "Faixa"), acompanhado de um aviso fixo:

> "Essa faixa representa seu progresso de estudos no app e não substitui
> sua graduação oficial na associação."

Um botão/link visível para o "App do Aluno" (graduação real, faltas,
eventos) fica presente na tela de progresso, próximo ao aviso.

## Recompensas visuais

Cada faixa é representada por um elemento visual simples (retângulo/badge
colorido via CSS/SVG) como placeholder — sem depender de vídeo/gif por
enquanto, o que mantém o app leve. O usuário pode enviar posteriormente
gifs/imagens reais de cada faixa; a troca é só de asset, sem mudar a lógica
de desbloqueio.

## Persistência

Continua em `localStorage`, no mesmo mecanismo já usado para progresso e
favoritos — por navegador/dispositivo, sem login. Novo objeto de estado
(nome a definir na fase de implementação) guarda: faixa atual, sessões/
níveis concluídos, e último resultado de cada mini-prova.

## Fora de escopo desta etapa

- Tentativas limitadas ou tempo de espera entre tentativas (confirmado:
  ilimitado, sem espera).
- Qualquer sincronização com o "App do Aluno" além do botão/link de acesso.
- Progresso sincronizado entre dispositivos (exigiria conta de usuário).
- Vídeos/gifs reais de faixa (usa placeholder até o usuário enviar).
- Ampliar a progressão de Kata além dos 3 níveis acima (os demais grupos
  do arquivo completo, se existirem, não fazem parte desta feature).

## Dependências com outras mudanças já feitas na mesma sessão de trabalho

- Limpeza de pastas (remoção de `mobile/` e `site/`, atualização de docs
  para refletir "web app only").
- Troca do vídeo local (.mp4) de técnica por link/embed do YouTube na
  seção Treinar, no mesmo padrão que os katas já usavam.
