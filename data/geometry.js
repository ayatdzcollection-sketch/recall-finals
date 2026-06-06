/* GEOMETRY — from the "25-26 Final Exam Geometry Review Packet" (Ch 7–11).
   Lessons give the formula/method; questions use the packet's verified answers. */
(function (STUDY) {
  "use strict";
  STUDY.register({
    id: "geometry",
    name: "Geometry",
    icon: "📐",
    accent: "#ffb648",
    weight: 3,
    intro: "Quadrilaterals, similarity, right triangles and trig, circles, and the area, surface-area, and volume formulas. These are the five chapters on your final.",
    topics: [

      /* 1. Polygons & quadrilaterals */
      {
        id: "geo-quads",
        title: "Polygon Angles & Quadrilaterals",
        blurb: "Angle sums, parallelograms, trapezoids, and kites.",
        lesson: [
          { h: "Angle sums" },
          { list: [
            "Interior angles of any **n-gon** add to **(n − 2) · 180°**. A quadrilateral = **360°**.",
            "Each interior angle of a **regular** n-gon = **(n−2)·180 / n**; each exterior angle = **360 / n**.",
          ] },
          { example: "Hexagon (n=6): exterior = 360/6 = **60°**; interior = 180 − 60 = **120°**.", as: "Worked" },
          { h: "Parallelogram properties" },
          { list: ["Opposite sides **congruent**", "Opposite angles **congruent**", "Consecutive angles **supplementary** (add to 180°)", "Diagonals **bisect** each other"] },
          { h: "Trapezoids & kites" },
          { list: [
            "**Isosceles trapezoid:** legs are congruent; base angles are congruent.",
            "**Midsegment** of a trapezoid = **½(base₁ + base₂)**.",
            "**Kite:** two pairs of consecutive sides congruent; diagonals are **perpendicular**.",
          ] },
          { tip: "A property is true 'for a parallelogram' only if it holds for **every** parallelogram. 'All sides congruent' is **only** true for a rhombus, so it's *not* always true." },
        ],
        visual: {
          type: "table", cap: "Quadrilateral quick-reference",
          head: ["Figure", "Key property", "Useful formula"],
          rows: [
            ["Parallelogram", "Opp. sides & angles ≅", "consecutive ∠s = 180°"],
            ["Rectangle", "All angles 90°", "diagonals ≅"],
            ["Rhombus", "All sides ≅", "diagonals ⊥, area ½d₁d₂"],
            ["Isosceles trapezoid", "Legs ≅, base ∠s ≅", "midseg = ½(b₁+b₂)"],
            ["Kite", "2 pairs consec. sides ≅", "diagonals ⊥, area ½d₁d₂"],
          ],
        },
        cards: [
          { front: "Sum of the interior angles of a quadrilateral", back: "360°." },
          { front: "Each exterior angle of a regular n-gon", back: "360 / n." },
          { front: "Each interior angle of a regular hexagon", back: "120° (exterior 60°)." },
          { front: "Consecutive angles of a parallelogram are…", back: "Supplementary (add to 180°)." },
          { front: "Trapezoid midsegment formula", back: "½(base₁ + base₂)." },
          { front: "A kite's diagonals are…", back: "Perpendicular." },
        ],
        questions: [
          { type: "mc", q: "Three interior angles of a quadrilateral are 109°, 114°, and 75°. The fourth angle is:", choices: ["52°", "85°", "62°", "75°"], answer: 2, explain: "360 − (109+114+75) = 360 − 298 = 62°." },
          { type: "fill", q: "Each interior angle of a regular hexagon measures ____ degrees.", answers: ["120", "120°"], explain: "(6−2)·180/6 = 120°." },
          { type: "mc", q: "Opposite sides of a parallelogram are 3x+2 and 5x−10. Find x.", choices: ["3", "4", "5", "6"], answer: 3, explain: "3x+2 = 5x−10 → 12 = 2x → x = 6." },
          { type: "mc", q: "Which statement may NOT be true for every parallelogram?", choices: ["Opposite angles are congruent", "The diagonals bisect each other", "All sides are congruent", "Consecutive angles are supplementary"], answer: 2, explain: "All sides congruent is true only for a rhombus." },
          { type: "mc", q: "An isosceles trapezoid has a base angle of 72°. The angle next to it (along a leg) is:", choices: ["72°", "90°", "108°", "144°"], answer: 2, explain: "Consecutive angles between the bases are supplementary: 180 − 72 = 108°." },
          { type: "fill", q: "A trapezoid's midsegment is 20 and one base is 25. The other base is ____.", answers: ["15"], explain: "midseg = ½(b₁+b₂) → 20 = ½(25+b) → 40 = 25+b → b = 15." },
        ],
      },

      /* 2. Similarity */
      {
        id: "geo-similarity",
        title: "Similarity & Proportions",
        blurb: "Scale factor, proportional sides, and the k : k² : k³ rule.",
        lesson: [
          { p: "**Similar** figures have the same shape: corresponding angles are equal and corresponding sides are **proportional**. The ratio of corresponding sides is the **scale factor (k)**." },
          { h: "The ratio rules" },
          { list: [
            "Ratio of **sides / perimeters** = **k**",
            "Ratio of **areas** = **k²**",
            "Ratio of **volumes** = **k³**",
          ] },
          { p: "**Triangle Proportionality (side-splitter):** a line parallel to one side of a triangle divides the other two sides proportionally." },
          { example: "If AB/BC = DE/EF and 40/60 = 50/EF, then EF = 50·60/40 = **75**.", as: "Worked" },
          { tip: "Going up the dimensions, the exponent climbs: length **k¹**, area **k²**, volume **k³**." },
        ],
        visual: {
          type: "table", cap: "Scale factor k between similar figures",
          head: ["Compare", "Ratio"],
          rows: [["Corresponding sides", "k"], ["Perimeters", "k"], ["Areas", "k²"], ["Volumes", "k³"]],
        },
        cards: [
          { front: "What is the scale factor of similar figures?", back: "The ratio of any pair of corresponding sides." },
          { front: "If the scale factor is k, the ratio of areas is…", back: "k²." },
          { front: "If the scale factor is k, the ratio of volumes is…", back: "k³." },
          { front: "Ratio of perimeters of similar figures", back: "Equal to the scale factor k." },
          { front: "Triangle Proportionality Theorem", back: "A line parallel to one side of a triangle splits the other two sides proportionally." },
        ],
        questions: [
          { type: "mc", q: "AB = 40, BC = 60, DE = 50, with corresponding sides proportional. Find EF.", choices: ["33", "45", "70", "75"], answer: 3, explain: "40/60 = 50/EF → EF = 50·60/40 = 75." },
          { type: "mc", q: "Two regular hexagons have sides 21 and 18. The scale factor is:", choices: ["3/2", "7/6", "6/7", "21/2"], answer: 1, explain: "21/18 = 7/6." },
          { type: "mc", q: "△ABC ~ △JKL. Perimeter of ABC = 57, BC = 15, and KL = 50. Find the perimeter of JKL.", choices: ["152", "171", "190", "200"], answer: 2, explain: "Scale = 50/15; perimeter = 57·(50/15) = 190." },
          { type: "mc", q: "Two similar solids have a scale factor of 1:3. The ratio of their volumes is:", choices: ["1:3", "1:6", "1:9", "1:27"], answer: 3, explain: "Volume ratio = k³ = 1³:3³ = 1:27." },
          { type: "fill", q: "Two spheres have a volume ratio of 1:27. Their surface-area ratio is 1: ____.", answers: ["9"], explain: "Volume k³=1:27 → k=1:3 → area k²=1:9." },
        ],
      },

      /* 3. Right triangles */
      {
        id: "geo-righttri",
        title: "Right Triangles & Pythagorean Theorem",
        blurb: "a² + b² = c², radical form, and special right triangles.",
        lesson: [
          { p: "In a right triangle, **a² + b² = c²** (c is the hypotenuse). Leave answers in **simplest radical form** when asked." },
          { example: "Legs 12 and 6 → c = √(12² + 6²) = √180 = √(36·5) = **6√5**.", as: "Worked" },
          { p: "To check if three lengths form a right triangle, test whether **a² + b² = c²**." },
          { h: "Special right triangles" },
          { list: [
            "**45-45-90:** legs are equal; **hypotenuse = leg · √2**.",
            "**30-60-90:** **hypotenuse = 2 · (short leg)**, and **long leg = short leg · √3**.",
          ] },
          { tip: "Simplify radicals by pulling out perfect squares: √180 = √36·√5 = 6√5." },
        ],
        visual: {
          type: "table", cap: "Special right triangles",
          head: ["Triangle", "Sides (short : long : hyp)"],
          rows: [["45-45-90", "x : x : x√2"], ["30-60-90", "x : x√3 : 2x"]],
        },
        cards: [
          { front: "Pythagorean Theorem", back: "a² + b² = c² (c is the hypotenuse)." },
          { front: "45-45-90 triangle ratio", back: "leg : leg : hypotenuse = x : x : x√2." },
          { front: "30-60-90 triangle ratio", back: "short : long : hyp = x : x√3 : 2x." },
          { front: "Simplify √180", back: "√(36·5) = 6√5." },
          { front: "How do you check if 3 sides make a right triangle?", back: "Test whether a² + b² = c²." },
        ],
        questions: [
          { type: "mc", q: "A right triangle has legs 12 and 6. The hypotenuse, in simplest radical form, is:", choices: ["6√3", "18", "6√5", "√72"], answer: 2, explain: "√(144+36)=√180=6√5." },
          { type: "mc", q: "Which set of side lengths does NOT form a right triangle?", choices: ["3, 6, 9", "6, 8, 10", "5, 12, 13", "8, 15, 17"], answer: 0, explain: "3²+6² = 45 ≠ 81 = 9². The others satisfy a²+b²=c²." },
          { type: "mc", q: "In a 45-45-90 triangle, each leg is 8 cm. The hypotenuse is:", choices: ["8 cm", "16 cm", "8√2 cm", "8√3 cm"], answer: 2, explain: "hyp = leg·√2 = 8√2." },
          { type: "fill", q: "A right triangle has one leg 10 and hypotenuse 20. The other leg, in radical form, is ____.", answers: ["10√3", "10 sqrt 3", "10 root 3"], explain: "√(400−100)=√300=10√3." },
          { type: "mc", q: "In a 30-60-90 triangle the hypotenuse is 16. The short leg is:", choices: ["8", "8√3", "16√3", "4"], answer: 0, explain: "hyp = 2·short → short = 8 (long = 8√3)." },
        ],
      },

      /* 4. Trig */
      {
        id: "geo-trig",
        title: "Right-Triangle Trigonometry",
        blurb: "SOH-CAH-TOA, finding angles, and elevation/depression.",
        lesson: [
          { p: "Use **SOH-CAH-TOA** to relate an angle to two sides of a right triangle:" },
          { list: [
            "**sin θ = Opposite / Hypotenuse**",
            "**cos θ = Adjacent / Hypotenuse**",
            "**tan θ = Opposite / Adjacent**",
          ] },
          { p: "To **find a side**, multiply (e.g. opposite = hyp · sin θ). To **find an angle**, use the **inverse** (sin⁻¹, cos⁻¹, tan⁻¹)." },
          { example: "Opposite leg 16, adjacent 30 → tan A = 16/30 = 8/15 ≈ **0.533**, so A = tan⁻¹(8/15) ≈ **28°**.", as: "Worked" },
          { p: "**Angle of elevation** (looking up) and **angle of depression** (looking down) are measured from the horizontal and used the same way." },
          { example: "Slope: height 15 m at a 24° angle of depression → distance along slope = 15 / sin 24° ≈ **36.9 m**.", as: "Worked" },
          { tip: "Pick the ratio by what you have: have **opp & adj** → tan; **opp & hyp** → sin; **adj & hyp** → cos." },
        ],
        visual: {
          type: "concept", cap: "SOH-CAH-TOA",
          hub: "Right triangle",
          leaves: [
            { b: "SOH", s: "sin = Opp / Hyp" },
            { b: "CAH", s: "cos = Adj / Hyp" },
            { b: "TOA", s: "tan = Opp / Adj" },
          ],
        },
        cards: [
          { front: "sin θ =", back: "Opposite / Hypotenuse (SOH)." },
          { front: "cos θ =", back: "Adjacent / Hypotenuse (CAH)." },
          { front: "tan θ =", back: "Opposite / Adjacent (TOA)." },
          { front: "How do you find an unknown angle from two sides?", back: "Use inverse trig: sin⁻¹, cos⁻¹, or tan⁻¹." },
          { front: "Angle of elevation vs. depression", back: "Elevation = looking up from horizontal; depression = looking down. Same trig setup." },
        ],
        questions: [
          { type: "mc", q: "In a right triangle, the side opposite angle A is 16 and the adjacent side is 30. tan A =", choices: ["16/30 (8/15)", "30/16", "16/34", "34/16"], answer: 0, explain: "tan = opposite/adjacent = 16/30 = 8/15." },
          { type: "mc", q: "To find an unknown ANGLE A when you know the opposite (7) and the hypotenuse (14), use:", choices: ["sin(7/14)", "sin⁻¹(7/14)", "cos⁻¹(7/14)", "tan(14/7)"], answer: 1, explain: "opp & hyp → sin; solve for the angle with sin⁻¹." },
          { type: "mc", q: "A slope has a vertical height of 15 m and an angle of depression of 24°. The distance along the slope ≈", choices: ["6.1 m", "16.4 m", "36.9 m", "33.7 m"], answer: 2, explain: "sin 24° = 15/d → d = 15/sin24° ≈ 36.9 m." },
          { type: "fill", q: "A rope is 13 yd long at a 27° angle of elevation. The horizontal ground distance = 13 · cos 27° ≈ ____ yd (nearest tenth).", answers: ["11.6"], explain: "13·cos27° ≈ 11.6." },
        ],
      },

      /* 5. Circles */
      {
        id: "geo-circles",
        title: "Circles: Angles, Arcs & Segments",
        blurb: "Vocabulary, inscribed/central angles, chords/secants, and the circle equation.",
        lesson: [
          { h: "Vocabulary" },
          { defs: [
            ["Chord", "A segment with both endpoints on the circle."],
            ["Diameter", "A chord through the center (= 2 · radius)."],
            ["Tangent", "A line touching the circle at exactly one point; it is **perpendicular to the radius** at the point of tangency."],
            ["Secant", "A line that intersects the circle at **two** points."],
          ] },
          { h: "Angle & arc rules" },
          { list: [
            "**Central angle = its intercepted arc.**",
            "**Inscribed angle = ½ its intercepted arc** (an angle in a semicircle = 90°).",
            "**Two chords meeting inside:** angle = **½(sum of the two arcs)**; segment products **a·b = c·d**.",
            "**From an external point** (two secants/tangents): angle = **½|difference of arcs|**.",
            "**Tangent–secant:** tangent² = (external part)·(whole secant).",
          ] },
          { h: "Equation of a circle" },
          { p: "Center **(h, k)**, radius **r**:  **(x − h)² + (y − k)² = r²**." },
          { example: "Center (3, −3) passing through (−3, 2): r² = (3−(−3))² + (−3−2)² = 36 + 25 = 61 → **(x−3)² + (y+3)² = 61**.", as: "Worked" },
          { tip: "Inscribed angle = **half** the arc; central angle = the **whole** arc. A tangent always meets the radius at a **right angle**." },
        ],
        visual: {
          type: "table", cap: "Angle = ? of the arc(s)",
          head: ["Vertex location", "Angle equals"],
          rows: [["Center", "the arc"], ["On the circle (inscribed)", "½ · arc"], ["Inside (2 chords)", "½ (sum of arcs)"], ["Outside (secants/tangents)", "½ |difference of arcs|"]],
        },
        cards: [
          { front: "A tangent line is ____ to the radius at the point of tangency.", back: "Perpendicular." },
          { front: "Inscribed angle = ", back: "½ of its intercepted arc." },
          { front: "Central angle = ", back: "Its intercepted arc (the full arc)." },
          { front: "Angle from two chords meeting inside a circle", back: "½ (sum of the two intercepted arcs)." },
          { front: "Equation of a circle, center (h,k), radius r", back: "(x − h)² + (y − k)² = r²." },
          { front: "An angle inscribed in a semicircle is…", back: "90° (a right angle)." },
        ],
        questions: [
          { type: "mc", q: "A line that touches a circle at exactly one point and is perpendicular to the radius there is a:", choices: ["chord", "secant", "tangent", "diameter"], answer: 2 },
          { type: "mc", q: "An inscribed angle intercepts a 160° arc. The inscribed angle measures:", choices: ["160°", "80°", "320°", "40°"], answer: 1, explain: "Inscribed angle = ½ · 160 = 80°." },
          { type: "mc", q: "Two chords intersect inside a circle, segments 4 and (x+2) on one chord, 3 and 2x on the other, with 4(x+2)=3(2x). Find x.", choices: ["2", "4", "6", "8"], answer: 1, explain: "4x+8 = 6x → 8 = 2x → x = 4." },
          { type: "mc", q: "The equation of a circle with center (2, 3) and radius 7 is:", choices: ["(x−2)² + (y−3)² = 7", "(x−2)² + (y−3)² = 49", "(x+2)² + (y+3)² = 49", "(x−3)² + (y−2)² = 49"], answer: 1, explain: "r² = 7² = 49." },
          { type: "fill", q: "Write the equation of the circle with center (3, −3) that passes through (−3, 2). (x−3)² + (y+3)² = ____", answers: ["61"], explain: "r² = 6² + 5² = 61." },
        ],
      },

      /* 6. Area of polygons */
      {
        id: "geo-area",
        title: "Area of Polygons",
        blurb: "Triangles, parallelograms, trapezoids, rhombi/kites, regular polygons.",
        lesson: [
          { h: "Area formulas" },
          { list: [
            "**Parallelogram:** A = b · h",
            "**Triangle:** A = ½ · b · h",
            "**Rectangle:** A = l · w",
            "**Trapezoid:** A = ½ (b₁ + b₂) · h",
            "**Rhombus / Kite:** A = ½ · d₁ · d₂  (half the product of the diagonals)",
            "**Regular polygon:** A = ½ · apothem · perimeter",
          ] },
          { example: "Rhombus area 45, one diagonal 9 → 45 = ½·9·d₂ → d₂ = 10.", as: "Worked" },
          { example: "Regular hexagon, side 11, apothem 9.5 → A = ½·(6·11)·9.5 = ½·66·9.5 = 313.5.", as: "Worked" },
          { tip: "The **apothem** is the distance from the center to the middle of a side. Regular-polygon area = **½ · apothem · perimeter** (same as a bunch of triangles)." },
        ],
        visual: {
          type: "table", cap: "Area formula sheet",
          head: ["Shape", "Area"],
          rows: [["Parallelogram", "b·h"], ["Triangle", "½·b·h"], ["Trapezoid", "½(b₁+b₂)·h"], ["Rhombus / Kite", "½·d₁·d₂"], ["Regular polygon", "½·apothem·perimeter"]],
        },
        cards: [
          { front: "Area of a parallelogram", back: "A = base × height." },
          { front: "Area of a trapezoid", back: "A = ½(b₁ + b₂)·h." },
          { front: "Area of a rhombus or kite", back: "A = ½ · d₁ · d₂ (the diagonals)." },
          { front: "Area of a regular polygon", back: "A = ½ · apothem · perimeter." },
          { front: "What is an apothem?", back: "The distance from the center of a regular polygon to the midpoint of a side." },
        ],
        questions: [
          { type: "mc", q: "A parallelogram has base 6 cm and height 4 cm. Its area is:", choices: ["10 cm²", "24 cm²", "12 cm²", "48 cm²"], answer: 1, explain: "A = b·h = 6·4 = 24." },
          { type: "mc", q: "A trapezoid has parallel sides 6 and 13 and height 8. Its area is:", choices: ["76", "152", "104", "38"], answer: 0, explain: "½(6+13)·8 = ½·19·8 = 76." },
          { type: "mc", q: "A kite has diagonals 16 in and 21 in. Its area is:", choices: ["37 in²", "168 in²", "336 in²", "84 in²"], answer: 1, explain: "½·16·21 = 168." },
          { type: "fill", q: "A rhombus has area 45 and one diagonal 9. The other diagonal is ____.", answers: ["10"], explain: "45 = ½·9·d₂ → d₂ = 10." },
          { type: "fill", q: "A regular hexagon has side 11 ft and apothem 9.5 ft. Its area is ____ ft².", answers: ["313.5", "313.50"], explain: "½·(6·11)·9.5 = 313.5." },
        ],
      },

      /* 7. Circle measurement */
      {
        id: "geo-circlemeasure",
        title: "Circumference, Arc Length & Sectors",
        blurb: "Going around and slicing up circles.",
        lesson: [
          { list: [
            "**Circumference:** C = π · d = 2π · r",
            "**Arc length:** (θ / 360) · 2π · r  — a fraction of the circumference",
            "**Sector area:** (θ / 360) · π · r²  — a fraction of the area",
          ] },
          { example: "Arc length, 80° central angle, r = 9 → (80/360)·2π·9 ≈ 12.57.", as: "Worked" },
          { example: "Sector area, 256°, r = 14 → (256/360)·π·14² ≈ 437.87.", as: "Worked" },
          { tip: "Arc length and sector area are both just **(θ/360)** of the whole — of the **circumference** for arc length, of the **area** for a sector." },
        ],
        visual: {
          type: "table", cap: "Circle measurement",
          head: ["Quantity", "Formula"],
          rows: [["Circumference", "πd = 2πr"], ["Area", "πr²"], ["Arc length", "(θ/360)·2πr"], ["Sector area", "(θ/360)·πr²"]],
        },
        cards: [
          { front: "Circumference of a circle", back: "C = πd = 2πr." },
          { front: "Arc length formula", back: "(θ/360) · 2πr." },
          { front: "Sector area formula", back: "(θ/360) · πr²." },
          { front: "Find radius from circumference C", back: "r = C / (2π)." },
        ],
        questions: [
          { type: "mc", q: "A circle has diameter 11 in. Its circumference ≈", choices: ["34.56 in", "17.28 in", "38.0 in", "95.0 in"], answer: 0, explain: "C = π·11 ≈ 34.56." },
          { type: "mc", q: "A circle's circumference is 23 m. Its radius ≈", choices: ["3.66 m", "7.32 m", "11.5 m", "1.83 m"], answer: 0, explain: "r = 23/(2π) ≈ 3.66." },
          { type: "fill", q: "Arc length for an 80° central angle on a circle of radius 9 ≈ ____ (nearest hundredth).", answers: ["12.57", "12.6"], explain: "(80/360)·2π·9 ≈ 12.57." },
          { type: "fill", q: "Area of a 256° sector with radius 14 ≈ ____ cm² (nearest hundredth).", answers: ["437.87", "437.9"], explain: "(256/360)·π·14² ≈ 437.87." },
        ],
      },

      /* 8. Surface area & volume */
      {
        id: "geo-solids",
        title: "Surface Area & Volume of Solids",
        blurb: "Prisms, cylinders, pyramids, cones, and spheres — forward and reverse.",
        lesson: [
          { h: "Surface area" },
          { list: [
            "**Rectangular prism:** SA = 2(lw + lh + wh)",
            "**Cylinder:** SA = 2πr² + 2πr·h",
            "**Pyramid:** SA = base area + ½ · perimeter · slant height ℓ",
            "**Cone:** SA = πr² + πr·ℓ",
            "**Sphere:** SA = 4πr²",
          ] },
          { h: "Volume" },
          { list: [
            "**Prism:** V = B·h  (= l·w·h)",
            "**Cylinder:** V = πr²·h",
            "**Pyramid:** V = ⅓·B·h",
            "**Cone:** V = ⅓·πr²·h",
            "**Sphere:** V = (4/3)πr³",
          ] },
          { example: "Square pyramid, base edge 48, height 10 → V = ⅓·48²·10 = ⅓·2304·10 = 7680 in³.", as: "Worked" },
          { p: "**Reverse problems** give the volume/SA and ask for a missing dimension — just solve the formula." },
          { example: "Cylinder V = 2304 in³, r = 12 → h = V/(πr²) = 2304/(144π) = 16/π ≈ 5.09 in.", as: "Worked" },
          { tip: "Cones and pyramids are the **'⅓' shapes** — they hold exactly one-third of the prism/cylinder with the same base and height." },
        ],
        visual: {
          type: "table", cap: "Solid formulas",
          head: ["Solid", "Volume", "Surface area"],
          rows: [
            ["Rect. prism", "l·w·h", "2(lw+lh+wh)"],
            ["Cylinder", "πr²h", "2πr² + 2πrh"],
            ["Pyramid", "⅓·B·h", "B + ½·P·ℓ"],
            ["Cone", "⅓πr²h", "πr² + πrℓ"],
            ["Sphere", "(4/3)πr³", "4πr²"],
          ],
        },
        cards: [
          { front: "Volume of a cylinder", back: "V = πr²h." },
          { front: "Volume of a cone", back: "V = ⅓πr²h." },
          { front: "Volume of a pyramid", back: "V = ⅓ · base area · height." },
          { front: "Volume of a sphere", back: "V = (4/3)πr³." },
          { front: "Surface area of a sphere", back: "SA = 4πr²." },
          { front: "Surface area of a cylinder", back: "SA = 2πr² + 2πrh." },
          { front: "Surface area of a rectangular prism", back: "SA = 2(lw + lh + wh)." },
        ],
        questions: [
          { type: "mc", q: "A square pyramid has base edges 48 in and height 10 in. Its volume is:", choices: ["5760 in³", "23,040 in³", "7680 in³", "2560 in³"], answer: 2, explain: "V = ⅓·48²·10 = 7680." },
          { type: "mc", q: "A rectangular prism has l=6, w=12, h=3. Its surface area is:", choices: ["252 in²", "216 in²", "180 in²", "108 in²"], answer: 0, explain: "2(72+18+36) = 252." },
          { type: "mc", q: "A sphere has surface area 9π. Its radius is:", choices: ["1.5 m", "3 m", "4.5 m", "9 m"], answer: 0, explain: "4πr² = 9π → r² = 9/4 → r = 1.5." },
          { type: "fill", q: "A cylinder has volume 2304 in³ and radius 12 in. Its exact height is 16/____ in.", answers: ["π", "pi"], explain: "h = 2304/(144π) = 16/π ≈ 5.09." },
          { type: "fill", q: "A rectangular prism is 5 by 9 by 3. Its volume is ____ in³.", answers: ["135"], explain: "5·9·3 = 135." },
          { type: "mc", q: "A cone holds what fraction of the volume of a cylinder with the same base and height?", choices: ["one half", "one third", "two thirds", "the same"], answer: 1, explain: "Cone V = ⅓πr²h = ⅓ of the cylinder." },
        ],
      },
    ],
  });
})(window.STUDY);
