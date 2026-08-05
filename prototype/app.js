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

const contactInfo = {
  place: "Academia Bee Strong",
  address: "R. Alm. Luís Penido Burnier, 211 - Jardim Sandra, São Paulo - SP",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=R.%20Alm.%20Lu%C3%ADs%20Penido%20Burnier%2C%20211%20-%20Jardim%20Sandra%2C%20S%C3%A3o%20Paulo%20-%20SP",
  instagram: "@associacao_atarashii_karate",
  instagramUrl: "https://www.instagram.com/associacao_atarashii_karate/",
  whatsappNumber: "5511965512234",
};
// CONFIGURACAO PENDENTE: substituir pelo link real do "App do Aluno" antes de publicar.
const STUDENT_APP_URL = "https://SUBSTITUIR-PELO-LINK-DO-APP-DO-ALUNO.exemplo.com";

const atarashiiStory = {
  author: "Sensei Luiz",
  authorRole: "Fundador da Associacao Atarashii Karate-Do Shotokan",
  paragraphs: [
    "Tudo comecou no final do ano de 2002, eu tinha 12 anos, quando meu tio Deci me chamou um dia para participar de uma aula de Jiu-Jitsu na academia onde ele treinava.",
    "Chegamos na academia, mas o professor de Jiu-Jitsu faltou. Entao a recepcionista da academia informou que iria comecar a aula de Karate (Estilo Shotokan), que o professor ja estava na sala e que, se eu quisesse participar para nao perder a viagem, eu poderia.",
    "Fiz a aula de Karate e meu tio ficou esperando do lado de fora a aula acabar. Assim que acabou, ele me perguntou:",
    "— E ai, gostou da aula de Karate?",
    "Eu respondi:",
    "— Tio, infelizmente voce perdeu um \"Jiujiteiro\", mas ganhou um Karateca.",
    "Ele entendeu, e iamos juntos toda semana para a academia: ele fazia o treino dele de Jiu-Jitsu e eu fazia o de Karate.",
    "Em 2003 conquistei a minha primeira faixa (amarela), participei do meu primeiro campeonato e fui vice-campeao paulista.",
    "Dai para a frente nao parei mais de treinar, participar de campeonatos e conquistar as minhas graduacoes.",
    "Entao continuei treinando com o meu Sensei Julio Cesar e me formei Faixa Preta em 2009, aos 18 anos.",
    "Continuei me dedicando, treinando, participando de campeonatos, ate que em 2014 surgiu a oportunidade de ministrar as aulas no lugar do Sensei durante um curto periodo. Me dediquei ao maximo nas aulas, e todos os pais e alunos me elogiaram durante este periodo como substituto.",
    "Foi ai que nasceu a vontade de querer ministrar aulas de Karate.",
    "Em janeiro de 2015 surgiu uma oportunidade de mostrar o meu trabalho na academia onde ministro aulas ate hoje. Em janeiro de 2024 fez 15 anos que sou Faixa Preta e ha 9 anos que sou professor de Karate.",
    "Em 2017 foi criada a Associacao Atarashii Karate-Do Shotokan, onde ministro aulas para todas as idades e sexos. Tenho alunos a partir de 5 anos, adolescentes, adultos e idosos.",
    "Sempre digo a todos que me procuram que nao ha idade para comecar a fazer esporte, e que o Karate nao e so colocar a luva e ficar dando porrada: tem todo um contexto e uma historia por tras, que so quem treina sabe a forca que tem.",
    "Saber que tenho a responsabilidade, principalmente com as criancas, de poder participar ativamente na educacao e na construcao do carater — e que tudo isso elas vao poder levar para a vida inteira — e, para mim, muito gratificante.",
    "A essencia dessa arte marcial esta no esforcar-se na formacao do bom carater, na fidelidade ao caminho da razao, no criar e fixar um intuito de esforco, no respeito acima de tudo e no dominar o espirito de agressao.",
    "O Karate hoje faz parte da minha vida. Sao mais de 20 anos me dedicando nao apenas a arte marcial e a defesa pessoal, mas tambem a uma filosofia de vida.",
    "Centenas de alunos passaram por mim, e pude deixar em cada um deles um pouco desta licao de vida: o desejo de ser um cidadao melhor, um pai melhor, um filho melhor. Nao ha preco que pague isso.",
  ],
};
const storeKey = "karate-shotokan-progress";
const app = document.querySelector("#app");
const tabs = [...document.querySelectorAll(".tab")];

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

