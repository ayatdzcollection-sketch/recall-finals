/* data/extra.js, authored VARIETY questions added on top of the originals.
   These reword concepts and add application/example items so the practice
   pool isn't just the memorised guide/Blooket wording. Nothing is removed;
   these are mixed in everywhere (topic practice, mixed, smart, cram, tests). */
(function (STUDY) {
  "use strict";
  const A = STUDY.addAuthored;
  const mc = (q, choices, answer, explain) => ({ type: "mc", q: q, choices: choices, answer: answer, explain: explain });
  const fill = (q, answers, explain) => ({ type: "fill", q: q, answers: answers, explain: explain });
  const tf = (q, answer, explain) => ({ type: "tf", q: q, answer: answer, explain: explain });

  /* ===================== ELA ===================== */
  A("ela-figurative", [
    mc("Identify the device: “The classroom was a zoo during the party.”", ["Simile", "Metaphor", "Hyperbole", "Personification"], 1, "A direct comparison with no 'like/as' = metaphor."),
    mc("Identify the device: “I'm so hungry I could eat a horse.”", ["Personification", "Simile", "Hyperbole", "Imagery"], 2, "An obvious exaggeration = hyperbole."),
    mc("Identify the device: “The autumn leaves waved hello as I walked by.”", ["Personification", "Hyperbole", "Simile", "Metaphor"], 0, "Leaves given the human act of waving hello."),
    mc("Which sentence contains a SIMILE?", ["Her temper was a volcano.", "The fog crept in silently.", "He was as stubborn as a mule.", "Time is money."], 2, "'as ... as' signals a simile."),
    mc("Which sentence is the best example of IMAGERY?", ["She was nice.", "The deal was fair.", "Warm cinnamon and woodsmoke drifted from the kitchen.", "He left early."], 2, "It appeals to the senses (smell)."),
    fill("A comparison that uses the word 'like' or 'as' is called a ______.", ["simile"]),
  ]);
  A("ela-sound", [
    mc("Identify the device: “The wild winds whipped wickedly.”", ["Assonance", "Alliteration", "Onomatopoeia", "Hyperbole"], 1, "Repeated 'w' sounds at the start of words."),
    mc("Which line uses ONOMATOPOEIA?", ["The night was calm and still.", "The bacon sizzled and popped in the pan.", "Her eyes sparkled.", "The road went on forever."], 1, "'sizzled' and 'popped' imitate sounds."),
    mc("A poem's lines are arranged in groups separated by blank lines. Each group is a:", ["meter", "rhyme scheme", "stanza", "couplet"], 2),
    fill("The repetition of vowel sounds in nearby words (e.g., 'the rain in Spain') is called ______.", ["assonance"]),
  ]);
  A("ela-devices", [
    mc("A character says “Oh, wonderful” after spilling coffee on his shirt. This is:", ["Dramatic irony", "Situational irony", "Verbal irony", "An allusion"], 2, "Saying the opposite of what's meant = verbal irony."),
    mc("The audience sees the villain hiding, but the hero walks in unaware. This is:", ["Verbal irony", "Situational irony", "Dramatic irony", "Foreshadowing"], 2),
    mc("A fire station burns down. This is:", ["Verbal irony", "Situational irony", "Dramatic irony", "A pun"], 1, "The opposite of what's expected = situational irony."),
    mc("“Home” feels warm and safe while “house” feels neutral. This difference in feeling is the word's:", ["denotation", "connotation", "syntax", "etymology"], 1),
    mc("The overall feeling or atmosphere a work creates in the reader is its:", ["tone", "theme", "mood", "plot"], 2, "Mood = the reader's feeling; tone = the author's attitude."),
    mc("A storm cloud used to represent coming trouble is an example of:", ["symbolism", "alliteration", "a simile", "denotation"], 0),
  ]);
  A("ela-story", [
    mc("In a plot diagram, the conflict is first introduced during the:", ["exposition", "rising action", "climax", "resolution"], 1),
    mc("A sailor fights to survive a violent storm at sea. This is:", ["internal conflict", "external conflict", "the resolution", "an allusion"], 1),
    mc("A soldier wrestles with guilt over a choice he made. This is:", ["external conflict", "internal conflict", "the climax", "foreshadowing"], 1),
    mc("The narrator states, “Mr. Diaz was a cruel, dishonest man.” This is:", ["indirect characterization", "direct characterization", "an allusion", "imagery"], 1, "The narrator tells us directly."),
    mc("We learn a character is kind because she quietly pays for a stranger's meal. This is:", ["direct characterization", "indirect characterization", "exposition", "mood"], 1, "Shown through action = indirect."),
    mc("The highest point of tension, where the story turns, is the:", ["exposition", "rising action", "climax", "resolution"], 2),
  ]);
  A("ela-nonfiction", [
    mc("“Buy now and protect your children's future!” appeals mainly to:", ["ethos", "logos", "pathos", "syntax"], 2, "It targets emotion (fear/love)."),
    mc("“In 12 clinical trials, the drug cut symptoms by 40%.” appeals mainly to:", ["pathos", "logos", "ethos", "mood"], 1, "Facts and statistics = logos."),
    mc("“As a board-certified cardiologist, I recommend this.” appeals mainly to:", ["pathos", "logos", "ethos", "imagery"], 2, "Credibility/authority = ethos."),
    mc("A true account of a person's life written BY that same person is a(n):", ["biography", "autobiography", "memoir", "essay"], 1),
    mc("Which statement is a FACT (not an opinion)?", ["Summer is the best season.", "Water freezes at 0°C at sea level.", "That movie was boring.", "Everyone should travel more."], 1),
    fill("A persuasive appeal based on the speaker's credibility or character is called ______.", ["ethos"]),
  ]);
  A("ela-writing", [
    mc("Which belongs in the INTRODUCTION rather than a body paragraph?", ["A supporting quote", "The thesis statement", "Quote analysis", "A concluding sentence"], 1),
    mc("Which is the correct MLA in-text citation for a quote on page 12 by author Harper Lee?", ["(Lee, pg. 12)", "(Harper Lee 12)", "(Lee 12)", "(Lee, 2020, 12)"], 2, "MLA = (LastName Page), no comma, no 'pg.'"),
    mc("Which is NOT part of correct MLA formatting?", ["Double spacing", "Times New Roman 12pt", "A separate cover page", "A Works Cited page"], 2),
    tf("A conclusion should introduce brand-new evidence and quotes.", false, "Conclusions restate and give a final 'so what,' not new info."),
  ]);
  A("ela-grammar", [
    mc("Which sentence is a COMMA SPLICE?", ["I was tired, so I went to bed.", "I was tired, I went to bed.", "Because I was tired, I went to bed.", "I was tired and went to bed."], 1, "Two complete sentences joined by only a comma."),
    mc("Which is a complete, correct sentence (not a fragment or run-on)?", ["Running through the rain.", "She missed the bus she walked instead.", "After the long game.", "We won the game, and everyone celebrated."], 3),
    mc("Which sentence is a RUN-ON?", ["The dog barked loudly.", "The sun set we kept hiking.", "When the sun set, we kept hiking.", "The sun set, so we kept hiking."], 1),
  ]);
  A("ela-rj", [
    mc("Romeo and Juliet is best classified as a:", ["comedy", "tragedy", "history", "sonnet sequence"], 1),
    mc("Which two families feud in the play?", ["Montagues and Capulets", "Tudors and Stuarts", "Hatfields and McCoys", "Capulets and Escalus"], 0),
    mc("Roughly how long does the action of the play take place over?", ["a single afternoon", "about four to five days", "several months", "ten years"], 1, "The whole tragedy unfolds in under a week."),
    mc("'But soft! What light through yonder window breaks?' is spoken during the balcony scene by:", ["Juliet", "Romeo", "Mercutio", "Friar Laurence"], 1, "Romeo speaks it as he watches Juliet at her window."),
    mc("Comic relief in the play comes mainly from:", ["the Prince and Paris", "the Nurse and Mercutio", "Lord and Lady Capulet", "Benvolio and Balthasar"], 1, "The Nurse's bawdy humor and Mercutio's wit lighten the tragedy."),
    tf("Romeo is in love with Juliet from the very first scene of the play.", false, "He is pining over Rosaline until he meets Juliet at the ball."),
    tf("The deaths of Romeo and Juliet finally end the feud between the families.", true, "Both fathers reconcile over their children's bodies."),
    fill("The young lovers are called a pair of '______-crossed lovers,' meaning fate is against them.", ["star"], "'Star-crossed' = doomed by the stars/fate."),
    fill("The priest who secretly marries the couple is Friar ______.", ["Laurence", "Lawrence"], "Friar Laurence."),
    fill("Romeo is exiled to the nearby city of ______ after killing Tybalt.", ["Mantua"], "He is banished to Mantua."),
  ]);
  A("ela-poems", [
    mc("In “The Road Not Taken,” the diverging roads are a metaphor for:", ["a literal forest walk", "life's choices and their consequences", "the four seasons", "two friends arguing"], 1),
    mc("“All the world's a stage” (The Seven Ages of Man) compares life to:", ["a journey", "a play/performance", "a river", "a battle"], 1),
  ]);

  /* ===================== BIOLOGY ===================== */
  A("bio-mitosis", [
    mc("Which stage comes immediately AFTER metaphase?", ["prophase", "anaphase", "telophase", "interphase"], 1),
    mc("During which stage do chromosomes line up along the middle of the cell?", ["prophase", "metaphase", "anaphase", "telophase"], 1),
    fill("Most of a cell's life is spent growing and copying DNA in a stage called ______.", ["interphase"]),
  ]);
  A("bio-meiosis", [
    mc("A skin cell divides to heal a cut. Which process is this?", ["meiosis", "mitosis", "fertilization", "translation"], 1),
    mc("Which process produces sperm and egg cells?", ["mitosis", "meiosis", "cytokinesis", "transcription"], 1),
    tf("Meiosis produces four cells that are genetically identical to the parent.", false, "They are genetically DIFFERENT and haploid."),
  ]);
  A("bio-mendel", [
    mc("In a cross of Tt × Tt, what FRACTION of offspring show the recessive trait?", ["1/2", "1/4", "3/4", "0"], 1),
    mc("Which cross produces a 1:1 ratio of dominant to recessive offspring?", ["TT × tt", "Tt × Tt", "Tt × tt", "TT × TT"], 2),
    fill("An organism with two different alleles (e.g., Tt) is called ______.", ["heterozygous"]),
  ]);
  A("bio-molecular", [
    mc("In DNA, which base pairs with cytosine (C)?", ["adenine", "thymine", "guanine", "uracil"], 2),
    mc("Translation (building the protein) takes place at the:", ["nucleus", "ribosome", "centromere", "cell membrane"], 1),
    fill("The flow of genetic information is DNA → ______ → protein.", ["mRNA", "rna", "messenger rna"]),
  ]);
  A("bio-evolution", [
    mc("Some bacteria survive an antibiotic and pass on resistance to offspring. This is the best example of:", ["natural selection", "a population bottleneck", "translation", "mitosis"], 0),
    mc("Which is REQUIRED for natural selection to occur?", ["all individuals being identical", "variation among individuals", "no offspring", "a stable environment forever"], 1),
  ]);
  A("bio-systems", [
    mc("Which body system exchanges oxygen and carbon dioxide?", ["digestive", "respiratory", "excretory", "muscular"], 1),
    mc("Which system sends signals that control all the other systems?", ["circulatory", "nervous", "skeletal", "lymphatic"], 1),
  ]);
  A("bio-heart", [
    mc("Which side of the heart pumps blood TO the lungs?", ["left side", "right side", "the aorta", "the atria only"], 1),
    fill("Oxygen-rich blood leaves the left ventricle through the large artery called the ______.", ["aorta"]),
  ]);

  // --- teacher-confirmed Biology question types (from the review walkthrough) ---
  A("bio-molecular", [
    mc("A DNA strand reads C-T-C. What is its matching mRNA codon?", ["G-A-G", "G-U-G", "C-U-C", "G-T-G"], 0, "DNA→mRNA: C→G, T→A, C→G, and RNA uses U not T. C-T-C → G-A-G."),
    mc("The mRNA codon is A-U-G. What is the tRNA anticodon?", ["U-A-C", "T-A-C", "A-U-G", "U-T-C"], 0, "Anticodon pairs with the codon: A↔U, U↔A, G↔C → U-A-C."),
    mc("The codon A-U-G codes for which amino acid (it's also 'start')?", ["Met", "Tyr", "Stop", "Leu"], 0, "AUG = Methionine / Start."),
    mc("What does DNA replication do, and when?", ["Builds a protein, in the ribosome", "Makes a perfect copy of DNA, before a cell divides", "Turns DNA into mRNA, in the nucleus", "Destroys old DNA, during digestion"], 1, "Replication copies DNA before division so each new cell gets a full set."),
    mc("An error made during DNA replication is called a:", ["protein", "mutation", "ribosome", "codon"], 1, "Replication errors = mutations, which can create new traits."),
    fill("Transcription copies DNA into ______ inside the nucleus.", ["mRNA", "messenger rna", "rna"]),
  ]);
  A("bio-evolution", [
    mc("Which statement about natural selection is TRUE?", ["It creates brand-new traits when organisms need them", "It selects the best version of traits that already exist", "It only happens to plants", "It stops mutations from occurring"], 1, "Natural selection does NOT create traits, mutations do; nature selects from what exists."),
    mc("Where do the NEW traits that natural selection acts on come from?", ["random mutations", "the organism's effort", "the environment directly", "natural selection itself"], 0),
    mc("'Evolution is the outcome; natural selection is the ______.'", ["mistake", "mechanism", "opposite", "definition"], 1, "Natural selection is the mechanism; evolution is the result."),
    mc("The Florida Panther losing genetic diversity after its habitat shrank to one small area is an example of a:", ["founder effect", "population bottleneck", "selection pressure", "mutation"], 1),
    mc("A few birds reaching a new island and starting a population with low genetic diversity is the:", ["bottleneck effect", "founder effect", "survival of the fittest", "adaptation"], 1),
    mc("Junco birds that survived best in cities were BOLDER, not faster. This shows an adaptation can be:", ["only physical", "a behavior, not just a physical trait", "created on purpose", "impossible to inherit"], 1),
    mc("Which scientist is credited with the theory of natural selection?", ["Mendel", "Darwin", "Watson", "Pasteur"], 1),
    mc("Why is eye color (blue vs. brown vs. green) usually NOT selected for?", ["It can't be inherited", "None of the variations give a survival advantage", "It's caused by the environment", "It only appears in adults"], 1, "For selection to act, a variation has to actually affect survival/reproduction."),
  ]);

  /* ===================== HISTORY ===================== */
  A("his-industrial", [
    mc("In which country did the Industrial Revolution begin?", ["France", "Great Britain", "Germany", "the United States"], 1),
    mc("Which invention became the most important new power source of the Industrial Revolution?", ["the light bulb", "the steam engine", "the telephone", "the cotton gin"], 1),
    mc("Labor unions of the era mainly fought for:", ["lower taxes", "better wages, safety, and an end to child labor", "free trade", "new colonies"], 1),
  ]);
  A("his-nationalism", [
    mc("Who unified Germany through 'blood and iron' Realpolitik?", ["Cavour", "Otto von Bismarck", "Garibaldi", "Napoleon III"], 1),
    mc("Which African nation successfully resisted European colonization?", ["Nigeria", "Ethiopia", "Kenya", "the Congo"], 1),
  ]);
  A("his-imperialism", [
    mc("The Berlin Conference divided up which continent among European powers?", ["Asia", "Africa", "South America", "Australia"], 1),
    mc("Social Darwinism was a pseudoscience used mainly to justify:", ["free public schools", "imperialism and racism", "labor unions", "democracy"], 1),
  ]);
  A("his-wwi", [
    mc("The MAIN long-term causes of WWI are remembered as M-A-I-N:", ["Money, Art, Industry, News", "Militarism, Alliances, Imperialism, Nationalism", "Marx, Africa, India, Napoleon", "Monarchy, Army, Italy, Navy"], 1),
    mc("The spark that directly triggered WWI was the assassination of:", ["Czar Nicholas II", "Archduke Franz Ferdinand", "Kaiser Wilhelm", "Otto von Bismarck"], 1),
    fill("The barren, dangerous ground between opposing trenches was called 'No ______ Land.'", ["man's", "mans", "man"]),
  ]);
  A("his-interwar", [
    mc("Who led India's independence movement using nonviolent resistance?", ["Nehru", "Mohandas Gandhi", "Nelson Mandela", "Mao Zedong"], 1),
    mc("The Great Depression caused widespread:", ["full employment", "unemployment and economic collapse", "colonial expansion", "lower prices and prosperity"], 1),
  ]);
  A("his-wwii", [
    mc("Giving in to Hitler's territorial demands to avoid war was the policy of:", ["containment", "appeasement", "isolationism", "Realpolitik"], 1),
    mc("The 'Final Solution' refers to:", ["the Marshall Plan", "the Nazi plan to murder Europe's Jews (the Holocaust)", "Japan's surrender", "the Treaty of Versailles"], 1),
  ]);
  A("his-coldwar", [
    mc("The 'Iron Curtain' described the division of:", ["Korea", "Europe into communist East and capitalist West", "Africa", "Germany only"], 1),
    mc("The Marshall Plan was a U.S. program to:", ["arm the Soviet Union", "rebuild war-torn Western Europe", "colonize Asia", "start the UN"], 1),
    mc("The Domino Theory was used to justify U.S. intervention in:", ["Cuba", "Vietnam", "Egypt", "Spain"], 1),
  ]);
  A("his-decolonization", [
    mc("The 1947 partition divided British India into India and:", ["Bangladesh", "Pakistan", "Sri Lanka", "Nepal"], 1),
    mc("Apartheid was South Africa's system of:", ["free elections", "racial segregation and white-minority rule", "communism", "religious tolerance"], 1),
    mc("The 1994 genocide of the Tutsi minority took place in:", ["Rwanda", "Nigeria", "South Africa", "Kenya"], 0),
  ]);

  /* ===================== FRENCH ===================== */
  A("fr-belgique", [
    mc("Which language is spoken in Wallonia (southern Belgium)?", ["Dutch", "German", "French", "English"], 2),
    mc("Brussels, the capital of Belgium, is officially:", ["French-only", "Dutch-only", "bilingual (French + Dutch)", "German-only"], 2),
  ]);
  A("fr-environnement", [
    mc("« la canicule » means:", ["drought", "a heat wave", "a flood", "recycling"], 1),
    mc("« la sécheresse » means:", ["a wildfire", "a heat wave", "drought", "pollution"], 2),
  ]);

  /* ===================== GEOMETRY (concept, non-numeric) ===================== */
  A("geo-quads", [
    mc("In a parallelogram, opposite sides are always:", ["perpendicular", "congruent (equal)", "different lengths", "curved"], 1),
    mc("Which statement is NOT always true for a parallelogram?", ["Opposite sides are congruent", "Opposite angles are congruent", "All four sides are congruent", "Diagonals bisect each other"], 2, "All sides congruent is only true for a rhombus/square."),
  ]);
  A("geo-circles", [
    mc("A tangent line meets the radius at the point of tangency at what angle?", ["45°", "60°", "90°", "180°"], 2),
    mc("An inscribed angle is always ___ the central angle that intercepts the same arc.", ["equal to", "half of", "twice", "unrelated to"], 1),
  ]);
  A("geo-righttri", [
    mc("In a right triangle, which equation is the Pythagorean Theorem?", ["a + b = c", "a² + b² = c²", "a² − b² = c²", "½ab = c"], 1),
  ]);
})(window.STUDY);
