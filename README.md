# Recall · Finals Trainer 📚

An interactive, active-recall study app for the 2026 spring final exams — **ELA, Biology, French 3, Geometry, and History**. Built straight from the class study guides, with spaced repetition, interleaved practice, and printable randomized mock tests.

**▶️ Live site:** https://ayatdzcollection-sketch.github.io/recall-finals/

No login. No accounts. No database. Your progress is saved automatically in your own browser, so you can just open the link and start. Share it with classmates — everyone gets their own progress.

---

## How to use it

- **Online:** open the live link on your phone or laptop.
- **Offline / to share a file:** open **`study-app.html`** — it's the entire app in one self-contained file. Double-click it, AirDrop/email it, or drop it in a shared Drive. Works with no internet.

### The study modes
- **Smart Study** — an interleaved mix of new material + items that are *due* for review (this is the spaced-repetition engine).
- **Mixed Practice** — random questions across topics/subjects, to fight the illusion of mastery you get from studying one topic at a time.
- **Review** — resurfaces only what you got wrong or what's due, so you spend time where it counts.
- **Each topic** has three tabs: **Learn** (a short lesson + a visual), **Cards** (flashcards you grade yourself on), and **Practice** (active-recall questions).
- **Practice Test** — generates a randomized mock that mirrors the real final's format (e.g. History = ~70 multiple choice + ~30 matching), with a separate answer key. Re-roll for a brand-new version every time. Print it or "Save as PDF."

---

## Why it's built this way (the learning science)

This isn't a digital textbook — it's a **retrieval** tool. The design follows four well-supported findings from cognitive science:

1. **Active recall (the testing effect).** Trying to *retrieve* an answer before seeing it strengthens memory far more than re-reading. Every topic makes you attempt the answer first.
2. **Spaced repetition.** Material you've seen resurfaces across sessions on an expanding schedule (a Leitner box system tuned for a multi-day cram window). Getting something right pushes it further out; missing it brings it back soon.
3. **Interleaving.** Questions are mixed across topics and types rather than blocked, which improves your ability to tell concepts apart and transfer them to a real exam.
4. **Self-checking & feedback.** Answers reveal immediately after you attempt, wrong items get flagged for review, and per-subject mastery + weak-spot tracking show you exactly what to drill next.

Coverage is **weighted by priority**: ELA (most) → Biology → French 3 & Geometry → History (lightest), matching how the workload was described.

---

## What's inside

| Subject | Topics | Source |
|---|---|---|
| 📖 ELA | 9 | Two Blooket sets (104 verified Qs) + the Romeo & Juliet / poetry / nonfiction guide |
| 🧬 Biology | 10 | Final exam review answer key |
| 🇫🇷 French 3 | 5 | French 3 final study guide |
| 📐 Geometry | 8 | 25-26 Geometry review packet (Ch 7–11) |
| 🌍 History | 8 | Two World History guides (incl. the real 70 MC + 30 matching format) |

**264 practice questions + 249 flashcards** in total.

---

## Project structure

```
exam-study-app/
├── index.html          # multi-file app entry (open this to run locally)
├── study-app.html      # single-file build (share / offline)
├── css/styles.css
├── js/
│   ├── storage.js      # state + progress (localStorage)
│   ├── srs.js          # spaced-repetition scheduler + interleaving
│   ├── quiz.js         # question & flashcard engine
│   ├── test.js         # printable randomized test generator
│   └── app.js          # router + screens + lesson/visual rendering
├── data/
│   ├── ela.js / biology.js / french.js / geometry.js / history.js
│   ├── ela-pool.js     # generated from the Blooket answer keys
│   └── raw/            # extracted source material (provenance)
└── build/
    ├── gen-ela.js      # regenerate ela-pool.js from raw JSON
    ├── bundle.js       # rebuild study-app.html
    └── selftest.js     # headless validation of all questions
```

### Dev commands (optional)
```bash
node build/gen-ela.js   # rebuild the ELA question pool from the answer keys
node build/selftest.js  # validate every question (answer indices, etc.)
node build/bundle.js    # rebuild the single-file study-app.html
```
No dependencies, no build step required to *run* — `index.html` works as-is.

---

*Built with active recall, spaced repetition, and interleaving. Good luck on finals. 🍀*
