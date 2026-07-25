# Gamificacao por Faixas de Estudo - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a navegacao do Atarashii App (web app estatico em `/prototype`) em uma progressao de jogo por faixas: o aluno estuda uma sessao, faz uma mini-prova, e so libera a proxima sessao se acertar pelo menos 70%. A sequencia de faixas (Branca -> Amarela -> Vermelha -> Laranja -> Verde -> Roxa -> Marrom -> Preta) segue exatamente a ordem Aprender -> Treinar -> Kata (Iniciante/Intermediario/Avancado) -> Consultar -> Revisar (desafio final).

**Architecture:** O app continua um site estatico sem build step (HTML/CSS/JS puro, sem framework). Toda a logica de faixas/bloqueio/pontuacao fica isolada num novo modulo puro `prototype/gamification.js` (sem DOM, testavel com `node --test`), carregado antes de `prototype/app.js`. `app.js` continua sendo o unico arquivo de renderizacao/estado (segue o padrao ja existente no repo), mas passa a consumir `Gamification` para decidir o que esta bloqueado e qual faixa mostrar. O progresso continua em `localStorage` (mesma chave `karate-shotokan-progress` ja usada hoje), com um novo campo `sessions` dentro do objeto salvo.

**Tech Stack:** HTML/CSS/JS puro (sem bundler, sem framework), Node.js (`node --test` + `node:assert/strict`) apenas para testar o modulo `gamification.js`, `fetch`/`localStorage` do navegador para o resto.

## Global Constraints

- Bloqueio **estritamente sequencial**: nunca pular etapa, sem excecao. (spec)
- Nota minima para passar em qualquer prova: **70%** (>= 0.7 da pontuacao). (spec)
- Tentativas **ilimitadas**, sem espera entre elas. (spec)
- "Home" e "Contato" nunca ficam bloqueados. (spec)
- Toda tela de faixa usa o rotulo **"Faixa de Estudos"** (nunca so "Faixa"), com aviso fixo de que nao substitui a graduacao oficial, e um botao/link visivel para o "App do Aluno". (spec)
- Divisao dos katas (usar exatamente esta lista, ja confirmada pelo usuario):
  - **Iniciante**: Heian Shodan, Heian Nidan, Heian Sandan, Heian Yondan, Heian Godan
  - **Intermediario**: Tekki Shodan, Tekki Nidan, Tekki Sandan, Bassai Dai, Bassai Sho, Kanku Dai, Kanku Sho, Empi, Hangetsu, Jion, Jiin
  - **Avancado**: Jitte, Gankaku, Chinte, Sochin, Nijushiho, Gojushiho Dai, Gojushiho Sho, Unsu, Meikyo, Wankan
  - Taikyoku Shodan fica **fora** da progressao gamificada (conteudo extra, sem quiz).
- A reclassificacao dos katas por nivel de jogo **nao pode alterar** os links de video (`video.youtube_video_url`) ja existentes em `data/katas-shotokan-complete.json` - hoje as 27 katas ja tem link real do YouTube funcionando, confirmado antes deste plano.
- Nao adicionar login/conta de usuario, nem sincronizacao entre dispositivos - fora de escopo.
- Nao adicionar dependencias novas (sem framework de teste, sem bundler) - usar apenas o que ja existe (Node built-in `node:test`, `node:assert/strict`).

---

### Task 1: Reclassificar os katas em 3 niveis de jogo

**Files:**
- Modify: `data/katas-shotokan-complete.json`

**Interfaces:**
- Produces: campo novo `nivelJogo` em cada objeto de kata, com um dos valores `"iniciante"`, `"intermediario"`, `"avancado"`, ou `null` (so para Taikyoku Shodan). Tarefas futuras (Task 5, 6) leem este campo via `kata.nivelJogo`.

- [ ] **Step 1: Escrever um script temporario que aplica a reclassificacao**

Criar um arquivo temporario `tmp-reclassify-katas.js` **na raiz do repo** (nao em `scripts/` - essa pasta nao existe hoje e o script e apagado no Step 4, entao nao vale criar uma pasta so pra isso) com o conteudo abaixo. Ele le `data/katas-shotokan-complete.json`, adiciona `nivelJogo` a cada kata segundo a lista fixa, e verifica que nenhum `video.youtube_video_url` foi alterado.

```js
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data", "katas-shotokan-complete.json");
const raw = fs.readFileSync(filePath, "utf8");
const data = JSON.parse(raw);
const katas = Array.isArray(data) ? data : data.katas;

const TIERS = {
  iniciante: ["Heian Shodan", "Heian Nidan", "Heian Sandan", "Heian Yondan", "Heian Godan"],
  intermediario: [
    "Tekki Shodan", "Tekki Nidan", "Tekki Sandan",
    "Bassai Dai", "Bassai Sho", "Kanku Dai", "Kanku Sho",
    "Empi", "Hangetsu", "Jion", "Jiin",
  ],
  avancado: [
    "Jitte", "Gankaku", "Chinte", "Sochin", "Nijushiho",
    "Gojushiho Dai", "Gojushiho Sho", "Unsu", "Meikyo", "Wankan",
  ],
};

const nameToTier = {};
for (const [tier, names] of Object.entries(TIERS)) {
  for (const name of names) nameToTier[name] = tier;
}

const videoUrlsBefore = new Map(
  katas.map((k) => [k.id, k.video?.youtube_video_url || null]),
);

let assigned = 0;
for (const kata of katas) {
  const name = kata.nome || kata.name;
  kata.nivelJogo = nameToTier[name] || null;
  if (kata.nivelJogo) assigned += 1;
}

const missingFromTiers = katas.filter((k) => !k.nivelJogo && (k.nome || k.name) !== "Taikyoku Shodan");
if (missingFromTiers.length) {
  console.error("ERRO: katas sem nivelJogo que nao sao Taikyoku Shodan:", missingFromTiers.map((k) => k.nome));
  process.exit(1);
}

for (const kata of katas) {
  const before = videoUrlsBefore.get(kata.id);
  const after = kata.video?.youtube_video_url || null;
  if (before !== after) {
    console.error("ERRO: video mudou para", kata.id, "antes:", before, "depois:", after);
    process.exit(1);
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("OK -", assigned, "katas classificadas, videos preservados.");
```

- [ ] **Step 2: Rodar o script**

Run: `node tmp-reclassify-katas.js`
Expected: imprime `OK - 26 katas classificadas, videos preservados.` (26 porque Taikyoku Shodan fica de fora).

- [ ] **Step 3: Conferir manualmente a contagem por nivel**

Run:
```bash
node -e "
const d = require('./data/katas-shotokan-complete.json');
const katas = Array.isArray(d) ? d : d.katas;
const counts = {};
katas.forEach(k => { counts[k.nivelJogo] = (counts[k.nivelJogo]||0)+1; });
console.log(counts);
"
```
Expected: `{ iniciante: 5, intermediario: 11, avancado: 10, null: 1 }`

- [ ] **Step 4: Apagar o script temporario e commitar so o dado**

```bash
rm tmp-reclassify-katas.js
git add data/katas-shotokan-complete.json
git commit -m "feat: classificar katas em 3 niveis de jogo (iniciante/intermediario/avancado)"
```

---

### Task 2: Criar bancos de perguntas de kata por nivel

**Files:**
- Create: `data/quiz-kata-iniciante.json`
- Create: `data/quiz-kata-intermediario.json`
- Create: `data/quiz-kata-avancado.json`

**Interfaces:**
- Produces: 3 arquivos JSON, cada um um array de perguntas no mesmo formato de `data/quiz.json` (`id`, `category`, `question`, `options` (4 strings), `correctOption` (indice 0-3), `explanation`). Consumidos por `app.js` na Task 4 via `dataFiles.quizKataIniciante` etc.

- [ ] **Step 1: Criar `data/quiz-kata-iniciante.json`** com exatamente este conteudo:

```json
[
  {
    "id": "quiz-kata-iniciante-01",
    "category": "Katas - Iniciante",
    "question": "Qual e o significado do kata Heian Shodan?",
    "options": [
      "Paz e tranquilidade nivel 1",
      "Paz e tranquilidade nivel 2",
      "Paz e tranquilidade nivel 3",
      "Paz e tranquilidade nivel 4"
    ],
    "correctOption": 0,
    "explanation": "Heian Shodan (平安初段) significa \"Paz e tranquilidade nivel 1\"."
  },
  {
    "id": "quiz-kata-iniciante-02",
    "category": "Katas - Iniciante",
    "question": "Qual e o significado do kata Heian Nidan?",
    "options": [
      "Paz e tranquilidade nivel 1",
      "Paz e tranquilidade nivel 3",
      "Paz e tranquilidade nivel 4",
      "Paz e tranquilidade nivel 2"
    ],
    "correctOption": 3,
    "explanation": "Heian Nidan (平安二段) significa \"Paz e tranquilidade nivel 2\"."
  },
  {
    "id": "quiz-kata-iniciante-03",
    "category": "Katas - Iniciante",
    "question": "Qual e o significado do kata Heian Sandan?",
    "options": [
      "Paz e tranquilidade nivel 2",
      "Paz e tranquilidade nivel 4",
      "Paz e tranquilidade nivel 3",
      "Paz e tranquilidade nivel 1"
    ],
    "correctOption": 2,
    "explanation": "Heian Sandan (平安三段) significa \"Paz e tranquilidade nivel 3\"."
  },
  {
    "id": "quiz-kata-iniciante-04",
    "category": "Katas - Iniciante",
    "question": "Qual e o significado do kata Heian Yondan?",
    "options": [
      "Paz e tranquilidade nivel 3",
      "Paz e tranquilidade nivel 4",
      "Paz e tranquilidade nivel 1",
      "Paz e tranquilidade nivel 2"
    ],
    "correctOption": 1,
    "explanation": "Heian Yondan (平安四段) significa \"Paz e tranquilidade nivel 4\"."
  },
  {
    "id": "quiz-kata-iniciante-05",
    "category": "Katas - Iniciante",
    "question": "Qual e o significado do kata Heian Godan?",
    "options": [
      "Paz e tranquilidade nivel 5",
      "Paz e tranquilidade nivel 1",
      "Paz e tranquilidade nivel 2",
      "Paz e tranquilidade nivel 3"
    ],
    "correctOption": 0,
    "explanation": "Heian Godan (平安五段) significa \"Paz e tranquilidade nivel 5\"."
  }
]
```

