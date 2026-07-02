const state = {
  route: "home",
  data: null,
  filter: "todos",
  search: "",
  quizIndex: 0,
  quizAnswers: [],
};

const storeKey = "karate-shotokan-progress";
const app = document.querySelector("#app");
const tabs = [...document.querySelectorAll(".tab")];

const dataFiles = {
	contents: "data/content-items.json",
	techniques: "data/techniques.json",
	stances: "data/stances.json",
	katas: "data/katas.json",
	glossary: "data/glossary.json",
	rules: "data/rules.json",
	quiz: "data/quiz.json",
};

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(storeKey)) || { studied: [], quiz: null };
  } catch {
    return { studied: [], quiz: null };
  }
}

function setProgress(progress) {
  localStorage.setItem(storeKey, JSON.stringify(progress));
}

function markStudied(id) {
  const progress = getProgress();
  if (!progress.studied.includes(id)) {
    progress.studied.push(id);
  }
  setProgress(progress);
  render();
}

function isStudied(id) {
  return getProgress().studied.includes(id);
}

async function loadData() {
  const entries = await Promise.all(
    Object.entries(dataFiles).map(async ([key, path]) => {
      const response = await fetch(path);
      return [key, await response.json()];
    }),
  );
  state.data = Object.fromEntries(entries);
}

function allStudyItems() {
  const d = state.data;
  return [
    ...d.contents.map((item) => ({ ...item, kind: "conteudo", name: item.title })),
    ...d.techniques.map((item) => ({ ...item, kind: "tecnica" })),
    ...d.stances.map((item) => ({ ...item, kind: "base" })),
    ...d.katas.map((item) => ({ ...item, kind: "kata" })),
    ...d.glossary.map((item) => ({ ...item, kind: "termo", name: item.term })),
    ...d.rules.map((item) => ({ ...item, kind: "regra", name: item.title })),
  ];
}

function progressPercent() {
  const total = allStudyItems().length;
  const done = getProgress().studied.length;
  return total ? Math.round((done / total) * 100) : 0;
}

function setRoute(route) {
  state.route = route;
  state.filter = "todos";
  state.search = "";
  tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.route === route));
  render();
}

function openDetail(kind, id) {
  state.route = `detail:${kind}:${id}`;
  tabs.forEach((tab) => tab.classList.remove("is-active"));
  render();
}

function htmlEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function button(label, action, className = "secondary-button") {
  return `<button class="${className}" data-action="${action}" type="button">${label}</button>`;
}

function progressBlock() {
  const percent = progressPercent();
  return `
    <div class="progress-track" aria-label="Progresso geral">
      <div class="progress-fill" style="width: ${percent}%"></div>
    </div>
    <p class="muted">${percent}% dos itens marcados como estudados</p>
  `;
}

function homeView() {
  const progress = getProgress();
  const lastQuiz = progress.quiz ? `${progress.quiz.score}/${progress.quiz.total} no ultimo quiz` : "Quiz ainda nao iniciado";
  return `
    <section class="hero">
      <div class="hero-brand">
        <img class="hero-logo" src="assets/brand/atarashii-logo.png" alt="Logo Atarashii Karate-do Shotokan" />
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
        <p>Tecnicas basicas, bases e katas iniciais.</p>
      </button>
      <button class="card module-card" data-action="go:consultar" type="button">
        <h3>Consultar</h3>
        <p>Glossario, regras, pontuacao e termos.</p>
      </button>
      <button class="card module-card" data-action="go:revisar" type="button">
        <h3>Revisar</h3>
        <p>${lastQuiz}</p>
      </button>
    </section>
  `;
}

