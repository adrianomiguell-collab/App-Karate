import React, { useMemo, useState } from "react";
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import contents from "./src/data/content-items.json";
import glossary from "./src/data/glossary.json";
import katas from "./src/data/katas.json";
import quiz from "./src/data/quiz.json";
import rules from "./src/data/rules.json";
import stances from "./src/data/stances.json";
import techniques from "./src/data/techniques.json";

const logo = require("./src/assets/brand/atarashii-logo.png");

const assetMap = {
  "assets/bases/bases-01.png": require("./src/assets/bases/bases-01.png"),
  "assets/bases/bases-02.png": require("./src/assets/bases/bases-02.png"),
  "assets/bases/bases-03.png": require("./src/assets/bases/bases-03.png"),
  "assets/katas/heian-shodan-nidan.png": require("./src/assets/katas/heian-shodan-nidan.png"),
  "assets/katas/heian-sandan-yondan-godan-bassai-dai.png": require("./src/assets/katas/heian-sandan-yondan-godan-bassai-dai.png"),
  "assets/katas/tekki-shodan-nidan-sandan.png": require("./src/assets/katas/tekki-shodan-nidan-sandan.png"),
  "assets/rules/kumite-pontuacao-avisos.png": require("./src/assets/rules/kumite-pontuacao-avisos.png"),
  "assets/rules/terminologia-arbitragem.png": require("./src/assets/rules/terminologia-arbitragem.png")
};

const tabs = [
  { id: "home", label: "Home" },
  { id: "aprender", label: "Aprender" },
  { id: "treinar", label: "Treinar" },
  { id: "consultar", label: "Consultar" },
  { id: "revisar", label: "Revisar" }
];

function normalizeItem(item, kind) {
  return {
    ...item,
    kind,
    displayTitle: item.title || item.name || item.term,
    displaySummary: item.summary || item.description || item.meaning || item.category || ""
  };
}

