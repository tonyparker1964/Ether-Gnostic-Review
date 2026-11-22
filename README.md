# Gnosis — The Living Library

A responsive, zero-build, static web application for studying the Nag Hammadi collection. Includes catalog navigation, filtering, a study reader, browser speech synthesis, a concept atlas, five guided study modules, flashcards, quizzes with source-linked feedback, bookmarks, and a local study journal.

## Run locally

Open `index.html` provides the views, `styles.css` the visual system, `catalog.js` the catalog and structured lesson content, and `app.js` the interactions. `full-texts.js` and `text-reader.js` provide the bundled editions and narrator.

Module completion, reviewed cards, best quiz scores, bookmarks, and notes stay in this browser. Quiz attempts can be repeated, and modules can be marked complete in any order. Notes can be linked to a module or work, edited, and backed up as JSON. Existing Gnosis Journal JSON backups can still be imported. Clearing browser storage removes local study progress. Journal exports contain notes only.

The narrator uses browser speech synthesis and remembers the selected voice and speed. Voice availability depends on the browser and device. There is no sign-in or synchronization.

Independent project, not affiliated with Gnosis.org.