function normalizeProgress(progress) {
  return {
    studied: Array.isArray(progress?.studied) ? progress.studied : [],
    favorites: Array.isArray(progress?.favorites) ? progress.favorites : [],
    quiz: progress?.quiz || null,
    sessions: progress?.sessions && typeof progress.sessions === "object" ? progress.sessions : {},
    finalChallenge: progress?.finalChallenge || null,
  };
}

function getProgress() {
  try {
    return normalizeProgress(JSON.parse(localStorage.getItem(storeKey)));
  } catch {
    return normalizeProgress(null);
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

function toggleFavorite(id) {
  const progress = getProgress();
  if (progress.favorites.includes(id)) {
    progress.favorites = progress.favorites.filter((favoriteId) => favoriteId !== id);
  } else {
    progress.favorites.push(id);
  }
  setProgress(progress);
  render();
}

function isFavorite(id) {
  return getProgress().favorites.includes(id);
}

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

const SESSION_LABELS = {
  aprender: "Aprender",
  treinar: "Treinar",
  "kata-iniciante": "Kata - Iniciante",
  "kata-intermediario": "Kata - Intermediario",
  "kata-avancado": "Kata - Avancado",
  consultar: "Consultar",
};

const SESSION_QUIZ_CONFIG = {
  aprender: {
    dataKey: "quiz",
    // Subconjunto de 10 perguntas (de um banco de 23 nessas categorias) para
    // nao sobrecarregar a primeira prova do jogo -- mantem pelo menos 1
    // pergunta de cada uma das 8 categorias de Aprender.
    ids: ["q001", "q005", "q008", "q011", "q012", "q014", "q016", "q036", "q039", "q045"],
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
  if (config.ids) return config.ids.map((id) => pool.find((q) => q.id === id)).filter(Boolean);
  if (!config.categories) return pool;
  return pool.filter((q) => config.categories.includes(q.category));
}

function beltDisclaimer() {
  return `
    <div class="belt-disclaimer">
      <p><strong>Isso e a sua Faixa de Estudos no app.</strong> Ela representa seu progresso estudando aqui e nao substitui sua graduacao oficial na associacao.</p>
      <a class="secondary-button contact-link" href="${htmlEscape(STUDENT_APP_URL)}" target="_blank" rel="noreferrer">Abrir App do Aluno</a>
    </div>
  `;
}

function quizGateBlock(sessionKey) {
  if (sessionCompleted(sessionKey)) {
    const belt = Gamification.beltForSession(sessionKey);
    return `
      <div class="quiz-gate quiz-gate-done">
        <p>Prova concluida! Voce conquistou a ${htmlEscape(Gamification.BELT_LABELS[belt])}.</p>
        ${beltDisclaimer()}
      </div>
    `;
  }
  if (!sessionUnlockedForUI(sessionKey)) {
    const idx = Gamification.SESSION_ORDER.indexOf(sessionKey);
    const previousKey = idx > 0 ? Gamification.SESSION_ORDER[idx - 1] : null;
    const previousLabel = previousKey ? SESSION_LABELS[previousKey] : "";
    return `
      <div class="quiz-gate quiz-gate-locked">
        <button class="primary-button" type="button" disabled>Fazer prova</button>
        <p class="muted">Voce pode estudar este conteudo livremente. A prova so libera depois de conquistar a faixa de "${htmlEscape(previousLabel)}".</p>
      </div>
    `;
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

async function loadData() {
  const entries = await Promise.all(
    Object.entries(dataFiles).map(async ([key, path]) => {
      const response = await fetch(path);
      return [key, await response.json()];
    }),
  );
  state.data = Object.fromEntries(entries);
  state.data.katas = Array.isArray(state.data.katas) ? state.data.katas : state.data.katas.katas;
}

function allStudyItems() {
  const d = state.data;
  return [
    ...d.contents.map((item) => ({ ...item, kind: "conteudo", name: item.title })),
    ...d.techniques.map((item) => ({ ...item, kind: "tecnica" })),
    ...d.stances.map((item) => ({ ...item, kind: "base" })),
    ...d.katas.map((item) => ({ ...item, kind: "kata", name: item.nome || item.name, summary: item.significado || item.summary })),
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
  if (!state.route.startsWith("detail:")) {
    state.detailReturnRoute = state.route;
  }
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

function paragraphsTemplate(value) {
  const paragraphs = String(value || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  return paragraphs.map((paragraph) => `<p>${htmlEscape(paragraph)}</p>`).join("");
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

function beltSwatchHtml(beltKey) {
  const image = Gamification.BELT_IMAGES[beltKey];
  if (image) {
    return `<img class="belt-swatch" src="../${htmlEscape(image)}" alt="${htmlEscape(Gamification.BELT_LABELS[beltKey])}" />`;
  }
  return `<span class="belt-swatch" style="background:${Gamification.BELT_COLORS[beltKey]}"></span>`;
}

function currentBeltBlock() {
  const progress = getProgress();
  const beltKey = Gamification.currentBeltKey(progress.sessions);
  return `
    <button class="belt-home-badge" data-action="go:progresso" type="button">
      <span class="belt-home-badge-main">
        ${beltSwatchHtml(beltKey)}
        <span>Faixa de Estudos atual: <strong>${htmlEscape(Gamification.BELT_LABELS[beltKey])}</strong></span>
      </span>
      <span class="muted belt-home-badge-link">Ver progresso &rsaquo;</span>
    </button>
  `;
}

function moduleCard(sessionKey, label, description, routeOverride) {
  const route = routeOverride || sessionKey;
  const locked = !sessionUnlockedForUI(sessionKey);
  return `
    <button class="card module-card" data-action="go:${route}" type="button">
      <h3>${htmlEscape(label)}${locked ? ' <span class="lock-icon" aria-hidden="true" title="Prova ainda bloqueada">&#128274;</span>' : ""}</h3>
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
      ${currentBeltBlock()}
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
      <button class="card module-card" data-action="go:atarashii" type="button">
        <h3>A Atarashii</h3>
        <p>A historia da nossa Associacao e do fundador.</p>
      </button>
      <button class="card module-card" data-action="go:contato" type="button">
        <h3>Contato</h3>
        <p>Endereco, mapa e redes da associacao.</p>
      </button>
    </section>
  `;
}

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
      <p class="muted">Katas organizados em 3 niveis. Voce pode estudar qualquer nivel a qualquer momento -- a prova de cada nivel libera na sequencia.</p>
      <div class="grid three">
        ${tiers.map((tier) => {
          const sessionKey = KATA_TIER_TO_SESSION[tier];
          const unlocked = sessionUnlockedForUI(sessionKey);
          const completed = sessionCompleted(sessionKey);
          const count = kataTierItems(tier).length;
          const status = completed ? "Concluido" : unlocked ? "Prova disponivel" : "Prova bloqueada";
          return `
            <button class="card" data-action="go:${sessionKey}" type="button">
              <h3>${KATA_TIER_LABELS[tier]}${unlocked ? "" : ' <span class="lock-icon" aria-hidden="true" title="Prova ainda bloqueada">&#128274;</span>'}</h3>
              <p>${count} katas. ${status}</p>
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

function cardTemplate(item) {
  const done = isStudied(item.id) ? "Estudado" : "Abrir";
  const title = item.name || item.title || item.nome;
  const summary = item.summary || item.description || item.meaning || item.significado || item.classification || item.classificacao?.faixa_sugerida || "";
  return `
    <button class="card" data-open="${item.kind}:${item.id}" type="button">
      <h3>${htmlEscape(title)}</h3>
      <p>${htmlEscape(summary)}</p>
      <p class="muted">${htmlEscape(item.kind)} &middot; ${done}</p>
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

function youtubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) return url;
      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/").filter(Boolean)[1];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

function videoTemplate(video, title) {
  const embedUrl = youtubeEmbedUrl(video);
  if (!embedUrl) {
    return `<p><a class="text-link" href="${htmlEscape(video)}" target="_blank" rel="noreferrer">Abrir video oficial</a></p>`;
  }
  return `
    <div class="video-player">
      <iframe src="${htmlEscape(embedUrl)}" title="Video oficial - ${htmlEscape(title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
    <p><a class="text-link" href="${htmlEscape(video)}" target="_blank" rel="noreferrer">Abrir no YouTube</a></p>
  `;
}
function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function listTemplate(items) {
  const values = asArray(items);
  return values.length ? `<ul>${values.map((entry) => `<li>${htmlEscape(entry)}</li>`).join("")}</ul>` : `<p class="muted">Pendente de cadastro.</p>`;
}

function fieldTemplate(label, value) {
  if (!value || (Array.isArray(value) && !value.length)) return "";
  return `<div class="info-card"><strong>${htmlEscape(label)}</strong><span>${htmlEscape(Array.isArray(value) ? value.join(", ") : value)}</span></div>`;
}

function detailSection(title, content) {
  if (!content) return "";
  return `<section class="detail-section"><h3>${htmlEscape(title)}</h3>${content}</section>`;
}

function kataVideoUrl(item) {
  return item.video?.youtube_video_url || item.associationVideoUrl || item.videoUrl || "";
}

function kataDetailView(item) {
  const title = item.nome || item.name;
  const technical = item.informacoes_tecnicas || {};
  const classification = item.classificacao || {};
  const objectives = item.objetivos || {};
  const bunkai = item.bunkai || {};
  const video = kataVideoUrl(item);
  const index = state.data.katas.findIndex((kata) => kata.id === item.id);
  const previous = index > 0 ? state.data.katas[index - 1] : null;
  const next = index >= 0 && index < state.data.katas.length - 1 ? state.data.katas[index + 1] : null;
  const studied = isStudied(item.id);
  const favorite = isFavorite(item.id);
  const kataProgress = studied ? 100 : 0;
  const techniqueGroups = Object.entries(item.tecnicas || {})
    .filter(([, values]) => asArray(values).length)
    .map(([group, values]) => `<div class="technique-group"><strong>${htmlEscape(group.replaceAll("_", " "))}</strong>${listTemplate(values)}</div>`)
    .join("");

  return `
    <article class="detail kata-detail">
      ${button("Voltar", "back")}
      <header class="kata-hero">
        <p class="eyebrow">Kata Shotokan</p>
        <h2>${htmlEscape(title)}</h2>
        ${item.nome_japones ? `<p class="kata-japanese">${htmlEscape(item.nome_japones)}</p>` : ""}
        <p class="kata-summary"><strong>Significado:</strong> ${htmlEscape(item.significado || "Pendente de cadastro.")}</p>
        ${item.pronuncia ? `<p class="muted"><strong>Pronuncia:</strong> ${htmlEscape(item.pronuncia)}</p>` : ""}
        <div class="meta">
          ${[classification.nivel, classification.faixa_sugerida, technical.quantidade_aproximada_movimentos ? `${technical.quantidade_aproximada_movimentos} movimentos` : null, technical.tempo_medio_execucao, technical.grau_dificuldade_1a5 ? `Dificuldade ${technical.grau_dificuldade_1a5}/5` : null].filter(Boolean).map((value) => `<span>${htmlEscape(value)}</span>`).join("")}
        </div>
        <div class="progress-track" aria-label="Progresso deste kata"><div class="progress-fill" style="width: ${kataProgress}%"></div></div>
        <p class="muted">${studied ? "Kata marcado como estudado." : "Kata ainda nao marcado como estudado."}</p>
      </header>

      ${video ? videoTemplate(video, title) : `<div class="video-pending">${htmlEscape(item.video?.video_tipo || "Video oficial pendente de cadastro.")}</div>`}

      <div class="detail-actions">
        ${button(favorite ? "Favorito" : "Favoritar", `favorite:${item.id}`)}
        ${button(studied ? "Estudado" : "Marcar como estudado", `study:${item.id}`, "primary-button")}
      </div>

      ${detailSection("Historico", `<p>${htmlEscape(item.historico || "Pendente de cadastro.")}</p>`)}
      ${detailSection("Origem e criador", `<div class="info-grid">${fieldTemplate("Origem", item.origem)}${fieldTemplate("Criador", item.criador)}</div>`)}
      ${detailSection("Classificacao", `<div class="info-grid">${fieldTemplate("Nivel", classification.nivel)}${fieldTemplate("Faixa sugerida", classification.faixa_sugerida)}${fieldTemplate("Ordem tradicional", classification.ordem_tradicional_aprendizado)}${fieldTemplate("Sequencia", classification.associacao_que_utiliza_sequencia)}</div>`)}
      ${detailSection("Informacoes tecnicas", `<div class="info-grid">${fieldTemplate("Movimentos", technical.quantidade_aproximada_movimentos)}${fieldTemplate("Tempo medio", technical.tempo_medio_execucao)}${fieldTemplate("Kiai", technical.quantidade_kiai)}${fieldTemplate("Pontos de Kiai", technical.pontos_kiai)}${fieldTemplate("Direcoes principais", technical.direcoes_principais)}${fieldTemplate("Dificuldade", technical.grau_dificuldade_1a5 ? `${technical.grau_dificuldade_1a5}/5` : "")}</div>`)}
      ${detailSection("Objetivos", `<div class="info-grid">${fieldTemplate("Objetivo principal", objectives.objetivo_principal)}${fieldTemplate("O aluno desenvolve", objectives.o_que_o_aluno_desenvolve)}${fieldTemplate("Conceitos", objectives.principais_conceitos)}${fieldTemplate("Estrategia", objectives.estrategia_combate_representada)}</div>`)}
      ${detailSection("Tecnicas", techniqueGroups || `<p class="muted">Tecnicas pendentes de cadastro.</p>`)}
      ${detailSection("Bases utilizadas", listTemplate(item.bases_utilizadas))}
      ${detailSection("Embusen", `<p>${htmlEscape(technical.embusen || "Pendente de cadastro.")}</p>`)}
      ${detailSection("Bunkai", `<div class="info-grid">${fieldTemplate("Aplicacao principal", bunkai.aplicacao_principal)}${fieldTemplate("Conceito", bunkai.conceito)}${fieldTemplate("Distancia", bunkai.distancia)}${fieldTemplate("Tipo de combate", bunkai.tipo_combate)}</div>`)}
      ${detailSection("Erros comuns", listTemplate(item.principais_erros))}
      ${detailSection("Checklist", `<ul class="checklist">${asArray(item.checklist_aprendizagem).map((entry) => `<li>${htmlEscape(entry)}</li>`).join("")}</ul>`)}
      ${detailSection("Curiosidades", listTemplate(item.curiosidades))}
      ${item.fontes_e_observacoes?.observacao ? detailSection("Observacoes", `<p>${htmlEscape(item.fontes_e_observacoes.observacao)}</p>`) : ""}

      <nav class="kata-nav" aria-label="Navegacao entre katas">
        ${previous ? `<button class="secondary-button" data-open="kata:${previous.id}" type="button">Kata anterior</button>` : `<span></span>`}
        ${next ? `<button class="secondary-button" data-open="kata:${next.id}" type="button">Proximo Kata</button>` : `<span></span>`}
      </nav>
    </article>
  `;
}
function detailView(kind, id) {
  const item = findItem(kind, id);
  if (!item) return `<p class="empty">Item nao encontrado.</p>`;

  if (kind === "kata" && item.classificacao && item.informacoes_tecnicas) {
    return kataDetailView(item);
  }

  const title = item.title || item.name || item.term || item.nome;
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
      ${paragraphsTemplate(text)}
      ${kind === "tecnica" ? (video ? videoTemplate(video, title) : `<div class="video-pending">Video oficial pendente de cadastro.</div>`) : ""}
      ${item.longDescription ? detailSection("Como executar", `<p>${htmlEscape(item.longDescription)}</p>`) : ""}
      ${asArray(item.executionSteps).length ? detailSection("Passo a passo", `<ol class="execution-steps">${asArray(item.executionSteps).map((entry) => `<li><strong>${htmlEscape(entry.title || "Etapa")}</strong><span>${htmlEscape(entry.text || entry)}</span></li>`).join("")}</ol>`) : ""}
      ${item.meaning && kind === "kata" ? `<p><strong>Significado:</strong> ${htmlEscape(item.meaning)}</p>` : ""}
      ${asset ? `<div class="asset"><img src="../${asset}" alt="${htmlEscape(title)}" /></div>` : ""}
      ${video && kind !== "tecnica" ? `<p><a class="text-link" href="${htmlEscape(video)}" target="_blank" rel="noreferrer">Abrir video oficial</a></p>` : ""}
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

function atarashiiView() {
  return `
    <section class="detail atarashii-view">
      <p class="eyebrow">A Atarashii</p>
      <h2>A historia por tras da Associacao</h2>
      <div class="atarashii-author">
        <strong>${htmlEscape(atarashiiStory.author)}</strong>
        <span class="muted">${htmlEscape(atarashiiStory.authorRole)}</span>
      </div>
      ${atarashiiStory.paragraphs.map((paragraph) => `<p>${htmlEscape(paragraph)}</p>`).join("")}
      <p class="atarashii-signature">— ${htmlEscape(atarashiiStory.author)}, ${htmlEscape(atarashiiStory.authorRole)}</p>
    </section>
  `;
}

function contactView() {
  const whatsappUrl = contactInfo.whatsappNumber ? `https://wa.me/${contactInfo.whatsappNumber}` : "";
  return `
    <section class="detail contact-view">
      <p class="eyebrow">Contato</p>
      <h2>Associacao Atarashii Karate-do Shotokan</h2>
      <div class="contact-list">
        <div class="info-card">
          <strong>Local de treino</strong>
          <span>${htmlEscape(contactInfo.place)}</span>
        </div>
        <div class="info-card">
          <strong>Endereco</strong>
          <span>${htmlEscape(contactInfo.address)}</span>
        </div>
        <div class="info-card">
          <strong>Instagram</strong>
          <span>${htmlEscape(contactInfo.instagram)}</span>
        </div>
        <div class="info-card">
          <strong>WhatsApp</strong>
          <span>${contactInfo.whatsappNumber ? "Abrir conversa pelo WhatsApp." : "Numero pendente de cadastro."}</span>
        </div>
      </div>
      <div class="contact-actions">
        <a class="primary-button contact-link" href="${htmlEscape(contactInfo.mapsUrl)}" target="_blank" rel="noreferrer">Abrir no mapa</a>
        <a class="secondary-button contact-link" href="${htmlEscape(contactInfo.instagramUrl)}" target="_blank" rel="noreferrer">Abrir Instagram</a>
        ${whatsappUrl ? `<a class="primary-button contact-link" href="${htmlEscape(whatsappUrl)}" target="_blank" rel="noreferrer">Chamar no WhatsApp</a>` : `<button class="secondary-button" type="button" disabled>WhatsApp pendente</button>`}
      </div>
    </section>
  `;
}
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

function saveQuizResult() {
  const questions = activeQuizQuestions();
  const total = questions.length;
  const score = questions.reduce((sum, question, index) => sum + (state.quizAnswers[index] === question.correctOption ? 1 : 0), 0);
  const passed = Gamification.passesThreshold(score, total);
  const progress = getProgress();

  const isFinal = state.activeQuizSession === "final";
  const previous = isFinal ? progress.finalChallenge : progress.sessions[state.activeQuizSession];
  const alreadyEarned = isFinal ? Boolean(previous?.passed) : Boolean(previous?.completed);
  const sticky = passed || alreadyEarned;

  if (isFinal) {
    progress.finalChallenge = { score, total, passed: sticky, date: new Date().toISOString() };
  } else {
    progress.sessions[state.activeQuizSession] = { completed: sticky, score, total, date: new Date().toISOString() };
  }
  setProgress(progress);
}

function resultView() {
  const questions = activeQuizQuestions();
  const total = questions.length;
  const score = questions.reduce((sum, question, index) => sum + (state.quizAnswers[index] === question.correctOption ? 1 : 0), 0);
  const passed = Gamification.passesThreshold(score, total);
  const progress = getProgress();

  const isFinal = state.activeQuizSession === "final";
  const previous = isFinal ? progress.finalChallenge : progress.sessions[state.activeQuizSession];
  const alreadyEarned = isFinal ? Boolean(previous?.passed) : Boolean(previous?.completed);

  const wrong = questions
    .map((question, index) => ({ question, index, answer: state.quizAnswers[index] }))
    .filter((entry) => entry.answer !== entry.question.correctOption);

  const beltKey = isFinal ? "preta" : Gamification.beltForSession(state.activeQuizSession);
  const beltLabel = beltKey ? Gamification.BELT_LABELS[beltKey] : "";
  const backRoute = isFinal ? "revisar" : state.activeQuizSession;

  let message;
  if (passed) {
    message = `<p class="quiz-pass">Parabens! Voce conquistou a ${htmlEscape(beltLabel)}.</p>`;
  } else if (alreadyEarned) {
    message = `<p class="quiz-fail">Voce nao atingiu 70% nesta tentativa, mas sua ${htmlEscape(beltLabel)} continua conquistada.</p>`;
  } else {
    message = `<p class="quiz-fail">Voce precisa de pelo menos 70% para conquistar a ${htmlEscape(beltLabel)}. Tente novamente.</p>`;
  }

  return `
    <section class="hero">
      <h2>Resultado</h2>
      <p>Voce acertou ${score} de ${total} perguntas (${Gamification.scorePercent(score, total)}%).</p>
      ${message}
      ${alreadyEarned ? beltDisclaimer() : ""}
      <div class="toolbar">
        ${passed ? "" : button("Tentar novamente", `start-session-quiz:${state.activeQuizSession}`, "primary-button")}
        ${button("Voltar", `go:${backRoute}`, passed ? "primary-button" : "secondary-button")}
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
  const beltOrder = ["branca", ...Gamification.SESSION_ORDER.map((key) => Gamification.BELT_BY_SESSION[key])];
  const currentBelt = Gamification.currentBeltKey(progress.sessions);
  const currentIndex = beltOrder.indexOf(currentBelt);
  const finalUnlocked = Gamification.isFinalChallengeUnlocked(progress.sessions);
  const blackBeltEarned = Boolean(progress.finalChallenge?.passed);

  const beltRows = beltOrder.map((beltKey, index) => {
    const earned = currentIndex >= index;
    return `
      <li class="belt-row ${earned ? "is-earned" : "is-locked"}">
        ${beltSwatchHtml(beltKey)}
        <span>${htmlEscape(Gamification.BELT_LABELS[beltKey])}</span>
        <span class="muted">${earned ? "Conquistada" : "Bloqueada"}</span>
      </li>
    `;
  }).join("");

  const blackBeltRow = `
    <li class="belt-row ${blackBeltEarned ? "is-earned" : "is-locked"}">
      ${beltSwatchHtml("preta")}
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
      ${beltDisclaimer()}
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
    atarashii: atarashiiView,
    contato: contactView,
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
    state.route = state.detailReturnRoute || "home";
    tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.route === state.route));
    render();
  } else if (action.startsWith("favorite:")) {
    toggleFavorite(action.split(":")[1]);
  } else if (action.startsWith("study:")) {
    markStudied(action.split(":")[1]);
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
      saveQuizResult();
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













