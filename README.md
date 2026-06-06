# Recall · Finals Trainer 📚

An active-recall study app for the 2026 spring finals: ELA, Biology, French 3, Geometry, and History. The questions come straight from the class study guides, wrapped in spaced repetition, interleaved practice, and printable mock tests.

**▶️ Live site:** https://ayatdzcollection-sketch.github.io/recall-finals/

No login. No accounts. No database. Your progress saves automatically in your own browser, so you open the link and start. Send it to a classmate and they get their own progress.

---

## How to use it

- **Online:** open the live link on your phone or laptop.
- **Offline, or to hand someone a file:** open **`study-app.html`**. It's the whole app in one self-contained file. Double-click it, AirDrop or email it, or drop it in a shared Drive. No internet needed.

### The study modes
- **Smart Study:** an interleaved mix of new material and items that are *due* for review. This is the spaced-repetition engine doing its thing.
- **Mixed Practice:** random questions pulled across topics and subjects, so you can't coast on the false confidence you get from drilling one topic at a time.
- **Review:** only what you got wrong or what's come due, so your time lands where it's weakest.
- **Each topic** has three tabs: **Learn** (a short lesson and a visual), **Cards** (flashcards you grade yourself on), and **Practice** (active-recall questions).
- **Practice Test:** builds a randomized mock in the real final's format (History, for example, is ~70 multiple choice plus ~30 matching) with a separate answer key. Re-roll for a fresh version any time. Print it or save it as a PDF.

---

## Why it's built this way (the learning science)

The app is built around retrieving answers, not re-reading them. Four well-supported findings from cognitive science shape it:

1. **Active recall (the testing effect).** Pulling an answer out of your head before you see it builds memory far better than re-reading. Every topic makes you attempt the answer first.
2. **Spaced repetition.** Material you've seen comes back across sessions on a widening schedule (a Leitner box system tuned for a few-day cram window). Get something right and it pushes further out; miss it and it returns soon.
3. **Interleaving.** Questions are shuffled across topics and types instead of blocked, which trains you to tell concepts apart and use them cold on a real exam.
4. **Self-checking and feedback.** Answers reveal the moment you attempt, wrong items get flagged, and per-subject mastery plus weak-spot tracking show you what to drill next.

Depth is weighted by priority: ELA gets the most, then Biology, then French 3 and Geometry, with History lightest. That matches how you described the workload.

---

## What's inside

| Subject | Topics | Source |
|---|---|---|
| 📖 ELA | 9 | Two Blooket sets (104 verified Qs) plus the Romeo & Juliet / poetry / nonfiction guide |
| 🧬 Biology | 10 | Final exam review answer key |
| 🇫🇷 French 3 | 5 | French 3 final study guide |
| 📐 Geometry | 8 | 25-26 Geometry review packet (Ch 7–11) |
| 🌍 History | 8 | Two World History guides (including the real 70 MC + 30 matching format) |

**264 practice questions and 249 flashcards** in total.

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
No dependencies, and no build step to run. `index.html` works as-is.

---

*Made for the 2026 finals. Good luck. 🍀*
