/* ELA — English Language Arts (heaviest weighting)
   Question pools come from the two Blooket answer keys (window.ELA_POOL),
   tagged by topic; lessons, visuals, flashcards & a few items authored from
   the Romeo & Juliet / poetry / nonfiction study guide. */
(function (STUDY) {
  "use strict";
  function pool(tag) {
    return (window.ELA_POOL || []).filter(q => q.tag === tag)
      .map(q => ({ type: "mc", q: q.q, choices: q.choices, answer: q.answer }));
  }

  STUDY.register({
    id: "ela",
    name: "ELA",
    icon: "📖",
    accent: "#f25f8a",
    weight: 5,
    intro: "Literary and poetic devices, story elements, *Romeo and Juliet*, the studied poems, nonfiction and rhetoric, essay writing, and grammar. It's the biggest slice of your finals.",
    topics: [

      /* ---------------- 1. Figurative language ---------------- */
      {
        id: "ela-figurative",
        title: "Figurative Language",
        blurb: "Simile, metaphor, hyperbole, personification, imagery, euphemism.",
        lesson: [
          { p: "**Figurative language** means words that say something *other than* their literal meaning to create an image or feeling. These are the most-tested ELA terms — learn to **define** them and **spot an example**." },
          { defs: [
            ["Simile", "A comparison of two unlike things using **like** or **as**. *Her voice was as sweet as honey.*"],
            ["Metaphor", "A **direct** comparison **without** like/as — it says one thing *is* another. *This class is paradise.* Types: **implied**, **direct**, and **extended** (a metaphor stretched over many lines)."],
            ["Hyperbole", "An extreme **over-exaggeration** for dramatic or comedic effect. *I've told you a million times.*"],
            ["Personification", "Giving **human qualities** to non-human things. *The wind whispered secrets.*"],
            ["Imagery", "Vivid, descriptive language that appeals to the **five senses**. *The scent of dried leaves and wood smoke tickled my nose.*"],
            ["Euphemism", "A mild, polite phrase that replaces a harsh one. *He \"passed away\"* (instead of *died*)."],
          ] },
          { tip: "Simile vs. metaphor: if you can point to the word **like** or **as**, it's a simile. No like/as = metaphor." },
        ],
        visual: {
          type: "table", cap: "Figurative language at a glance",
          head: ["Device", "What it does", "Example"],
          rows: [
            ["Simile", "Compares with *like/as*", "*brave **like** a lion*"],
            ["Metaphor", "Compares directly (is)", "*the world **is** a stage*"],
            ["Hyperbole", "Exaggerates", "*I could sleep for a year*"],
            ["Personification", "Human traits to non-human", "*the sun **smiled***"],
            ["Imagery", "Appeals to senses", "*crisp, golden toast*"],
            ["Euphemism", "Softens a harsh idea", "*let go* (fired)"],
          ],
        },
        cards: [
          { front: "Simile", back: "A comparison using LIKE or AS." },
          { front: "Metaphor", back: "A direct comparison without like/as (one thing IS another)." },
          { front: "Hyperbole", back: "An exaggerated statement not meant literally, for effect." },
          { front: "Personification", back: "Giving human qualities to non-human things." },
          { front: "Imagery", back: "Descriptive language that appeals to the five senses." },
          { front: "Euphemism", back: "A mild/indirect phrase substituting for a harsh one (passed away = died)." },
          { front: "Extended metaphor", back: "A metaphor developed over several lines or the whole work." },
        ],
        questions: pool("figurative"),
      },

      /* ---------------- 2. Sound devices & poetry structure ---------------- */
      {
        id: "ela-sound",
        title: "Sound Devices & Poetry Structure",
        blurb: "Alliteration, assonance, consonance, onomatopoeia, rhyme, meter, stanza.",
        lesson: [
          { p: "**Sound devices** use the *music* of words. Poetry questions also test the **structure** of a poem." },
          { defs: [
            ["Alliteration", "Repeated **beginning** consonant sounds. *The **s**lithering **s**nake **s**ilently **s**lipped.*"],
            ["Assonance", "Repeated **vowel** sounds in nearby words. *The br**ee**ze blew through the tr**ee**s.*"],
            ["Consonance", "Repeated **consonant** sounds (often inside/end of words)."],
            ["Onomatopoeia", "A word that **imitates a sound**. *buzz, crack, bang, hum.*"],
            ["Stanza", "A grouped set of lines in a poem, separated by a blank line (a 'paragraph' of poetry)."],
            ["Rhyme scheme", "The pattern of end-rhymes, labeled with letters (ABAB, AABB…)."],
            ["Meter", "The **rhythmic** structure of a poem (its pattern of stressed/unstressed beats)."],
          ] },
          { tip: "**A**lliteration = **A**t the start. **Assonance** has **'a' for vowels**. Onomatopoeia = the word *sounds* like its meaning." },
        ],
        visual: {
          type: "compare", cap: "Three sound devices that get confused",
          left: { h: "Alliteration", items: ["Repeated **starting consonants**", "*Peter Piper picked…*", "Front of words"] },
          right: { h: "Assonance", items: ["Repeated **vowel** sounds", "*twinkling diamonds in the night sky*", "Inside words"] },
        },
        cards: [
          { front: "Alliteration", back: "Repetition of beginning consonant sounds in nearby words." },
          { front: "Assonance", back: "Repetition of vowel sounds in a series of words." },
          { front: "Consonance", back: "Repetition of consonant sounds within or at the end of words." },
          { front: "Onomatopoeia", back: "A word that imitates a sound (buzz, crack, hum)." },
          { front: "Stanza", back: "A grouped set of lines in a poem, set off by a blank line." },
          { front: "Rhyme scheme", back: "The pattern of rhymes at the ends of lines (e.g., ABAB)." },
          { front: "Meter", back: "The rhythmic structure / beat pattern of a poem." },
        ],
        questions: pool("sound"),
      },

      /* ---------------- 3. Literary devices & meaning ---------------- */
      {
        id: "ela-devices",
        title: "Literary Devices & Meaning",
        blurb: "Symbolism, irony, allusion, pun, connotation/denotation, mood, tone.",
        lesson: [
          { p: "These devices shape **meaning, mood, and message**." },
          { defs: [
            ["Symbolism", "When an object, character, or thing represents **something bigger than itself** (a dove = peace)."],
            ["Allusion", "A reference to a well-known person, place, event, or work (history, the Bible, mythology)."],
            ["Foreshadowing", "Hints about **what will happen later**."],
            ["Pun", "A play on words using double meaning or similar sound."],
            ["Connotation vs. Denotation", "**Denotation** = literal dictionary meaning. **Connotation** = the emotions/associations a word carries (*home* vs. *house*)."],
            ["Mood vs. Tone", "**Mood** = the feeling the reader gets (the atmosphere). **Tone** = the **author's attitude** toward the subject."],
          ] },
          { h: "The three ironies" },
          { defs: [
            ["Verbal irony", "Saying the opposite of what you mean (*clear as mud*)."],
            ["Situational irony", "The opposite of what's expected happens (tweeting that social media is a waste of time)."],
            ["Dramatic irony", "The **audience knows** something a character does not (we know the villain is in the house; the character doesn't)."],
          ] },
          { tip: "Mood = how the **reader** feels. Tone = how the **author** feels. They rhyme: *auTHOR → Tone*." },
        ],
        visual: {
          type: "table", cap: "The three types of irony",
          head: ["Type", "Who's fooled", "Example"],
          rows: [
            ["Verbal", "The listener (it's sarcasm)", "*\"Great weather!\"* in a storm"],
            ["Situational", "Everyone — outcome flips", "A fire station burns down"],
            ["Dramatic", "The character (audience knows)", "We see the trap; the hero doesn't"],
          ],
        },
        cards: [
          { front: "Symbolism", back: "When an object/character/thing represents something bigger than itself." },
          { front: "Allusion", back: "A reference to a well-known person, place, event, or work of art." },
          { front: "Verbal irony", back: "Saying the opposite of what you actually mean (sarcasm)." },
          { front: "Situational irony", back: "When the opposite of what is expected actually happens." },
          { front: "Dramatic irony", back: "When the audience knows something a character does not." },
          { front: "Connotation", back: "The emotions/associations a word carries beyond its literal meaning." },
          { front: "Denotation", back: "The literal, dictionary definition of a word." },
          { front: "Mood", back: "The emotional atmosphere/feeling a work gives the reader." },
          { front: "Tone", back: "The author's attitude toward the subject, characters, or audience." },
          { front: "Foreshadowing", back: "Hints an author gives about what will happen later." },
        ],
        questions: pool("devices"),
      },

      /* ---------------- 4. Story elements & plot ---------------- */
      {
        id: "ela-story",
        title: "Story Elements & Plot",
        blurb: "Plot stages, conflict, characterization, narrator/POV, setting, theme.",
        lesson: [
          { p: "Every narrative is built from the same parts. Know the **plot diagram** and the kinds of **conflict** and **characterization**." },
          { defs: [
            ["Exposition", "The opening — introduces characters and setting."],
            ["Rising action", "Events that build and **introduce the conflict**."],
            ["Climax", "The **turning point / high point** of the story."],
            ["Resolution", "The end — the conflict is settled."],
            ["Theme", "The underlying **message or lesson** of the work."],
            ["Setting", "**When and where** the story happens — time, place, and culture."],
          ] },
          { h: "Conflict & characters" },
          { defs: [
            ["Internal vs. External conflict", "**Internal** = inside a character (fear, guilt, anger). **External** = a character vs. an outside force (a storm, another person)."],
            ["Protagonist / Antagonist", "**Protagonist** = the main character. **Antagonist** = the person *or thing* working against them."],
            ["Direct vs. Indirect characterization", "**Direct** = narrator *tells* you (*\"Jane is cruel\"*). **Indirect** = shown through actions/words (*John snapped without warning*)."],
            ["Point of view", "**1st person** = narrator is in the story ('I'). **3rd-person omniscient** = outside narrator who knows **everyone's** thoughts."],
          ] },
          { tip: "Plot shape: a mountain. Exposition (base) → Rising action (climb) → **Climax** (peak) → Falling action → Resolution (back to ground)." },
        ],
        visual: {
          type: "flow", cap: "Freytag's plot pyramid (in order)",
          steps: [
            { i: "🏁", n: "Exposition", d: "set-up" },
            { i: "📈", n: "Rising action", d: "conflict builds" },
            { i: "⛰️", n: "Climax", d: "turning point" },
            { i: "📉", n: "Falling action", d: "winding down" },
            { i: "🎬", n: "Resolution", d: "conflict settled" },
          ],
        },
        cards: [
          { front: "Where is the conflict introduced?", back: "In the rising action." },
          { front: "Climax", back: "The high point / turning point of the plot." },
          { front: "Resolution", back: "The end of the story, where the conflict is settled." },
          { front: "Internal conflict", back: "A struggle inside a character (e.g., fear, anger, guilt)." },
          { front: "External conflict", back: "A struggle between a character and an outside force (storm, person)." },
          { front: "Protagonist", back: "The main character of a story." },
          { front: "Antagonist", back: "The person OR thing working against the protagonist." },
          { front: "Indirect characterization", back: "Revealing personality through actions/speech, not by telling." },
          { front: "Third-person omniscient", back: "An outside narrator who knows every character's thoughts." },
          { front: "Setting", back: "When and where a story takes place (time, place, culture)." },
        ],
        questions: pool("story"),
      },

      /* ---------------- 5. Romeo & Juliet ---------------- */
      {
        id: "ela-rj",
        title: "Romeo and Juliet",
        blurb: "Shakespeare, the chorus, and who's who in Verona.",
        lesson: [
          { p: "*Romeo and Juliet* is a tragedy by **William Shakespeare** (English playwright, ~1564–1616, the Elizabethan era). It's set in **Verona, Italy**, and follows two 'star-crossed lovers' from feuding families." },
          { term: "The Chorus", def: "A single speaker who opens the play with a **prologue (sonnet)**, summarizes what's to come, and sets the mood — a framing narrator." },
          { h: "Who's who" },
          { defs: [
            ["Romeo", "Son of the **Montagues**; falls instantly for Juliet."],
            ["Juliet", "Daughter of the **Capulets**; ~13 years old."],
            ["The Montagues vs. Capulets", "The two feuding households whose 'ancient grudge' drives the tragedy."],
            ["Mercutio", "Romeo's witty friend (a Montague ally); killed by Tybalt."],
            ["Benvolio", "Romeo's calm cousin who tries to keep the peace."],
            ["Friar Laurence", "The priest who secretly marries Romeo and Juliet and devises the potion plan."],
            ["The Nurse", "Juliet's loyal caretaker and confidante."],
            ["Paris", "The nobleman Juliet's parents want her to marry."],
            ["Balthasar", "Romeo's servant who brings him the (false) news of Juliet's death."],
            ["The Prince", "Prince Escalus, ruler of Verona, who enforces order and punishes the feud."],
          ] },
          { tip: "**M**ontague = Ro**m**eo. **C**apulet = Juliet's clan (think 'C' for the Capulet ball). Mercutio & Benvolio are on Romeo's side; Tybalt & Paris on Juliet's." },
        ],
        visual: {
          type: "compare", cap: "The two households",
          left: { h: "🔵 Montagues (Romeo)", items: ["Romeo", "Benvolio (cousin)", "Mercutio (friend, ally)", "Balthasar (servant)"] },
          right: { h: "🔴 Capulets (Juliet)", items: ["Juliet", "Tybalt (cousin)", "The Nurse", "Paris (suitor)"] },
        },
        cards: [
          { front: "Who wrote Romeo and Juliet?", back: "William Shakespeare." },
          { front: "What does the Chorus do?", back: "Opens the play with a prologue/sonnet that previews the plot and sets the mood." },
          { front: "Romeo's family", back: "The Montagues." },
          { front: "Juliet's family", back: "The Capulets." },
          { front: "Friar Laurence", back: "The priest who secretly marries the couple and plans the potion scheme." },
          { front: "Mercutio", back: "Romeo's witty friend, killed by Tybalt." },
          { front: "Benvolio", back: "Romeo's level-headed cousin who tries to keep the peace." },
          { front: "Paris", back: "The nobleman Juliet's parents want her to marry." },
          { front: "Balthasar", back: "Romeo's servant who brings news of Juliet's 'death.'" },
          { front: "The Prince (Escalus)", back: "Ruler of Verona who punishes the feuding families." },
          { front: "Setting of Romeo and Juliet", back: "Verona, Italy." },
        ],
        questions: [
          { type: "mc", q: "Who wrote Romeo and Juliet?", choices: ["Charles Dickens", "William Shakespeare", "Edgar Allan Poe", "Homer"], answer: 1, explain: "Shakespeare, the Elizabethan playwright." },
          { type: "mc", q: "What is the main job of the Chorus in Romeo and Juliet?", choices: ["To fight in the battle scenes", "To open the play and preview/summarize the story", "To play Romeo's father", "To provide comic relief only"], answer: 1, explain: "The Chorus delivers the prologue, foreshadowing the tragedy." },
          { type: "mc", q: "Romeo belongs to which family?", choices: ["The Capulets", "The Montagues", "The royal family", "The Friars"], answer: 1 },
          { type: "mc", q: "Which character secretly marries Romeo and Juliet?", choices: ["The Prince", "Friar Laurence", "Mercutio", "Benvolio"], answer: 1 },
          { type: "mc", q: "Whom do Juliet's parents want her to marry?", choices: ["Mercutio", "Benvolio", "Paris", "Balthasar"], answer: 2 },
          { type: "tf", q: "Mercutio and Benvolio are allies/friends of Romeo (the Montague side).", answer: true, explain: "Both stand with Romeo; Tybalt and Paris are on the Capulet side." },
          { type: "fill", q: "Romeo and Juliet is set in which Italian city?", answers: ["Verona"], explain: "Verona, Italy." },
        ],
      },

      /* ---------------- 6. The studied poems ---------------- */
      {
        id: "ela-poems",
        title: "The Studied Poems",
        blurb: "\"Fog,\" \"Daffodils,\" \"The Road Not Taken,\" \"Seven Ages of Man,\" \"A Narrow Fellow.\"",
        lesson: [
          { p: "You'll be asked to identify devices and themes in these specific poems. Here's the quick recall for each." },
          { defs: [
            ["\"Fog\" — Carl Sandburg", "A tiny poem that uses an **extended metaphor**: the fog comes *\"on little cat feet.\"* Theme: nature is quiet, mysterious, and fleeting."],
            ["\"I Wandered Lonely as a Cloud\" (Daffodils) — Wordsworth", "Opens with a **simile** (*lonely as a cloud*) and **personification** (daffodils *dancing*). Theme: nature's beauty brings lasting joy and comfort in memory."],
            ["\"The Road Not Taken\" — Robert Frost", "A traveler chooses between two paths — an **extended metaphor** for life's choices. Theme: our decisions shape who we become (and we romanticize them later)."],
            ["\"The Seven Ages of Man\" — Shakespeare", "*\"All the world's a stage\"* — an **extended metaphor** comparing life to a play with 7 stages (infant → schoolboy → lover → soldier → justice → old age → second childhood)."],
            ["\"A Narrow Fellow in the Grass\" — Emily Dickinson", "A riddle-like poem describing a **snake** without naming it; uses **imagery** and **metaphor**. Theme: nature inspires both wonder and fear."],
          ] },
          { tip: "Three of these lean on the **extended metaphor**: Fog (fog = cat), Road (roads = life choices), Seven Ages (life = a play)." },
        ],
        visual: {
          type: "table", cap: "Poem cheat-sheet",
          head: ["Poem", "Poet", "Key device", "Theme"],
          rows: [
            ["Fog", "Sandburg", "Extended metaphor (cat)", "Nature is quiet & fleeting"],
            ["Daffodils", "Wordsworth", "Simile + personification", "Nature brings lasting joy"],
            ["The Road Not Taken", "Frost", "Extended metaphor (path = life)", "Choices shape us"],
            ["Seven Ages of Man", "Shakespeare", "Extended metaphor (life = play)", "Life has stages"],
            ["A Narrow Fellow", "Dickinson", "Imagery / metaphor (snake)", "Awe & fear of nature"],
          ],
        },
        cards: [
          { front: "\"Fog\" — central device & image", back: "Extended metaphor: fog arrives 'on little cat feet.' (Carl Sandburg)" },
          { front: "\"I Wandered Lonely as a Cloud\" — opening device", back: "A simile ('lonely as a cloud') + personification of dancing daffodils. (Wordsworth)" },
          { front: "\"The Road Not Taken\" — meaning", back: "Two paths = an extended metaphor for life's choices. (Robert Frost)" },
          { front: "\"The Seven Ages of Man\" — famous line & device", back: "'All the world's a stage' — extended metaphor comparing life to a play. (Shakespeare)" },
          { front: "\"A Narrow Fellow in the Grass\" — subject", back: "A snake, described with vivid imagery without being named. (Emily Dickinson)" },
        ],
        questions: [
          { type: "mc", q: "In Carl Sandburg's \"Fog,\" the fog is compared to a cat ('little cat feet'). This comparison sustained through the poem is an example of:", choices: ["Onomatopoeia", "An extended metaphor", "A simile", "Alliteration"], answer: 1, explain: "The cat comparison runs through the whole short poem — an extended metaphor." },
          { type: "mc", q: "\"I wandered lonely as a cloud\" (Wordsworth) is an example of which device?", choices: ["Metaphor", "Simile", "Hyperbole", "Personification"], answer: 1, explain: "'as a cloud' = a simile." },
          { type: "mc", q: "In \"The Road Not Taken,\" the two roads most likely symbolize:", choices: ["A literal hiking trip", "Choices and decisions in life", "Two friends", "The seasons"], answer: 1 },
          { type: "mc", q: "\"All the world's a stage\" from \"The Seven Ages of Man\" compares life to a play. This is:", choices: ["A pun", "An extended metaphor", "Situational irony", "Assonance"], answer: 1 },
          { type: "mc", q: "Emily Dickinson's \"A Narrow Fellow in the Grass\" describes, without naming, a:", choices: ["River", "Snake", "Bird", "Storm"], answer: 1 },
        ],
      },

      /* ---------------- 7. Nonfiction, rhetoric & argument ---------------- */
      {
        id: "ela-nonfiction",
        title: "Nonfiction, Rhetoric & Argument",
        blurb: "Fiction vs nonfiction, biography/memoir, ethos/pathos/logos, fact vs opinion.",
        lesson: [
          { p: "Nonfiction is **true/factual** writing. Know its purposes, forms, and the tools of persuasion." },
          { defs: [
            ["3 purposes of nonfiction", "To **persuade**, to **inform**, and to **explain**."],
            ["Biography / Autobiography / Memoir", "**Biography** = someone's life by *another* person. **Autobiography** = your life by *yourself* (whole life). **Memoir** = personal stories/reflections on *part* of a life."],
            ["Objective vs. Subjective", "**Objective** = just facts, no bias. **Subjective** = personal opinions/feelings."],
            ["Fact vs. Opinion", "**Fact** can be proven (*the Mona Lisa was painted by da Vinci*). **Opinion** is a belief (*chocolate is the best flavor*)."],
            ["Anecdote", "A short, personal story used to illustrate a point."],
          ] },
          { h: "Ethos, Pathos, Logos (rhetorical appeals)" },
          { defs: [
            ["Ethos", "Appeal to **credibility/character** ('As a doctor with 20 years' experience…'). Builds **trust**."],
            ["Pathos", "Appeal to **emotion** ('Imagine the joy on your child's face…')."],
            ["Logos", "Appeal to **logic & evidence** ('Studies show it's 50% more effective')."],
          ] },
          { tip: "**E**thos = **E**thics/Expert. **P**athos = **P**assion/emotion. **L**ogos = **L**ogic. (Pathos → sympathy → emotion.)" },
        ],
        visual: {
          type: "concept", cap: "The three rhetorical appeals",
          hub: "Persuasion",
          leaves: [
            { b: "Ethos", s: "credibility / 'trust me, I'm an expert'" },
            { b: "Pathos", s: "emotion / makes you feel" },
            { b: "Logos", s: "logic, facts, statistics" },
          ],
        },
        cards: [
          { front: "Three purposes of nonfiction", back: "To persuade, to inform, and to explain." },
          { front: "Autobiography", back: "An account of a person's life written by that person." },
          { front: "Biography", back: "An account of a person's life written by someone else." },
          { front: "Memoir", back: "A collection of personal stories/reflections written by an individual." },
          { front: "Objective writing", back: "Presents facts without bias or personal opinion." },
          { front: "Subjective writing", back: "Expresses personal opinions, feelings, and biases." },
          { front: "Ethos", back: "A persuasive appeal to the author's credibility/character." },
          { front: "Pathos", back: "A persuasive appeal to emotions and feelings." },
          { front: "Logos", back: "A persuasive appeal to logic, reason, and evidence." },
          { front: "Fact vs. opinion", back: "A fact can be proven true; an opinion is a personal belief." },
          { front: "Anecdote", back: "A short, informal story used to illustrate a point." },
        ],
        questions: pool("nonfiction"),
      },

      /* ---------------- 8. Essay writing & MLA ---------------- */
      {
        id: "ela-writing",
        title: "Essay Writing & MLA",
        blurb: "Thesis, topic sentences, body paragraphs, quote integration, MLA.",
        lesson: [
          { p: "A strong literary essay has a clear structure. Each part has a job." },
          { defs: [
            ["Thesis statement", "A **debatable claim + reasons** — goes in the **introduction**. Not a question, hook, or quote."],
            ["Topic sentence", "Opens a body paragraph; **mirrors the thesis** and transitions into the paragraph's point."],
            ["Body paragraph", "Needs a **topic sentence, transitions, quotes + analysis**, and a concluding sentence. No first-person, no contractions."],
            ["Conclusion", "**Restates** the thesis and ends with a strong final **'so what?'** statement. Adds **no new** information or quotes."],
            ["Point of view", "Formal essays use **third person** — avoid 'I/you'."],
          ] },
          { h: "Integrating & citing quotes (MLA)" },
          { list: [
            "Use a **lead-in** before the quote (don't drop it in cold).",
            "Don't put a semicolon after *'The author argues that'* — it's a dependent clause.",
            "MLA in-text citation = **(Author LastName Page)** — no comma, no 'pg.', no year. *(Dan 2)*",
            "The period goes **after** the citation, **outside** the quotation marks.",
            "MLA format: Times New Roman 12pt, double-spaced, a Works Cited page — but **no cover page**.",
          ] },
          { tip: "Quote sandwich: **lead-in → quote (citation) → analysis** ('This shows…'). Every body paragraph = TS + evidence + analysis + concluding sentence." },
        ],
        visual: {
          type: "flow", cap: "Anatomy of a literary essay",
          steps: [
            { i: "🎣", n: "Intro", d: "hook + thesis" },
            { i: "①", n: "Body ¶", d: "TS + quote + analysis" },
            { i: "②", n: "Body ¶", d: "TS + quote + analysis" },
            { i: "✅", n: "Conclusion", d: "restate + 'so what'" },
          ],
        },
        cards: [
          { front: "A thesis is…", back: "A debatable claim + reasons (placed in the introduction)." },
          { front: "What must an introduction include?", back: "A thesis statement." },
          { front: "Topic sentence", back: "A sentence mirroring the thesis that transitions into the paragraph." },
          { front: "A body paragraph must include…", back: "A topic sentence, transitions, and quotes WITH analysis." },
          { front: "A conclusion should…", back: "Restate the topic/thesis and end with a strong 'so what' statement (no new info)." },
          { front: "Correct MLA in-text citation format", back: "(Author LastName Page) — no comma, no 'pg', no year." },
          { front: "Which is NOT part of MLA format?", back: "A cover page (MLA uses a heading, not a title page)." },
          { front: "Quote punctuation rule", back: "The period goes after the citation, outside the quotation marks." },
        ],
        questions: pool("writing"),
      },

      /* ---------------- 9. Grammar ---------------- */
      {
        id: "ela-grammar",
        title: "Grammar: Fragments, Run-ons & Commas",
        blurb: "Fix incomplete and overloaded sentences; use commas correctly.",
        lesson: [
          { defs: [
            ["Sentence fragment", "An **incomplete** sentence missing a subject, a verb, or a complete thought. *Because he missed the bus.*"],
            ["Run-on sentence", "**Two independent clauses jammed together** without proper punctuation or a conjunction. *I went to the store I bought milk.*"],
            ["Comma splice", "Two independent clauses joined by **only a comma**. *I was tired, I kept working.* (Fix with a period, semicolon, or comma + FANBOYS.)"],
          ] },
          { h: "Comma basics" },
          { list: [
            "After an **introductory** phrase: *After finishing the project, the team celebrated.*",
            "Between items in a **list** of three or more.",
            "Before a **coordinating conjunction** (FANBOYS) joining two complete sentences.",
          ] },
          { tip: "Fragment = **too little** (no complete thought). Run-on = **too much** (two sentences, no break). Comma splice = a **weak comma** doing a period's job." },
        ],
        visual: {
          type: "table", cap: "Three sentence errors",
          head: ["Error", "Problem", "Fix"],
          rows: [
            ["Fragment", "Incomplete thought", "Add the missing subject/verb"],
            ["Run-on", "Two sentences fused", "Split with . ; or , + FANBOYS"],
            ["Comma splice", "Comma where a period belongs", "Use . ; or , + conjunction"],
          ],
        },
        cards: [
          { front: "Sentence fragment", back: "An incomplete sentence lacking a subject, verb, or complete thought." },
          { front: "Run-on sentence", back: "Two independent clauses joined without proper punctuation/conjunction." },
          { front: "Comma splice", back: "Two independent clauses joined by only a comma." },
          { front: "Comma after an introductory phrase?", back: "Yes — 'After the game, we left.'" },
        ],
        questions: pool("grammar"),
      },
    ],
  });
})(window.STUDY);
