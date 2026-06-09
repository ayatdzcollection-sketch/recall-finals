/* data/french-extra.js — extra French 3 practice for the final (Oral June 9,
   Written June 9-10): conjugation usage, si-clauses, futur-vs-conditionnel,
   irregular stems, plus more Belgique + environnement vocab.

   Loaded AFTER js/quizgen.js so authored ids only ever append (never shifts the
   generated conjugation-drill ids). Normal authored questions -> they show in
   the For You feed and Practice, mixed with the generated drills. */
(function (STUDY) {
  "use strict";
  if (!STUDY || typeof STUDY.addAuthored !== "function") return;

  function mc(topicId, rows) {
    STUDY.addAuthored(topicId, rows.map(function (r) {
      return { type: "mc", q: r[0], choices: r[1], answer: r[2], explain: r[3] || "", lvl: r[4] || 1, concept: "frextra" };
    }));
  }
  function fill(topicId, rows) {
    STUDY.addAuthored(topicId, rows.map(function (r) {
      return { type: "fill", q: r[0], answers: r[1], explain: r[2] || "", lvl: r[3] || 1, concept: "frextra" };
    }));
  }

  /* ===== Le Conditionnel: usage, si-clauses, stems, production ===== */
  mc("fr-conditionnel", [
    ["Le conditionnel expresses:", ["a finished past action", "'would' — politeness, hypotheticals, suggestions", "'will' — a sure future plan", "a command"], 1, "Le conditionnel = 'would'."],
    ["After « Si » + imparfait, the OTHER clause uses the:", ["futur", "conditionnel", "présent", "passé composé"], 1, "Si j'avais le temps, je voyagerais. (si + imparfait → conditionnel)"],
    ["« Je voudrais un café » is more polite than « Je veux un café » because it uses the:", ["futur", "conditionnel", "imparfait", "présent"], 1, "voudrais = conditionnel of vouloir → softer/polite."],
    ["Which sentence says 'you SHOULD call her' (a suggestion)?", ["Tu appelles.", "Tu appelleras.", "Tu devrais l'appeler.", "Tu as appelé."], 2, "devrais (conditionnel of devoir) = should."],
    ["The future/conditional stem of « vouloir » is:", ["voudr-", "voulr-", "vouler-", "voudrai-"], 0, "vouloir → voudr- (je voudrais)."],
    ["The future/conditional stem of « venir » is:", ["venir-", "viendr-", "viendrai-", "vendr-"], 1, "venir → viendr- (je viendrais). (vendre → vendr-, don't mix them up.)"],
    ["The future/conditional stem of « voir » is:", ["voir-", "verr-", "voyr-", "vu-"], 1, "voir → verr- (je verrais)."],
  ]);
  fill("fr-conditionnel", [
    ["Si j'avais de l'argent, je ____ en Belgique. (voyager)", ["voyagerais"], "si + imparfait → conditionnel: voyager + -ais."],
    ["Si tu étudiais plus, tu ____ l'examen. (réussir)", ["réussirais", "reussirais"], "réussir + -ais → réussirais."],
    ["Politesse : ____ -vous m'aider, s'il vous plaît ? (pouvoir, vous)", ["pourriez"], "pourr- + -iez → pourriez."],
    ["Au conditionnel : On ____ aller à la mer ? (pouvoir)", ["pourrait"], "pourr- + -ait → pourrait."],
    ["Suggestion : Vous ____ visiter Bruxelles. (devoir)", ["devriez"], "devr- + -iez → devriez (you should)."],
  ]);

  /* ===== Le Futur: usage, si + présent, futur-vs-conditionnel ===== */
  mc("fr-futur", [
    ["After « Si » + présent, the OTHER clause uses the:", ["conditionnel", "futur", "imparfait", "passé composé"], 1, "Si j'ai le temps, j'irai. (si + présent → futur)"],
    ["« Je parlerai » vs « Je parlerais » — which one is the FUTUR ('I will speak')?", ["Je parlerais (-ais)", "Je parlerai (-ai)", "both", "neither"], 1, "Futur ends in -ai; conditionnel ends in -ais."],
    ["« Nous irons en France cet été » means:", ["We would go to France", "We will go to France", "We went to France", "We are going to France right now"], 1, "irons = futur of aller (will go)."],
    ["« Il serait content de te voir » means:", ["He will be happy", "He would be happy", "He was happy", "He is happy"], 1, "serait = conditionnel (would be)."],
    ["The futur simple endings are:", ["-ais, -ais, -ait, -ions, -iez, -aient", "-ai, -as, -a, -ons, -ez, -ont", "-e, -es, -e, -ons, -ez, -ent", "-rai, -ras, -ra"], 1, "Futur endings come from avoir: -ai, -as, -a, -ons, -ez, -ont."],
    ["The futur and the conditionnel of a verb always share the same:", ["endings", "stem", "subject", "meaning"], 1, "Same stem; only the endings differ."],
  ]);
  fill("fr-futur", [
    ["Si j'ai le temps, j' ____ au cinéma demain. (aller)", ["irai"], "si + présent → futur: ir- + -ai → irai."],
    ["Au futur : Demain, nous ____ nos amis. (voir)", ["verrons"], "verr- + -ons → verrons."],
    ["Au futur : Tu ____ tes devoirs ce soir ? (faire)", ["feras"], "fer- + -as → feras."],
    ["Au futur : Ils ____ en retard. (être)", ["seront"], "ser- + -ont → seront."],
  ]);

  /* ===== La Belgique ===== */
  mc("fr-belgique", [
    ["En Wallonie (au sud), on parle:", ["le néerlandais", "le français", "l'allemand", "l'anglais"], 1, "Wallonie = French-speaking."],
    ["Le néerlandais, parlé en Flandre, est aussi appelé:", ["German", "Dutch / Flemish", "English", "Italian"], 1, "néerlandais = Dutch (Flemish)."],
    ["Bruxelles, la capitale, est officiellement:", ["française seulement", "néerlandaise seulement", "bilingue (français + néerlandais)", "allemande"], 2, "Brussels is officially bilingual."],
    ["Quels pays touchent la Belgique à l'est ?", ["la France et l'Espagne", "l'Allemagne et le Luxembourg", "les Pays-Bas et l'Italie", "la Suisse"], 1, "À l'est: Germany & Luxembourg."],
  ]);
  fill("fr-belgique", [
    ["La capitale de la Belgique est ____.", ["Bruxelles"], "Bruxelles (Brussels)."],
    ["Au nord de la Belgique, on trouve les Pays-Bas et la mer du ____.", ["Nord", "nord"], "la mer du Nord (North Sea)."],
  ]);

  /* ===== L'Environnement ===== */
  mc("fr-environnement", [
    ["« la pollution » means:", ["recycling", "pollution", "drought", "heat wave"], 1],
    ["« le changement climatique » means:", ["the weather today", "climate change", "global cooling", "a heat wave"], 1],
    ["« protéger l'environnement » means:", ["to pollute the environment", "to protect the environment", "to study the environment", "to ignore the environment"], 1],
    ["« un incendie » is:", ["a flood", "a fire / wildfire", "a drought", "a storm"], 1],
  ]);
  fill("fr-environnement", [
    ["Heat wave en français : « la ____ ».", ["canicule"], "la canicule = heat wave."],
    ["Drought en français : « la ____ ».", ["sécheresse", "secheresse"], "la sécheresse = drought."],
    ["To recycle en français : « ____ ».", ["recycler"], "recycler / le recyclage."],
  ]);

  /* ===== L'Écriture (the host-family email) ===== */
  mc("fr-ecriture", [
    ["« J'aimerais visiter Bruxelles » uses which tense?", ["futur", "conditionnel", "passé composé", "présent"], 1, "aimerais = conditionnel (would like)."],
    ["How do you write 'I would NOT want to get up early'?", ["Je veux me lever tôt.", "Je ne voudrais pas me lever tôt.", "Je me lèverai tôt.", "Je me suis levé tôt."], 1, "Je ne voudrais pas… = I wouldn't want to…"],
    ["A polite closing for the host-family email is:", ["Salut !", "Bien à vous,", "Au revoir !", "Merci beaucoup."], 1, "Bien à vous = best regards."],
  ]);
  fill("fr-ecriture", [
    ["To start a request, 'I would like' : « J' ____ visiter… » (aimer)", ["aimerais"], "aimer + -ais → aimerais (I would like)."],
  ]);
})(window.STUDY);
