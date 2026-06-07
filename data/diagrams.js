/* data/diagrams.js — image-occlusion diagrams (label-the-part recall).
   Each diagram has an inline SVG and parts with x/y as % of the SVG box.
   Used by QUIZ.runDiagram (Biology "Label It"). */
(function (STUDY) {
  "use strict";
  STUDY.DIAGRAMS = STUDY.DIAGRAMS || [];

  // --- Nucleotide (DNA building block) ---
  STUDY.DIAGRAMS.push({
    id: "nucleotide", subjectId: "biology", topicId: "bio-molecular", title: "Parts of a Nucleotide",
    svg:
      "<svg viewBox='0 0 220 130' xmlns='http://www.w3.org/2000/svg'>" +
      "<rect x='0' y='0' width='220' height='130' rx='14' fill='#f6f7fc'/>" +
      "<line x1='52' y1='52' x2='95' y2='78' stroke='#777' stroke-width='3'/>" +
      "<line x1='118' y1='84' x2='150' y2='70' stroke='#777' stroke-width='3'/>" +
      "<circle cx='46' cy='46' r='20' fill='#ff9f43'/>" +
      "<text x='46' y='50' font-size='11' text-anchor='middle' fill='#3a2400' font-family='system-ui'>PO₄</text>" +
      "<polygon points='106,62 126,72 122,94 90,94 86,72' fill='#54a0ff'/>" +
      "<text x='106' y='86' font-size='10' text-anchor='middle' fill='#06224a' font-family='system-ui'>sugar</text>" +
      "<rect x='150' y='54' width='52' height='30' rx='6' fill='#1dd1a1'/>" +
      "<text x='176' y='73' font-size='10' text-anchor='middle' fill='#04332a' font-family='system-ui'>A·T·G·C</text>" +
      "</svg>",
    parts: [
      { x: 21, y: 35, label: "phosphate", aliases: ["phosphate group", "po4"], note: " The phosphate group is part of the backbone." },
      { x: 48, y: 66, label: "sugar", aliases: ["deoxyribose", "5-carbon sugar"], note: " The sugar (deoxyribose) joins the phosphate and base." },
      { x: 80, y: 53, label: "nitrogen base", aliases: ["base", "nitrogenous base"], note: " The base (A, T, G, or C) carries the code." },
    ],
  });

  // --- Four-chambered heart (schematic) ---
  STUDY.DIAGRAMS.push({
    id: "heart", subjectId: "biology", topicId: "bio-heart", title: "The Four-Chambered Heart",
    svg:
      "<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'>" +
      "<rect x='0' y='0' width='200' height='200' rx='16' fill='#f6f7fc'/>" +
      "<rect x='40' y='40' width='120' height='130' rx='18' fill='#ffe0e6' stroke='#c0392b' stroke-width='2'/>" +
      "<line x1='100' y1='42' x2='100' y2='168' stroke='#c0392b' stroke-width='2'/>" +
      "<line x1='42' y1='104' x2='158' y2='104' stroke='#c0392b' stroke-width='2'/>" +
      "<rect x='104' y='8' width='14' height='40' rx='5' fill='#c0392b'/>" +   /* aorta */
      "<rect x='52' y='10' width='13' height='36' rx='5' fill='#2c6fbf'/>" +   /* vena cava */
      "<text x='70' y='76' font-size='9' text-anchor='middle' fill='#7a1f16' font-family='system-ui'>RA</text>" +
      "<text x='130' y='76' font-size='9' text-anchor='middle' fill='#7a1f16' font-family='system-ui'>LA</text>" +
      "<text x='70' y='140' font-size='9' text-anchor='middle' fill='#7a1f16' font-family='system-ui'>RV</text>" +
      "<text x='130' y='140' font-size='9' text-anchor='middle' fill='#7a1f16' font-family='system-ui'>LV</text>" +
      "</svg>",
    parts: [
      { x: 35, y: 37, label: "right atrium", aliases: ["ra"], note: " Receives blood from the body (note: anatomical right = your left as you look at it)." },
      { x: 65, y: 37, label: "left atrium", aliases: ["la"], note: " Receives oxygen-rich blood from the lungs." },
      { x: 35, y: 70, label: "right ventricle", aliases: ["rv"], note: " Pumps blood to the lungs." },
      { x: 65, y: 70, label: "left ventricle", aliases: ["lv"], note: " Pumps blood out to the body." },
      { x: 55, y: 12, label: "aorta", aliases: [], note: " The big artery carrying blood to the body." },
      { x: 29, y: 13, label: "vena cava", aliases: ["superior vena cava", "inferior vena cava"], note: " Returns blood from the body to the heart." },
    ],
  });

  // --- Chromosome ---
  STUDY.DIAGRAMS.push({
    id: "chromosome", subjectId: "biology", topicId: "bio-chromosome", title: "Parts of a Chromosome",
    svg:
      "<svg viewBox='0 0 160 180' xmlns='http://www.w3.org/2000/svg'>" +
      "<rect x='0' y='0' width='160' height='180' rx='14' fill='#f6f7fc'/>" +
      "<path d='M55 25 C40 60 40 120 55 160 L72 160 C60 120 60 60 72 25 Z' fill='#9b59b6'/>" +
      "<path d='M105 25 C120 60 120 120 105 160 L88 160 C100 120 100 60 88 25 Z' fill='#9b59b6'/>" +
      "<ellipse cx='80' cy='90' rx='34' ry='12' fill='#6c3483'/>" +
      "<rect x='49' y='120' width='14' height='16' rx='3' fill='#f1c40f'/>" +
      "</svg>",
    parts: [
      { x: 50, y: 50, label: "chromatid", aliases: ["sister chromatid", "chromatids"], note: " The two identical copies that make up the chromosome." },
      { x: 50, y: 50, label: "centromere", aliases: [], note: " Holds the two chromatids together (the pinched middle)." },
      { x: 35, y: 71, label: "gene", aliases: [], note: " A segment of DNA that codes for a trait." },
    ],
  });
  // fix the duplicate-coordinate on the chromosome (centromere is centre)
  STUDY.DIAGRAMS[STUDY.DIAGRAMS.length - 1].parts[0] = { x: 38, y: 32, label: "chromatid", aliases: ["sister chromatid", "chromatids"], note: " The two identical copies that make up the chromosome." };
})(window.STUDY);
