/* data/hard.js, a larger, HARDER question batch, tagged with concept + lvl
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
    // euphemism, the thin one, now well covered
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
    h("foreshadowing", "An early line, “She had no idea it would be the last time she'd see the house”, is an example of:", ["flashback", "foreshadowing", "a pun", "imagery"], 1),
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
    e("speaker", "The SPEAKER of a poem is:", ["always the poet themselves", "the voice or persona telling the poem", "the rhyme pattern", "the main idea"], 1, "The speaker is the voice of the poem, which may differ from the poet."),
    h("speaker", "A poem is narrated by a lonely lighthouse keeper. The lighthouse keeper is the poem's:", ["meter", "speaker", "stanza", "rhyme scheme"], 1),
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
    h("ethos", "“Trust me, I've taught biology for 25 years.” This appeal is:", ["pathos", "logos", "ethos", "denotation"], 2),
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
    h("conditionnel", "Which fully correct sentence uses the conditional to soften a request?", ["Je veux de l'eau.", "Je voudrais de l'eau, s'il vous plaît.", "J'ai voulu de l'eau.", "Je voudrai de l'eau."], 1, "voudrais (conditional) = 'I would like', polite; voudrai is future."),
  ]);

  /* ============ BIOLOGY (Easy recall + Hard application per topic) ============ */
  A("bio-mitosis", [
    e("interphase", "During which interphase sub-stage is DNA copied?", ["G1", "S", "G2", "M"], 1, "S = Synthesis."),
    h("mitosis", "Which event happens during ANAPHASE?", ["Chromosomes line up in the middle", "Sister chromatids are pulled to opposite poles", "DNA is copied", "Two nuclei reform"], 1),
    h("chromatin", "Most of the time, a cell's DNA exists as long, thin ______ (not condensed chromosomes).", ["chromatin", "centromeres", "ribosomes", "gametes"], 0),
  ]);
  A("bio-chromosome", [
    h("p", "A cell with a faulty p53 gene is dangerous because it:", ["divides too slowly", "can't catch mutations, so damaged cells keep dividing", "makes too much bile", "can't copy DNA at all"], 1),
    h("cancer", "Why are OLDER people statistically more likely to develop cancer?", ["their cells are bigger", "they've had more cell divisions, so more chances for mutations", "they have more p53 genes", "they stopped making chromatin"], 1),
  ]);
  A("bio-meiosis", [
    h("meiosis", "Why are siblings (same parents) often quite different from each other?", ["they were raised differently", "meiosis makes genetically different sex cells each time", "mitosis copied them wrong", "they have different numbers of chromosomes"], 1),
    e("haploid", "A gamete is described as HAPLOID, meaning it has:", ["two sets of chromosomes", "one set of chromosomes", "no chromosomes", "double the DNA"], 1),
  ]);
  A("bio-mendel", [
    h("heterozygous", "A cross of Tt × tt (T = tall, dominant) gives what chance of a TALL child?", ["0%", "25%", "50%", "100%"], 2, "Tt × tt → 2 Tt : 2 tt → 50% tall."),
    h("genotype", "An organism shows the recessive trait. Its genotype must be:", ["homozygous dominant (TT)", "homozygous recessive (tt)", "heterozygous (Tt)", "impossible to tell"], 1, "Recessive trait shows only with two lowercase alleles."),
  ]);
  A("bio-pedigree", [
    h("pedigree", "On a pedigree, an UNSHADED individual must carry at least one:", ["recessive allele", "dominant allele", "mutation", "extra chromosome"], 1, "Unshaded = doesn't show the trait → has ≥1 dominant allele."),
  ]);
  A("bio-systems", [
    h("respiratory", "Which body system exchanges oxygen and carbon dioxide?", ["digestive", "respiratory", "excretory", "muscular"], 1),
    h("nervous", "Which system sends the signals that control all the others?", ["circulatory", "nervous", "skeletal", "lymphatic"], 1),
  ]);
  A("bio-heart", [
    h("heart", "Blood from the body enters the heart at the:", ["left ventricle", "right atrium", "aorta", "left atrium"], 1, "Body → vena cava → right atrium."),
    h("heart", "Which path is correct for oxygen-poor blood heading to the lungs?", ["left ventricle → aorta", "right ventricle → pulmonary artery", "left atrium → pulmonary vein", "right atrium → aorta"], 1),
  ]);

  /* ============ HISTORY ============ */
  A("his-industrial", [
    h("industrial", "Why did the Industrial Revolution begin in Britain specifically?", ["it had no rivers", "abundant resources, capital, and geography", "it banned factories", "it had the smallest population"], 1),
    h("industrial", "Labor unions of the era did NOT primarily fight for:", ["banning child labor", "better worker safety", "higher wages", "equal pay for men and women"], 3, "Equal pay was not a typical union goal at that time."),
  ]);
  A("his-nationalism", [
    h("nationalism", "Bismarck and Cavour both unified their nations mainly through:", ["democracy and voting", "Realpolitik, practical power politics", "religious reform", "foreign aid"], 1),
    h("nationalism", "Meiji Japan's modernization differed from the West's because it was:", ["slow and gradual", "fast and state-directed", "led by labor unions", "focused on farming only"], 1),
  ]);
  A("his-imperialism", [
    h("imperialism", "At the Berlin Conference, African borders were decided by:", ["African leaders voting", "European powers, with no African input", "the United Nations", "a continent-wide election"], 1),
    h("imperialism", "Social Darwinism was used to justify imperialism by claiming:", ["all cultures are equal", "'survival of the fittest' applied to whole races/societies", "colonies should be freed", "trade should be banned"], 1),
  ]);
  A("his-interwar", [
    h("interwar", "Economic chaos from the Great Depression helped dictators rise because leaders promised:", ["more taxes", "economic stability and national pride", "to abolish armies", "open borders"], 1),
    h("interwar", "Gandhi's main weapon against British rule was:", ["a large navy", "nonviolent resistance / civil disobedience", "foreign alliances", "guerrilla bombing"], 1),
  ]);
  A("his-wwii", [
    h("wwii", "Appeasement failed because giving in to Hitler's demands:", ["satisfied him permanently", "let him seize more land unchecked", "started a trade war", "created the UN"], 1),
    h("wwii", "Germany's central location in Europe was a disadvantage because it had to:", ["import all its food", "fight a war on multiple fronts at once", "build a navy first", "abandon its allies"], 1),
  ]);
  A("his-decolonization", [
    h("decolonization", "The 1960 'Year of Africa' refers to:", ["the Berlin Conference", "seventeen African nations gaining independence in one year", "the start of apartheid", "the Rwandan genocide"], 1),
    h("decolonization", "Mandela and Gandhi are historically linked because both:", ["led armies", "used nonviolent protest against injustice", "ruled as kings", "started world wars"], 1),
  ]);

  /* ============ GEOMETRY (formula recall = Easy; the parametric problems = Hard) ============ */
  A("geo-area", [
    e("triangle", "The area of a triangle equals:", ["base × height", "½ × base × height", "2 × base × height", "base + height"], 1),
    e("trapezoid", "The area of a trapezoid equals:", ["b₁ × b₂", "½(b₁ + b₂) × height", "(b₁ + b₂) × height", "½ × b₁ × b₂"], 1),
  ]);
  A("geo-solids", [
    e("cylinder", "The volume of a cylinder equals:", ["2πrh", "πr²h", "⅓πr²h", "4πr²"], 1),
    e("sphere", "The volume of a sphere equals:", ["4πr²", "(4/3)πr³", "πr²h", "2πr"], 1),
    h("cone", "A cone and a cylinder have the same radius and height. The cone's volume is:", ["the same", "one-third of the cylinder's", "twice the cylinder's", "half the cylinder's"], 1, "Cone = ⅓πr²h."),
  ]);
  A("geo-circlemeasure", [
    e("circumference", "The circumference of a circle equals:", ["πr²", "πd (or 2πr)", "½πr", "4πr²"], 1),
  ]);
  A("geo-righttri", [
    e("pythagorean", "The Pythagorean theorem is:", ["a + b = c", "a² + b² = c²", "½ab = c", "a² − b² = c²"], 1),
    h("pythagorean", "Which set of side lengths forms a RIGHT triangle?", ["3, 6, 9", "6, 8, 10", "4, 5, 6", "5, 5, 9"], 1, "6²+8²=10² (36+64=100)."),
  ]);
  A("geo-trig", [
    e("tangent", "In SOH-CAH-TOA, tangent equals:", ["opposite ÷ hypotenuse", "adjacent ÷ hypotenuse", "opposite ÷ adjacent", "hypotenuse ÷ opposite"], 2),
    h("sine", "To find a missing ANGLE from the opposite and hypotenuse, you use:", ["sin", "sin⁻¹ (inverse sine)", "cos", "tan"], 1),
  ]);
  A("geo-quads", [
    e("parallelogram", "In a parallelogram, opposite sides are always:", ["perpendicular", "congruent (equal)", "different", "curved"], 1),
    h("parallelogram", "Which is NOT always true of a parallelogram?", ["opposite angles are congruent", "diagonals bisect each other", "all four sides are congruent", "opposite sides are parallel"], 2, "All sides congruent only for a rhombus/square."),
  ]);
  A("geo-similarity", [
    h("similarity", "Two figures are similar with scale factor 3. Their AREAS are in the ratio:", ["3 : 1", "9 : 1", "1 : 3", "6 : 1"], 1, "Area ratio = (scale factor)²."),
  ]);
  A("geo-circles", [
    e("tangent", "A tangent line meets a circle's radius at the point of tangency at a ___ angle.", ["45°", "60°", "90°", "180°"], 2),
    h("inscribed", "An inscribed angle is ___ the central angle that intercepts the same arc.", ["equal to", "half of", "twice", "unrelated to"], 1),
  ]);

  /* ============ FRENCH ============ */
  A("fr-belgique", [
    h("wallonie", "In which region of Belgium is French spoken?", ["Flanders", "Wallonia", "the Netherlands", "Luxembourg"], 1),
    h("bruxelles", "Brussels is special because it is officially:", ["French-only", "Dutch-only", "bilingual (French + Dutch)", "German-only"], 2),
  ]);
  A("fr-environnement", [
    h("canicule", "« la canicule » in English is:", ["a flood", "a heat wave", "a wildfire", "recycling"], 1),
    h("incendie", "« un incendie » means:", ["a drought", "a storm", "a fire / wildfire", "a heat wave"], 2),
  ]);
  A("fr-futur", [
    h("futur", "Which is the FUTUR (not conditional) of 'nous (aller)'?", ["nous irions", "nous irons", "nous allions", "nous irais"], 1, "irons = future; irions = conditional."),
  ]);

  /* ============ ELA, remaining topics ============ */
  A("ela-writing", [
    h("thesis", "Which is the strongest THESIS statement?", ["This essay is about Romeo and Juliet.", "Is fate to blame in Romeo and Juliet?", "Shakespeare shows that impulsive choices, not fate, drive the tragedy.", "Romeo and Juliet is a famous play."], 2, "A thesis is a debatable claim, not a topic or question."),
    h("citation", "Which is the correct MLA in-text citation for page 14 by author Lee?", ["(Lee, pg. 14)", "(Lee 14)", "(Harper Lee, 2020)", "Lee, page 14"], 1),
    e("conclusion", "A conclusion should:", ["introduce a new quote", "restate the thesis and give a final 'so what'", "ask a question", "add a new argument"], 1),
  ]);
  A("ela-grammar", [
    h("splice", "Which sentence is a COMMA SPLICE?", ["I was late, so I ran.", "I was late, I ran.", "Because I was late, I ran.", "I was late and ran."], 1, "Two complete sentences joined by only a comma."),
    h("run", "Which is a RUN-ON sentence?", ["The bell rang and we left.", "The bell rang we left.", "When the bell rang, we left.", "The bell rang; we left."], 1),
    h("fragment", "Which is a sentence FRAGMENT?", ["She left early.", "Running through the rain without an umbrella.", "We won.", "They cheered loudly."], 1),
  ]);
  A("ela-rj", [
    h("character", "Which character secretly marries Romeo and Juliet?", ["The Prince", "Friar Laurence", "Mercutio", "Tybalt"], 1),
    h("character", "Mercutio and Benvolio are best described as:", ["Capulets", "allies/friends of Romeo (Montague side)", "Juliet's parents", "rival suitors"], 1),
  ]);
  A("ela-poems", [
    h("poem", "In “The Road Not Taken,” the two roads are a metaphor for:", ["a real forest", "life's choices", "two friends", "the seasons"], 1),
    h("poem", "“Fog” by Sandburg compares the fog to a cat. Sustained through the poem, this is:", ["a simile", "an extended metaphor", "onomatopoeia", "alliteration"], 1),
  ]);
  A("ela-story", [
    h("narrator", "A THIRD-PERSON OMNISCIENT narrator:", ["is a character in the story", "knows every character's thoughts", "only knows one character's thoughts", "never describes feelings"], 1),
    h("setting", "The SETTING of a story includes:", ["only the time", "only the place", "the time, place, and culture", "the main character"], 2),
  ]);
})(window.STUDY);
