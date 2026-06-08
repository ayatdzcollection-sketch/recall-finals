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
    h("consonance", "“The lumpy, bumpy road” repeats the 'mp' sound inside the words. This is:", ["alliteration", "consonance", "onomatopoeia", "a simile"], 1, "Repeated consonant sounds within/at the ends of words = consonance."),
    h("alliteration", "What is the difference between ALLITERATION and ASSONANCE?", ["alliteration repeats vowels; assonance repeats consonants", "alliteration repeats beginning consonant sounds; assonance repeats vowel sounds", "they are the same thing", "assonance happens only at line ends"], 1),
    e("couplet", "Two consecutive rhyming lines form a:", ["stanza", "couplet", "refrain", "meter"], 1),
    h("rhyme", "A poem whose end-rhymes follow the pattern AABB is described by its:", ["meter", "rhyme scheme", "stanza count", "tone"], 1),
    h("freeverse", "A poem written with NO regular rhyme or meter is in:", ["a sonnet", "free verse", "iambic pentameter", "couplets"], 1),
    h("refrain", "A line or group of lines repeated throughout a poem (like a chorus) is a:", ["stanza", "refrain", "meter", "simile"], 1),
    h("onomatopoeia", "Which sentence uses ONOMATOPOEIA?", ["The forest was peaceful.", "The bees buzzed and the twigs snapped underfoot.", "She felt very tired.", "The night was long."], 1, "'buzzed' and 'snapped' imitate sounds."),
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
    h("purpose", "The author's PURPOSE in a 'how to change a tire' article is mainly to:", ["persuade", "inform / explain", "entertain", "frighten"], 1, "Step-by-step instructions inform and explain."),
    h("structure", "A nonfiction text that lists events in the order they happened uses ___ structure.", ["compare-and-contrast", "chronological / sequence", "problem-and-solution", "spatial"], 1),
    h("structure", "“Because factories dumped waste, the river's fish died off.” This passage uses ___ structure.", ["cause-and-effect", "chronological", "compare-and-contrast", "spatial"], 0),
    h("ethos", "“As a pediatric nurse for 18 years, I can tell you...” relies mainly on:", ["pathos", "logos", "ethos", "imagery"], 2, "Appeal to the speaker's credibility = ethos."),
    h("pathos", "An ad showing a shivering, hungry puppy to raise donations relies mainly on:", ["logos", "ethos", "pathos", "syntax"], 2, "Targets emotion = pathos."),
    h("logos", "“Three peer-reviewed studies found a 30% drop in errors.” relies mainly on:", ["pathos", "ethos", "logos", "tone"], 2, "Facts and data = logos."),
    h("genre", "A book about Lincoln's life written by a historian (not Lincoln) is a:", ["autobiography", "biography", "memoir", "novel"], 1, "Someone else writes a biography."),
    h("objective", "Which sentence is OBJECTIVE (unbiased)?", ["The movie was a thrilling masterpiece.", "The movie runs for 142 minutes.", "Everyone should see this movie.", "The ending felt disappointing."], 1, "A verifiable, opinion-free statement."),
    e("anecdote", "A short personal story an author tells to illustrate a point is a(n):", ["statistic", "anecdote", "citation", "thesis"], 1),
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

  /* ===== BIOLOGY depth layer (in-scope application questions for final prep) ===== */
  A("bio-molecular", [
    h("transcription", "A DNA strand reads C-T-C. The mRNA copied from it is:", ["GAG", "CTC", "GUG", "CAC"], 0, "Pair each DNA base to its mRNA partner: C→G, T→A, C→G = GAG."),
    h("transcription", "A DNA strand reads T-A-C. The mRNA copied from it is:", ["AUG", "TAC", "ATG", "UAC"], 0, "T→A, A→U, C→G = AUG, which is the START codon."),
    h("anticodon", "The mRNA codon is AUG. The tRNA anticodon that matches it is:", ["UAC", "TAC", "AUG", "GUA"], 0, "Codon and anticodon pair up: A↔U, U↔A, G↔C = UAC."),
    h("codon", "The mRNA codon AUG codes for which amino acid, and what else does it signal?", ["Met, and it is the START signal", "a STOP", "Phe", "a tRNA"], 0, "AUG = methionine (Met) and it starts translation."),
    h("location", "Transcription happens in the ___ ; translation happens at the ___.", ["ribosome ; nucleus", "nucleus ; ribosome", "cytoplasm ; nucleus", "nucleus ; mitochondria"], 1, "DNA is transcribed to mRNA in the nucleus; the mRNA is then translated at a ribosome."),
    e("pairing", "In RNA, adenine (A) pairs with:", ["thymine (T)", "uracil (U)", "guanine (G)", "cytosine (C)"], 1, "RNA swaps T for U, so A pairs with U."),
    h("replication", "DNA replication (copying) happens:", ["after the cell divides", "before a cell divides, so each new cell gets a full copy", "only at the ribosome", "only in gametes"], 1),
    h("mutation", "An error while copying DNA is a mutation. Mutations matter for evolution because they:", ["always kill the cell", "can create new traits that natural selection can then act on", "only happen at the ribosome", "reverse evolution"], 1),
  ]);
  A("bio-pedigree", [
    h("recessive", "Two parents who do NOT show a trait have a child who DOES. The trait must be:", ["dominant", "recessive, and both parents are carriers", "found only in males", "impossible"], 1, "Two unaffected parents plus an affected child means the trait is recessive and both parents are Tt carriers."),
    h("carrier", "Those two unaffected parents who had an affected child must both be:", ["TT", "Tt (carriers)", "tt", "one TT and one tt"], 1),
    h("probability", "Two carrier parents (Tt × Tt). What percent of their children are expected to SHOW the recessive trait?", ["0%", "25%", "50%", "75%"], 1, "Tt × Tt = 1 TT : 2 Tt : 1 tt, so 25% are tt and show the recessive trait."),
    h("probability", "A carrier parent (Tt) and an affected parent (tt). Chance a child is affected (tt)?", ["0%", "25%", "50%", "100%"], 2, "Tt × tt = 2 Tt : 2 tt = 50% affected."),
    h("symbols", "On a pedigree, an unshaded circle joined by a horizontal line to a shaded square shows:", ["two affected males", "an unaffected female mated with an affected male", "two children", "two carriers"], 1, "Circle = female, square = male, shaded = shows the trait, and the line = a mating pair."),
  ]);
  A("bio-lizards", [
    h("isolation", "Volcanic lava trenches split one lizard population into two groups that became separate species. The trenches caused:", ["a mutation", "geographic isolation", "a population boom", "camouflage"], 1),
    h("selection", "Dusk Anoles on the dark mountain ended up dark-skinned because:", ["they chose to change color", "dark skin camouflaged them on dark bark, so they survived and reproduced more", "the pale lizards taught them", "dark color is always dominant"], 1),
    h("hybrid", "Hybrid lizards have patchy coloring. Natural selection works against them because they:", ["cannot find food", "are camouflaged on neither mountain, so predators spot them easily", "grow too large", "live too long"], 1),
    h("barrier", "The two lizard species now have different dewlap (throat-flap) colors, so they no longer mate. This difference is a:", ["selection pressure", "reproductive barrier", "geographic isolation", "population bottleneck"], 1),
    h("ancestor", "The two lizard species share about 98% of their DNA. The best conclusion is that they:", ["are unrelated", "recently diverged from a common ancestor", "are really one species", "were bred by humans"], 1),
    h("discriminate", "A lava trench splitting a population is ___ ; different mating displays that stop two groups breeding is ___.", ["reproductive barrier ; geographic isolation", "geographic isolation ; reproductive barrier", "both mutations", "both bottlenecks"], 1),
  ]);
  A("bio-meiosis", [
    h("compare", "A skin cell divides to heal a cut. Which process, and what result?", ["meiosis, making 4 different haploid cells", "mitosis, making 2 identical diploid cells", "meiosis, making 2 identical cells", "mitosis, making 4 haploid cells"], 1, "Body repair uses mitosis (2 identical diploid cells). Meiosis is only for making gametes."),
    h("haploid", "A human body cell is diploid (2 sets of chromosomes). After meiosis, each gamete is:", ["diploid (2 sets)", "haploid (1 set), so fertilization restores the 2 sets", "triploid (3 sets)", "identical to the parent cell"], 1),
    h("compare2", "Meiosis produces ___ ; mitosis produces ___ .", ["2 identical cells ; 4 different cells", "4 genetically different haploid cells ; 2 identical diploid cells", "gametes ; more gametes", "haploid cells ; haploid cells"], 1),
  ]);
  A("bio-evolution", [
    h("mechanism", "Giraffes have long necks today. Natural selection explains this as:", ["giraffes stretched their necks and passed the stretch on", "some giraffes already had longer necks by chance, and they survived and reproduced more", "they needed longer necks, so they grew them", "the environment created the trait on demand"], 1, "Natural selection does NOT create traits; it selects the best version of variation that already exists."),
    h("timing", "Rats became poison-resistant. When did the resistance trait first appear?", ["after the poison, in response to it", "by random mutation before the poison, then selection spread it", "the rats learned it during their lives", "parents taught it to their pups"], 1),
    h("notselection", "Which scenario is NOT natural selection?", ["faster gazelles escape lions and survive", "a flood randomly kills most of a population and the survivors rebuild it", "poison-resistant rats survive and spread", "camouflaged lizards avoid predators"], 1, "Random culling (a population bottleneck) is not selection FOR a trait, so it is not natural selection."),
  ]);
  A("bio-mendel", [
    h("ratio", "A single-trait cross gives about a 3:1 tall-to-short ratio in the offspring. The parents were most likely:", ["TT × tt", "Tt × Tt", "tt × tt", "TT × TT"], 1, "Tt × Tt = 3 showing the dominant trait : 1 showing the recessive trait (the classic 3:1)."),
  ]);
  A("bio-mitosis", [
    h("interphase", "A cell spends most of its life in interphase. During interphase the cell:", ["splits into two", "grows and copies its DNA to get ready to divide", "makes gametes", "dies"], 1),
    h("purpose", "Mitosis is used for:", ["making sex cells", "growth and repair, producing 2 identical body cells", "cutting the chromosome number in half", "creating genetic variety"], 1),
  ]);
  A("bio-chromosome", [
    h("chromatin", "Most of the time a cell's DNA sits as loose ___ ; it winds up into tight ___ only for division.", ["chromosomes ; chromatin", "chromatin ; chromosomes", "genes ; alleles", "mRNA ; DNA"], 1),
  ]);
  A("bio-systems", [
    h("teamwork", "Oxygen first enters the body at the ___ system, then the ___ system carries it to the cells.", ["circulatory ; respiratory", "respiratory ; circulatory", "excretory ; nervous", "digestive ; immune"], 1),
  ]);
  A("bio-heart", [
    h("pulmonary", "The pulmonary artery is unusual because it carries:", ["oxygen-rich blood to the body", "oxygen-poor blood to the lungs", "urine to the bladder", "air to the heart"], 1, "Arteries carry blood away from the heart; the pulmonary artery carries deoxygenated blood to the lungs."),
    h("return", "After picking up oxygen in the lungs, blood returns to the heart through the:", ["vena cava", "pulmonary vein", "aorta", "pulmonary artery"], 1, "Pulmonary vein leads into the left atrium."),
    e("arteries", "Arteries always carry blood:", ["toward the heart", "away from the heart", "only to the lungs", "in a circle"], 1, "Arteries carry blood Away from the heart."),
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
    h("structure", "Which belongs in the INTRODUCTION, not a body paragraph?", ["a supporting quote", "the thesis statement", "quote analysis", "a concluding sentence"], 1, "The thesis lives in the intro."),
    e("structure", "A TOPIC SENTENCE does what?", ["introduces the whole essay", "opens a body paragraph and mirrors the thesis", "lists the Works Cited", "gives the final 'so what'"], 1),
    h("pov", "A formal literary essay should be written in:", ["first person ('I think...')", "second person ('you should...')", "third person", "a mix of all three"], 2, "Avoid I/you in formal essays."),
    h("quote", "What is the correct way to integrate a quote?", ["drop it in with no introduction", "use a lead-in, then the quote, then analysis", "stack several quotes back-to-back", "end the paragraph on a bare quote"], 1, "Lead-in, quote (citation), then analysis = the quote sandwich."),
    h("citation", "With an MLA in-text citation, the period goes:", ["before the closing quotation mark", "after the citation, outside the quotation marks", "nowhere, there is no period", "before the author's name"], 1, "...tragedy” (Lee 12). Period after the parentheses."),
    h("citation", "Which is NOT part of correct MLA format?", ["double spacing", "Times New Roman 12pt", "a separate cover/title page", "a Works Cited page"], 2, "MLA uses a heading, not a cover page."),
    h("conclusion", "Which is a MISTAKE in a conclusion?", ["restating the thesis in fresh words", "giving a final 'so what'", "introducing a brand-new quote and argument", "tying the ideas together"], 2, "Conclusions add no new evidence."),
  ]);
  A("ela-grammar", [
    h("splice", "Which sentence is a COMMA SPLICE?", ["I was late, so I ran.", "I was late, I ran.", "Because I was late, I ran.", "I was late and ran."], 1, "Two complete sentences joined by only a comma."),
    h("run", "Which is a RUN-ON sentence?", ["The bell rang and we left.", "The bell rang we left.", "When the bell rang, we left.", "The bell rang; we left."], 1),
    h("fragment", "Which is a sentence FRAGMENT?", ["She left early.", "Running through the rain without an umbrella.", "We won.", "They cheered loudly."], 1),
    e("fanboys", "The FANBOYS coordinating conjunctions are:", ["for, and, nor, but, or, yet, so", "is, am, are, was, were", "who, what, when, where, why", "first, next, then, finally"], 0, "FANBOYS = For, And, Nor, But, Or, Yet, So."),
    h("splice", "The best way to FIX the comma splice “She studied hard, she passed” is:", ["just delete the comma", "“She studied hard, so she passed.”", "“She studied hard she passed.”", "add a second comma"], 1, "A comma + a FANBOYS word (so) joins the two clauses correctly."),
    h("fragment", "Why is “Because she forgot her keys.” a FRAGMENT?", ["it has no verb", "it has no subject", "it starts with a subordinating word and never finishes the thought", "it is too long"], 2, "'Because...' leaves the idea incomplete."),
    e("comma", "Which sentence needs a comma after its INTRODUCTORY phrase?", ["The dog barked at noon.", "After the long meeting we grabbed lunch.", "She ran and jumped.", "We left early."], 1, "'After the long meeting,' is an introductory phrase."),
    h("comma", "Which sentence punctuates a LIST correctly?", ["We bought apples bread and milk.", "We bought apples, bread, and milk.", "We, bought apples bread and milk.", "We bought, apples, bread and milk."], 1, "Commas separate three or more items."),
    h("comma", "Which correctly uses a comma + conjunction to join two complete sentences?", ["I cooked, and washed the dishes.", "I cooked dinner, and she washed the dishes.", "I cooked dinner and, she washed the dishes.", "I, cooked dinner and she washed the dishes."], 1, "Two full clauses joined by ', and' is correct."),
    h("run", "Which is a correct fix for a RUN-ON?", ["jam the sentences closer together", "add a period, semicolon, or comma + FANBOYS between the clauses", "remove the subject", "make it one long word"], 1, "Run-ons need a real break between the two sentences."),
  ]);
  A("ela-rj", [
    // ----- plot / sequence of events -----
    e("plot", "Before he falls for Juliet, Romeo is lovesick over another girl named:", ["Rosaline", "Beatrice", "Ophelia", "Helena"], 0, "Romeo pines for Rosaline until he sees Juliet at the Capulet ball."),
    h("plot", "Order these events correctly: (1) balcony scene, (2) Capulet ball, (3) secret marriage.", ["3 → 2 → 1", "2 → 1 → 3", "1 → 2 → 3", "2 → 3 → 1"], 1, "Romeo meets Juliet at the ball, woos her on the balcony that night, and they marry the next day."),
    h("plot", "The turning point (climax) of the play is usually identified as the moment Romeo:", ["first sees Juliet", "kills Tybalt", "drinks the poison", "marries Juliet"], 1, "Killing Tybalt gets Romeo banished and sets the tragedy racing toward its end."),
    h("plot", "After Romeo kills Tybalt, Prince Escalus punishes him with:", ["execution", "banishment to Mantua", "a heavy fine", "house arrest in Verona"], 1, "Romeo is exiled, not killed, 'banishèd.'"),
    h("plot", "Friar Laurence's plan is for Juliet to drink a potion that will:", ["poison Paris", "make her love Paris", "make her appear dead for about 42 hours", "erase her memory of Romeo"], 2, "She fakes death so she can later slip away to Romeo in Mantua."),
    h("plot", "Romeo wrongly believes Juliet is dead because:", ["he watches her drink poison", "the Friar's letter never reaches him and Balthasar reports her death", "Paris tells him", "the Nurse lies to him"], 1, "Friar John is quarantined, so the message fails; Balthasar brings the false news."),
    h("plot", "Where does Romeo get the poison he drinks?", ["from Friar Laurence", "from an apothecary in Mantua", "from the Nurse", "from Paris"], 1, "He buys it from a poor apothecary in Mantua."),
    h("plot", "Whom does Romeo kill at the Capulet tomb just before taking his own life?", ["Tybalt", "Paris", "Benvolio", "Lord Capulet"], 1, "Paris is mourning at the tomb and challenges Romeo."),
    h("plot", "Juliet ultimately dies by:", ["drinking leftover poison", "stabbing herself with Romeo's dagger", "the sleeping potion", "Tybalt's sword"], 1, "Finding no poison left, she uses Romeo's dagger."),
    e("plot", "What finally ends the Montague-Capulet feud?", ["a new law from the Prince", "the deaths of Romeo and Juliet", "Tybalt's death", "Friar Laurence's sermon"], 1, "Grief over their children reconciles the families."),
    // ----- character / foils -----
    e("character", "Mercutio is a kinsman of which figure, making him an outsider to BOTH feuding houses?", ["Friar Laurence", "Prince Escalus", "Lord Capulet", "Lord Montague"], 1, "Mercutio is related to the Prince, neither Montague nor Capulet."),
    h("character", "Mercutio's long, fanciful speech about a tiny fairy who brings dreams is the:", ["'Tomorrow' speech", "Queen Mab speech", "'Seven Ages' speech", "'Quality of Mercy' speech"], 1, "The Queen Mab speech shows his wit and his cynicism about dreams and love."),
    h("character", "A FOIL highlights another character by contrast. Paris functions mainly as a foil to:", ["Tybalt", "Romeo", "Benvolio", "the Friar"], 1, "Paris is the 'approved' suitor, contrasting Romeo's passionate, secret love."),
    h("character", "The Nurse loses Juliet's trust when she advises Juliet to:", ["run away to Mantua", "forget Romeo and marry Paris", "drink the Friar's potion", "confront Tybalt"], 1, "After championing Romeo, the Nurse's switch feels like a betrayal."),
    h("character", "When Juliet refuses to marry Paris, Lord Capulet:", ["calmly agrees to wait", "flies into a rage and threatens to disown her", "asks the Friar to decide", "sends her to a convent"], 1, "His fury pushes Juliet toward the Friar's risky plan."),
    e("character", "Friar Laurence agrees to marry Romeo and Juliet mainly because he hopes it will:", ["make him rich", "end the families' feud", "punish the Capulets", "impress the Prince"], 1, "He gambles that their love can reconcile the households."),
    h("character", "Tybalt, 'the fiery Tybalt,' is best described as:", ["a calm peacemaker", "a hot-tempered Capulet eager to fight", "Juliet's father", "Romeo's servant"], 1, "His aggression triggers the fatal duel."),
    // ----- theme -----
    e("theme", "Calling the couple 'star-crossed lovers' suggests their relationship is controlled by:", ["money", "fate / the stars", "their parents alone", "free choice"], 1, "'Star-crossed' = doomed by fate."),
    h("theme", "Which pair of opposing forces best captures the play's central thematic tension?", ["wealth vs. poverty", "love vs. hate", "city vs. country", "faith vs. science"], 1, "The lovers' love collides with their families' hatred."),
    h("theme", "Friar Laurence's warning 'Wisely and slow; they stumble that run fast' develops the theme of:", ["greed", "the danger of haste", "religious doubt", "class conflict"], 1, "Impulsiveness and rushing drive the tragedy."),
    h("theme", "'These violent delights have violent ends' warns that:", ["a war is coming", "intense, hasty passion can lead to destruction", "Juliet will betray Romeo", "the Nurse cannot be trusted"], 1, "The Friar foreshadows that fierce love may end in ruin."),
    // ----- literary devices in the text -----
    e("device", "'O brawling love, O loving hate' joins two contradictory ideas. This device is a(n):", ["simile", "oxymoron", "onomatopoeia", "alliteration"], 1, "Contradictory terms placed together = oxymoron."),
    h("device", "'Parting is such sweet sorrow' is an example of:", ["hyperbole", "oxymoron", "allusion", "pun"], 1, "'Sweet sorrow' pairs opposite ideas."),
    h("device", "The audience knows Juliet is only drugged while Romeo believes she is dead. This is:", ["verbal irony", "situational irony", "dramatic irony", "foreshadowing"], 2, "The audience knows more than the character = dramatic irony."),
    h("device", "'It is the east, and Juliet is the sun' compares Juliet to the sun with no 'like' or 'as.' This is a:", ["simile", "metaphor", "pun", "allusion"], 1, "A direct comparison = metaphor."),
    h("device", "A speech a character delivers ALONE on stage to reveal inner thoughts (like Juliet's balcony lines) is a:", ["aside", "dialogue", "soliloquy", "prologue"], 2, "Alone + inner thoughts = soliloquy."),
    h("device", "Mercutio's dying line, 'ask for me tomorrow and you shall find me a grave man,' relies on a:", ["pun", "simile", "euphemism", "metaphor"], 0, "'Grave' means both serious and a burial grave, a pun."),
    h("device", "References to Cupid, Phoebus, and Echo in the play are:", ["puns", "allusions to mythology", "stage directions", "soliloquies"], 1, "An allusion is a reference to well-known myth or history."),
    h("device", "In 'wherefore art thou Romeo?', the word 'wherefore' means:", ["where", "why", "when", "whether"], 1, "Juliet asks WHY he must be a Montague, not where he is."),
    // ----- structure / quotes -----
    e("structure", "The Prologue, spoken by the Chorus, is written in the 14-line form of a:", ["limerick", "sonnet", "ballad", "haiku"], 1, "A Shakespearean sonnet opens the play."),
    h("structure", "By revealing in the Prologue that the lovers will die, Shakespeare creates:", ["comic relief", "suspense about who survives", "dramatic irony / foreshadowing", "a flashback"], 2, "We watch the whole play already knowing the doomed ending."),
    h("quote", "'A plague o' both your houses!' is cried by which dying character, blaming both families?", ["Tybalt", "Mercutio", "Paris", "Benvolio"], 1, "Mercutio curses the feud as he dies."),
    h("quote", "The closing lines, 'For never was a story of more woe / Than this of Juliet and her Romeo,' are spoken by:", ["Friar Laurence", "Prince Escalus", "Lord Montague", "the Nurse"], 1, "The Prince ends the play."),
    h("quote", "'My only love sprung from my only hate!' Juliet says this when she realizes that Romeo:", ["loves Rosaline", "is a Montague, her family's enemy", "killed Tybalt", "is leaving for Mantua"], 1, "Her beloved belongs to the hated house."),
  ]);
  A("ela-poems", [
    // ----- "Fog" (Sandburg) -----
    e("fog", "Who wrote the short poem “Fog”?", ["Robert Frost", "Carl Sandburg", "Emily Dickinson", "William Wordsworth"], 1, "Carl Sandburg."),
    h("fog", "In “Fog,” the fog arrives “on little cat feet.” Sustained through the whole poem, the fog-as-cat comparison is a(n):", ["simile", "extended metaphor", "onomatopoeia", "hyperbole"], 1, "One image carried across the poem = extended metaphor."),
    h("fog", "The mood and theme of Sandburg's “Fog” are best described as:", ["loud and violent", "quiet, mysterious, and fleeting", "angry and bitter", "joyful and noisy"], 1, "The fog comes silently and moves on."),
    // ----- "I Wandered Lonely as a Cloud" / Daffodils (Wordsworth) -----
    e("daffodils", "“I Wandered Lonely as a Cloud” (the Daffodils poem) was written by:", ["Emily Dickinson", "William Wordsworth", "Robert Frost", "Carl Sandburg"], 1, "William Wordsworth."),
    h("daffodils", "The line “I wandered lonely as a cloud” is a:", ["metaphor", "simile", "personification", "pun"], 1, "'as a cloud' uses 'as' = simile."),
    h("daffodils", "Describing the daffodils as “dancing” and “tossing their heads” is:", ["personification", "onomatopoeia", "alliteration", "hyperbole"], 0, "Human actions given to flowers = personification."),
    h("daffodils", "The theme of the Daffodils poem is that nature's beauty:", ["is frightening", "brings lasting joy and comfort in memory", "is best ignored", "quickly fades from memory"], 1, "Recalling the daffodils later fills the speaker's heart with pleasure."),
    // ----- "The Road Not Taken" (Frost) -----
    e("road", "“The Road Not Taken” was written by:", ["Robert Frost", "Shakespeare", "Wordsworth", "Dickinson"], 0, "Robert Frost."),
    h("road", "In “The Road Not Taken,” the two diverging roads are an extended metaphor for:", ["a real forest path", "choices and their consequences in life", "two old friends", "the four seasons"], 1, "The roads stand for life's decisions."),
    h("road", "Looking back, the speaker of “The Road Not Taken” tends to:", ["forget his choices", "dramatize and romanticize the choice he made", "make no choices at all", "blame others"], 1, "'I shall be telling this with a sigh': he later mythologizes the choice."),
    // ----- "The Seven Ages of Man" (Shakespeare) -----
    e("seven-ages", "“The Seven Ages of Man” (“All the world's a stage”) is by:", ["Frost", "Shakespeare", "Sandburg", "Wordsworth"], 1, "William Shakespeare."),
    h("seven-ages", "“All the world's a stage, / And all the men and women merely players” compares life to:", ["a river", "a play / performance", "a battle", "a garden"], 1, "Life as a stage play = an extended metaphor."),
    h("seven-ages", "“The Seven Ages of Man” divides a human life into:", ["four seasons", "seven stages", "three acts", "twelve months"], 1, "Infant, schoolboy, lover, soldier, justice, old age, second childhood."),
    // ----- "A Narrow Fellow in the Grass" (Dickinson) -----
    e("narrow", "“A Narrow Fellow in the Grass” was written by:", ["Emily Dickinson", "Robert Frost", "Carl Sandburg", "Shakespeare"], 0, "Emily Dickinson."),
    h("narrow", "The “narrow fellow” the poem describes, without ever naming it, is a:", ["river", "snake", "bird", "fox"], 1, "Vivid imagery describes a snake gliding through the grass."),
    h("narrow", "Dickinson's poem conveys that nature can inspire both:", ["hunger and thirst", "wonder and fear", "love and wealth", "noise and silence"], 1, "'Zero at the bone': awe mixed with fear."),
    // ----- cross-poem discrimination -----
    h("device", "Which studied poem OPENS with a simile rather than a metaphor?", ["“Fog”", "“The Road Not Taken”", "“I Wandered Lonely as a Cloud”", "“The Seven Ages of Man”"], 2, "'lonely as a cloud' uses 'as'."),
    h("device", "Three studied poems rely on an EXTENDED METAPHOR. Which group is correct?", ["Fog, The Road Not Taken, The Seven Ages of Man", "Daffodils, Fog, A Narrow Fellow", "The Road Not Taken, Daffodils, A Narrow Fellow", "The Seven Ages, Daffodils, Fog"], 0, "Fog = cat, Road = life's choices, Seven Ages = life as a play."),
    h("poet", "Which poem-and-poet pairing is CORRECT?", ["“Fog” = Frost", "“The Road Not Taken” = Dickinson", "“A Narrow Fellow in the Grass” = Dickinson", "“Daffodils” = Sandburg"], 2, "Dickinson wrote 'A Narrow Fellow in the Grass.'"),
  ]);
  A("ela-story", [
    h("narrator", "A THIRD-PERSON OMNISCIENT narrator:", ["is a character in the story", "knows every character's thoughts", "only knows one character's thoughts", "never describes feelings"], 1),
    h("setting", "The SETTING of a story includes:", ["only the time", "only the place", "the time, place, and culture", "the main character"], 2),
  ]);
})(window.STUDY);