export default function App() {
  const [route, setRoute] = useState("home");
  const [detail, setDetail] = useState(null);
  const [studied, setStudied] = useState([]);
  const [search, setSearch] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const allItems = useMemo(() => [
    ...contents.map((item) => normalizeItem(item, "conteudo")),
    ...techniques.map((item) => normalizeItem(item, "tecnica")),
    ...stances.map((item) => normalizeItem(item, "base")),
    ...katas.map((item) => normalizeItem(item, "kata")),
    ...glossary.map((item) => normalizeItem(item, "termo")),
    ...rules.map((item) => normalizeItem(item, "regra"))
  ], []);

  const progress = allItems.length ? Math.round((studied.length / allItems.length) * 100) : 0;

  function go(nextRoute) {
    setDetail(null);
    setRoute(nextRoute);
  }

  function openItem(item) {
    setDetail(item);
  }

  function markStudied(id) {
    setStudied((current) => current.includes(id) ? current : [...current, id]);
  }

  function renderHome() {
    return (
      <View>
        <View style={styles.hero}>
          <View style={styles.heroBrand}>
            <Image source={logo} style={styles.heroLogo} />
            <View style={styles.flex}>
              <Text style={styles.eyebrow}>Associacao Atarashii Karate-do Shotokan</Text>
              <Text style={styles.heroTitle}>Atarashii App</Text>
            </View>
          </View>
          <Text style={styles.bodyText}>
            Estude e consulte Karate Shotokan em uma primeira versao focada em iniciantes.
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.muted}>{progress}% dos itens marcados como estudados</Text>
        </View>

        <View style={styles.grid}>
          <ModuleCard title="Aprender" text="Historia, fundamentos, conduta e graduacao." onPress={() => go("aprender")} />
          <ModuleCard title="Treinar" text="Tecnicas basicas, bases e katas iniciais." onPress={() => go("treinar")} />
          <ModuleCard title="Consultar" text="Glossario, regras, pontuacao e termos." onPress={() => go("consultar")} />
          <ModuleCard title="Revisar" text="Quiz da apostila e revisao de conhecimento." onPress={() => go("revisar")} />
        </View>
      </View>
    );
  }

  function renderList(title, subtitle, items) {
    return (
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.muted}>{subtitle}</Text>
        <View style={styles.list}>
          {items.map((item) => (
            <ItemCard
              key={`${item.kind}-${item.id}`}
              item={item}
              studied={studied.includes(item.id)}
              onPress={() => openItem(item)}
            />
          ))}
        </View>
      </View>
    );
  }

  function renderLearn() {
    return renderList(
      "Aprender",
      "Conteudos historicos, conceituais e formativos.",
      contents.map((item) => normalizeItem(item, "conteudo"))
    );
  }

  function renderTrain() {
    return renderList(
      "Treinar",
      "Kihon, bases e katas iniciais com suporte para videos futuros.",
      [
        ...techniques.map((item) => normalizeItem(item, "tecnica")),
        ...stances.map((item) => normalizeItem(item, "base")),
        ...katas.map((item) => normalizeItem(item, "kata"))
      ]
    );
  }

  function renderConsult() {
    return renderList(
      "Consultar",
      "Glossario, regras, pontuacao e termos de referencia.",
      [
        ...glossary.map((item) => normalizeItem(item, "termo")),
        ...rules.map((item) => normalizeItem(item, "regra"))
      ]
    );
  }

  function renderReview() {
    if (route === "quiz") return renderQuiz();
    if (route === "resultado") return renderResult();

    return (
      <View style={styles.hero}>
        <Text style={styles.sectionTitle}>Revisar</Text>
        <Text style={styles.bodyText}>Responda o quiz da apostila para fixar os principais conceitos.</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setAnswers([]);
            setQuizIndex(0);
            setRoute("quiz");
          }}
        >
          <Text style={styles.primaryText}>Iniciar quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderQuiz() {
    const current = quiz[quizIndex];
    const selected = answers[quizIndex];
    return (
      <View style={styles.quizCard}>
        <Text style={styles.muted}>Pergunta {quizIndex + 1} de {quiz.length}</Text>
        <Text style={styles.sectionTitle}>{current.question}</Text>
        {current.options.map((option, index) => (
          <TouchableOpacity
            key={option}
            style={[styles.answer, selected === index && styles.answerSelected]}
            onPress={() => {
              const next = [...answers];
              next[quizIndex] = index;
              setAnswers(next);
            }}
          >
            <Text style={styles.answerText}>{option}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (quizIndex < quiz.length - 1) {
              setQuizIndex(quizIndex + 1);
            } else {
              setRoute("resultado");
            }
          }}
        >
          <Text style={styles.primaryText}>{quizIndex < quiz.length - 1 ? "Proxima" : "Finalizar"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderResult() {
    const score = quiz.reduce((total, question, index) => total + (answers[index] === question.correctOption ? 1 : 0), 0);
    const wrong = quiz
      .map((question, index) => ({ question, answer: answers[index] }))
      .filter(({ question, answer }) => answer !== question.correctOption);

    return (
      <View>
        <View style={styles.hero}>
          <Text style={styles.sectionTitle}>Resultado</Text>
          <Text style={styles.bodyText}>Voce acertou {score} de {quiz.length} perguntas.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => go("revisar")}>
            <Text style={styles.primaryText}>Voltar</Text>
          </TouchableOpacity>
        </View>
        {wrong.slice(0, 10).map(({ question, answer }) => (
          <View key={question.id} style={styles.card}>
            <Text style={styles.cardTitle}>{question.question}</Text>
            <Text style={styles.muted}>Sua resposta: {question.options[answer] || "Nao respondida"}</Text>
            <Text style={styles.bodyText}>Correta: {question.options[question.correctOption]}</Text>
          </View>
        ))}
      </View>
    );
  }

  function renderSearch() {
    const query = search.trim().toLowerCase();
    const results = query
      ? allItems.filter((item) => JSON.stringify(item).toLowerCase().includes(query))
      : [];

    return (
      <View>
        <Text style={styles.sectionTitle}>Busca</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar OSS, Kiai, Heian, Yuko..."
          placeholderTextColor="#8a8f98"
          style={styles.input}
        />
        <View style={styles.list}>
          {results.map((item) => (
            <ItemCard key={`${item.kind}-${item.id}`} item={item} studied={studied.includes(item.id)} onPress={() => openItem(item)} />
          ))}
        </View>
      </View>
    );
  }

  function renderDetail() {
    if (!detail) return null;
    const asset = detail.imageUrl || detail.diagramUrl || detail.assetUrl;
    const video = detail.associationVideoUrl || detail.videoUrl;
    const source = assetMap[asset];

    return (
      <View>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => setDetail(null)}>
          <Text style={styles.secondaryText}>Voltar</Text>
        </TouchableOpacity>
        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>{detail.displayTitle}</Text>
          <Text style={styles.muted}>{detail.kind} {detail.category ? `· ${detail.category}` : ""}</Text>
          <Text style={styles.bodyText}>{detail.body || detail.description || detail.meaning}</Text>
          {detail.kyodos ? <Text style={styles.bodyText}>Movimentos: {detail.kyodos}</Text> : null}
          {detail.idealTime ? <Text style={styles.bodyText}>Tempo ideal: {detail.idealTime}</Text> : null}
          {detail.kiai ? <Text style={styles.bodyText}>Kiai: {detail.kiai}</Text> : null}
          {source ? <Image source={source} style={styles.assetImage} resizeMode="contain" /> : null}
          {video ? (
            <TouchableOpacity style={styles.secondaryButton} onPress={() => Linking.openURL(video)}>
              <Text style={styles.secondaryText}>Abrir video oficial</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.primaryButton} onPress={() => markStudied(detail.id)}>
            <Text style={styles.primaryText}>{studied.includes(detail.id) ? "Estudado" : "Marcar como estudado"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderCurrent() {
    if (detail) return renderDetail();
    if (route === "home") return renderHome();
    if (route === "aprender") return renderLearn();
    if (route === "treinar") return renderTrain();
    if (route === "consultar") return renderConsult();
    if (route === "revisar" || route === "quiz" || route === "resultado") return renderReview();
    if (route === "busca") return renderSearch();
    return renderHome();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#222831" />
      <View style={styles.topbar}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.flex}>
          <Text style={styles.eyebrow}>Guia de estudo</Text>
          <Text style={styles.appTitle}>Atarashii App</Text>
        </View>
        <TouchableOpacity style={styles.roundButton} onPress={() => go("busca")}>
          <Text style={styles.roundText}>?</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {renderCurrent()}
      </ScrollView>

      <View style={styles.tabbar}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => go(tab.id)}>
            <Text style={[styles.tabText, route === tab.id && styles.tabActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

function ModuleCard({ title, text, onPress }) {
  return (
    <TouchableOpacity style={styles.moduleCard} onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.muted}>{text}</Text>
    </TouchableOpacity>
  );
}

function ItemCard({ item, studied, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{item.displayTitle}</Text>
      <Text style={styles.muted}>{item.kind} {studied ? "· estudado" : ""}</Text>
      <Text style={styles.cardSummary}>{item.displaySummary}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#f7f4ef",
    flex: 1
  },
  topbar: {
    alignItems: "center",
    backgroundColor: "#222831",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  logo: {
    borderRadius: 24,
    height: 48,
    marginRight: 12,
    width: 48
  },
  flex: {
    flex: 1
  },
  eyebrow: {
    color: "#d8c7aa",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  appTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800"
  },
  roundButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 21,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  roundText: {
    color: "#222831",
    fontSize: 18,
    fontWeight: "900"
  },
  content: {
    flex: 1
  },
  contentInner: {
    padding: 16,
    paddingBottom: 96
  },
  hero: {
    backgroundColor: "#fffdf9",
    borderColor: "#ded7cc",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16
  },
  heroBrand: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 12
  },
  heroLogo: {
    borderRadius: 40,
    height: 80,
    marginRight: 14,
    width: 80
  },
  heroTitle: {
    color: "#20242b",
    fontSize: 27,
    fontWeight: "900"
  },
  bodyText: {
    color: "#20242b",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8
  },
  muted: {
    color: "#6b7280",
    fontSize: 13,
    lineHeight: 19
  },
  grid: {
    gap: 12
  },
  moduleCard: {
    backgroundColor: "#fffdf9",
    borderColor: "#ded7cc",
    borderLeftColor: "#b32222",
    borderLeftWidth: 5,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14
  },
  sectionTitle: {
    color: "#20242b",
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 29,
    marginBottom: 8
  },
  list: {
    gap: 10,
    marginTop: 14
  },
  card: {
    backgroundColor: "#fffdf9",
    borderColor: "#ded7cc",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14
  },
  cardTitle: {
    color: "#20242b",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6
  },
  cardSummary: {
    color: "#4b5563",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6
  },
  progressTrack: {
    backgroundColor: "#e5ded2",
    borderRadius: 999,
    height: 10,
    marginTop: 14,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: "#b32222",
    height: 10
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#b32222",
    borderRadius: 8,
    marginTop: 14,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 14
  },
  primaryText: {
    color: "#fff",
    fontWeight: "800"
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#ece6db",
    borderRadius: 8,
    marginBottom: 12,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 14
  },
  secondaryText: {
    color: "#20242b",
    fontWeight: "800"
  },
  detailCard: {
    backgroundColor: "#fffdf9",
    borderColor: "#ded7cc",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16
  },
  assetImage: {
    backgroundColor: "#f4f0e8",
    borderRadius: 8,
    height: 360,
    marginTop: 14,
    width: "100%"
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ded7cc",
    borderRadius: 8,
    borderWidth: 1,
    color: "#20242b",
    fontSize: 16,
    minHeight: 46,
    paddingHorizontal: 12
  },
  quizCard: {
    backgroundColor: "#fffdf9",
    borderColor: "#ded7cc",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16
  },
  answer: {
    backgroundColor: "#fff",
    borderColor: "#ded7cc",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
    padding: 12
  },
  answerSelected: {
    borderColor: "#b32222",
    borderWidth: 2
  },
  answerText: {
    color: "#20242b",
    fontSize: 15
  },
  tabbar: {
    backgroundColor: "#fff",
    borderTopColor: "#ded7cc",
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: "row",
    left: 0,
    position: "absolute",
    right: 0
  },
  tab: {
    alignItems: "center",
    flex: 1,
    minHeight: 64,
    justifyContent: "center",
    paddingHorizontal: 2
  },
  tabText: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "700"
  },
  tabActive: {
    color: "#b32222"
  }
});
