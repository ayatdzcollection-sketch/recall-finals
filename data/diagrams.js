/* data/diagrams.js — image-occlusion diagrams (label-the-part recall).
   Detailed, original textbook-style SVGs (color-coded). Each part has x/y as
   % of the SVG box. Used by QUIZ.runDiagram (Biology "Label It"). */
(function (STUDY) {
  "use strict";
  STUDY.DIAGRAMS = STUDY.DIAGRAMS || [];

  /* ---------------- Four-chambered heart (cross-section) ---------------- */
  STUDY.DIAGRAMS.push({
    id: "heart", subjectId: "biology", topicId: "bio-heart", title: "The Four-Chambered Heart",
    svg:
      "<svg viewBox='0 0 300 320' xmlns='http://www.w3.org/2000/svg'>" +
      "<rect width='300' height='320' rx='16' fill='#f7f8fc'/>" +
      // great vessels (behind muscle)
      "<path d='M168 70 C168 28 120 20 104 52' fill='none' stroke='#d23b35' stroke-width='15' stroke-linecap='round'/>" +   // aorta arch
      "<path d='M150 78 C140 44 186 36 214 52' fill='none' stroke='#3f78c2' stroke-width='12' stroke-linecap='round'/>" +    // pulmonary artery
      "<rect x='70' y='22' width='20' height='80' rx='10' fill='#3f78c2'/>" +     // superior vena cava
      "<rect x='72' y='232' width='18' height='66' rx='9' fill='#3f78c2'/>" +     // inferior vena cava
      "<rect x='206' y='96' width='40' height='14' rx='7' fill='#d23b35'/>" +     // pulmonary veins
      "<rect x='206' y='120' width='40' height='14' rx='7' fill='#d23b35'/>" +
      // myocardium (heart muscle body)
      "<path d='M150 78 C108 56 64 70 66 116 C50 168 70 250 150 292 C230 250 250 168 234 116 C236 70 192 56 150 78 Z' fill='#e07a82' stroke='#b34a52' stroke-width='3'/>" +
      // chambers
      "<path d='M150 96 C120 84 86 92 88 124 C90 146 120 150 150 146 Z' fill='#cfe0f5' stroke='#9fb8d8' stroke-width='1.5'/>" +   // right atrium
      "<path d='M150 96 C180 84 214 92 212 124 C210 146 180 150 150 146 Z' fill='#f4ced3' stroke='#d8a6ad' stroke-width='1.5'/>" + // left atrium
      "<path d='M150 156 C116 154 92 168 96 210 C99 240 122 262 150 274 Z' fill='#cfe0f5' stroke='#9fb8d8' stroke-width='1.5'/>" + // right ventricle
      "<path d='M150 156 C184 154 210 168 206 212 C202 244 178 264 150 274 Z' fill='#f4ced3' stroke='#d8a6ad' stroke-width='2.5'/>" + // left ventricle (thicker)
      "<line x1='150' y1='92' x2='150' y2='276' stroke='#b34a52' stroke-width='5'/>" +   // septum
      // valves
      "<ellipse cx='120' cy='152' rx='12' ry='5' fill='#fff' stroke='#7a8aa6' stroke-width='1.5'/>" +
      "<ellipse cx='180' cy='152' rx='12' ry='5' fill='#fff' stroke='#7a8aa6' stroke-width='1.5'/>" +
      "<ellipse cx='150' cy='90' rx='9' ry='4' fill='#fff' stroke='#7a8aa6' stroke-width='1.3' transform='rotate(-20 150 90)'/>" +
      "</svg>",
    parts: [
      { x: 27, y: 13, label: "superior vena cava", aliases: ["svc", "vena cava"], note: " Returns oxygen-poor blood from the upper body to the right atrium." },
      { x: 38, y: 13, label: "aorta", aliases: [], note: " The largest artery — carries oxygen-rich blood out to the body." },
      { x: 64, y: 15, label: "pulmonary artery", aliases: ["pulmonary trunk"], note: " Carries oxygen-poor blood from the right ventricle to the lungs." },
      { x: 78, y: 33, label: "pulmonary vein", aliases: ["pulmonary veins"], note: " Brings oxygen-rich blood from the lungs to the left atrium." },
      { x: 37, y: 37, label: "right atrium", aliases: ["ra"], note: " Receives blood from the body (it's on your left as you look at the diagram)." },
      { x: 62, y: 37, label: "left atrium", aliases: ["la"], note: " Receives oxygen-rich blood from the lungs." },
      { x: 39, y: 67, label: "right ventricle", aliases: ["rv"], note: " Pumps blood to the lungs." },
      { x: 60, y: 70, label: "left ventricle", aliases: ["lv"], note: " The thick-walled chamber that pumps blood to the whole body." },
      { x: 40, y: 47, label: "tricuspid valve", aliases: ["tricuspid"], note: " Between the right atrium and right ventricle." },
      { x: 60, y: 47, label: "mitral valve", aliases: ["bicuspid valve", "mitral", "bicuspid"], note: " Between the left atrium and left ventricle." },
      { x: 27, y: 83, label: "inferior vena cava", aliases: ["ivc"], note: " Returns blood from the lower body to the right atrium." },
    ],
  });

  /* ---------------- Nucleotide ---------------- */
  STUDY.DIAGRAMS.push({
    id: "nucleotide", subjectId: "biology", topicId: "bio-molecular", title: "Parts of a Nucleotide",
    svg:
      "<svg viewBox='0 0 300 200' xmlns='http://www.w3.org/2000/svg'>" +
      "<rect width='300' height='200' rx='16' fill='#f7f8fc'/>" +
      "<line x1='66' y1='96' x2='128' y2='118' stroke='#9aa3bd' stroke-width='4'/>" +
      "<line x1='168' y1='112' x2='208' y2='98' stroke='#9aa3bd' stroke-width='4'/>" +
      // phosphate group
      "<circle cx='58' cy='86' r='26' fill='#ff9f43' stroke='#d97e1f' stroke-width='2'/>" +
      "<circle cx='58' cy='52' r='9' fill='#ffd9a8'/><circle cx='30' cy='98' r='9' fill='#ffd9a8'/><circle cx='40' cy='58' r='9' fill='#ffd9a8'/>" +
      "<text x='58' y='91' font-size='15' text-anchor='middle' fill='#5a3200' font-family='system-ui' font-weight='700'>P</text>" +
      // 5-carbon sugar (pentagon ring)
      "<polygon points='148,92 178,112 168,146 128,146 118,112' fill='#7ab8ff' stroke='#3f78c2' stroke-width='2'/>" +
      "<text x='148' y='130' font-size='12' text-anchor='middle' fill='#0a2747' font-family='system-ui'>sugar</text>" +
      // nitrogen base (double ring)
      "<rect x='206' y='70' width='66' height='58' rx='10' fill='#1dd1a1' stroke='#119c77' stroke-width='2'/>" +
      "<text x='239' y='104' font-size='12' text-anchor='middle' fill='#063a2d' font-family='system-ui'>A T G C</text>" +
      "</svg>",
    parts: [
      { x: 19, y: 43, label: "phosphate", aliases: ["phosphate group", "po4"], note: " Part of the DNA backbone." },
      { x: 49, y: 60, label: "sugar", aliases: ["deoxyribose", "5-carbon sugar"], note: " The 5-carbon sugar (deoxyribose) links the phosphate and base." },
      { x: 80, y: 49, label: "nitrogen base", aliases: ["base", "nitrogenous base"], note: " A, T, G, or C — this carries the genetic code." },
    ],
  });

  /* ---------------- Duplicated chromosome ---------------- */
  STUDY.DIAGRAMS.push({
    id: "chromosome", subjectId: "biology", topicId: "bio-chromosome", title: "Parts of a Chromosome",
    svg:
      "<svg viewBox='0 0 200 280' xmlns='http://www.w3.org/2000/svg'>" +
      "<rect width='200' height='280' rx='16' fill='#f7f8fc'/>" +
      // left sister chromatid
      "<path d='M62 30 C44 60 44 110 60 128 C44 150 44 210 62 250 C70 256 84 256 92 250 C78 210 78 150 92 128 C78 110 78 60 92 30 C84 24 70 24 62 30 Z' fill='#9b59b6' stroke='#6c3483' stroke-width='2'/>" +
      // right sister chromatid
      "<path d='M108 30 C122 60 122 110 108 128 C122 150 122 210 108 250 C116 256 130 256 138 250 C156 210 156 150 140 128 C156 110 156 60 138 30 C130 24 116 24 108 30 Z' fill='#9b59b6' stroke='#6c3483' stroke-width='2'/>" +
      // centromere (constriction band)
      "<rect x='58' y='120' width='84' height='18' rx='6' fill='#6c3483'/>" +
      // a gene band
      "<rect x='62' y='180' width='30' height='16' rx='4' fill='#f1c40f' stroke='#b8930a' stroke-width='1.5'/>" +
      // telomere caps
      "<ellipse cx='77' cy='30' rx='17' ry='8' fill='#d2b4de'/><ellipse cx='123' cy='30' rx='17' ry='8' fill='#d2b4de'/>" +
      "</svg>",
    parts: [
      { x: 38, y: 25, label: "telomere", aliases: ["telomeres", "tip", "end cap"], note: " The protective cap at the end of a chromosome." },
      { x: 30, y: 60, label: "chromatid", aliases: ["sister chromatid", "chromatids"], note: " One of the two identical copies that make up a duplicated chromosome." },
      { x: 50, y: 46, label: "centromere", aliases: [], note: " The pinched region that holds the two chromatids together." },
      { x: 39, y: 67, label: "gene", aliases: [], note: " A segment of DNA that codes for a specific trait." },
    ],
  });
})(window.STUDY);
