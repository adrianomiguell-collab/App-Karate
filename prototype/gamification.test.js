const test = require("node:test");
const assert = require("node:assert/strict");
const Gamification = require("./gamification.js");

test("faixa inicial e branca quando nenhuma sessao concluida", () => {
  assert.equal(Gamification.currentBeltKey({}), "branca");
});

test("cada sessao concluida avanca a faixa na ordem certa", () => {
  const completed = { aprender: { completed: true }, treinar: { completed: true } };
  assert.equal(Gamification.currentBeltKey(completed), "vermelha");
});

test("sequencia quebrada nao pula faixa", () => {
  const completed = { treinar: { completed: true } };
  assert.equal(Gamification.currentBeltKey(completed), "branca");
});

test("sessao so desbloqueia se a anterior estiver completa", () => {
  assert.equal(Gamification.isSessionUnlocked({}, "aprender"), true);
  assert.equal(Gamification.isSessionUnlocked({}, "treinar"), false);
  assert.equal(Gamification.isSessionUnlocked({ aprender: { completed: true } }, "treinar"), true);
  assert.equal(Gamification.isSessionUnlocked({ aprender: { completed: true } }, "kata-iniciante"), false);
});

test("uma sessao com completed:false nao conta como concluida nem destrava a proxima", () => {
  const sessions = { aprender: { completed: false, score: 3, total: 10 } };
  assert.equal(Gamification.isSessionCompleted(sessions, "aprender"), false);
  assert.equal(Gamification.isSessionUnlocked(sessions, "treinar"), false);
  assert.equal(Gamification.currentBeltKey(sessions), "branca");
});

test("desafio final so desbloqueia com todas as 6 sessoes completas", () => {
  const almostAll = {
    aprender: { completed: true },
    treinar: { completed: true },
    "kata-iniciante": { completed: true },
    "kata-intermediario": { completed: true },
    "kata-avancado": { completed: true },
  };
  assert.equal(Gamification.isFinalChallengeUnlocked(almostAll), false);
  const all = { ...almostAll, consultar: { completed: true } };
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
