/* data/hard.js — a larger, HARDER question batch, tagged with concept + lvl
   so the Easy/Hard practice toggle still covers every concept in each lesson.
   Heaviest where the pool was thin (euphemism, the rarer devices). */
(function (STUDY) {
  "use strict";
  const A = STUDY.addAuthored;
  // hard MC: {q, choices, answer, explain, concept, lvl:2}
  const h = (concept, q, choices, answer, explain) => ({ type: "mc", q: q, choices: choices, answer: answer, explain: explain, concept: concept, lvl: 2 });
  const e = (concept, q, choices, answer, explain) => ({ type: "mc", q: q, choices: choices, answer: answer, explain: explain, concept: concept, lvl: 1 });

  /* ===== ELA · Figurative language (esp. euphemism) ===== */
  A("ela-figurative", [
    // euphemism — the thin one, now well covered
    e("euphemism", "A euphemism is used to make something sound:", ["harsher and more shocking", "milder, softer, or more polite", "funnier and exaggerated", "more scientific"], 1, "A euphemism softens a harsh or blunt idea."),
    h("euphemism", "Which sentence contains a EUPHEMISM?", ["The wind screamed through the trees.", "Our dog had to be put to sleep last week.", "He runs as fast as lightning.", "The city never sleeps."], 1, "'Put to sleep' softens 'killed/euthanized.'"),
    h("euphemism", "Which sentence contains a EUPHEMISM?", ["She has a heart of gold.", "The company is letting twenty people go.", "Time is a thief.", "The stars danced overhead."], 1, "'Letting people go' softens 'firing/laying off.'"),
    h("euphemism", "“He's between jobs right now” is a euphemism for:", ["he is very busy", "he is unemployed", "he travels for work", "he was promoted"], 1, "It politely avoids saying 'unemployed.'"),
    h("euphemism", "Which of these is NOT a euphemism?", ["passed away", "let go", "pre-owned car", "as cold as ice"], 3, "'As cold as ice' is a simile, not a softened term."),
    h("euphemism", "“We're downsizing the department” most softens the blunt idea of:", ["hiring more staff", "cutting jobs / layoffs", "moving offices", "a smaller budget for snacks"], 1, "'Downsizing' is a corporate euphemism for layoffs."),
    // simile vs metaphor discrimination (harder)
    h("simile", "Which sentence is a SIMILE (not a metaphor)?", ["Her words were daggers.", "The lake was a sheet of glass.", "He fought like a cornered tiger.", "Time is money."], 2, "'like a cornered tiger' uses 'like' → simile; the others are direct metaphors."),
    h("metaphor", "“The comments section was a battlefield.” This is a:", ["simile", "metaphor", "hyperbole", "euphemism"], 1, "A direct comparison with no 'like/as' → metaphor."),
    h("metaphor", "An EXTENDED metaphor is one that:", ["uses 'like' or 'as'", "is carried on across several lines or the whole passage", "exaggerates for effect", "appeals to the senses"], 1),
    h("metaphor", "“Drowning in paperwork, she came up for air only at lunch.” The ongoing comparison to being underwater is an:", ["extended metaphor", "simile", "onomatopoeia", "allusion"], 0),
    // hyperbole / personification / imagery harder
    h("hyperbole", "Which is the clearest HYPERBOLE?", ["The soup was a little salty.", "I've asked you a thousand times to call back.", "She smiled politely.", "The road curved left."], 1, "An obvious, un-literal exaggeration."),
    h("personification", "Which sentence uses PERSONIFICATION?", ["The engine coughed and then died.", "He was brave as a lion.", "The pizza was the size of a tire.", "It was raining hard."], 0, "An engine 'coughing' and 'dying' gives it human/living traits."),
    h("imagery", "Which sentence relies most on IMAGERY?", ["The plan was efficient.", "Grease hissed in the pan as onions turned glassy and gold.", "He was kind to everyone.", "The meeting ended on time."], 1, "Vivid sensory detail (sound, sight) = imagery."),
  ]);

  /* ===== ELA · Literary devices ===== */
  A("ela-devices", [
    h("verbal", "A student looks at a pile of homework and sighs, “Oh good, more fun.” This is:", ["situational irony", "dramatic irony", "verbal irony", "an allusion"], 2, "Saying the opposite of what's meant = verbal irony."),
    h("situational", "A lifeguard who can't swim is hired at the pool. This is:", ["verbal irony", "situational irony", "dramatic irony", "a pun"], 1, "The outcome is the opposite of what's expected."),
    h("dramatic", "The audience knows the bridge is out, but the driver keeps speeding toward it. This is:", ["verbal irony", "situational irony", "dramatic irony", "symbolism"], 2, "Audience knows what the character doesn't = dramatic irony."),
    h("connotation", "Choosing “thrifty” instead of “cheap” changes the word's:", ["denotation", "connotation", "syllables", "spelling"], 1, "Same literal idea, different feeling/association = connotation."),
    e("denotation", "The DENOTATION of a word is its:", ["emotional association", "literal dictionary meaning", "rhyme", "origin"], 1),
    h("allusion", "“He met his Waterloo on the final exam” is an ALLUSION to:", ["a sport", "Napoleon's famous defeat", "a river in Texas", "a song"], 1, "An allusion references a well-known event (Napoleon's defeat at Waterloo)."),
    h("pun", "“A bicycle can't stand on its own because it's two-tired.” This is a:", ["pun", "metaphor", "euphemism", "allusion"], 0, "Wordplay on 'too tired'/'two-tired' = pun."),
    h("symbolism", "In a story, a wilting flower that appears whenever a character loses hope is an example of:", ["alliteration", "symbolism", "a simile", "denotation"], 1),
    h("foreshadowing", "An early line — “She had no idea it would be the last time she'd see the house” — is an example of:", ["flashback", "foreshadowing", "a pun", "imagery"], 1),
    h("mood", "A graveyard at midnight with fog and distant howls mainly establishes the story's:", ["mood", "thesis", "rhyme scheme", "denotation"], 0, "The atmosphere/feeling for the reader = mood."),
    h("tone", "A reviewer writes about a film with biting sarcasm. 'Sarcastic' describes the:", ["mood", "tone", "setting", "plot"], 1, "The author's attitude = tone."),
  ]);

  /* ===== ELA · Sound devices ===== */
  A("ela-sound", [
    h("alliteration", "Which line uses ALLITERATION?", ["The waves crashed loudly.", "Silent snakes slid swiftly by.", "Her eyes were bright.", "The clock struck noon."], 1),
    h("assonance", "Which line uses ASSONANCE?", ["Big black bugs bit Bob.", "The light of the bright sky at night.", "The dog barked twice.", "Crash! Bang! Pop!"], 1, "Repeated long-i vowel sound (light/bright/sky/night)."),
    h("onomatopoeia", "Which line uses ONOMATOPOEIA?", ["The meadow was calm.", "The cereal snapped, crackled, and popped.", "She felt nervous.", "The hill was steep."], 1),
    e("stanza", "A STANZA in a poem is:", ["a single rhyme", "a group of lines set off by a blank line", "the poem's beat", "the last word of a line"], 1),
    h("rhyme", "A poem whose line endings follow the pattern A-B-A-B has a defined:", ["meter", "rhyme scheme", "stanza", "tone"], 1),
    e("meter", "METER in poetry refers to its:", ["rhyme pattern", "rhythmic structure / beat", "number of stanzas", "main idea"], 1),
  ]);

  /* ===== ELA · Story elements (harder) ===== */
  A("ela-story", [
    h("conflict", "A hiker lost in a blizzard, fighting frostbite, faces what kind of conflict?", ["internal (character vs. self)", "external (character vs. nature)", "no conflict", "verbal irony"], 1),
    h("conflict", "A character torn between telling the truth and protecting a friend faces:", ["external conflict", "internal conflict", "the resolution", "the exposition"], 1),
    h("characterization", "We never hear it stated, but we decide a character is greedy from how he hoards food and lies. This is:", ["direct characterization", "indirect characterization", "exposition", "an allusion"], 1),
    h("theme", "Which is a THEME (not just a topic)?", ["War", "Friendship", "Loyalty can demand painful sacrifice", "A dog"], 2, "A theme is a full message/insight, not a one-word topic."),
    h("climax", "In a mystery, the moment the detective finally corners the culprit is the:", ["exposition", "rising action", "climax", "resolution"], 2),
  ]);

  /* ===== ELA · Nonfiction & rhetoric (harder) ===== */
  A("ela-nonfiction", [
    h("ethos", "“Trust me — I've taught biology for 25 years.” This appeal is:", ["pathos", "logos", "ethos", "denotation"], 2),
    h("pathos", "“Every night, children in our town go to bed hungry.” This appeal is:", ["ethos", "logos", "pathos", "tone"], 2),
    h("logos", "“Recycling one ton of paper saves about 17 trees.” This appeal is:", ["ethos", "pathos", "logos", "mood"], 2),
    h("memoir", "An author writes a book reflecting on a few formative years of their own life. This is a:", ["biography", "memoir", "novel", "news article"], 1),
    h("fact", "Which is a verifiable FACT?", ["Autumn is the most beautiful season.", "The Pacific is Earth's largest ocean.", "Everyone should learn an instrument.", "That book is boring."], 1),
  ]);

  /* ===== A few harder items in other subjects ===== */
  A("bio-evolution", [
    h("evolution", "A drought leaves only deep-rooted plants alive to reproduce, so the next generation is mostly deep-rooted. This is best explained by:", ["a population bottleneck", "natural selection", "the founder effect", "genetic drift only"], 1),
    h("evolution", "Which scenario shows the FOUNDER effect (not natural selection)?", ["The fastest gazelles survive lions", "Five beetles blown to an island start a new, low-diversity population", "Bacteria evolve antibiotic resistance", "Moths darken as soot covers trees"], 1),
  ]);
  A("his-wwi", [
    h("wwi", "Which was NOT one of the M-A-I-N causes of WWI?", ["Militarism", "Alliances", "The Marshall Plan", "Nationalism"], 2, "The Marshall Plan came after WWII."),
  ]);
  A("his-coldwar", [
    h("coldwar", "Which event is considered the FIRST major US–USSR confrontation of the Cold War?", ["The Cuban Missile Crisis", "The Berlin Airlift", "The fall of the Berlin Wall", "The Korean War"], 1),
  ]);
  A("fr-conditionnel", [
    h("conditionnel", "Which fully correct sentence uses the conditional to soften a request?", ["Je veux de l'eau.", "Je voudrais de l'eau, s'il vous plaît.", "J'ai voulu de l'eau.", "Je voudrai de l'eau."], 1, "voudrais (conditional) = 'I would like' — polite; voudrai is future."),
  ]);
})(window.STUDY);