function sectionView(area) {
  const titles = {
    aprender: ["Aprender", "Conteudos historicos, conceituais e formativos."],
    treinar: ["Treinar", "Conteudos praticos para consulta antes ou depois do treino."],
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
      ...state.data.katas.map((item) => ({ ...item, kind: "kata" })),
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
    </section>
  `;
}

function cardTemplate(item) {
  const done = isStudied(item.id) ? "Estudado" : "Abrir";
  const title = item.name || item.title;
  const summary = item.summary || item.description || item.meaning || item.classification || "";
  return `
    <button class="card" data-open="${item.kind}:${item.id}" type="button">
      <h3>${htmlEscape(title)}</h3>
      <p>${htmlEscape(summary)}</p>
      <p class="muted">${htmlEscape(item.kind)} · ${done}</p>
    </button>
  `;
}

function findItem(kind, id) {
  const d = state.data;
  const map = {
    conteudo: d.contents,
    tecnica: d.techniques,
    base: d.stances,
    kata: d.katas,
    termo: d.glossary,
    regra: d.rules,
  };
  return map[kind]?.find((item) => item.id === id);
}

function detailView(kind, id) {
  const item = findItem(kind, id);
  if (!item) return `<p class="empty">Item nao encontrado.</p>`;

  const title = item.title || item.name || item.term;
  const text = item.body || item.description || item.meaning || "";
  const asset = item.imageUrl || item.diagramUrl || item.assetUrl;
  const video = item.associationVideoUrl || item.videoUrl;
  const meta = [
    kind,
    item.category,
    item.type,
    item.modality,
    item.level,
    item.kyodos ? `${item.kyodos} movimentos` : null,
    item.idealTime,
    item.kiai ? `Kiai: ${item.kiai}` : null,
  ].filter(Boolean);

  return `
    <article class="detail">
      ${button("Voltar", "back")}
      <h2>${htmlEscape(title)}</h2>
      <div class="meta">${meta.map((value) => `<span>${htmlEscape(value)}</span>`).join("")}</div>
      ${item.summary ? `<p><strong>Resumo:</strong> ${htmlEscape(item.summary)}</p>` : ""}
      <p>${htmlEscape(text)}</p>
      ${item.meaning && kind === "kata" ? `<p><strong>Significado:</strong> ${htmlEscape(item.meaning)}</p>` : ""}
      ${asset ? `<div class="asset"><img src="../${asset}" alt="${htmlEscape(title)}" /></div>` : ""}
      ${video ? `<p><a class="text-link" href="${htmlEscape(video)}" target="_blank" rel="noreferrer">Abrir video oficial</a></p>` : ""}
      ${item.instructorNotes ? `<p><strong>Observacoes do instrutor:</strong> ${htmlEscape(item.instructorNotes)}</p>` : ""}
      ${item.practiceChecklist?.length ? `<ul>${item.practiceChecklist.map((entry) => `<li>${htmlEscape(entry)}</li>`).join("")}</ul>` : ""}
      ${button(isStudied(item.id) ? "Estudado" : "Marcar como estudado", `study:${item.id}`, "primary-button")}
    </article>
  `;
}

function searchView() {
  const query = state.search.trim().toLowerCase();
  const results = query
    ? allStudyItems().filter((item) => {
        const haystack = [
          item.title,
          item.name,
          item.term,
          item.summary,
          item.description,
          item.meaning,
          item.category,
          item.type,
        ].join(" ").toLowerCase();
        return haystack.includes(query);
      })
    : [];

  return `
    <section>
      <h2 class="section-title">Busca</h2>
      <div class="search-row">
        <input class="search-input" id="searchInput" value="${htmlEscape(state.search)}" placeholder="Digite um termo..." />
        ${button("Buscar", "search", "primary-button")}
      </div>
      <div class="grid three">
        ${results.length ? results.map(cardTemplate).join("") : `<p class="empty">Digite algo para buscar nos conteudos do app.</p>`}
      </div>
    </section>
  `;
}

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
    consultar: () => sectionView("consultar"),
    revisar: reviewView,
    busca: searchView,
    quiz: quizView,
    resultado: resultView,
    progresso: progressView,
  };

  app.innerHTML = (views[state.route] || homeView)();
}

document.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-route]");
  const actionTarget = event.target.closest("[data-action]");
  const openTarget = event.target.closest("[data-open]");
  const filterTarget = event.target.closest("[data-filter]");
  const answerTarget = event.target.closest("[data-answer]");

  if (tab) {
    setRoute(tab.dataset.route);
    return;
  }

  if (openTarget) {
    const [kind, id] = openTarget.dataset.open.split(":");
    openDetail(kind, id);
    return;
  }

  if (filterTarget) {
    state.filter = filterTarget.dataset.filter;
    render();
    return;
  }

  if (answerTarget) {
    state.quizAnswers[state.quizIndex] = Number(answerTarget.dataset.answer);
    render();
    return;
  }

  if (!actionTarget) return;

  const action = actionTarget.dataset.action;
  if (action.startsWith("go:")) {
    setRoute(action.split(":")[1]);
  } else if (action === "home-search") {
    state.search = document.querySelector("#homeSearch")?.value || "";
    state.route = "busca";
    render();
  } else if (action === "search") {
    state.search = document.querySelector("#searchInput")?.value || "";
    render();
  } else if (action === "back") {
    history.length > 1 ? history.back() : setRoute("home");
    if (state.route.startsWith("detail:")) setRoute("home");
  } else if (action.startsWith("study:")) {
    markStudied(action.split(":")[1]);
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
});

document.querySelector("#progressButton").addEventListener("click", () => {
  state.route = "progresso";
  tabs.forEach((tab) => tab.classList.remove("is-active"));
  render();
});

loadData()
  .then(render)
  .catch((error) => {
    app.innerHTML = `<p class="empty">Nao foi possivel carregar os dados. Abra este prototipo por um servidor local.</p>`;
    console.error(error);
  });
