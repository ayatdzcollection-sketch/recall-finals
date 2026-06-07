/* data/french-listen.js — realistic listening-comprehension questions.
   type:'listen' → the app SPEAKS `say` (fr-FR), hides the text, and asks an
   MC about it. Kept in STUDY.FR_LISTEN (not in topic.questions) so they only
   run in the Listening drill, never in silent practice or printed tests. */
(function (STUDY) {
  "use strict";
  const L = [
    // vocabulary
    { say: "la canicule", topicId: "fr-environnement", q: "What word did you hear?", choices: ["a heat wave", "a drought", "a flood", "recycling"], answer: 0 },
    { say: "la sécheresse", topicId: "fr-environnement", q: "What word did you hear?", choices: ["pollution", "a drought", "a wildfire", "the weather"], answer: 1 },
    { say: "un incendie", topicId: "fr-environnement", q: "What word did you hear?", choices: ["a fire / wildfire", "a forest", "a river", "the heat"], answer: 0 },
    { say: "le réchauffement climatique", topicId: "fr-environnement", q: "What did you hear?", choices: ["global warming", "recycling", "the weather forecast", "cold weather"], answer: 0 },
    { say: "la Flandre", topicId: "fr-belgique", q: "What did you hear?", choices: ["the Dutch-speaking region of Belgium", "the French-speaking region", "the capital city", "a river"], answer: 0 },
    // sentences
    { say: "Je voudrais un café, s'il vous plaît.", topicId: "fr-conditionnel", q: "What is the speaker doing?", choices: ["politely ordering a coffee", "refusing a coffee", "asking for the time", "ordering a tea"], answer: 0 },
    { say: "J'aimerais visiter Bruxelles cet été.", topicId: "fr-conditionnel", q: "What did the speaker say?", choices: ["I would like to visit Brussels this summer", "I visited Brussels last summer", "I will not visit Brussels", "I live in Brussels"], answer: 0 },
    { say: "On parle français en Wallonie.", topicId: "fr-belgique", q: "What did you hear about Wallonia?", choices: ["French is spoken there", "Dutch is spoken there", "It is the capital", "It borders Germany"], answer: 0 },
    { say: "Nous devrions recycler plus.", topicId: "fr-conditionnel", q: "What is the speaker suggesting?", choices: ["We should recycle more", "We recycled yesterday", "We will not recycle", "Recycling is difficult"], answer: 0 },
    { say: "Il fait très chaud aujourd'hui.", topicId: "fr-environnement", q: "What is the weather like?", choices: ["It's very hot today", "It's cold", "It's raining", "It's snowing"], answer: 0 },
    { say: "Est-ce qu'on pourrait aller à la mer ?", topicId: "fr-conditionnel", q: "What is being asked?", choices: ["Could we go to the sea? (a polite request)", "We went to the sea", "We will go to the sea", "I don't like the sea"], answer: 0 },
    { say: "Bien à vous", topicId: "fr-ecriture", q: "When would you hear this phrase?", choices: ["at the end of an email", "at the start of an email", "when ordering food", "when asking directions"], answer: 0 },
    // conjugation identification (tense by ear)
    { say: "je parlerais", topicId: "fr-conditionnel", q: "Which form did you hear?", choices: ["conditionnel — 'I would speak'", "futur — 'I will speak'", "passé — 'I spoke'", "présent — 'I speak'"], answer: 0 },
    { say: "ils seront", topicId: "fr-futur", q: "Which tense did you hear?", choices: ["futur — 'they will be'", "conditionnel — 'they would be'", "présent — 'they are'", "imparfait — 'they were'"], answer: 0 },
    { say: "tu ferais", topicId: "fr-conditionnel", q: "Which form did you hear?", choices: ["conditionnel — 'you would do'", "futur — 'you will do'", "passé — 'you did'", "présent — 'you do'"], answer: 0 },
    { say: "nous irons", topicId: "fr-futur", q: "Which form did you hear?", choices: ["futur — 'we will go'", "conditionnel — 'we would go'", "passé — 'we went'", "présent — 'we go'"], answer: 0 },
  ];

  STUDY.FR_LISTEN = L;
  // give them ids + index so SRS / starring work (not added to any topic's pool)
  L.forEach(function (q, i) {
    q.type = "listen"; q.subjectId = "french"; q.id = "fr-listen#" + i;
    const e = STUDY.topicIndex[q.topicId];
    STUDY.itemIndex[q.id] = { type: "q", subject: STUDY.byId.french, topic: e ? e.topic : null, ref: q };
  });
})(window.STUDY);