- [ ] **Step 2: Criar `data/quiz-kata-intermediario.json`** com exatamente este conteudo:

```json
[
  {
    "id": "quiz-kata-intermediario-01",
    "category": "Katas - Intermediario",
    "question": "Qual e o significado do kata Tekki Shodan?",
    "options": [
      "Cavaleiro de ferro nivel 1",
      "Cavaleiro de ferro nivel 2",
      "Romper a fortaleza - forma menor",
      "Voo da andorinha"
    ],
    "correctOption": 0,
    "explanation": "Tekki Shodan (鉄騎初段) significa \"Cavaleiro de ferro nivel 1\"."
  },
  {
    "id": "quiz-kata-intermediario-02",
    "category": "Katas - Intermediario",
    "question": "Qual e o significado do kata Tekki Nidan?",
    "options": [
      "Cavaleiro de ferro nivel 1",
      "Romper a fortaleza - forma menor",
      "Voo da andorinha",
      "Cavaleiro de ferro nivel 2"
    ],
    "correctOption": 3,
    "explanation": "Tekki Nidan (鉄騎二段) significa \"Cavaleiro de ferro nivel 2\"."
  },
  {
    "id": "quiz-kata-intermediario-03",
    "category": "Katas - Intermediario",
    "question": "Qual e o significado do kata Tekki Sandan?",
    "options": [
      "Romper a fortaleza - forma menor",
      "Voo da andorinha",
      "Cavaleiro de ferro nivel 3",
      "Cavaleiro de ferro nivel 1"
    ],
    "correctOption": 2,
    "explanation": "Tekki Sandan (鉄騎三段) significa \"Cavaleiro de ferro nivel 3\"."
  },
  {
    "id": "quiz-kata-intermediario-04",
    "category": "Katas - Intermediario",
    "question": "Qual e o significado do kata Bassai Dai?",
    "options": [
      "Voo da andorinha",
      "Romper a fortaleza",
      "Cavaleiro de ferro nivel 1",
      "Romper a fortaleza - forma menor"
    ],
    "correctOption": 1,
    "explanation": "Bassai Dai (抜塞大) significa \"Romper a fortaleza\"."
  },
  {
    "id": "quiz-kata-intermediario-05",
    "category": "Katas - Intermediario",
    "question": "Qual e o significado do kata Bassai Sho?",
    "options": [
      "Romper a fortaleza - forma menor",
      "Cavaleiro de ferro nivel 1",
      "Romper a fortaleza",
      "Voo da andorinha"
    ],
    "correctOption": 0,
    "explanation": "Bassai Sho (抜塞小) significa \"Romper a fortaleza - forma menor\"."
  },
  {
    "id": "quiz-kata-intermediario-06",
    "category": "Katas - Intermediario",
    "question": "Qual e o significado do kata Kanku Dai?",
    "options": [
      "Cavaleiro de ferro nivel 1",
      "Romper a fortaleza",
      "Voo da andorinha",
      "Contemplar o ceu"
    ],
    "correctOption": 3,
    "explanation": "Kanku Dai (観空大) significa \"Contemplar o ceu\"."
  },
  {
    "id": "quiz-kata-intermediario-07",
    "category": "Katas - Intermediario",
    "question": "Qual e o significado do kata Kanku Sho?",
    "options": [
      "Romper a fortaleza",
      "Voo da andorinha",
      "Contemplar o ceu - forma menor",
      "Cavaleiro de ferro nivel 1"
    ],
    "correctOption": 2,
    "explanation": "Kanku Sho (観空小) significa \"Contemplar o ceu - forma menor\"."
  },
  {
    "id": "quiz-kata-intermediario-08",
    "category": "Katas - Intermediario",
    "question": "Qual e o significado do kata Empi?",
    "options": [
      "Contemplar o ceu - forma menor",
      "Voo da andorinha",
      "Cavaleiro de ferro nivel 1",
      "Romper a fortaleza"
    ],
    "correctOption": 1,
    "explanation": "Empi (燕飛) significa \"Voo da andorinha\"."
  },
  {
    "id": "quiz-kata-intermediario-09",
    "category": "Katas - Intermediario",
    "question": "Qual e o significado do kata Hangetsu?",
    "options": [
      "Meia-lua",
      "Cavaleiro de ferro nivel 1",
      "Romper a fortaleza",
      "Contemplar o ceu - forma menor"
    ],
    "correctOption": 0,
    "explanation": "Hangetsu (半月) significa \"Meia-lua\"."
  },
  {
    "id": "quiz-kata-intermediario-10",
    "category": "Katas - Intermediario",
    "question": "Qual e o significado do kata Jion?",
    "options": [
      "Cavaleiro de ferro nivel 1",
      "Romper a fortaleza",
      "Contemplar o ceu - forma menor",
      "Amor e gratidao"
    ],
    "correctOption": 3,
    "explanation": "Jion (慈恩) significa \"Amor e gratidao\"."
  },
  {
    "id": "quiz-kata-intermediario-11",
    "category": "Katas - Intermediario",
    "question": "Qual e o significado do kata Jiin?",
    "options": [
      "Romper a fortaleza",
      "Contemplar o ceu - forma menor",
      "Amor e protecao",
      "Cavaleiro de ferro nivel 1"
    ],
    "correctOption": 2,
    "explanation": "Jiin (慈陰) significa \"Amor e protecao\"."
  }
]
```

- [ ] **Step 3: Criar `data/quiz-kata-avancado.json`** com exatamente este conteudo:

```json
[
  {
    "id": "quiz-kata-avancado-01",
    "category": "Katas - Avancado",
    "question": "Qual e o significado do kata Jitte?",
    "options": [
      "Dez maos",
      "Grou sobre a rocha",
      "Vinte e quatro passos",
      "Maos de nuvem"
    ],
    "correctOption": 0,
    "explanation": "Jitte (十手) significa \"Dez maos\"."
  },
  {
    "id": "quiz-kata-avancado-02",
    "category": "Katas - Avancado",
    "question": "Qual e o significado do kata Gankaku?",
    "options": [
      "Dez maos",
      "Vinte e quatro passos",
      "Maos de nuvem",
      "Grou sobre a rocha"
    ],
    "correctOption": 3,
    "explanation": "Gankaku (岩鶴) significa \"Grou sobre a rocha\"."
  },
  {
    "id": "quiz-kata-avancado-03",
    "category": "Katas - Avancado",
    "question": "Qual e o significado do kata Chinte?",
    "options": [
      "Vinte e quatro passos",
      "Maos de nuvem",
      "Maos estranhas / tecnicas estranhas",
      "Dez maos"
    ],
    "correctOption": 2,
    "explanation": "Chinte (珍手) significa \"Maos estranhas / tecnicas estranhas\"."
  },
  {
    "id": "quiz-kata-avancado-04",
    "category": "Katas - Avancado",
    "question": "Qual e o significado do kata Sochin?",
    "options": [
      "Maos de nuvem",
      "Espirito inabalavel",
      "Dez maos",
      "Vinte e quatro passos"
    ],
    "correctOption": 1,
    "explanation": "Sochin (壮鎮) significa \"Espirito inabalavel\"."
  },
  {
    "id": "quiz-kata-avancado-05",
    "category": "Katas - Avancado",
    "question": "Qual e o significado do kata Nijushiho?",
    "options": [
      "Vinte e quatro passos",
      "Dez maos",
      "Espirito inabalavel",
      "Maos de nuvem"
    ],
    "correctOption": 0,
    "explanation": "Nijushiho (二十四歩) significa \"Vinte e quatro passos\"."
  },
  {
    "id": "quiz-kata-avancado-06",
    "category": "Katas - Avancado",
    "question": "Qual e o significado do kata Gojushiho Dai?",
    "options": [
      "Dez maos",
      "Espirito inabalavel",
      "Maos de nuvem",
      "Cinquenta e quatro passos - forma longa"
    ],
    "correctOption": 3,
    "explanation": "Gojushiho Dai (五十四歩大) significa \"Cinquenta e quatro passos - forma longa\"."
  },
  {
    "id": "quiz-kata-avancado-07",
    "category": "Katas - Avancado",
    "question": "Qual e o significado do kata Gojushiho Sho?",
    "options": [
      "Espirito inabalavel",
      "Maos de nuvem",
      "Cinquenta e quatro passos - forma curta",
      "Dez maos"
    ],
    "correctOption": 2,
    "explanation": "Gojushiho Sho (五十四歩小) significa \"Cinquenta e quatro passos - forma curta\"."
  },
  {
    "id": "quiz-kata-avancado-08",
    "category": "Katas - Avancado",
    "question": "Qual e o significado do kata Unsu?",
    "options": [
      "Cinquenta e quatro passos - forma curta",
      "Maos de nuvem",
      "Dez maos",
      "Espirito inabalavel"
    ],
    "correctOption": 1,
    "explanation": "Unsu (雲手) significa \"Maos de nuvem\"."
  },
  {
    "id": "quiz-kata-avancado-09",
    "category": "Katas - Avancado",
    "question": "Qual e o significado do kata Meikyo?",
    "options": [
      "Espelho limpo / espelho da alma",
      "Dez maos",
      "Espirito inabalavel",
      "Cinquenta e quatro passos - forma curta"
    ],
    "correctOption": 0,
    "explanation": "Meikyo (明鏡) significa \"Espelho limpo / espelho da alma\"."
  },
  {
    "id": "quiz-kata-avancado-10",
    "category": "Katas - Avancado",
    "question": "Qual e o significado do kata Wankan?",
    "options": [
      "Dez maos",
      "Espirito inabalavel",
      "Cinquenta e quatro passos - forma curta",
      "Coroa real"
    ],
    "correctOption": 3,
    "explanation": "Wankan (王冠) significa \"Coroa real\"."
  }
]
```

