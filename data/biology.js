/* BIOLOGY (second-heaviest). Authored from the Bio final review answer key:
   cell reproduction, genetics, molecular genetics, evolution, body systems. */
(function (STUDY) {
  "use strict";
  STUDY.register({
    id: "biology",
    name: "Biology",
    icon: "🧬",
    accent: "#27c89b",
    weight: 4,
    intro: "Cell reproduction, genetics, DNA, evolution, and body systems. **Your teacher confirmed:** the final is **all multiple choice**, **evolution has the most questions**, and you only need the **big picture** of meiosis and the DNA processes (not the steps). Chromosome detail stays light.",
    topics: [

      /* 1. Cell reproduction / mitosis */
      {
        id: "bio-mitosis",
        title: "Cellular Reproduction (Mitosis)",
        blurb: "The cell cycle and the five stages of mitosis, in order.",
        lesson: [
          { p: "**Mitosis** makes two **identical** body cells. Before it, the cell spends most of its life in **interphase** (growing and copying its DNA)." },
          { defs: [
            ["Interphase", "The cell does its job and **grows**. Three sub-stages: **G1** (growth) → **S** (DNA is copied/doubles) → **G2** (more growth, prep to divide)."],
            ["Mitosis", "The division of the **nucleus**: Prophase → Metaphase → Anaphase → Telophase."],
            ["Cytokinesis", "The splitting of the **cytoplasm** into two separate cells (after mitosis)."],
            ["Chromosome", "A structure made of tightly wound **chromatin** (DNA)."],
          ] },
          { tip: "Remember the order with **\"I P-MAT\"**: **I**nterphase, then **P**rophase, **M**etaphase, **A**naphase, **T**elophase." },
        ],
        visual: {
          type: "flow", cap: "The cell cycle in order",
          steps: [
            { i: "🌱", n: "Interphase", d: "G1·S·G2 grow + copy DNA" },
            { i: "1", n: "Prophase", d: "chromosomes condense" },
            { i: "2", n: "Metaphase", d: "line up in middle" },
            { i: "3", n: "Anaphase", d: "pull apart" },
            { i: "4", n: "Telophase", d: "two nuclei form" },
          ],
        },
        cards: [
          { front: "Put the stages of mitosis in order.", back: "(Interphase →) Prophase → Metaphase → Anaphase → Telophase." },
          { front: "What are the 3 sub-stages of interphase?", back: "G1 (growth), S (DNA doubles), G2 (continued growth)." },
          { front: "During which interphase stage is DNA copied?", back: "S phase (synthesis)." },
          { front: "A chromosome is made of…", back: "Tightly wound chromatin (DNA)." },
          { front: "Cytokinesis", back: "The division of the cytoplasm into two cells (after the nucleus divides)." },
        ],
        questions: [
          { type: "mc", q: "Which is the correct order of the stages of mitosis?", choices: ["Metaphase, Prophase, Anaphase, Telophase", "Prophase, Metaphase, Anaphase, Telophase", "Anaphase, Telophase, Prophase, Metaphase", "Telophase, Anaphase, Metaphase, Prophase"], answer: 1 },
          { type: "mc", q: "During which sub-stage of interphase is DNA copied (doubled)?", choices: ["G1", "S", "G2", "Prophase"], answer: 1, explain: "S = Synthesis, when DNA is replicated." },
          { type: "fill", q: "Interphase has three parts: G1, ____, and G2.", answers: ["S", "S phase", "synthesis"], explain: "S (synthesis), when DNA doubles." },
          { type: "mc", q: "A chromosome is made of tightly wound…", choices: ["protein only", "chromatin", "ribosomes", "lipids"], answer: 1 },
          { type: "tf", q: "In interphase, the cell is doing its normal job and growing.", answer: true },
          { type: "fill", q: "The division of the cytoplasm into two cells is called ______.", answers: ["cytokinesis"] },
        ],
      },

      /* 2. Chromosomes & cancer */
      {
        id: "bio-chromosome",
        title: "Chromosomes & Cancer",
        blurb: "Chromosome anatomy and how the p53 gene guards against cancer.",
        lesson: [
          { note: "**Light scope (per teacher):** you don't need chromosome structure in deep detail. But the **p53 / cancer** part below was emphasized a lot." },
          { defs: [
            ["Chromosome", "A long piece of **DNA, coiled and condensed**. You only see chromosomes during cell division."],
            ["Chromatin", "That **same DNA unwound** into a long, thin form (how it sits the rest of the time)."],
            ["Centromere", "The pinched middle that **holds the 2 sister chromatids together**."],
            ["Sister chromatids", "The two **identical copies** of a chromosome, joined at the centromere."],
            ["Gene", "A section of DNA with the info to make **one protein** (one gene = one protein)."],
          ] },
          { h: "Cancer & the p53 gene" },
          { p: "**p53** is a gene whose job is to **check DNA after it's copied** (after replication) and **find and fix mistakes** (mutations). If p53 is **faulty/mutated** itself, it stops catching mutations. Those mutations build up — especially in the genes that **control how fast a cell divides** — so cells **divide too fast**, stop doing their job, and form **tumors**. That's cancer." },
          { p: "Cancer happens when **mutations** build up in dividing cells. **Taller** people have **more cells**, and **older** people's cells have **divided for longer**, both mean more chances for a harmful mutation, so higher cancer odds." },
          { tip: "Think of p53 as the cell's **'quality inspector'**, it halts a cell with damaged DNA before that damage can spread." },
        ],
        visual: {
          type: "concept", cap: "Parts of a chromosome",
          hub: "Chromosome",
          leaves: [
            { b: "Centromere", s: "holds the 2 chromatids together" },
            { b: "Chromatids", s: "two identical copies" },
            { b: "Gene", s: "DNA segment coding for a trait" },
          ],
        },
        cards: [
          { front: "Centromere", back: "Holds the two chromatids of a chromosome together." },
          { front: "Gene", back: "A segment of DNA that codes for a trait." },
          { front: "Chromatids", back: "The two identical copies of a chromosome." },
          { front: "Job of the p53 gene", back: "Detects DNA damage and stops a cell from dividing: prevents cancer." },
          { front: "Why do taller/older people have higher cancer rates?", back: "More cells (taller) and more cell divisions over time (older) = more chances for mutations." },
        ],
        questions: [
          { type: "mc", q: "What is the role of the p53 gene?", choices: ["It speeds up cell division", "It detects DNA damage and stops the cell from dividing", "It produces energy for the cell", "It copies DNA"], answer: 1, explain: "p53 is a tumor suppressor that prevents damaged cells from dividing." },
          { type: "mc", q: "What holds the two chromatids of a chromosome together?", choices: ["The gene", "The centromere", "The ribosome", "The nucleus"], answer: 1 },
          { type: "fill", q: "A ____ is a segment of DNA that codes for a trait.", answers: ["gene"] },
          { type: "mc", q: "Why do taller people tend to have higher cancer rates?", choices: ["Their cells divide faster", "They have more cells, so more chances for a mutation", "They have weaker immune systems", "They have larger p53 genes"], answer: 1 },
          { type: "tf", q: "If the p53 gene is defective, cells with damaged DNA are more likely to keep dividing.", answer: true },
        ],
      },

      /* 3. Meiosis */
      {
        id: "bio-meiosis",
        title: "Meiosis vs. Mitosis",
        blurb: "Making gametes: 4 different haploid sex cells.",
        lesson: [
          { p: "**Meiosis** produces **gametes** (sex cells: sperm and egg). It makes **4 different haploid** cells, each with **half** the chromosomes, so that fertilization restores the full number." },
          { tip: "**Teacher's big takeaway:** you do **not** need the steps of meiosis. Just know it makes **sex cells** with **half** the DNA, all **different** from each other — that's why siblings (even from the same parents) can look and act so differently." },
          { defs: [
            ["Mitosis → result", "**2 identical diploid** cells (two copies of each chromosome). Used for growth/repair of body cells."],
            ["Meiosis → result", "**4 genetically different haploid** cells (one copy of each chromosome). Used to make gametes."],
            ["Diploid vs. Haploid", "**Diploid** = two sets of chromosomes (body cells). **Haploid** = one set (gametes)."],
          ] },
          { tip: "**Mei**osis makes **'me' (sex cells)** → 4 unique. **Mit**osis makes **'mini-me' twins** → 2 identical." },
        ],
        visual: {
          type: "compare", cap: "Two kinds of cell division",
          left: { h: "Mitosis", items: ["Makes **2** cells", "**Identical** to parent", "**Diploid** (full set)", "Growth & repair"] },
          right: { h: "Meiosis", items: ["Makes **4** cells", "**Different** from each other", "**Haploid** (half set)", "Makes gametes (sex cells)"] },
        },
        cards: [
          { front: "Purpose of meiosis", back: "To produce gametes (sex cells)." },
          { front: "Mitosis produces…", back: "2 identical diploid cells." },
          { front: "Meiosis produces…", back: "4 genetically different haploid cells." },
          { front: "Diploid vs. haploid", back: "Diploid = two sets of chromosomes; haploid = one set (gametes)." },
        ],
        questions: [
          { type: "mc", q: "What is the purpose of meiosis?", choices: ["To repair damaged tissue", "To produce gametes (sex cells)", "To make two identical body cells", "To produce energy"], answer: 1 },
          { type: "mc", q: "How many cells, and of what type, does meiosis produce?", choices: ["2 identical diploid cells", "4 different haploid cells", "2 different haploid cells", "4 identical diploid cells"], answer: 1 },
          { type: "mc", q: "Mitosis results in:", choices: ["4 different haploid cells", "2 identical diploid cells", "1 haploid cell", "4 identical haploid cells"], answer: 1 },
          { type: "fill", q: "A gamete (sex cell) is ____ , meaning it has one copy of each chromosome.", answers: ["haploid"] },
        ],
      },

      /* 4. Mendelian genetics */
      {
        id: "bio-mendel",
        title: "Mendelian Genetics & Punnett Squares",
        blurb: "Alleles, genotype/phenotype, and predicting offspring ratios.",
        lesson: [
          { defs: [
            ["Allele", "A version of a gene (e.g., **T** for tall, **t** for short)."],
            ["Homozygous", "Two of the **same** allele (TT or tt). 'Purebred.'"],
            ["Heterozygous", "Two **different** alleles (Tt). 'Hybrid.'"],
            ["Genotype", "The **letters/alleles** an organism has (TT, Tt, tt)."],
            ["Phenotype", "The **physical trait** you see (tall, short)."],
            ["Dominant vs. recessive", "A **dominant** allele (capital, T) shows even if only one is present; a **recessive** allele (lowercase, t) shows only when homozygous (tt)."],
          ] },
          { h: "Worked crosses (T = tall, t = short)" },
          { list: [
            "**TT × tt** → all **Tt** → **100% tall**.",
            "**Tt × Tt** → 1 TT : 2 Tt : 1 tt → genotype **25% TT, 50% Tt, 25% tt**; phenotype **75% tall, 25% short**.",
            "Dog cross **Rr × rr** (R = red, r = brown) → 50% Rr, 50% rr → **50% red, 50% brown**.",
          ] },
          { tip: "A **3:1** phenotype ratio (75%:25%) is the fingerprint of a **Tt × Tt** cross. A **1:1** ratio comes from **Tt × tt**." },
          { note: "**Scope (per teacher):** only **basic single-trait** crosses. No dihybrid crosses, no incomplete/codominance, no sex-linked traits, no multiple alleles, no blood types. You won't fill in a Punnett square on the scantron, but you must be able to solve one to pick the right probability (e.g., *100% / 75% / 25% / 0%*)." },
        ],
        visual: {
          type: "table", cap: "Punnett square: Tt × Tt",
          head: ["", "T", "t"],
          rows: [["**T**", "TT", "Tt"], ["**t**", "Tt", "tt"]],
        },
        cards: [
          { front: "Homozygous", back: "Two identical alleles (TT or tt)." },
          { front: "Heterozygous", back: "Two different alleles (Tt)." },
          { front: "Genotype vs. phenotype", back: "Genotype = the alleles (Tt); phenotype = the visible trait (tall)." },
          { front: "Cross TT × tt: offspring?", back: "All Tt → 100% show the dominant trait (tall)." },
          { front: "Cross Tt × Tt: phenotype ratio?", back: "75% dominant : 25% recessive (3:1). Genotypes 25% TT, 50% Tt, 25% tt." },
          { front: "Cross Rr × rr: ratio?", back: "50% Rr : 50% rr (1:1)." },
        ],
        questions: [
          { type: "mc", q: "In a cross of two heterozygous tall plants (Tt × Tt), what percent of offspring are short (tt)?", choices: ["0%", "25%", "50%", "75%"], answer: 1, explain: "1 of 4 boxes is tt = 25%." },
          { type: "mc", q: "A homozygous tall plant (TT) is crossed with a homozygous short plant (tt). The offspring are:", choices: ["All tall (Tt)", "All short", "Half tall, half short", "75% tall"], answer: 0, explain: "All Tt, tall is dominant." },
          { type: "mc", q: "Which genotype is heterozygous?", choices: ["TT", "tt", "Tt", "ttt"], answer: 2 },
          { type: "fill", q: "The physical traits you can observe (like tall or short) are called the ____.", answers: ["phenotype"] },
          { type: "mc", q: "A red dog (Rr) is crossed with a brown dog (rr). What ratio of red:brown puppies is expected?", choices: ["3:1", "1:1", "all red", "all brown"], answer: 1, explain: "Rr × rr → 50% Rr (red) : 50% rr (brown)." },
          { type: "tf", q: "An organism with two different alleles (Tt) is called homozygous.", answer: false, explain: "Two different alleles = heterozygous." },
        ],
      },

      /* 5. Pedigrees */
      {
        id: "bio-pedigree",
        title: "Pedigrees",
        blurb: "Reading family trees of inherited traits.",
        lesson: [
          { p: "A **pedigree** is a chart that tracks a trait through a family across generations." },
          { defs: [
            ["Shaded shape", "An individual who **has the trait** being followed."],
            ["Unshaded shape", "An individual **without** the trait."],
            ["Squares vs. circles", "**Square = male**, **circle = female**. A horizontal line between them = a mating pair; vertical lines drop down to their children."],
          ] },
          { p: "To find the chance of a recessive child from two heterozygous (carrier) parents (Tt × Tt), use a Punnett square: the odds of **tt = 25%**. From a Tt × tt pair, a recessive child = **50%**." },
          { tip: "Shaded = **has** the trait. Square = boy, circle = girl. That's most of what pedigree questions ask." },
        ],
        visual: {
          type: "table", cap: "Pedigree symbols",
          head: ["Symbol", "Meaning"],
          rows: [["☐ / ○", "Male / Female"], ["Shaded", "Has the trait"], ["Unshaded", "Does not have the trait"], ["Horizontal line", "A mating pair"], ["Vertical line", "Their offspring"]],
        },
        cards: [
          { front: "What does a shaded symbol mean on a pedigree?", back: "That individual has the trait being followed." },
          { front: "Square vs. circle on a pedigree", back: "Square = male, circle = female." },
          { front: "Two carrier parents (Tt × Tt): chance a child is recessive (tt)?", back: "25%." },
          { front: "Tt × tt cross: chance of a recessive child?", back: "50%." },
        ],
        questions: [
          { type: "mc", q: "On a pedigree, what does it mean for an individual's symbol to be shaded?", choices: ["They are male", "They have the trait being followed", "They are deceased", "They are the oldest child"], answer: 1 },
          { type: "mc", q: "On a pedigree, a square represents a ____ and a circle represents a ____.", choices: ["female; male", "male; female", "parent; child", "carrier; non-carrier"], answer: 1 },
          { type: "mc", q: "Two heterozygous (Tt) parents have a child. What is the chance the child is homozygous recessive (tt)?", choices: ["0%", "25%", "50%", "100%"], answer: 1 },
        ],
      },

      /* 6. Molecular genetics */
      {
        id: "bio-molecular",
        title: "Molecular Genetics (DNA → Protein)",
        blurb: "DNA structure, transcription, and translation.",
        lesson: [
          { p: "**DNA** is a **double helix** made of repeating **nucleotides**. Each nucleotide has three parts: a **phosphate**, a **sugar**, and a **nitrogen base** (A, T, G, C)." },
          { p: "Bases pair up: **A–T** and **G–C** (in RNA, A pairs with **U** instead of T). There are **5 bases total**: A, T, G, C, and **U** (which replaces T in RNA)." },
          { h: "DNA's three processes" },
          { defs: [
            ["Replication", "Making a **perfect copy** of DNA. It happens **before a cell divides** so each new cell gets a full set. You don't need the steps — just what it does and when. **Errors in replication = mutations**, which can create new traits (the link to evolution)."],
            ["Transcription", "Happens in the **nucleus**: DNA's information is copied into **mRNA**."],
            ["Translation", "Happens in the **cytoplasm** at the **ribosome**: it reads the mRNA, and **tRNA** brings the matching **amino acids** to build a protein."],
          ] },
          { h: "Codons & the codon wheel" },
          { defs: [
            ["Codon", "3 **mRNA** bases that code for one amino acid (e.g., **AUG = Met / Start**)."],
            ["Anticodon", "The matching 3 bases on **tRNA**. The anticodon of the codon **AUG** is **UAC** (A↔U, U↔A, G↔C)."],
          ] },
          { tip: "**Teacher's exact question types:** *DNA CTC → its mRNA is GAG*; *mRNA codon AUG → anticodon UAC*; *codon AUG → amino acid Met*. Practice reading across DNA → mRNA → tRNA → amino acid. **Transcription** = nucleus (DNA→mRNA); **Translation** = ribosome (mRNA→protein)." },
        ],
        visual: {
          type: "flow", cap: "Central dogma (DNA → protein)",
          steps: [
            { i: "🧬", n: "DNA", d: "in the nucleus" },
            { i: "📝", n: "Transcription", d: "DNA → mRNA" },
            { i: "✉️", n: "mRNA", d: "carries the code" },
            { i: "🏭", n: "Translation", d: "ribosome + tRNA" },
            { i: "🔗", n: "Protein", d: "amino acids" },
          ],
        },
        cards: [
          { front: "What is the structure of DNA?", back: "A double helix made of repeating nucleotides (bases A, T, G, C)." },
          { front: "Three parts of a nucleotide", back: "Phosphate, sugar, and a nitrogen base." },
          { front: "DNA base pairing rules", back: "A–T and G–C (A–U in RNA)." },
          { front: "Transcription: where & what?", back: "In the nucleus; DNA is copied into mRNA." },
          { front: "Translation: where & what?", back: "In the cytoplasm at the ribosome; mRNA is read and tRNA brings amino acids to build a protein." },
          { front: "Codon", back: "A set of 3 mRNA bases coding for one amino acid." },
        ],
        questions: [
          { type: "mc", q: "Where does transcription take place and what does it produce?", choices: ["Cytoplasm; a protein", "Nucleus; mRNA from DNA", "Ribosome; tRNA", "Mitochondria; DNA"], answer: 1 },
          { type: "mc", q: "During translation, what brings the correct amino acid to the ribosome?", choices: ["DNA", "mRNA", "tRNA", "The nucleus"], answer: 2 },
          { type: "mc", q: "The three parts of a nucleotide are:", choices: ["phosphate, sugar, and a base", "nucleus, ribosome, and DNA", "A, T, and G only", "codon, gene, and protein"], answer: 0 },
          { type: "fill", q: "In DNA, the base A (adenine) always pairs with the base ____.", answers: ["T", "thymine"] },
          { type: "mc", q: "DNA's overall structure is best described as a:", choices: ["single strand", "double helix", "flat sheet", "branched tree"], answer: 1 },
          { type: "fill", q: "Translation happens at the ribosome in the ______ of the cell.", answers: ["cytoplasm"] },
        ],
      },

      /* 7. Evolution & natural selection */
      {
        id: "bio-evolution",
        title: "Evolution & Natural Selection",
        blurb: "How populations change: variation, selection, adaptation. (The most-tested topic.)",
        lesson: [
          { note: "**This section has the most questions on the final.** Don't just memorize the definition — understand how natural selection *works*." },
          { defs: [
            ["Evolution", "The **gradual change in a species over time**, most often driven by natural selection."],
            ["Natural selection", "The environment, through **selection pressures**, 'picks' the **best traits**. Survivors reproduce and pass those traits on. Worked out by **Charles Darwin**."],
            ["Adaptation", "The result of a **mutation**: a trait that helps an organism survive better. Can be **physical** (a shape) **or behavioral** (e.g., junco *boldness*) or **chemical** (rats *processing poison*)."],
            ["Selection pressure", "A change in the environment that causes certain traits to be **selected over others**."],
            ["Population bottleneck", "A population crashes to a few individuals then rebounds, slashing genetic variation (the **Florida Panther**). Change **not** driven by natural selection."],
            ["Founder effect", "A **few** individuals start a new population (e.g., an animal reaching an **island**); their offspring all descend from those few, so diversity is low. Also **not** driven by selection."],
          ] },
          { h: "The single most important idea" },
          { p: "**Natural selection does NOT create new traits.** New traits appear **randomly through mutations**. Nature only **selects the best version of what already exists.** *Giraffes didn't grow longer necks because they needed to — some already had longer necks, those survived and reproduced, and mutations pushed them further.* Same with the **rats**: poison-resistance existed (by mutation) *before* the poison; once people added poison, the resistant ones survived and the trait spread." },
          { tip: "**Evolution is the OUTCOME; natural selection is the MECHANISM.** Natural selection does the work; evolution is the result." },
          { h: "The 4 requirements for natural selection" },
          { olist: [
            "**Variation** — individuals differ (and the difference must *matter*: eye color is just blue/brown/green, so nature doesn't select for it).",
            "**Inheritance** — those variations can be passed to offspring.",
            "**Overproduction** — more offspring are born than can survive on the resources (the **sea-turtle** example).",
            "**Differential survival** — the best-fit variations survive and reproduce more ('survival of the fittest').",
          ] },
          { tip: "Know the **3 case studies** and their pressure → outcome: **hawksbeard** (habitat fragmentation → heavier seeds that drop straight down), **juncos** (cities/people → boldness), **rats** (poison → resistance). There are for-sure questions on these, plus a reading passage with questions." },
        ],
        visual: {
          type: "table", cap: "Three real case studies (selection pressure → adaptation)",
          head: ["Organism", "Selection pressure", "Adaptation that survived"],
          rows: [
            ["Hawksbeard plant", "Habitat fragmentation", "More **non-feathery seeds** that drop straight down & root"],
            ["Juncos (birds)", "Humans & buildings", "**Boldness**, bold birds get food in cities"],
            ["Rats", "Poison", "A DNA **mutation** making them poison-resistant"],
          ],
        },
        cards: [
          { front: "Evolution", back: "The gradual change in a species over time, driven by natural selection." },
          { front: "Natural selection", back: "Nature selecting the best-fit traits; survivors reproduce and pass traits on." },
          { front: "Adaptation", back: "A beneficial trait (from a mutation) selected for by natural selection." },
          { front: "Selection pressure", back: "An environmental change that causes certain traits to be selected over others." },
          { front: "Population bottleneck", back: "A population crash then rebound → reduced genetic variation." },
          { front: "Resilience", back: "The ability of an organism/ecosystem to bounce back after a disturbance." },
          { front: "The 4 parts of natural selection", back: "Variation, inheritance, overproduction (more offspring than resources), differential survival." },
        ],
        questions: [
          { type: "mc", q: "Which best defines evolution?", choices: ["A sudden change in one organism", "The gradual change in a species over time by natural selection", "When an animal learns a new behavior", "The death of a population"], answer: 1 },
          { type: "mc", q: "A change in the environment that causes certain traits to be favored is called a:", choices: ["mutation", "selection pressure", "bottleneck", "phenotype"], answer: 1 },
          { type: "mc", q: "Which is NOT one of the four components of natural selection?", choices: ["Variation among individuals", "Inheritance of traits", "Every individual survives equally", "More offspring than can survive"], answer: 2, explain: "Survival is NOT equal, that's the whole point (differential survival)." },
          { type: "mc", q: "When a population crashes to a small size and then rebounds with less genetic variation, this is a:", choices: ["population bottleneck", "adaptation", "selection pressure", "resilience"], answer: 0 },
          { type: "fill", q: "A beneficial trait that is selected for by natural selection is called an ______.", answers: ["adaptation"] },
          { type: "tf", q: "Adaptations are originally created by mutations.", answer: true },
        ],
      },

      /* 8. Lizard / applied natural selection */
      {
        id: "bio-lizards",
        title: "Applying Selection: The Sky-Island Lizards",
        blurb: "Geographic isolation, speciation, and reproductive barriers.",
        lesson: [
          { p: "Two lizard populations were split when **volcanic eruptions created impassable lava trenches** (geographic isolation). Over time they became two species:" },
          { defs: [
            ["Lichen (Light) Anoles", "On lush **Mount Verde**, pale, mottled skin camouflages against lichen."],
            ["Dusk Anoles", "On dark **Mount Umbra**, solid dark skin camouflages against dark volcanic bark. The dark bark was a **selective advantage** for darker lizards."],
            ["Geographic isolation", "A **physical divide** that keeps two populations from reaching each other to mate."],
            ["Reproductive barrier", "The two now have **different dewlap (throat-flap) colors**, so they won't respond to each other's mating display, keeping them separate species."],
          ] },
          { p: "**Hybrids** have patchy coloring that camouflages on **neither** mountain, so predators spot them easily → they don't survive. Their DNA is **98% identical**, meaning the two species **recently diverged from a common ancestor**." },
          { tip: "Big idea: the environment **'selected' the individuals whose traits best matched their specific habitat**, that's natural selection in action." },
        ],
        visual: {
          type: "compare", cap: "Two species, one ancestor",
          left: { h: "Lichen Anole (Mt. Verde)", items: ["Pale, mottled skin", "Hides on lichen", "Distinct dewlap color"] },
          right: { h: "Dusk Anole (Mt. Umbra)", items: ["Solid dark skin", "Hides on dark bark", "Different dewlap color"] },
        },
        cards: [
          { front: "What originally isolated the two lizard populations?", back: "Volcanic eruptions created impassable lava trenches (geographic isolation)." },
          { front: "Why did Dusk Anoles evolve dark colors?", back: "The dark bark on Mount Umbra gave darker lizards a selective (camouflage) advantage." },
          { front: "Different dewlap colors keeping species apart is an example of…", back: "A reproductive barrier." },
          { front: "Why can't hybrids survive well?", back: "Their patchy color camouflages on neither mountain → predators spot them easily." },
          { front: "DNA 98% identical means…", back: "The two species recently diverged from a common ancestor." },
          { front: "Geographic isolation", back: "A physical divide that prevents two populations from reaching one another to mate." },
        ],
        questions: [
          { type: "mc", q: "One species lived across a whole region until a barrier split its habitat in two, and over time each side became its own species. Which event would cause that kind of split?", choices: ["A season with plenty of food", "A new river or lava flow divides the habitat", "All members living close together", "A shared mating call"], answer: 1, explain: "A physical barrier that cannot be crossed isolates the groups (geographic isolation)." },
          { type: "mc", q: "Two populations are separated by a physical barrier and can never reach each other to mate. What is this called?", choices: ["A population bottleneck", "Geographic isolation", "An adaptation", "A mutation"], answer: 1 },
          { type: "mc", q: "Two related lizard groups now use different throat-flap colors in their mating displays, so they no longer recognize or mate with each other. This difference acts as a:", choices: ["Selection pressure", "Reproductive barrier", "Geographic isolation", "Population bottleneck"], answer: 1, explain: "Anything that stops two groups from successfully mating is a reproductive barrier." },
          { type: "mc", q: "On a dark mountain, dark lizards blend in; on a pale mountain, pale lizards blend in. A patchy, in-between lizard would most likely:", choices: ["Blend in better than both", "Be easily spotted by predators on either mountain", "Grow much larger", "Live longer than the others"], answer: 1, explain: "The intermediate form is camouflaged on neither habitat, so it's selected against." },
          { type: "mc", q: "Two separate lizard species share about 98% of their DNA. This most strongly suggests they:", choices: ["Are completely unrelated", "Recently shared a common ancestor", "Are actually one species", "Were bred by humans"], answer: 1 },
        ],
      },

      /* 9. Body systems */
      {
        id: "bio-systems",
        title: "Human Body Systems",
        blurb: "The job of each major organ system.",
        lesson: [
          { p: "Each body system has a specific function. Know what each one **does**." },
          { defs: [
            ["Digestive", "Breaks down food, absorbs nutrients, removes food waste."],
            ["Circulatory (Cardiac)", "Moves blood, nutrients, hormones, and immune cells around the body."],
            ["Respiratory", "Gas exchange, brings **oxygen in** and lets **carbon dioxide out**."],
            ["Excretory", "Filters blood and makes/stores/removes **urine**."],
            ["Immune", "Fights off foreign invaders (pathogens)."],
            ["Nervous", "**Controls** all the other body systems."],
            ["Muscular", "Creates **movement** with muscles."],
            ["Skeletal", "Provides structure, stores nutrients, makes blood, protects organs."],
            ["Integumentary", "The body's **covering** (skin), protects, regulates temperature, gives sensory info."],
            ["Lymphatic", "A **drainage system** for cells and tissues."],
          ] },
          { tip: "The **nervous** system is the boss, it **controls** every other system." },
        ],
        visual: {
          type: "table", cap: "System → function",
          head: ["System", "Main job"],
          rows: [
            ["Digestive", "Break down food, absorb nutrients"],
            ["Circulatory", "Transport blood/nutrients/hormones"],
            ["Respiratory", "Gas exchange (O₂ in, CO₂ out)"],
            ["Excretory", "Filter blood, make & remove urine"],
            ["Nervous", "Controls all other systems"],
            ["Skeletal", "Structure, protection, makes blood"],
            ["Integumentary", "Skin: protect, regulate temp, sense"],
          ],
        },
        cards: [
          { front: "Respiratory system", back: "Gas exchange: brings oxygen in, removes carbon dioxide." },
          { front: "Nervous system", back: "Controls all of the other body systems." },
          { front: "Skeletal system", back: "Provides structure, stores nutrients, makes blood, protects organs." },
          { front: "Excretory system", back: "Filters blood and makes, stores, and removes urine." },
          { front: "Integumentary system", back: "The skin: protects, regulates temperature, provides sensory info." },
          { front: "Circulatory system", back: "Moves blood, nutrients, hormones, and immune cells around the body." },
          { front: "Lymphatic system", back: "A drainage system for cells and tissues." },
        ],
        questions: [
          { type: "mc", q: "Which system controls all of the other body systems?", choices: ["Circulatory", "Nervous", "Skeletal", "Lymphatic"], answer: 1 },
          { type: "mc", q: "The respiratory system is responsible for:", choices: ["filtering blood into urine", "gas exchange (oxygen in, carbon dioxide out)", "fighting infections", "creating movement"], answer: 1 },
          { type: "mc", q: "Which system provides structure, protects organs, and helps make blood?", choices: ["Muscular", "Skeletal", "Integumentary", "Excretory"], answer: 1 },
          { type: "fill", q: "The ____ system is the skin, it protects the body and regulates temperature.", answers: ["integumentary"] },
          { type: "mc", q: "Filtering blood and removing waste as urine is the job of the ____ system.", choices: ["digestive", "excretory", "respiratory", "immune"], answer: 1 },
        ],
      },

      /* 10. Heart & digestion organs */
      {
        id: "bio-heart",
        title: "The Heart & Digestive Organs",
        blurb: "Blood flow through the 4-chambered heart and what each digestive organ does.",
        lesson: [
          { p: "The heart has **4 chambers**: two **atria** (top) and two **ventricles** (bottom), with valves between them." },
          { h: "Path of blood (one full loop)" },
          { olist: [
            "Body → **vena cava** → **right atrium**",
            "→ tricuspid valve → **right ventricle** → pulmonary valve → **pulmonary artery** → **lungs** (picks up O₂)",
            "→ **pulmonary vein** → **left atrium** → mitral valve → **left ventricle**",
            "→ aortic valve → **aorta** → out to the body",
          ] },
          { tip: "**Arteries** carry blood **A**way from the heart. The **pulmonary artery** is special, it carries *deoxygenated* blood to the lungs; the **pulmonary vein** brings *oxygenated* blood back." },
          { h: "Digestive organs" },
          { defs: [
            ["Esophagus", "Moves food from the mouth to the stomach."],
            ["Stomach", "Chemically digests food with acid and enzymes."],
            ["Liver", "Produces **bile** to digest fat."],
            ["Gallbladder", "**Stores** bile."],
            ["Pancreas", "Produces digestive **enzymes**."],
            ["Small intestine", "Breaks food down further and **absorbs nutrients**."],
            ["Large intestine", "Houses bacteria, finishes digestion, **absorbs water**."],
          ] },
        ],
        visual: {
          type: "flow", cap: "Blood flow through the heart",
          steps: [
            { i: "🫀", n: "Right atrium", d: "from body (vena cava)" },
            { i: "⬇️", n: "Right ventricle", d: "→ lungs" },
            { i: "🫁", n: "Lungs", d: "gets oxygen" },
            { i: "⬆️", n: "Left atrium", d: "from lungs" },
            { i: "💪", n: "Left ventricle", d: "→ aorta → body" },
          ],
        },
        cards: [
          { front: "Name the 4 chambers of the heart.", back: "Right atrium, left atrium, right ventricle, left ventricle." },
          { front: "Which vessel carries blood out to the body?", back: "The aorta (from the left ventricle)." },
          { front: "Which vessel carries blood from the heart to the lungs?", back: "The pulmonary artery." },
          { front: "Do arteries carry blood toward or away from the heart?", back: "Away from the heart." },
          { front: "Liver vs. gallbladder", back: "The liver PRODUCES bile; the gallbladder STORES it." },
          { front: "Where are most nutrients absorbed?", back: "The small intestine." },
          { front: "What does the large intestine absorb?", back: "Water (and houses bacteria that finish digestion)." },
        ],
        questions: [
          { type: "mc", q: "Which blood vessel carries oxygen-rich blood out of the heart to the body?", choices: ["Vena cava", "Pulmonary artery", "Aorta", "Pulmonary vein"], answer: 2 },
          { type: "mc", q: "The two upper chambers of the heart are the:", choices: ["ventricles", "atria", "valves", "arteries"], answer: 1 },
          { type: "mc", q: "Which organ produces bile to help digest fat?", choices: ["Gallbladder", "Liver", "Stomach", "Pancreas"], answer: 1 },
          { type: "mc", q: "The gallbladder's main job is to:", choices: ["produce enzymes", "store bile", "absorb water", "filter blood"], answer: 1 },
          { type: "fill", q: "Most nutrients are absorbed in the ____ intestine.", answers: ["small"] },
          { type: "mc", q: "Arteries always carry blood ____ the heart.", choices: ["toward", "away from", "in circles within", "out of the lungs to"], answer: 1, explain: "Arteries carry blood Away (A-A)." },
        ],
      },
    ],
  });
})(window.STUDY);
