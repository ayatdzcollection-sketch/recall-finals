/* data/ela-test-prep.js — fresh ELA questions that MIRROR the two Blooket sets
   and the study guide (same format + difficulty, new examples). Purpose: give
   test-day practice in the exact question shapes the final uses, now that the
   original pool wording is nearly mastered. NOT meant to be harder than the test.

   Loaded AFTER js/quizgen.js, so these append after the auto-generated questions
   and never shift any existing question id -> recorded progress is untouched.
   They are normal authored topic questions, so they appear in the For You feed
   (which boosts brand-new items), not only in Practice. */
(function (STUDY) {
  "use strict";
  if (!STUDY || typeof STUDY.addAuthored !== "function") return;

  // [stem, choices, answerIndex, explain, lvl]  (lvl 1 = recall, lvl 2 = identify/discriminate)
  function add(topicId, rows) {
    STUDY.addAuthored(topicId, rows.map(function (r) {
      return { type: "mc", q: r[0], choices: r[1], answer: r[2], explain: r[3] || "", lvl: r[4] || 1, concept: "testprep" };
    }));
  }

  /* ---------------- Figurative language ---------------- */
  add("ela-figurative", [
    ["Which sentence is a SIMILE?", ["Her temper was a volcano", "The brave dog charged in", "His hands were as cold as ice", "The wind howled all night"], 2, "A simile compares two things using 'like' or 'as'.", 2],
    ["Which sentence is a METAPHOR?", ["The snow fell like a blanket", "Time is a thief that steals our days", "The clock ticked loudly", "She ran as fast as a cheetah"], 1, "A metaphor compares directly, with no 'like' or 'as'.", 2],
    ["Which sentence uses PERSONIFICATION?", ["The thunder grumbled in the distance", "The cake tasted sweet", "He was strong like an ox", "The crowd was huge"], 0, "Personification gives human traits (grumbling) to a non-human thing.", 2],
    ["Which sentence is HYPERBOLE?", ["The soup was warm", "This backpack weighs a ton", "The river flowed quickly", "Birds sang in the trees"], 1, "Hyperbole is an obvious exaggeration not meant literally.", 2],
    ["Which line is the best example of IMAGERY?", ["She felt happy", "The sizzling bacon filled the kitchen with a smoky, salty smell", "It was a good day", "He was tall"], 1, "Imagery uses vivid sensory detail (sight, smell, sound, etc.).", 2],
    ["Which is a EUPHEMISM?", ["The dog barked all night", "Our old dog was put to sleep", "The dog ran fast", "The dog was big"], 1, "A euphemism is a gentle phrase that softens something harsh ('put to sleep' for died).", 2],
  ]);

  /* ---------------- Sound devices & poetry structure ---------------- */
  add("ela-sound", [
    ["Which is an example of ALLITERATION?", ["The big dog barked", "Sally's silly sheep should sleep", "The bees buzzed loudly", "Boom went the drum"], 1, "Alliteration repeats the same beginning consonant sound (s-s-s-s).", 2],
    ["Which line shows ASSONANCE?", ["Peter picked peppers", "The light of the bright night sky", "Crash went the cymbal", "Round and round we go"], 1, "Assonance repeats vowel sounds (the long 'i' in light/bright/night).", 2],
    ["Which word is ONOMATOPOEIA?", ["Quiet", "Sizzle", "Happy", "Slowly"], 1, "Onomatopoeia is a word that imitates a sound.", 2],
    ["Which shows CONSONANCE (repeated consonant sounds)?", ["A happy puppy", "The lumpy, bumpy road made him grumpy", "Loud thunder", "Green grass grows"], 1, "Consonance repeats a consonant sound inside/at the ends of words ('mp').", 2],
    ["A group of lines set off by a blank line in a poem is a:", ["meter", "rhyme scheme", "stanza", "simile"], 2, "A stanza is poetry's version of a paragraph.", 1],
    ["The rhythmic structure (beat) of a poem is its:", ["rhyme scheme", "stanza", "meter", "mood"], 2, "Meter is the rhythm; rhyme scheme is the end-rhyme pattern.", 1],
  ]);

  /* ---------------- Literary devices & meaning ---------------- */
  add("ela-devices", [
    ["Which is VERBAL irony?", ["Looking at pouring rain and saying 'What lovely weather!'", "The audience knows a secret the character doesn't", "A fire station burns down", "A dove standing for peace"], 0, "Verbal irony = saying the opposite of what you mean.", 2],
    ["Which is SITUATIONAL irony?", ["Saying 'Nice job' when someone fails", "A police station gets robbed", "We see the villain hiding but the hero doesn't", "Comparing love to a rose"], 1, "Situational irony = the opposite of what you'd expect happens.", 2],
    ["Which is DRAMATIC irony?", ["The audience knows the trap is set, but the character walks in unaware", "Saying the opposite of what you mean", "A marriage counselor gets divorced", "A dove for peace"], 0, "Dramatic irony = the audience knows something a character does not.", 2],
    ["A white dove used to stand for peace is an example of:", ["irony", "symbolism", "alliteration", "a pun"], 1, "Symbolism = an object standing for something bigger than itself.", 1],
    ["Calling someone 'a real Romeo' references a famous character. This is a/an:", ["pun", "allusion", "hyperbole", "onomatopoeia"], 1, "An allusion is a reference to a well-known person, work, or event.", 2],
    ["The DENOTATION of a word is:", ["the feelings it suggests", "its exact dictionary definition", "its rhyme", "its opposite"], 1, "Denotation = literal dictionary meaning; connotation = the feelings.", 1],
    ["'Home' and 'house' both mean a place to live, but 'home' suggests warmth and family. That extra feeling is the word's:", ["denotation", "connotation", "syllable", "meter"], 1, "Connotation is the emotional association a word carries.", 2],
    ["The overall FEELING a piece of writing gives the READER is its:", ["tone", "mood", "theme", "meter"], 1, "Mood = the atmosphere felt by the reader.", 2],
    ["The author's ATTITUDE toward the subject is the:", ["mood", "tone", "setting", "plot"], 1, "Tone = the writer's attitude; mood = the reader's feeling.", 2],
    ["'A bicycle can't stand on its own because it's two-tired.' This wordplay is a:", ["pun", "metaphor", "allusion", "simile"], 0, "A pun is a humorous play on words ('two-tired' / 'too tired').", 1],
  ]);

  /* ---------------- Story elements & plot ---------------- */
  add("ela-story", [
    ["Which is an EXTERNAL conflict?", ["A soldier battling an enemy army", "A girl struggling with guilt", "A boy deciding whether to lie", "Feeling nervous before a test"], 0, "External conflict is a character vs. an outside force.", 2],
    ["Which is an INTERNAL conflict?", ["A sailor fighting a storm", "A knight dueling a rival", "A student wrestling with her own fear of failure", "A hiker lost in the woods"], 2, "Internal conflict happens inside a character's mind.", 2],
    ["Which is DIRECT characterization?", ["The narrator states, 'Maria was generous and kind.'", "Maria gave her lunch to a stranger", "Maria smiled at everyone", "Maria volunteered every weekend"], 0, "Direct = the narrator tells you the trait outright.", 2],
    ["Which is INDIRECT characterization?", ["The narrator says, 'Tom was lazy.'", "Tom hit snooze five times and skipped his chores", "The author tells us Tom is rude", "Tom is described as tall"], 1, "Indirect = you infer the trait from actions/words.", 2],
    ["The turning point and highest point of tension in a plot is the:", ["exposition", "rising action", "climax", "resolution"], 2, "", 1],
    ["The part of a plot that introduces the characters and setting is the:", ["climax", "exposition", "resolution", "falling action"], 1, "", 1],
    ["The part where the conflict is settled and the story wraps up is the:", ["rising action", "climax", "resolution", "exposition"], 2, "", 1],
    ["A narrator who is NOT a character and knows every character's thoughts is:", ["first person", "third-person limited", "third-person omniscient", "second person"], 2, "Omniscient = 'all-knowing'.", 2],
    ["The underlying message or lesson of a story is its:", ["plot", "setting", "theme", "mood"], 2, "", 1],
    ["Hints early in a story about what will happen later are called:", ["flashback", "foreshadowing", "suspense", "irony"], 1, "", 1],
  ]);

  /* ---------------- Nonfiction, rhetoric & argument ---------------- */
  add("ela-nonfiction", [
    ["An ad says, 'As a board-certified dentist, I recommend this toothpaste.' This appeal is:", ["pathos", "logos", "ethos", "theme"], 2, "Ethos appeals to credibility/authority.", 2],
    ["An ad shows a lonely shelter puppy: 'Don't let him spend another night alone.' This appeal is:", ["ethos", "logos", "pathos", "fact"], 2, "Pathos appeals to emotion.", 2],
    ["An ad says, 'Studies show 9 out of 10 users saved money.' This appeal is:", ["ethos", "pathos", "logos", "tone"], 2, "Logos appeals to logic and evidence.", 2],
    ["Which is a statement of FACT?", ["Summer is the best season", "Water freezes at 0 degrees Celsius", "Pizza tastes amazing", "Everyone should travel more"], 1, "A fact can be proven true or false.", 2],
    ["Which is a statement of OPINION?", ["The library opens at 9 a.m.", "Dogs are better pets than cats", "Mount Everest is the tallest mountain", "A year has 12 months"], 1, "An opinion is a personal judgment.", 2],
    ["Writing that gives only facts, with no personal feelings, is:", ["subjective", "objective", "persuasive", "figurative"], 1, "Objective = unbiased facts; subjective = personal feelings.", 1],
    ["An account of a person's life written BY that same person is a/an:", ["biography", "autobiography", "essay", "report"], 1, "Auto = self.", 1],
    ["An account of a person's life written by SOMEONE ELSE is a:", ["autobiography", "biography", "memoir", "diary"], 1, "", 1],
    ["A collection of personal stories and reflections an author writes about their OWN life is a:", ["biography", "memoir", "textbook", "news report"], 1, "A memoir is personal and reflective, by the person themselves.", 2],
    ["Which is an example of NONFICTION?", ["A fantasy novel about dragons", "A biography of a president", "A short story about talking animals", "A sci-fi film about Mars"], 1, "Nonfiction is true/factual.", 1],
    ["The three main purposes of nonfiction are to persuade, to inform, and to:", ["entertain", "explain", "rhyme", "exaggerate"], 1, "", 1],
    ["Which is a LOADED (emotionally charged) word?", ["table", "coward", "walk", "blue"], 1, "Loaded words carry strong positive or negative feeling.", 2],
  ]);

  /* ---------------- Essay writing & MLA ---------------- */
  add("ela-writing", [
    ["A thesis statement is best described as:", ["a question to the reader", "a debatable claim plus reasons", "a fun hook", "a direct quote"], 1, "", 1],
    ["A topic sentence does what?", ["restates the thesis and transitions into the paragraph", "ends the essay", "adds a quote", "asks a question"], 0, "", 1],
    ["A strong conclusion should:", ["introduce a brand-new argument", "restate the thesis and end with a 'so what' statement", "include several new quotes", "ask the reader a question"], 1, "", 1],
    ["Every body paragraph must include:", ["a hook", "quotes and analysis", "the works cited page", "a cover page"], 1, "", 1],
    ["Which is the correct MLA in-text citation format?", ["(Smith, 2021, p. 14)", "(Smith 14)", "(Smith, 14)", "(John Smith 14)"], 1, "MLA in-text = (Author LastName PageNumber), no comma, no 'p.'.", 2],
    ["Which is a PROPERLY integrated quote?", ["The author argues that; 'we must act now' (Smith 2).", "The author argues that 'we must act now' (Smith 2).", "'We must act now.' (Smith pg 2)", "The author argues that, we must act now."], 1, "No semicolon, no 'pg', and the period comes after the citation.", 2],
    ["Which is NOT part of MLA formatting?", ["a Works Cited page", "a decorative cover page", "double spacing", "12-pt Times New Roman"], 1, "MLA does not use a cover page.", 1],
  ]);

  /* ---------------- Grammar: fragments, run-ons, commas ---------------- */
  add("ela-grammar", [
    ["Which sentence is a RUN-ON?", ["I like tea.", "We ran to the bus we missed it anyway.", "Because it rained, we stayed home.", "She sings, and he dances."], 1, "A run-on jams two complete sentences together with no proper punctuation.", 2],
    ["Which is a sentence FRAGMENT?", ["The dog barked loudly.", "After the long, cold night.", "She laughed and left.", "They won the game."], 1, "A fragment is missing a subject, a verb, or a complete thought.", 2],
    ["Which sentence uses commas CORRECTLY?", ["We bought apples oranges, and pears.", "When the bell rang, the students left.", "He ran, quickly to the door.", "She likes, tea and coffee."], 1, "Use a comma after an introductory clause.", 2],
    ["Best fix for the run-on 'I was tired I went to bed'?", ["I was tired, I went to bed.", "I was tired, so I went to bed.", "I was tired I, went to bed.", "I was tired; I, went to bed."], 1, "Join with a comma + conjunction (or a period/semicolon).", 2],
    ["Which is a COMPLETE sentence?", ["Running down the street.", "The tall man in the hat.", "Birds fly.", "Although she tried."], 2, "A complete sentence needs a subject and a verb and a full thought.", 1],
  ]);
})(window.STUDY);
