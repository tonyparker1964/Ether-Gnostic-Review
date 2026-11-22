# Gnosis — The Living Library

A responsive, zero-build, static web application for studying the Nag Hammadi collection. Includes catalog navigation, filtering, a study reader, browser speech synthesis, a concept atlas, guided offline study pathways, bookmarks, and a locally stored journal with JSON export/import.

## Run locally

Open `index.html` in a modern browser, or run `python3 -m http.server 8000` in this directory and visit `http://localhost:8000`.

## Deploy on GitHub Pages

1. Push the app files to the root of `main` in `tonyparker1964/Ether-Gnostic-Review`.
2. In repository **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
3. Open https://tonyparker1964.github.io/Ether-Gnostic-Review/ once deployment completes.

No npm, API keys, backend, or build tooling is required. The app uses relative asset paths for project-page hosting.

## Text and rights policy

The catalog contains original short editorial summaries and bibliographic titles. **No third-party English translation is bundled**. The reader links to https://www.gnosis.org/naghamm/nhl.html for external source consultation. Do not scrape, embed, or redistribute modern translations without permission or a compatible license. Ancient underlying works and modern translations have distinct rights statuses. The source index was not programmatically retrievable during this build, so titles, codex assignments, and descriptions are a starter catalog to verify against the source and scholarly editions before treating them as a definitive critical bibliography.

## Architecture and privacy

`index.html` provides the views, `styles.css` the responsive visual system, `catalog.js` the editable source metadata and concept descriptions, and `app.js` the application logic. Bookmarks and journal entries are stored in browser localStorage; there is no account, synchronization, or remote AI service. Speech uses the browser's speechSynthesis API and reads original overview text, not external translations. The Study Companion is a deterministic study-path generator, not an LLM. Browser storage may be lost on clearing site data or using private browsing; export regularly. No tracking code is included.

## Roadmap

- Verify and expand catalog against critical editions and exact source links.
- Add licensed translations, full-text search, paragraph anchors, and side-by-side comparison only when rights allow.
- Add an optional consent-based AI study service with explicit citations and historical/interpretive separation.
- Add a graphical relationship network and accessible keyboard navigation enhancements.
- Add optional integration with Ether Voice Reader using authorized voice/audio services.

Independent project, not affiliated with Gnosis.org.