- [ ] **Step 4: Validar os 3 arquivos e commitar**

Run:
```bash
node -e "['iniciante','intermediario','avancado'].forEach(t => { const q = require('./data/quiz-kata-'+t+'.json'); console.log(t, q.length, 'perguntas'); q.forEach(item => { if (item.options.length !== 4) throw new Error('opcoes != 4 em '+item.id); if (item.correctOption < 0 || item.correctOption > 3) throw new Error('correctOption invalido em '+item.id); }); })"
```
Expected: imprime `iniciante 5 perguntas`, `intermediario 11 perguntas`, `avancado 10 perguntas`, sem erro.

```bash
git add data/quiz-kata-iniciante.json data/quiz-kata-intermediario.json data/quiz-kata-avancado.json
git commit -m "feat: adicionar bancos de perguntas de kata por nivel (iniciante/intermediario/avancado)"
```

**Nota para o usuario:** estas perguntas foram geradas a partir do campo `significado` de cada kata (ja existente nos dados) como ponto de partida - podem e devem ser revisadas/substituidas depois por perguntas mais elaboradas.

---

### Task 3: Criar o modulo puro de gamificacao com testes

**Files:**
- Create: `prototype/gamification.js`
- Create: `prototype/gamification.test.js`

**Interfaces:**
- Produces: objeto `Gamification` (global `window.Gamification` no navegador, `module.exports` no Node) com: `SESSION_ORDER` (array de 6 strings), `BELT_BY_SESSION` (objeto), `BELT_LABELS` (objeto, 8 faixas incluindo `branca` e `preta`), `BELT_COLORS` (objeto, mesmas 8 chaves), `PASS_THRESHOLD` (numero, 0.7), `isSessionCompleted(sessionsCompleted, sessionKey)`, `isSessionUnlocked(sessionsCompleted, sessionKey)`, `isFinalChallengeUnlocked(sessionsCompleted)`, `currentBeltKey(sessionsCompleted)`, `scorePercent(correctCount, total)`, `passesThreshold(correctCount, total)`, `beltForSession(sessionKey)`.
- Consumido por: `prototype/app.js` (Task 4 em diante).

- [ ] **Step 1: Escrever os testes primeiro**

Criar `prototype/gamification.test.js`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const Gamification = require("./gamification.js");

test("faixa inicial e branca quando nenhuma sessao concluida", () => {
  assert.equal(Gamification.currentBeltKey({}), "branca");
});

test("cada sessao concluida avanca a faixa na ordem certa", () => {
  const completed = { aprender: true, treinar: true };
  assert.equal(Gamification.currentBeltKey(completed), "vermelha");
});

test("sequencia quebrada nao pula faixa", () => {
  const completed = { treinar: true };
  assert.equal(Gamification.currentBeltKey(completed), "branca");
});

test("sessao so desbloqueia se a anterior estiver completa", () => {
  assert.equal(Gamification.isSessionUnlocked({}, "aprender"), true);
  assert.equal(Gamification.isSessionUnlocked({}, "treinar"), false);
  assert.equal(Gamification.isSessionUnlocked({ aprender: true }, "treinar"), true);
  assert.equal(Gamification.isSessionUnlocked({ aprender: true }, "kata-iniciante"), false);
});

test("desafio final so desbloqueia com todas as 6 sessoes completas", () => {
  const almostAll = {
    aprender: true,
    treinar: true,
    "kata-iniciante": true,
    "kata-intermediario": true,
    "kata-avancado": true,
  };
  assert.equal(Gamification.isFinalChallengeUnlocked(almostAll), false);
  const all = { ...almostAll, consultar: true };
  assert.equal(Gamification.isFinalChallengeUnlocked(all), true);
});

test("70% ou mais passa, abaixo disso reprova", () => {
  assert.equal(Gamification.passesThreshold(7, 10), true);
  assert.equal(Gamification.passesThreshold(6, 10), false);
  assert.equal(Gamification.passesThreshold(4, 5), true);
});

test("scorePercent arredonda corretamente", () => {
  assert.equal(Gamification.scorePercent(1, 3), 33);
  assert.equal(Gamification.scorePercent(2, 3), 67);
});

