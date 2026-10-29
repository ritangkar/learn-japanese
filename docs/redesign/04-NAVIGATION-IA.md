# 4. Navigation and information architecture

Five primary tabs, fixed set, same order on every primary screen:

| Tab | Route | Purpose |
|---|---|---|
| Home | `#/` | where am I, what is next, how is my journey going |
| Explore | `#/explore` (+ `#/dest/:id`, `#/tokyo`) | the illustrated map, stop details, quests |
| Learn | `#/learn` (+ lesson, review, drills, kana, library, speak) | today's plan and practice |
| JLPT | `#/jlpt` (+ level, mock, exam, readiness, planner) | levels, section practice, mock exams |
| Journal | `#/journal` (+ achievements) | stamp book, postcards, milestones, how rewards work |

Secondary (not tabs): Profile & settings `#/me` (header person icon, also a Home quick link) with settings, sound, backup, storage, offline status, content status, about, privacy, credits, tour, **install**.

## Back behaviour (one rule)

The header "back" button always goes to a fixed **parent** screen (`parentOf()` in `src/app.js`), never to "whatever was in history". Screens that know a better parent (a quest → its stop) register it with `back(href, label)`. Immersive screens (lesson, review, activity, quest, drill) hide the tab bar and show a **close (X)** instead of a back arrow; if you have answered questions and not finished, closing asks "Leave this session?" first. The browser's own back button works normally (hash routes); answers already given are saved for review either way.

## Locked things explain themselves

Map stop → sheet lists the units it needs with your progress. JLPT level → says which previous-level criteria are open. Stamp slot → names the stop and shows whether it is locked.

## No dead ends

Every empty state names the next action (Open the map, Kana trainer, Start your first lesson). Every completion screen shows a primary next action. Unknown stops/routes have a way back.

## Removed / merged

Old `#/` (map) moved to `#/explore`; `#/journal` and `#/achievements` moved from "Me" to the Journal tab; the in-body "← Back" buttons were removed in favour of the header.
