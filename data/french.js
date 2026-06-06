/* FRENCH 3, from the "Study guide Final exam French 3 25-26":
   le conditionnel, le futur, la Belgique, l'environnement, écriture. */
(function (STUDY) {
  "use strict";
  STUDY.register({
    id: "french",
    name: "French 3",
    icon: "🇫🇷",
    accent: "#4f86f7",
    weight: 3,
    intro: "Le conditionnel et le futur, la géographie de la Belgique, le vocabulaire de l'environnement, et l'écriture (un e-mail à ta famille d'accueil).",
    topics: [

      /* 1. Le conditionnel */
      {
        id: "fr-conditionnel",
        title: "Le Conditionnel",
        blurb: "The 'would' tense, formation, suggestions, and irregular stems.",
        lesson: [
          { p: "**Le conditionnel** = *would* do something. Use it for **polite requests**, **hypotheticals**, and **suggestions** (*Tu **devrais** faire tes devoirs* = You **should** do your homework)." },
          { h: "Formation" },
          { p: "Take the **infinitive** (for -re verbs, drop the final **-e**) and add the **imperfect endings**: **-ais, -ais, -ait, -ions, -iez, -aient**." },
          { example: "parler → je parler**ais**, tu parler**ais**, il parler**ait**, nous parler**ions**, vous parler**iez**, ils parler**aient**", as: "Régulier" },
          { h: "Irregular stems (same as the futur!)" },
          { defs: [
            ["aller → ir-", "j'**ir**ais (I would go)"],
            ["avoir → aur-", "il **aur**ait"],
            ["être → ser-", "ils **ser**aient"],
            ["faire → fer-", "tu **fer**ais"],
            ["pouvoir → pourr-", "nous **pourr**ions"],
            ["devoir → devr-", "tu **devr**ais (you should)"],
            ["voir → verr- · venir → viendr- · vouloir → voudr-", "common extras"],
          ] },
          { tip: "The conditional **stem = the future stem**; only the **endings** differ (conditional uses the imperfect endings -ais/-ait/-ions…)." },
        ],
        visual: {
          type: "table", cap: "Conditional endings (added to the future stem)",
          head: ["Subject", "Ending", "Example (parler)"],
          rows: [["je", "-ais", "parlerais"], ["tu", "-ais", "parlerais"], ["il/elle", "-ait", "parlerait"], ["nous", "-ions", "parlerions"], ["vous", "-iez", "parleriez"], ["ils/elles", "-aient", "parleraient"]],
        },
        cards: [
          { front: "What is the conditionnel used for?", back: "To say 'would': polite requests, hypotheticals, and suggestions." },
          { front: "Conditional endings", back: "-ais, -ais, -ait, -ions, -iez, -aient (the imperfect endings)." },
          { front: "Conditional stem of aller", back: "ir- (j'irais)." },
          { front: "Conditional stem of être", back: "ser- (je serais)." },
          { front: "Conditional stem of avoir", back: "aur- (j'aurais)." },
          { front: "Conditional stem of faire", back: "fer- (je ferais)." },
          { front: "Conditional stem of pouvoir", back: "pourr- (je pourrais)." },
          { front: "Conditional stem of devoir", back: "devr- (tu devrais = you should)." },
        ],
        questions: [
          { type: "fill", q: "Complétez au conditionnel: Tu ____ qui à la soirée ? (inviter)", answers: ["inviterais"], explain: "inviter + -ais → inviterais." },
          { type: "fill", q: "Complétez au conditionnel: Vous ____ où ? (attendre)", answers: ["attendriez"], explain: "attendre → attendr- + -iez." },
          { type: "fill", q: "Complétez au conditionnel: Elle ____ au parc ? (aller)", answers: ["irait"], explain: "Irregular stem ir- + -ait." },
          { type: "fill", q: "Complétez au conditionnel: Il ____ une grande fête ? (avoir)", answers: ["aurait"], explain: "Stem aur- + -ait." },
          { type: "fill", q: "Complétez au conditionnel: Ils ____ heureux de nous voir ? (être)", answers: ["seraient"], explain: "Stem ser- + -aient." },
          { type: "fill", q: "Complétez au conditionnel: Vous ____ à votre correspondant ? (écrire)", answers: ["écririez", "ecririez"], explain: "écrire → écrir- + -iez." },
          { type: "fill", q: "Complétez au conditionnel: Nous ____ vous aider ? (pouvoir)", answers: ["pourrions"], explain: "Stem pourr- + -ions." },
          { type: "fill", q: "Suggestion au conditionnel: Tu ____ mieux de l'appeler. (faire)", answers: ["ferais"], explain: "Stem fer- + -ais." },
          { type: "fill", q: "Suggestion: Nous ____ moins stressés dans cette situation. (être)", answers: ["serions"], explain: "Stem ser- + -ions." },
          { type: "mc", q: "Which sentence correctly uses the conditional to make a suggestion?", choices: ["Tu fais tes devoirs.", "Tu devrais faire tes devoirs.", "Tu as fait tes devoirs.", "Tu feras tes devoirs."], answer: 1, explain: "devrais (conditional of devoir) = 'should' / suggestion." },
        ],
      },

      /* 2. Le futur */
      {
        id: "fr-futur",
        title: "Le Futur Simple",
        blurb: "The 'will' tense, same stems, different endings.",
        lesson: [
          { p: "**Le futur simple** = *will* do something. It uses the **same stems** as the conditional but the endings come from **avoir**: **-ai, -as, -a, -ons, -ez, -ont**." },
          { example: "parler → je parler**ai**, tu parler**as**, il parler**a**, nous parler**ons**, vous parler**ez**, ils parler**ont**", as: "Régulier" },
          { defs: [
            ["Futur vs. Conditionnel", "Same stem; **futur** = *will* (-ai/-as/-a…), **conditionnel** = *would* (-ais/-ait/-ions…)."],
            ["Irregular stems (shared)", "aller→ir-, avoir→aur-, être→ser-, faire→fer-, pouvoir→pourr-, devoir→devr-, voir→verr-, venir→viendr-."],
          ] },
          { tip: "Hear the difference: *je parler**ai*** (futur, 'I will speak') vs. *je parler**ais*** (conditionnel, 'I would speak')." },
        ],
        visual: {
          type: "compare", cap: "Futur vs. Conditionnel (same stem!)",
          left: { h: "Futur, 'will'", items: ["Endings: -ai, -as, -a, -ons, -ez, -ont", "j'irai = I will go", "il sera = he will be"] },
          right: { h: "Conditionnel, 'would'", items: ["Endings: -ais, -ait, -ions, -iez, -aient", "j'irais = I would go", "il serait = he would be"] },
        },
        cards: [
          { front: "Futur simple endings", back: "-ai, -as, -a, -ons, -ez, -ont (from avoir)." },
          { front: "Difference: futur vs. conditionnel", back: "Same stem; futur = 'will', conditionnel = 'would' (different endings)." },
          { front: "je + aller in the futur", back: "j'irai (I will go)." },
          { front: "il + être in the futur", back: "il sera (he will be)." },
        ],
        questions: [
          { type: "fill", q: "Au futur: Demain, je ____ au cinéma. (aller)", answers: ["irai"], explain: "Stem ir- + futur ending -ai." },
          { type: "fill", q: "Au futur: Nous ____ nos devoirs ce soir. (faire)", answers: ["ferons"], explain: "Stem fer- + -ons." },
          { type: "mc", q: "Which is the FUTUR (not conditional) form of 'tu parler-'?", choices: ["tu parlerais", "tu parleras", "tu parlais", "tu parlerions"], answer: 1, explain: "parleras = futur ('you will speak'); parlerais = conditional." },
          { type: "fill", q: "Au futur: Ils ____ contents. (être)", answers: ["seront"], explain: "Stem ser- + -ont." },
        ],
      },

      /* 3. La Belgique */
      {
        id: "fr-belgique",
        title: "La Belgique",
        blurb: "Belgium's regions, languages, capital, and neighbors.",
        lesson: [
          { p: "La Belgique is divided by **language**. You'll label a map and answer where each language is spoken." },
          { defs: [
            ["La Wallonie (Wallonia)", "The **southern** region, **French**-speaking."],
            ["La Flandre (Flanders)", "The **northern** region, **Dutch (néerlandais)**-speaking."],
            ["Bruxelles (Brussels)", "The **capital**, officially **bilingual** (French + Dutch)."],
            ["German region", "A small area in the **east** also speaks German."],
          ] },
          { h: "Neighbors to label" },
          { list: ["**Au nord** : les Pays-Bas (Netherlands) & la mer du Nord (North Sea)", "**À l'est** : l'Allemagne (Germany) & le Luxembourg", "**Au sud/ouest** : la France"] },
          { tip: "**Wa**llonie = French (think 'Wa' / *wallon*). **Fla**ndre = Flemish/Dutch. **Bruxelles** = both." },
        ],
        visual: {
          type: "table", cap: "Region → language",
          head: ["Region", "Where", "Language"],
          rows: [["Wallonie", "South", "French (français)"], ["Flandre", "North", "Dutch (néerlandais)"], ["Bruxelles", "Center (capital)", "Bilingual: French + Dutch"], ["East strip", "East", "German"]],
        },
        cards: [
          { front: "Which Belgian region speaks French?", back: "La Wallonie (Wallonia), in the south." },
          { front: "Which Belgian region speaks Dutch (néerlandais)?", back: "La Flandre (Flanders), in the north." },
          { front: "What is Belgium's bilingual capital?", back: "Bruxelles (Brussels): French + Dutch." },
          { front: "Belgium's neighbors", back: "Netherlands, Germany, Luxembourg, France (+ the North Sea to the north)." },
        ],
        questions: [
          { type: "mc", q: "Dans quelle région de la Belgique est-ce qu'on parle français ?", choices: ["La Flandre", "La Wallonie", "Les Pays-Bas", "Le Luxembourg"], answer: 1, explain: "La Wallonie (south) is French-speaking." },
          { type: "mc", q: "Quelle langue parle-t-on en Flandre ?", choices: ["Le français", "L'allemand", "Le néerlandais (Dutch)", "L'anglais"], answer: 2 },
          { type: "mc", q: "Dans quelle ville parle-t-on deux langues (français et néerlandais) ?", choices: ["Anvers", "Bruxelles", "Liège", "Bruges"], answer: 1, explain: "Brussels, the bilingual capital." },
          { type: "fill", q: "La mer au nord de la Belgique s'appelle la mer du ____.", answers: ["nord", "Nord"], explain: "la mer du Nord (North Sea)." },
          { type: "tf", q: "Brussels (Bruxelles) is the capital of Belgium.", answer: true },
        ],
      },

      /* 4. L'environnement */
      {
        id: "fr-environnement",
        title: "L'Environnement",
        blurb: "Climate & environment vocabulary for the reading/listening section.",
        lesson: [
          { p: "The listening (Edpuzzle) and reading cover an **intense summer**: *canicules, sécheresse, incendies*. Learn this vocab." },
          { defs: [
            ["la canicule", "heat wave"],
            ["la sécheresse", "drought"],
            ["l'incendie (m)", "fire / wildfire"],
            ["le réchauffement climatique", "global warming"],
            ["le changement climatique", "climate change"],
            ["la pollution", "pollution"],
            ["le recyclage / recycler", "recycling / to recycle"],
            ["protéger l'environnement", "to protect the environment"],
          ] },
          { tip: "Connect them: *À cause du **réchauffement climatique**, il y a plus de **canicules**, de **sécheresse**, et d'**incendies**.*" },
        ],
        visual: {
          type: "concept", cap: "Un été intense",
          hub: "Réchauffement climatique",
          leaves: [
            { b: "la canicule", s: "heat wave" },
            { b: "la sécheresse", s: "drought" },
            { b: "l'incendie", s: "wildfire" },
            { b: "le recyclage", s: "recycling (a solution)" },
          ],
        },
        cards: [
          { front: "la canicule", back: "a heat wave" },
          { front: "la sécheresse", back: "drought" },
          { front: "un incendie", back: "a fire / wildfire" },
          { front: "le réchauffement climatique", back: "global warming" },
          { front: "le recyclage", back: "recycling" },
          { front: "protéger l'environnement", back: "to protect the environment" },
        ],
        questions: [
          { type: "mc", q: "What does « la sécheresse » mean?", choices: ["the heat wave", "drought", "the wildfire", "recycling"], answer: 1 },
          { type: "mc", q: "« Une canicule » is:", choices: ["a flood", "a heat wave", "a storm", "a drought"], answer: 1 },
          { type: "fill", q: "« Un incendie » in English is a ____.", answers: ["fire", "wildfire", "a fire"], explain: "incendie = fire/wildfire." },
          { type: "mc", q: "« le réchauffement climatique » means:", choices: ["climate protection", "global warming", "the weather forecast", "recycling"], answer: 1 },
          { type: "fill", q: "To recycle in French is « ____ ».", answers: ["recycler"], explain: "recycler / le recyclage." },
        ],
      },

      /* 5. L'écriture */
      {
        id: "fr-ecriture",
        title: "L'Écriture (Writing the Email)",
        blurb: "Write to your Belgian host family using the conditional.",
        lesson: [
          { p: "**The task:** write an e-mail to your host family (*la famille Vosters*) about a 2-week visit to Belgium, explain **3 things you'd like to do** and **3 things you would not** like to do, then ask **2 questions**." },
          { h: "Structure" },
          { list: [
            "**Greeting:** *Cher / Chère…* or *Bonjour la famille Vosters,*",
            "**Body:** use the **conditionnel**, *J'**aimerais** visiter…* (I would like), *Je **voudrais**…*, *Je ne **voudrais** pas…* (I wouldn't like).",
            "**Ask 2 questions:** *Est-ce que nous **pourrions**…? Qu'est-ce qu'on **ferait** le week-end?*",
            "**Closing:** *Bien à vous,* + your name.",
          ] },
          { tip: "Lean on these conditional verbs: **j'aimerais** (I'd like), **je voudrais** (I'd want), **je pourrais** (I could), **on ferait** (we'd do)." },
        ],
        visual: {
          type: "table", cap: "Useful sentence starters (conditionnel)",
          head: ["French", "English"],
          rows: [
            ["J'aimerais visiter Bruxelles.", "I would like to visit Brussels."],
            ["Je voudrais goûter les gaufres.", "I would like to taste the waffles."],
            ["Je ne voudrais pas me lever tôt.", "I wouldn't want to get up early."],
            ["Est-ce qu'on pourrait aller à la mer ?", "Could we go to the sea?"],
            ["Bien à vous, …", "Best regards, … (closing)"],
          ],
        },
        cards: [
          { front: "How do you say 'I would like' (to start a request)?", back: "J'aimerais… (or Je voudrais…)" },
          { front: "Polite closing for the host-family email", back: "Bien à vous, + your name." },
          { front: "How many likes/dislikes/questions does the prompt require?", back: "3 things you'd like to do, 3 you wouldn't, and 2 questions." },
          { front: "Which tense should the email mainly use?", back: "Le conditionnel (j'aimerais, je voudrais, on pourrait…)." },
        ],
        questions: [
          { type: "mc", q: "Which sentence best fits the email ('something you'd like to do')?", choices: ["Je suis allé à Bruxelles.", "J'aimerais visiter Bruxelles.", "Je vais maintenant.", "J'ai visité la mer."], answer: 1, explain: "J'aimerais = conditional 'I would like'." },
          { type: "fill", q: "Complete the closing of a formal/friendly email: « Bien à ____, »", answers: ["vous"], explain: "Bien à vous = best regards." },
          { type: "mc", q: "The writing prompt asks you to include:", choices: ["5 things you like only", "3 likes, 3 dislikes, and 2 questions", "a poem", "a list of vocabulary"], answer: 1 },
        ],
      },
    ],
  });
})(window.STUDY);