test("beltForSession retorna a faixa certa para cada sessao", () => {
  assert.equal(Gamification.beltForSession("aprender"), "amarela");
  assert.equal(Gamification.beltForSession("kata-avancado"), "roxa");
  assert.equal(Gamification.beltForSession("consultar"), "marrom");
});
```

- [ ] **Step 2: Rodar os testes para confirmar que falham (o modulo ainda nao existe)**

Run: `node --test prototype/gamification.test.js`
Expected: FAIL com erro `Cannot find module './gamification.js'`

- [ ] **Step 3: Implementar `prototype/gamification.js`**

```js
(function (root) {
  const SESSION_ORDER = [
    "aprender",
    "treinar",
    "kata-iniciante",
    "kata-intermediario",
    "kata-avancado",
    "consultar",
  ];

  const BELT_BY_SESSION = {
    aprender: "amarela",
    treinar: "vermelha",
    "kata-iniciante": "laranja",
    "kata-intermediario": "verde",
    "kata-avancado": "roxa",
    consultar: "marrom",
  };

  const BELT_LABELS = {
    branca: "Faixa de Estudos Branca",
    amarela: "Faixa de Estudos Amarela",
    vermelha: "Faixa de Estudos Vermelha",
    laranja: "Faixa de Estudos Laranja",
    verde: "Faixa de Estudos Verde",
    roxa: "Faixa de Estudos Roxa",
    marrom: "Faixa de Estudos Marrom",
    preta: "Faixa de Estudos Preta",
  };

  const BELT_COLORS = {
    branca: "#f5f5f0",
    amarela: "#f2c200",
    vermelha: "#c0392b",
    laranja: "#e07b1a",
    verde: "#1f8a4c",
    roxa: "#6a3aa0",
    marrom: "#6b4226",
    preta: "#111111",
  };

  const PASS_THRESHOLD = 0.7;

  function isSessionCompleted(sessionsCompleted, sessionKey) {
    return Boolean(sessionsCompleted && sessionsCompleted[sessionKey]);
  }

  function isSessionUnlocked(sessionsCompleted, sessionKey) {
    const idx = SESSION_ORDER.indexOf(sessionKey);
    if (idx <= 0) return true;
    return isSessionCompleted(sessionsCompleted, SESSION_ORDER[idx - 1]);
  }

  function isFinalChallengeUnlocked(sessionsCompleted) {
    return SESSION_ORDER.every((key) => isSessionCompleted(sessionsCompleted, key));
  }

  function currentBeltKey(sessionsCompleted) {
    let belt = "branca";
    for (const key of SESSION_ORDER) {
      if (isSessionCompleted(sessionsCompleted, key)) {
        belt = BELT_BY_SESSION[key];
      } else {
        break;
      }
    }
    return belt;
  }

  function scorePercent(correctCount, total) {
    if (!total) return 0;
    return Math.round((correctCount / total) * 100);
  }

  function passesThreshold(correctCount, total) {
    if (!total) return false;
    return correctCount / total >= PASS_THRESHOLD;
  }

  function beltForSession(sessionKey) {
    return BELT_BY_SESSION[sessionKey] || null;
  }

  const api = {
    SESSION_ORDER,
    BELT_BY_SESSION,
    BELT_LABELS,
    BELT_COLORS,
    PASS_THRESHOLD,
    isSessionCompleted,
    isSessionUnlocked,
    isFinalChallengeUnlocked,
    currentBeltKey,
    scorePercent,
    passesThreshold,
    beltForSession,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.Gamification = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
```

- [ ] **Step 4: Rodar os testes de novo para confirmar que passam**

Run: `node --test prototype/gamification.test.js`
Expected: PASS em todos os 8 testes (`# pass 8`, `# fail 0`).

- [ ] **Step 5: Commit**

```bash
git add prototype/gamification.js prototype/gamification.test.js
git commit -m "feat: adicionar modulo puro de gamificacao (faixas, bloqueio, pontuacao) com testes"
```

---

### Task 4: Carregar os novos dados e estender o estado de progresso em app.js

**Files:**
- Modify: `prototype/index.html:33` (adicionar script tag)
- Modify: `prototype/app.js:23-51` (dataFiles, normalizeProgress, loadData)

**Interfaces:**
- Consumes: `Gamification` global (Task 3).
- Produces: `state.data.quizKataIniciante`, `state.data.quizKataIntermediario`, `state.data.quizKataAvancado` (arrays); `getProgress()` agora tambem retorna `sessions` (objeto, chave = sessionKey, valor = `{ completed: boolean, score: number, total: number, date: string }` ou `undefined`) e `finalChallenge` (`{ score, total, passed, date }` ou `null`). Usado pelas tasks seguintes.

- [ ] **Step 1: Adicionar o script do modulo de gamificacao no HTML**

Em `prototype/index.html`, linha 33, ANTES do script de `app.js`:

```html
    <script src="gamification.js"></script>
    <script src="app.js"></script>
```

- [ ] **Step 2: Adicionar os 3 novos arquivos de dados em `dataFiles`**

Em `prototype/app.js`, substituir o bloco (linhas 23-31):

```js
const dataFiles = {
  contents: "../data/content-items.json",
  techniques: "../data/techniques.json",
  stances: "../data/stances.json",
  katas: "../data/katas-shotokan-complete.json",
  glossary: "../data/glossary.json",
  rules: "../data/rules.json",
  quiz: "../data/quiz.json",
};
```

por:

```js
const dataFiles = {
  contents: "../data/content-items.json",
  techniques: "../data/techniques.json",
  stances: "../data/stances.json",
  katas: "../data/katas-shotokan-complete.json",
  glossary: "../data/glossary.json",
  rules: "../data/rules.json",
  quiz: "../data/quiz.json",
  quizKataIniciante: "../data/quiz-kata-iniciante.json",
  quizKataIntermediario: "../data/quiz-kata-intermediario.json",
  quizKataAvancado: "../data/quiz-kata-avancado.json",
};
```

- [ ] **Step 3: Estender `normalizeProgress` com `sessions` e `finalChallenge`**

Em `prototype/app.js`, substituir (linhas 33-39):

```js
function normalizeProgress(progress) {
  return {
    studied: Array.isArray(progress?.studied) ? progress.studied : [],
    favorites: Array.isArray(progress?.favorites) ? progress.favorites : [],
    quiz: progress?.quiz || null,
  };
}
```

por:

```js
function normalizeProgress(progress) {
  return {
    studied: Array.isArray(progress?.studied) ? progress.studied : [],
    favorites: Array.isArray(progress?.favorites) ? progress.favorites : [],
    quiz: progress?.quiz || null,
    sessions: progress?.sessions && typeof progress.sessions === "object" ? progress.sessions : {},
    finalChallenge: progress?.finalChallenge || null,
  };
}
```

- [ ] **Step 4: Verificar sintaxe e que os novos JSONs carregam via fetch**

Iniciar um servidor estatico local na raiz do repo (nao ha script de dev configurado; usar um servidor minimo em Node):

```bash
node -e "
const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png' };
http.createServer((req,res)=>{
  let p = path.join(process.cwd(), decodeURIComponent(req.url.split('?')[0]));
  if (p.endsWith('/')) p = path.join(p, 'index.html');
  fs.readFile(p, (err, data)=>{
    if (err) { res.writeHead(404); res.end('not found: '+p); return; }
    res.writeHead(200, {'Content-Type': mime[path.extname(p)] || 'application/octet-stream'});
    res.end(data);
  });
}).listen(8791, ()=>console.log('listening'));
" &
sleep 1
node -e "
Promise.all([
  fetch('http://localhost:8791/data/quiz-kata-iniciante.json').then(r=>r.json()),
  fetch('http://localhost:8791/data/quiz-kata-intermediario.json').then(r=>r.json()),
  fetch('http://localhost:8791/data/quiz-kata-avancado.json').then(r=>r.json()),
]).then(([a,b,c]) => console.log('OK', a.length, b.length, c.length)).catch(e => { console.error('FALHOU', e); process.exit(1); });
"
```
Expected: `OK 5 11 10` (sem erro de fetch/parse). Depois, parar o servidor: `lsof -ti:8791 -sTCP:LISTEN | xargs -r kill` (ou fechar o processo em background).

Run: `node --check prototype/app.js`
Expected: sem saida (sintaxe valida).

- [ ] **Step 5: Commit**

```bash
git add prototype/index.html prototype/app.js
git commit -m "feat: carregar bancos de quiz de kata e estender esquema de progresso com sessoes/faixas"
```

---

### Task 5: Bloqueio sequencial e novas telas de Kata (hub + 3 niveis)

**Files:**
- Modify: `prototype/app.js` (varias secoes - ver steps)

**Interfaces:**
- Consumes: `Gamification.SESSION_ORDER`, `Gamification.isSessionUnlocked`, `Gamification.isSessionCompleted` (Task 3); `getProgress()/setProgress()` com `sessions` (Task 4).
- Produces: `kataTierItems(tier)`, `sessionItems(sessionKey)`, `sessionAllStudied(sessionKey)`, `sessionUnlockedForUI(sessionKey)`, `sessionCompleted(sessionKey)`, `kataHubView()`, `kataTierView(tier)`, `lockedSessionView(sessionKey, label)`. Usadas pela Task 6 (fluxo de quiz) e pelo `render()` final.

- [ ] **Step 1: Adicionar helpers de itens por sessao**

Em `prototype/app.js`, logo apos a funcao `isFavorite` (depois da linha 79, antes de `async function loadData()`), adicionar:

```js
function kataTierItems(tier) {
  return state.data.katas.filter((k) => k.nivelJogo === tier);
}

function sessionItems(sessionKey) {
  if (sessionKey === "aprender") {
    return state.data.contents.filter((item) => item.area === "aprender");
  }
  if (sessionKey === "treinar") {
    return [...state.data.techniques, ...state.data.stances];
  }
  if (sessionKey === "kata-iniciante") return kataTierItems("iniciante");
  if (sessionKey === "kata-intermediario") return kataTierItems("intermediario");
  if (sessionKey === "kata-avancado") return kataTierItems("avancado");
  if (sessionKey === "consultar") {
    return [...state.data.glossary, ...state.data.rules];
  }
  return [];
}

function sessionAllStudied(sessionKey) {
  const items = sessionItems(sessionKey);
  return items.length > 0 && items.every((item) => isStudied(item.id));
}

function sessionUnlockedForUI(sessionKey) {
  return Gamification.isSessionUnlocked(getProgress().sessions, sessionKey);
}

function sessionCompleted(sessionKey) {
  return Gamification.isSessionCompleted(getProgress().sessions, sessionKey);
}
```

- [ ] **Step 2: Adicionar tela de sessao bloqueada**

Logo apos os helpers do Step 1, adicionar:

```js
const SESSION_LABELS = {
  aprender: "Aprender",
  treinar: "Treinar",
  "kata-iniciante": "Kata - Iniciante",
  "kata-intermediario": "Kata - Intermediario",
  "kata-avancado": "Kata - Avancado",
  consultar: "Consultar",
};

function lockedSessionView(sessionKey) {
  const idx = Gamification.SESSION_ORDER.indexOf(sessionKey);
  const previousKey = idx > 0 ? Gamification.SESSION_ORDER[idx - 1] : null;
  const previousLabel = previousKey ? SESSION_LABELS[previousKey] : "";
  return `
    <section class="hero locked-session">
      <p class="eyebrow">Bloqueado</p>
      <h2>${htmlEscape(SESSION_LABELS[sessionKey] || sessionKey)}</h2>
      <p>Conclua "${htmlEscape(previousLabel)}" com pelo menos 70% na prova para liberar esta sessao.</p>
      ${button("Voltar para Home", "go:home", "primary-button")}
    </section>
  `;
}
```

- [ ] **Step 3: Substituir o tratamento de "katas" em `sectionView` por hub + telas por nivel**

Em `prototype/app.js`, na funcao `sectionView`, remover a entrada `katas` do objeto `titles` e o bloco `if (area === "katas") { ... }`. O bloco atual (por volta das linhas 205-236) fica:

```js
function sectionView(area) {
  const titles = {
    aprender: ["Aprender", "Conteudos historicos, conceituais e formativos."],
    treinar: ["Treinar", "Kihon, tecnicas basicas e bases para consulta antes ou depois do treino."],
    consultar: ["Consultar", "Referencia rapida de termos, regras e comandos."],
  };
  const [title, subtitle] = titles[area];
  let items = [];

  if (area === "aprender") {
    items = state.data.contents.filter((item) => item.area === "aprender").map((item) => ({ ...item, kind: "conteudo", name: item.title }));
  }

  if (area === "treinar") {
    items = [
      ...state.data.techniques.map((item) => ({ ...item, kind: "tecnica" })),
      ...state.data.stances.map((item) => ({ ...item, kind: "base" })),
    ];
  }

  if (area === "consultar") {
    items = [
      ...state.data.glossary.map((item) => ({ ...item, kind: "termo", name: item.term, summary: item.meaning })),
      ...state.data.rules.map((item) => ({ ...item, kind: "regra", name: item.title, summary: item.description })),
    ];
  }

  const categories = ["todos", ...new Set(items.map((item) => item.type || item.category || item.kind))];
  const visible = state.filter === "todos" ? items : items.filter((item) => (item.type || item.category || item.kind) === state.filter);

  return `
    <section>
      <h2 class="section-title">${title}</h2>
      <p class="muted">${subtitle}</p>
      <div class="toolbar">
        ${categories.map((cat) => `<button class="chip ${state.filter === cat ? "is-active" : ""}" data-filter="${cat}" type="button">${cat}</button>`).join("")}
      </div>
      <div class="grid three">
        ${visible.map(cardTemplate).join("")}
      </div>
      ${quizGateBlock(area)}
    </section>
  `;
}
```

(A funcao `quizGateBlock` e criada na Task 6 - deixar a referencia aqui, ela sera definida antes de `sectionView` ser chamada em tempo de execucao porque `render()` so roda depois de todo o arquivo carregar.)

- [ ] **Step 4: Adicionar `kataHubView` e `kataTierView`**

Logo apos a funcao `sectionView` (que agora termina como no Step 3), adicionar:

```js
const KATA_TIER_LABELS = { iniciante: "Iniciante", intermediario: "Intermediario", avancado: "Avancado" };
const KATA_TIER_TO_SESSION = {
  iniciante: "kata-iniciante",
  intermediario: "kata-intermediario",
  avancado: "kata-avancado",
};

function extraKataNote() {
  const extra = state.data.katas.find((k) => !k.nivelJogo);
  if (!extra) return "";
  return `
    <p class="muted extra-kata-note">
      Kata extra (fora da progressao por faixas):
      <button class="text-link-button" data-open="kata:${extra.id}" type="button">${htmlEscape(extra.nome || extra.name)}</button>
    </p>
  `;
}

function kataHubView() {
  const tiers = ["iniciante", "intermediario", "avancado"];
  return `
    <section>
      <h2 class="section-title">Kata</h2>
      <p class="muted">Katas organizados em 3 niveis. Complete um nivel (70% na prova) para liberar o proximo.</p>
      <div class="grid three">
        ${tiers.map((tier) => {
          const sessionKey = KATA_TIER_TO_SESSION[tier];
          const unlocked = sessionUnlockedForUI(sessionKey);
          const completed = sessionCompleted(sessionKey);
          const count = kataTierItems(tier).length;
          if (!unlocked) {
            return `
              <div class="card is-locked" aria-disabled="true">
                <h3>${KATA_TIER_LABELS[tier]} <span class="lock-icon" aria-hidden="true">&#128274;</span></h3>
                <p>${count} katas. Bloqueado.</p>
              </div>
            `;
          }
          return `
            <button class="card" data-action="go:${sessionKey}" type="button">
              <h3>${KATA_TIER_LABELS[tier]}</h3>
              <p>${count} katas. ${completed ? "Concluido" : "Disponivel"}</p>
            </button>
          `;
        }).join("")}
      </div>
      ${extraKataNote()}
    </section>
  `;
}

function kataTierView(tier) {
  const sessionKey = KATA_TIER_TO_SESSION[tier];
  const items = kataTierItems(tier).map((item) => ({
    ...item,
    kind: "kata",
    name: item.nome || item.name,
    summary: item.significado || item.summary,
  }));
  return `
    <section>
      ${button("Voltar para Kata", "go:katas")}
      <h2 class="section-title">Kata - ${KATA_TIER_LABELS[tier]}</h2>
      <div class="grid three">
        ${items.map(cardTemplate).join("")}
      </div>
      ${quizGateBlock(sessionKey)}
    </section>
  `;
}
```

- [ ] **Step 5: Verificar sintaxe**

Run: `node --check prototype/app.js`
Expected: sem saida. (Vai reclamar de `quizGateBlock is not defined` so em tempo de execucao no navegador, nao na checagem de sintaxe - isso e resolvido na Task 6, que roda antes de qualquer verificacao no navegador.)

- [ ] **Step 6: Commit**

```bash
git add prototype/app.js
git commit -m "feat: adicionar bloqueio sequencial e telas de kata por nivel (hub + iniciante/intermediario/avancado)"
```

---

### Task 6: Fluxo de mini-prova por sessao (Aprender/Treinar/Kata/Consultar)

**Files:**
- Modify: `prototype/app.js` (varias secoes - ver steps)

**Interfaces:**
- Consumes: `Gamification.passesThreshold`, `Gamification.scorePercent`, `Gamification.beltForSession`, `Gamification.BELT_LABELS` (Task 3); `sessionAllStudied`, `sessionCompleted` (Task 5).
- Produces: `SESSION_QUIZ_CONFIG`, `sessionQuizQuestions(sessionKey)`, `quizGateBlock(sessionKey)`, `activeQuizQuestions()`. Modifica `state` (novo campo `activeQuizSession`), `quizView`, `resultView`, e o listener de clique (acao `start-session-quiz:<key>` substitui `start-quiz`).

- [ ] **Step 1: Adicionar `activeQuizSession` ao estado inicial**

Em `prototype/app.js`, linha 1-9, substituir:

```js
const state = {
  route: "home",
  detailReturnRoute: "home",
  data: null,
  filter: "todos",
  search: "",
  quizIndex: 0,
  quizAnswers: [],
};
```

por:

```js
const state = {
  route: "home",
  detailReturnRoute: "home",
  data: null,
  filter: "todos",
  search: "",
  quizIndex: 0,
  quizAnswers: [],
  activeQuizSession: null,
};
```

- [ ] **Step 2: Adicionar `SESSION_QUIZ_CONFIG`, `sessionQuizQuestions` e `quizGateBlock`**

Adicionar logo apos os helpers da Task 5 (`sessionCompleted`), antes de `async function loadData()`:

```js
const SESSION_QUIZ_CONFIG = {
  aprender: {
    dataKey: "quiz",
    categories: [
      "Historia e Origens", "Sistematizacao e Mestres", "Funakoshi e Shotokan",
      "Karate no Brasil", "Expansao Mundial", "Esporte e WKF", "Conduta", "Uniforme e Graduacao",
    ],
  },
  treinar: {
    dataKey: "quiz",
    categories: ["Fundamentos", "Tecnicas Basicas", "Bases e Termos"],
  },
  "kata-iniciante": { dataKey: "quizKataIniciante", categories: null },
  "kata-intermediario": { dataKey: "quizKataIntermediario", categories: null },
  "kata-avancado": { dataKey: "quizKataAvancado", categories: null },
  consultar: {
    dataKey: "quiz",
    categories: ["Regras de Kumite", "Regras de Kata"],
  },
};

function sessionQuizQuestions(sessionKey) {
  const config = SESSION_QUIZ_CONFIG[sessionKey];
  if (!config) return [];
  const pool = state.data[config.dataKey] || [];
  if (!config.categories) return pool;
  return pool.filter((q) => config.categories.includes(q.category));
}

function quizGateBlock(sessionKey) {
  if (sessionCompleted(sessionKey)) {
    const belt = Gamification.beltForSession(sessionKey);
    return `<p class="quiz-gate quiz-gate-done">Prova concluida! Voce conquistou a ${htmlEscape(Gamification.BELT_LABELS[belt])}.</p>`;
  }
  if (!sessionAllStudied(sessionKey)) {
    return `
      <div class="quiz-gate">
        <button class="primary-button" type="button" disabled>Fazer prova</button>
        <p class="muted">Marque todos os itens desta sessao como estudados para liberar a prova.</p>
      </div>
    `;
  }
  return `
    <div class="quiz-gate">
      ${button("Fazer prova", `start-session-quiz:${sessionKey}`, "primary-button")}
    </div>
  `;
}

function activeQuizQuestions() {
  if (state.activeQuizSession === "final") return state.data.quiz;
  return sessionQuizQuestions(state.activeQuizSession);
}
```

- [ ] **Step 3: Generalizar `quizView` para usar `activeQuizQuestions()`**

Em `prototype/app.js`, substituir a funcao `quizView` inteira:

```js
function quizView() {
  const question = state.data.quiz[state.quizIndex];
  if (!question) return resultView();
  const currentAnswer = state.quizAnswers[state.quizIndex];
  return `
    <section class="question">
      <p class="muted">Pergunta ${state.quizIndex + 1} de ${state.data.quiz.length}</p>
      <h2 class="section-title">${htmlEscape(question.question)}</h2>
      ${question.options.map((option, index) => `
        <button class="answer-button ${currentAnswer === index ? "is-selected" : ""}" data-answer="${index}" type="button">
          ${htmlEscape(option)}
        </button>
      `).join("")}
      <div class="toolbar">
        ${button(state.quizIndex === state.data.quiz.length - 1 ? "Finalizar" : "Proxima", "next-question", "primary-button")}
      </div>
    </section>
  `;
}
```

por:

```js
function quizView() {
  const questions = activeQuizQuestions();
  const question = questions[state.quizIndex];
  if (!question) return resultView();
  const currentAnswer = state.quizAnswers[state.quizIndex];
  return `
    <section class="question">
      <p class="muted">Pergunta ${state.quizIndex + 1} de ${questions.length}</p>
      <h2 class="section-title">${htmlEscape(question.question)}</h2>
      ${question.options.map((option, index) => `
        <button class="answer-button ${currentAnswer === index ? "is-selected" : ""}" data-answer="${index}" type="button">
          ${htmlEscape(option)}
        </button>
      `).join("")}
      <div class="toolbar">
        ${button(state.quizIndex === questions.length - 1 ? "Finalizar" : "Proxima", "next-question", "primary-button")}
      </div>
    </section>
  `;
}
```

- [ ] **Step 4: Generalizar `resultView` para gravar por sessao e mostrar a faixa conquistada**

Substituir a funcao `resultView` inteira:

```js
function resultView() {
  const total = state.data.quiz.length;
  const score = state.data.quiz.reduce((sum, question, index) => sum + (state.quizAnswers[index] === question.correctOption ? 1 : 0), 0);
  const progress = getProgress();
  progress.quiz = { score, total, date: new Date().toISOString() };
  setProgress(progress);

  const wrong = state.data.quiz
    .map((question, index) => ({ question, index, answer: state.quizAnswers[index] }))
    .filter((entry) => entry.answer !== entry.question.correctOption);

  return `
    <section class="hero">
      <h2>Resultado</h2>
      <p>Voce acertou ${score} de ${total} perguntas.</p>
      <div class="toolbar">
        ${button("Refazer quiz", "start-quiz", "primary-button")}
        ${button("Voltar para revisar", "go:revisar")}
      </div>
    </section>
    <section class="grid">
      ${wrong.length ? wrong.slice(0, 12).map(({ question, answer }) => `
        <article class="card">
          <h3>${htmlEscape(question.question)}</h3>
          <p>Sua resposta: ${htmlEscape(question.options[answer] ?? "Nao respondida")}</p>
          <p>Correta: ${htmlEscape(question.options[question.correctOption])}</p>
          <p>${htmlEscape(question.explanation)}</p>
        </article>
      `).join("") : `<p class="empty">Voce acertou todas as perguntas.</p>`}
    </section>
  `;
}
```

por:

```js
function resultView() {
  const questions = activeQuizQuestions();
  const total = questions.length;
  const score = questions.reduce((sum, question, index) => sum + (state.quizAnswers[index] === question.correctOption ? 1 : 0), 0);
  const passed = Gamification.passesThreshold(score, total);
  const progress = getProgress();

  if (state.activeQuizSession === "final") {
    progress.finalChallenge = { score, total, passed, date: new Date().toISOString() };
  } else {
    progress.sessions[state.activeQuizSession] = { completed: passed, score, total, date: new Date().toISOString() };
  }
  setProgress(progress);

  const wrong = questions
    .map((question, index) => ({ question, index, answer: state.quizAnswers[index] }))
    .filter((entry) => entry.answer !== entry.question.correctOption);

  const beltKey = state.activeQuizSession === "final" ? "preta" : Gamification.beltForSession(state.activeQuizSession);
  const beltLabel = beltKey ? Gamification.BELT_LABELS[beltKey] : "";
  const backRoute = state.activeQuizSession === "final" ? "revisar" : state.activeQuizSession;

  return `
    <section class="hero">
      <h2>Resultado</h2>
      <p>Voce acertou ${score} de ${total} perguntas (${Gamification.scorePercent(score, total)}%).</p>
      ${passed
        ? `<p class="quiz-pass">Parabens! Voce conquistou a ${htmlEscape(beltLabel)}.</p>`
        : `<p class="quiz-fail">Voce precisa de pelo menos 70% para conquistar a ${htmlEscape(beltLabel)}. Tente novamente.</p>`
      }
      <div class="toolbar">
        ${button("Tentar novamente", `start-session-quiz:${state.activeQuizSession}`, "primary-button")}
        ${button("Voltar", `go:${backRoute}`)}
      </div>
    </section>
    <section class="grid">
      ${wrong.length ? wrong.slice(0, 12).map(({ question, answer }) => `
        <article class="card">
          <h3>${htmlEscape(question.question)}</h3>
          <p>Sua resposta: ${htmlEscape(question.options[answer] ?? "Nao respondida")}</p>
          <p>Correta: ${htmlEscape(question.options[question.correctOption])}</p>
          <p>${htmlEscape(question.explanation)}</p>
        </article>
      `).join("") : `<p class="empty">Voce acertou todas as perguntas.</p>`}
    </section>
  `;
}
```

- [ ] **Step 5: Atualizar o listener de clique - trocar `start-quiz`/`next-question` para usar `activeQuizQuestions()` e a nova acao `start-session-quiz:<key>`**

Em `prototype/app.js`, dentro do `document.addEventListener("click", ...)`, substituir o trecho:

```js
  } else if (action === "start-quiz") {
    state.quizIndex = 0;
    state.quizAnswers = [];
    state.route = "quiz";
    render();
  } else if (action === "next-question") {
    if (state.quizIndex < state.data.quiz.length - 1) {
      state.quizIndex += 1;
      render();
    } else {
      state.route = "resultado";
      render();
    }
  }
```

por:

```js
  } else if (action.startsWith("start-session-quiz:")) {
    state.activeQuizSession = action.split(":")[1];
    state.quizIndex = 0;
    state.quizAnswers = [];
    state.route = "quiz";
    render();
  } else if (action === "next-question") {
    const questions = activeQuizQuestions();
    if (state.quizIndex < questions.length - 1) {
      state.quizIndex += 1;
      render();
    } else {
      state.route = "resultado";
      render();
    }
  }
```

- [ ] **Step 6: Adicionar as novas rotas de sessao no dispatcher `render()`**

Em `prototype/app.js`, a funcao `render()` atual:

```js
function render() {
  if (!state.data) {
    app.innerHTML = `<p class="empty">Carregando dados...</p>`;
    return;
  }

  if (state.route.startsWith("detail:")) {
    const [, kind, id] = state.route.split(":");
    app.innerHTML = detailView(kind, id);
    return;
  }

  const views = {
    home: homeView,
    aprender: () => sectionView("aprender"),
    treinar: () => sectionView("treinar"),
    katas: () => sectionView("katas"),
    consultar: () => sectionView("consultar"),
    revisar: reviewView,
    contato: contactView,
    busca: searchView,
    quiz: quizView,
    resultado: resultView,
    progresso: progressView,
  };

  app.innerHTML = (views[state.route] || homeView)();
}
```

substituir por:

```js
function render() {
  if (!state.data) {
    app.innerHTML = `<p class="empty">Carregando dados...</p>`;
    return;
  }

  if (state.route.startsWith("detail:")) {
    const [, kind, id] = state.route.split(":");
    app.innerHTML = detailView(kind, id);
    return;
  }

  if (SESSION_QUIZ_CONFIG[state.route] && !sessionUnlockedForUI(state.route)) {
    app.innerHTML = lockedSessionView(state.route);
    return;
  }

  if (state.route === "revisar" && !Gamification.isFinalChallengeUnlocked(getProgress().sessions)) {
    app.innerHTML = lockedFinalChallengeView();
    return;
  }

  const views = {
    home: homeView,
    aprender: () => sectionView("aprender"),
    treinar: () => sectionView("treinar"),
    katas: kataHubView,
    "kata-iniciante": () => kataTierView("iniciante"),
    "kata-intermediario": () => kataTierView("intermediario"),
    "kata-avancado": () => kataTierView("avancado"),
    consultar: () => sectionView("consultar"),
    revisar: reviewView,
    contato: contactView,
    busca: searchView,
    quiz: quizView,
    resultado: resultView,
    progresso: progressView,
  };

  app.innerHTML = (views[state.route] || homeView)();
}
```

(`lockedFinalChallengeView` e criada na Task 7.)

- [ ] **Step 7: Verificar sintaxe**

Run: `node --check prototype/app.js`
Expected: sem saida.

**Nota:** apos este Task, a aba "Revisar" antiga (`reviewView`, com o botao `data-action="start-quiz"`) fica temporariamente sem funcionar de ponta a ponta, porque o handler `start-quiz` foi removido em favor de `start-session-quiz:<key>` - isso e esperado e resolvido no proximo Task (Task 7), que atualiza `reviewView` para usar a nova acao. Nao pare a implementacao entre os dois Tasks achando que ha um bug.

- [ ] **Step 8: Commit**

```bash
git add prototype/app.js
git commit -m "feat: generalizar fluxo de quiz para funcionar por sessao com gate de itens estudados"
```

---

### Task 7: Transformar "Revisar" no desafio final (Faixa Preta)

**Files:**
- Modify: `prototype/app.js` (funcao `reviewView`, nova funcao `lockedFinalChallengeView`)

**Interfaces:**
- Consumes: `Gamification.isFinalChallengeUnlocked` (Task 3), `getProgress().finalChallenge` (Task 4).
- Produces: `lockedFinalChallengeView()` (usada pelo `render()` da Task 6, Step 6).

- [ ] **Step 1: Substituir `reviewView` e adicionar `lockedFinalChallengeView`**

Em `prototype/app.js`, substituir a funcao `reviewView` inteira:

```js
function reviewView() {
  const progress = getProgress();
  const last = progress.quiz ? `Ultimo resultado: ${progress.quiz.score}/${progress.quiz.total}` : "Voce ainda nao respondeu o quiz.";
  return `
    <section class="hero">
      <h2>Revisar</h2>
      <p>${last}</p>
      <div class="grid">
        <button class="card" data-action="start-quiz" type="button">
          <h3>Quiz da apostila</h3>
          <p>50 perguntas para revisar historia, fundamentos, regras, tecnicas e termos.</p>
        </button>
      </div>
    </section>
  `;
}
```

por:

```js
function lockedFinalChallengeView() {
  return `
    <section class="hero locked-session">
      <p class="eyebrow">Bloqueado</p>
      <h2>Revisar - Desafio Final</h2>
      <p>Conquiste as 6 faixas de estudo (Amarela ate Marrom) para liberar o desafio final e a Faixa Preta.</p>
      ${button("Voltar para Home", "go:home", "primary-button")}
    </section>
  `;
}

function reviewView() {
  const progress = getProgress();
  const challenge = progress.finalChallenge;
  const last = challenge
    ? `Ultimo resultado: ${challenge.score}/${challenge.total}${challenge.passed ? " - Faixa Preta conquistada!" : ""}`
    : "Voce ainda nao tentou o desafio final.";
  return `
    <section class="hero">
      <h2>Revisar - Desafio Final</h2>
      <p>${last}</p>
      <div class="grid">
        <button class="card" data-action="start-session-quiz:final" type="button">
          <h3>Quiz da apostila</h3>
          <p>50 perguntas para revisar historia, fundamentos, regras, tecnicas e termos. Acerte 70% para conquistar a Faixa de Estudos Preta.</p>
        </button>
      </div>
    </section>
  `;
}
```

- [ ] **Step 2: Verificar sintaxe**

Run: `node --check prototype/app.js`
Expected: sem saida.

- [ ] **Step 3: Commit**

```bash
git add prototype/app.js
git commit -m "feat: transformar Revisar no desafio final que concede a Faixa de Estudos Preta"
```

---

### Task 8: Bloqueio visual na Home e tela de Progresso com Faixas de Estudo

**Files:**
- Modify: `prototype/app.js` (`homeView`, nova funcao `progressView`, nova constante `STUDENT_APP_URL`)

**Interfaces:**
- Consumes: `Gamification.SESSION_ORDER`, `Gamification.BELT_BY_SESSION`, `Gamification.BELT_LABELS`, `Gamification.BELT_COLORS`, `Gamification.currentBeltKey`, `Gamification.isFinalChallengeUnlocked` (Task 3); `sessionUnlockedForUI` (Task 5).
- Produces: `moduleCard(sessionKey, label, description, routeOverride)`, `finalChallengeCard()`. Modifica `homeView` e `progressView`.

- [ ] **Step 1: Adicionar a constante `STUDENT_APP_URL` (config pendente) perto de `contactInfo`**

Em `prototype/app.js`, logo apos o bloco `const contactInfo = { ... };` (linha 18), adicionar:

```js
// CONFIGURACAO PENDENTE: substituir pelo link real do "App do Aluno" antes de publicar.
const STUDENT_APP_URL = "https://SUBSTITUIR-PELO-LINK-DO-APP-DO-ALUNO.exemplo.com";
```

- [ ] **Step 2: Adicionar `moduleCard` e `finalChallengeCard`, atualizar `homeView`**

Substituir a funcao `homeView` inteira:

```js
function homeView() {
  const progress = getProgress();
  const lastQuiz = progress.quiz ? `${progress.quiz.score}/${progress.quiz.total} no ultimo quiz` : "Quiz ainda nao iniciado";
  return `
    <section class="hero">
      <div class="hero-brand">
        <img class="hero-logo" src="../assets/brand/atarashii-logo.png" alt="Logo Atarashii Karate-do Shotokan" />
        <div>
          <p class="eyebrow">Associacao Atarashii Karate-do Shotokan</p>
          <h2>Atarashii App</h2>
        </div>
      </div>
      <p>Estude e consulte Karate Shotokan em uma primeira versao focada em iniciantes, com fundamentos, tecnicas, katas, glossario, regras e revisao.</p>
      ${progressBlock()}
      <div class="search-row">
        <input class="search-input" id="homeSearch" placeholder="Buscar OSS, Kiai, Heian, Yuko..." />
        ${button("Buscar", "home-search", "primary-button")}
      </div>
    </section>

    <section class="grid two">
      <button class="card module-card" data-action="go:aprender" type="button">
        <h3>Aprender</h3>
        <p>Historia, fundamentos, conduta e graduacao.</p>
      </button>
      <button class="card module-card" data-action="go:treinar" type="button">
        <h3>Treinar</h3>
        <p>Kihon, tecnicas basicas e bases principais.</p>
      </button>
      <button class="card module-card" data-action="go:katas" type="button">
        <h3>Kata</h3>
        <p>Katas iniciais, embusen e videos oficiais.</p>
      </button>
      <button class="card module-card" data-action="go:consultar" type="button">
        <h3>Consultar</h3>
        <p>Glossario, regras, pontuacao e termos.</p>
      </button>
      <button class="card module-card" data-action="go:revisar" type="button">
        <h3>Revisar</h3>
        <p>${lastQuiz}</p>
      </button>
      <button class="card module-card" data-action="go:contato" type="button">
        <h3>Contato</h3>
        <p>Endereco, mapa e redes da associacao.</p>
      </button>
    </section>
  `;
}
```

por:

```js
function moduleCard(sessionKey, label, description, routeOverride) {
  const route = routeOverride || sessionKey;
  const locked = !sessionUnlockedForUI(sessionKey);
  if (locked) {
    return `
      <div class="card module-card is-locked" aria-disabled="true">
        <h3>${htmlEscape(label)} <span class="lock-icon" aria-hidden="true">&#128274;</span></h3>
        <p>${htmlEscape(description)}</p>
      </div>
    `;
  }
  return `
    <button class="card module-card" data-action="go:${route}" type="button">
      <h3>${htmlEscape(label)}</h3>
      <p>${htmlEscape(description)}</p>
    </button>
  `;
}

function finalChallengeCard() {
  const progress = getProgress();
  const unlocked = Gamification.isFinalChallengeUnlocked(progress.sessions);
  const lastQuiz = progress.finalChallenge
    ? `${progress.finalChallenge.score}/${progress.finalChallenge.total} no desafio final`
    : "Desafio final ainda nao tentado";
  if (!unlocked) {
    return `
      <div class="card module-card is-locked" aria-disabled="true">
        <h3>Revisar <span class="lock-icon" aria-hidden="true">&#128274;</span></h3>
        <p>Conquiste todas as faixas de estudo para liberar.</p>
      </div>
    `;
  }
  return `
    <button class="card module-card" data-action="go:revisar" type="button">
      <h3>Revisar</h3>
      <p>${htmlEscape(lastQuiz)}</p>
    </button>
  `;
}

function homeView() {
  return `
    <section class="hero">
      <div class="hero-brand">
        <img class="hero-logo" src="../assets/brand/atarashii-logo.png" alt="Logo Atarashii Karate-do Shotokan" />
        <div>
          <p class="eyebrow">Associacao Atarashii Karate-do Shotokan</p>
          <h2>Atarashii App</h2>
        </div>
      </div>
      <p>Estude e consulte Karate Shotokan em uma primeira versao focada em iniciantes, com fundamentos, tecnicas, katas, glossario, regras e revisao.</p>
      ${progressBlock()}
      <div class="search-row">
        <input class="search-input" id="homeSearch" placeholder="Buscar OSS, Kiai, Heian, Yuko..." />
        ${button("Buscar", "home-search", "primary-button")}
      </div>
    </section>

    <section class="grid two">
      ${moduleCard("aprender", "Aprender", "Historia, fundamentos, conduta e graduacao.")}
      ${moduleCard("treinar", "Treinar", "Kihon, tecnicas basicas e bases principais.")}
      ${moduleCard("kata-iniciante", "Kata", "Katas organizados em 3 niveis, embusen e videos oficiais.", "katas")}
      ${moduleCard("consultar", "Consultar", "Glossario, regras, pontuacao e termos.")}
      ${finalChallengeCard()}
      <button class="card module-card" data-action="go:contato" type="button">
        <h3>Contato</h3>
        <p>Endereco, mapa e redes da associacao.</p>
      </button>
    </section>
  `;
}
```

- [ ] **Step 3: Substituir `progressView` para mostrar a lista de Faixas de Estudo**

Substituir a funcao `progressView` inteira:

```js
function progressView() {
  const progress = getProgress();
  return `
    <section class="hero">
      <h2>Progresso</h2>
      ${progressBlock()}
      <p class="muted">Itens estudados: ${progress.studied.length}</p>
      <p class="muted">${progress.quiz ? `Ultimo quiz: ${progress.quiz.score}/${progress.quiz.total}` : "Quiz ainda nao iniciado"}</p>
    </section>
  `;
}
```

por:

```js
function progressView() {
  const progress = getProgress();
  const beltOrder = ["branca", ...Gamification.SESSION_ORDER.map((key) => Gamification.BELT_BY_SESSION[key])];
  const currentBelt = Gamification.currentBeltKey(progress.sessions);
  const currentIndex = beltOrder.indexOf(currentBelt);
  const finalUnlocked = Gamification.isFinalChallengeUnlocked(progress.sessions);
  const blackBeltEarned = Boolean(progress.finalChallenge?.passed);

  const beltRows = beltOrder.map((beltKey, index) => {
    const earned = currentIndex >= index;
    return `
      <li class="belt-row ${earned ? "is-earned" : "is-locked"}">
        <span class="belt-swatch" style="background:${Gamification.BELT_COLORS[beltKey]}"></span>
        <span>${htmlEscape(Gamification.BELT_LABELS[beltKey])}</span>
        <span class="muted">${earned ? "Conquistada" : "Bloqueada"}</span>
      </li>
    `;
  }).join("");

  const blackBeltRow = `
    <li class="belt-row ${blackBeltEarned ? "is-earned" : "is-locked"}">
      <span class="belt-swatch" style="background:${Gamification.BELT_COLORS.preta}"></span>
      <span>${htmlEscape(Gamification.BELT_LABELS.preta)}</span>
      <span class="muted">${blackBeltEarned ? "Conquistada" : finalUnlocked ? "Disponivel no desafio final" : "Bloqueada"}</span>
    </li>
  `;

  return `
    <section class="hero">
      <h2>Meu Progresso de Estudos</h2>
      ${progressBlock()}
      <p class="muted">Itens estudados: ${progress.studied.length}</p>
      <p class="belt-current">Faixa de Estudos atual: <strong>${htmlEscape(Gamification.BELT_LABELS[currentBelt])}</strong></p>
      <ul class="belt-list">
        ${beltRows}
        ${blackBeltRow}
      </ul>
      <div class="belt-disclaimer">
        <p><strong>Isso e a sua Faixa de Estudos no app.</strong> Ela representa seu progresso estudando aqui e nao substitui sua graduacao oficial na associacao.</p>
        <a class="secondary-button contact-link" href="${htmlEscape(STUDENT_APP_URL)}" target="_blank" rel="noreferrer">Abrir App do Aluno</a>
      </div>
    </section>
  `;
}
```

- [ ] **Step 4: Verificar sintaxe**

Run: `node --check prototype/app.js`
Expected: sem saida.

- [ ] **Step 5: Commit**

```bash
git add prototype/app.js
git commit -m "feat: mostrar cadeados na Home e tela de Progresso com Faixas de Estudo e aviso de graduacao"
```

---

### Task 9: Estilos visuais (faixas, cadeados, avisos) e verificacao manual end-to-end

**Files:**
- Modify: `prototype/styles.css` (adicionar regras novas ao final do arquivo)

**Interfaces:**
- Consumes: classes usadas nas Tasks 5-8: `.is-locked`, `.lock-icon`, `.locked-session`, `.quiz-gate`, `.quiz-gate-done`, `.quiz-pass`, `.quiz-fail`, `.belt-list`, `.belt-row`, `.belt-swatch`, `.belt-current`, `.belt-disclaimer`, `.extra-kata-note`, `.text-link-button`.

- [ ] **Step 1: Adicionar as novas regras de CSS**

No final de `prototype/styles.css`, adicionar:

```css
.card.is-locked {
  cursor: not-allowed;
  opacity: 0.55;
}

.lock-icon {
  font-size: 14px;
}

.locked-session {
  text-align: center;
}

.quiz-gate {
  margin: 16px 0;
}

.quiz-gate-done {
  color: var(--green);
  font-weight: bold;
}

.quiz-pass {
  color: var(--green);
  font-weight: bold;
}

.quiz-fail {
  color: var(--red);
  font-weight: bold;
}

.belt-current {
  font-size: 16px;
  margin: 10px 0;
}

.belt-list {
  list-style: none;
  margin: 12px 0;
  padding: 0;
}

.belt-row {
  align-items: center;
  border-bottom: 1px solid var(--line);
  display: flex;
  gap: 10px;
  justify-content: space-between;
  padding: 8px 0;
}

.belt-row.is-locked {
  color: var(--muted);
  opacity: 0.6;
}

.belt-swatch {
  border: 1px solid var(--line);
  border-radius: 999px;
  flex-shrink: 0;
  height: 18px;
  width: 18px;
}

.belt-disclaimer {
  background: #f4f0e8;
  border: 1px dashed var(--line);
  border-radius: 8px;
  margin-top: 16px;
  padding: 14px;
}

.belt-disclaimer .contact-link {
  display: inline-block;
  margin-top: 10px;
}

.extra-kata-note {
  margin-top: 16px;
}

.text-link-button {
  background: none;
  border: none;
  color: var(--red);
  cursor: pointer;
  font: inherit;
  padding: 0;
  text-decoration: underline;
}
```

- [ ] **Step 2: Rodar os testes do modulo de gamificacao mais uma vez (regressao)**

Run: `node --test prototype/gamification.test.js`
Expected: PASS em todos os testes.

- [ ] **Step 3: Verificar sintaxe de todos os arquivos JS**

Run: `node --check prototype/app.js && node --check prototype/gamification.js && echo "sintaxe OK"`
Expected: `sintaxe OK`

- [ ] **Step 4: Verificacao manual end-to-end no navegador**

Usar o skill `run` (ou seguir manualmente): subir um servidor estatico na raiz do repo e abrir `prototype/index.html` num navegador (headless ou nao). Roteiro minimo a validar:

1. Abrir a Home: deve mostrar faixa Branca implicita, cards de "Aprender" e "Treinar" abertos, cards de "Kata" (aponta pro hub), "Consultar" e "Revisar" com cadeado.
2. Entrar em "Aprender", marcar todos os itens como estudados, clicar em "Fazer prova" (so deve habilitar depois de todos marcados), responder ao menos 70% certo, confirmar que a tela de resultado mostra "Faixa de Estudos Amarela" conquistada.
3. Voltar pra Home: confirmar que "Treinar" agora esta destravado e "Kata"/"Consultar"/"Revisar" continuam bloqueados.
4. Repetir para "Treinar" -> confirma Vermelha e destrava o hub de Kata.
5. Entrar no hub de Kata: card "Iniciante" destravado, "Intermediario" e "Avancado" com cadeado. Completar Iniciante (70%+) -> confirma Laranja e destrava Intermediario. Repetir para os 3 niveis (Verde, Roxa).
6. Completar "Consultar" -> confirma Marrom.
7. Voltar pra Home: card "Revisar" agora destravado. Entrar, fazer o quiz de 50 perguntas, acertar >=70% -> confirma "Faixa de Estudos Preta".
8. Abrir a tela de Progresso (botao do topbar): confirmar que lista as 8 faixas com estado correto, o aviso de "nao substitui a graduacao oficial", e o botao "Abrir App do Aluno" (vai para o placeholder ate a Task de configuracao final).
9. Testar reprovacao: numa sessao ainda nao concluida, responder errado de proposito (<70%) e confirmar que aparece "Tentar novamente" e a sessao continua bloqueada para a proxima.

Se nao houver navegador automatizado disponivel no ambiente de execucao (ex.: sem `chromium-cli`/Playwright instalado), documentar isso explicitamente no relato final e, como alternativa minima, validar a logica isolando trechos de `app.js` com `node -e` (mesmo padrao usado para validar `videoTemplate` na etapa anterior deste projeto) para os pontos criticos: `Gamification.currentBeltKey`, `Gamification.isSessionUnlocked`, `Gamification.passesThreshold` (ja cobertos pelos testes automatizados da Task 3) e a montagem de `SESSION_QUIZ_CONFIG`/`sessionQuizQuestions` contra os dados reais.

- [ ] **Step 5: Commit final**

```bash
git add prototype/styles.css
git commit -m "feat: adicionar estilos de faixas, cadeados e avisos da gamificacao"
```

---

### Task 10 (config pendente - nao e codigo): substituir o link do App do Aluno

**Files:**
- Modify: `prototype/app.js:19` (constante `STUDENT_APP_URL`, adicionada na Task 8, Step 1)

- [ ] **Step 1: Pedir ao usuario o link real do "App do Aluno" (area do aluno com graduacao real, faltas, eventos) e substituir o placeholder**

```js
const STUDENT_APP_URL = "https://SUBSTITUIR-PELO-LINK-DO-APP-DO-ALUNO.exemplo.com";
```

Este valor **nao pode ser inventado** - so o usuario tem o link real. Enquanto nao for substituido, o botao "Abrir App do Aluno" na tela de Progresso aponta para um placeholder obviamente falso, o que e intencional (evita publicar um link quebrado ou incorreto sem que alguem note).

- [ ] **Step 2: Depois de substituir, commitar**

```bash
git add prototype/app.js
git commit -m "chore: configurar link real do App do Aluno"
```
