/* data/pedigrees.js — real pedigree-chart practice for Biology (bio-pedigree).
   These are normal authored MC questions that carry a `fig` (an SVG pedigree)
   rendered above the stem by QUIZ. Standard pedigree conventions:
     square = male, circle = female, shaded = shows the trait,
     horizontal line = a mating pair, vertical line down = their children.
   Appended via addAuthored, so they get fresh bio-pedigree ids and never touch
   existing progress. */
(function (STUDY) {
  "use strict";
  if (!STUDY || typeof STUDY.addAuthored !== "function") return;

  const INK = "#34406b";       // outline + connector colour
  const FILL = "#34406b";      // shaded = shows the trait

  // ---- tiny SVG pedigree builder -------------------------------------------
  function square(x, y, shaded, id) {
    let s = "<rect x='" + (x - 13) + "' y='" + (y - 13) + "' width='26' height='26' " +
            "fill='" + (shaded ? FILL : "#fff") + "' stroke='" + INK + "' stroke-width='2.5'/>";
    if (id) s += label(x, y + 27, id);
    return s;
  }
  function circle(x, y, shaded, id) {
    let s = "<circle cx='" + x + "' cy='" + y + "' r='14' " +
            "fill='" + (shaded ? FILL : "#fff") + "' stroke='" + INK + "' stroke-width='2.5'/>";
    if (id) s += label(x, y + 28, id);
    return s;
  }
  function label(x, y, t) {
    return "<text x='" + x + "' y='" + y + "' font-size='10.5' text-anchor='middle' " +
           "fill='#555' font-family='system-ui'>" + t + "</text>";
  }
  function gen(x, y, t) {
    return "<text x='" + x + "' y='" + y + "' font-size='12' text-anchor='middle' " +
           "fill='#999' font-family='system-ui' font-weight='700'>" + t + "</text>";
  }
  function line(x1, y1, x2, y2) {
    return "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 +
           "' stroke='" + INK + "' stroke-width='2'/>";
  }
  function legend(w, y) {
    return "<text x='" + (w / 2) + "' y='" + y + "' font-size='10' text-anchor='middle' " +
           "fill='#777' font-family='system-ui'>shaded = shows the trait · □ male · ○ female</text>";
  }
  function svg(w, h, body) {
    return "<svg viewBox='0 0 " + w + " " + h + "' xmlns='http://www.w3.org/2000/svg'>" +
           "<rect width='" + w + "' height='" + h + "' rx='12' fill='#f7f8fc'/>" + body + "</svg>";
  }

  // ---- Pedigree A: two unaffected parents, one affected child (recessive) ----
  const PED_A = svg(260, 205,
    gen(20, 50, "I") + gen(20, 112, "II") +
    // generation I (parents), neither shaded
    square(95, 46, false, "I-1") + circle(165, 46, false, "I-2") +
    line(108, 46, 151, 46) +              // mating line
    line(130, 46, 130, 78) +              // drop to sibship
    // sibship bar to the two children
    line(100, 78, 160, 78) +
    line(100, 78, 100, 95) + line(160, 78, 160, 95) +
    // generation II (children): II-1 affected
    square(100, 108, true, "II-1") + circle(160, 108, false, "II-2") +
    legend(260, 196));

  // ---- Pedigree B: trait skips a generation (3 generations, recessive) -------
  const PED_B = svg(260, 215,
    gen(18, 46, "I") + gen(18, 100, "II") + gen(18, 154, "III") +
    // generation I: affected grandfather x unaffected grandmother
    square(110, 42, true, "I-1") + circle(180, 42, false, "I-2") +
    line(123, 42, 166, 42) +              // mating line
    line(145, 42, 145, 82) +              // straight drop to single child II-1
    // generation II: daughter (carrier) x her spouse (known carrier)
    circle(145, 96, false, "II-1") + square(205, 96, false, "II-2") +
    line(159, 96, 192, 96) +              // mating line
    line(175, 96, 175, 124) +             // drop to sibship
    line(150, 124, 200, 124) +
    line(150, 124, 150, 137) + line(200, 124, 200, 137) +
    // generation III: one affected child
    square(150, 150, true, "III-1") + circle(200, 150, false, "III-2") +
    legend(260, 206));

  STUDY.addAuthored("bio-pedigree", [
    // ---- Pedigree A questions ----
    { type: "mc", fig: PED_A, lvl: 2, concept: "recessive-read",
      q: "Parents I-1 and I-2 do NOT show the trait, but their son II-1 DOES. The trait must be:",
      choices: ["dominant", "recessive", "impossible to inherit", "passed only from the mother"], answer: 1,
      explain: "Two unaffected parents with an affected child means the trait is recessive (it was hidden in both parents)." },
    { type: "mc", fig: PED_A, lvl: 2, concept: "carrier-read",
      q: "Since neither parent shows the trait yet their child does, the genotypes of I-1 and I-2 must both be:",
      choices: ["TT (homozygous dominant)", "Tt (carriers)", "tt (affected)", "one TT and one tt"], answer: 1,
      explain: "Each parent had to carry a hidden recessive allele to pass it on, so both are Tt carriers." },
    { type: "mc", fig: PED_A, lvl: 2, concept: "genotype-read",
      q: "Individual II-1 is the shaded square and shows the recessive trait. Its genotype is:",
      choices: ["TT", "Tt", "tt", "cannot be determined"], answer: 2,
      explain: "A recessive trait only appears with two recessive alleles, so II-1 is tt." },
    { type: "mc", fig: PED_A, lvl: 1, concept: "symbol-read",
      q: "In this chart, II-1 is drawn as a shaded SQUARE. That tells you II-1 is a:",
      choices: ["female who shows the trait", "male who shows the trait", "female carrier", "male who does not show the trait"], answer: 1,
      explain: "Square = male; shaded = shows the trait." },
    // ---- Pedigree B questions ----
    { type: "mc", fig: PED_B, lvl: 2, concept: "carrier-infer",
      q: "Grandfather I-1 is shaded, so he is affected (tt). His daughter II-1 is unshaded. Because she had to receive a recessive allele from him, II-1's genotype must be:",
      choices: ["TT", "Tt (carrier)", "tt", "cannot be determined"], answer: 1,
      explain: "An affected father (tt) gives every child one t. II-1 doesn't show the trait, so she is Tt, a carrier." },
    { type: "mc", fig: PED_B, lvl: 2, concept: "cross-prob",
      q: "II-1 (Tt) marries II-2, who is also a known carrier (Tt). What is the chance that any one of their children SHOWS the recessive trait?",
      choices: ["0%", "25%", "50%", "75%"], answer: 1,
      explain: "Tt × Tt = 1 TT : 2 Tt : 1 tt, so 25% are tt and show the trait." },
    { type: "mc", fig: PED_B, lvl: 2, concept: "skip-pattern",
      q: "The trait shows up in generation I and generation III but skips generation II. This skipping pattern is a classic sign of a ___ trait.",
      choices: ["dominant", "recessive", "male-only", "newly mutated"], answer: 1,
      explain: "Recessive traits can hide in carriers for a generation, then reappear, so they often skip generations." },
  ]);
})(window.STUDY);
