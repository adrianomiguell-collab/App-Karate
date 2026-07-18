const state = {
  route: "home",
  detailReturnRoute: "home",
  data: null,
  filter: "todos",
  search: "",
  quizIndex: 0,
  quizAnswers: [],
};

const contactInfo = {
  place: "Academia Bee Strong",
  address: "R. Alm. Luís Penido Burnier, 211 - Jardim Sandra, São Paulo - SP",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=R.%20Alm.%20Lu%C3%ADs%20Penido%20Burnier%2C%20211%20-%20Jardim%20Sandra%2C%20S%C3%A3o%20Paulo%20-%20SP",
  instagram: "@associacao_atarashii_karate",
  instagramUrl: "https://www.instagram.com/associacao_atarashii_karate/",
  whatsappNumber: "5511965512234",
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
};

function normalizeProgress(progress) {
  return {
    studied: Array.isArray(progress?.studied) ? progress.studied : [],
    favorites: Array.isArray(progress?.favorites) ? progress.favorites : [],
    quiz: progress?.quiz || null,
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

function sectionView(area) {
  const titles = {
    aprender: ["Aprender", "Conteudos historicos, conceituais e formativos."],
    treinar: ["Treinar", "Kihon, tecnicas basicas e bases para consulta antes ou depois do treino."],
    katas: ["Kata", "Katas iniciais com ficha tecnica, embusen e videos oficiais quando disponiveis."],
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

  if (area === "katas") {
    items = state.data.katas.map((item) => ({ ...item, kind: "kata", name: item.nome || item.name, summary: item.significado || item.summary, category: item.classificacao?.nivel || item.category, level: item.classificacao?.faixa_sugerida || item.level }));
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

const techniqueVideoMap = {
  "gyaku-zuki": "assets/techniques/gyaku-zuki.mp4",
};

function localTechniqueVideo(item, title) {
  const source = techniqueVideoMap[item.id];
  if (!source) return "";
  return `
    <div class="technique-video">
      <video src="${htmlEscape(source)}" aria-label="Demonstracao do golpe ${htmlEscape(title)}" autoplay muted loop playsinline controls preload="metadata"></video>
      <p class="muted">Demonstracao visual sem audio. Observe a rotacao do quadril, o hikite e o kime.</p>
    </div>
  `;
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
  const techniqueVideo = kind === "tecnica" ? localTechniqueVideo(item, title) : "";
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
      ${techniqueVideo}
      ${item.longDescription ? detailSection("Como executar", `<p>${htmlEscape(item.longDescription)}</p>`) : ""}
      ${asArray(item.executionSteps).length ? detailSection("Passo a passo", `<ol class="execution-steps">${asArray(item.executionSteps).map((entry) => `<li><strong>${htmlEscape(entry.title || "Etapa")}</strong><span>${htmlEscape(entry.text || entry)}</span></li>`).join("")}</ol>`) : ""}
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













