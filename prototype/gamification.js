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
    return Boolean(sessionsCompleted && sessionsCompleted[sessionKey] && sessionsCompleted[sessionKey].completed);
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
