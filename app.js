(() => {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const reader = window.GnosisTextReader;
  const codexOrder = 'I II III IV V VI VII VIII IX X XI XII XIII'.split(' ');
  const key = 'gnosis-library-v1';
  const escapeHTML = value => String(value).replace(/[&<>"']/g, character =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  let currentWork;
  let currentModule;
  let noteContext;
  let editingNote;
  let cardIndex = 0;
  let reviewing = false;
  let quizResult = null;

  function load(name, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key + name)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function save(name, value) {
    try {
      localStorage.setItem(key + name, JSON.stringify(value));
      return true;
    } catch {
      alert('Browser storage is unavailable. Your change could not be saved.');
      return false;
    }
  }

  function closeMenu() {
    $('.sidebar').classList.remove('open');
    $('#menu').setAttribute('aria-expanded', 'false');
  }

  function show(view) {
    reader.stop();
    $$('.view').forEach(section => section.classList.toggle('active', section.id === view));
    const navView = { reader: 'library', lesson: 'study' }[view] || view;
    $$('.nav').forEach(button => {
      const active = button.dataset.view === navView;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    closeMenu();
    if (view === 'home' || view === 'study') renderProgress();
    const heading = $('#' + view + ' h1');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
    window.scrollTo(0, 0);
  }

  $('#menu').onclick = () => {
    const open = $('.sidebar').classList.toggle('open');
    $('#menu').setAttribute('aria-expanded', String(open));
    if (open) $('.nav.active').focus();
  };
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && $('.sidebar').classList.contains('open')) {
      closeMenu();
      $('#menu').focus();
    }
  });
  $$('[data-view], [data-go]').forEach(button => {
    button.onclick = () => show(button.dataset.view || button.dataset.go);
  });

  const codices = [...new Set(WORKS.flatMap(work => work.codex.split(', ')))];
  codices.sort((a, b) => codexOrder.indexOf(a) - codexOrder.indexOf(b));
  codices.forEach(codex => $('#codexFilter').add(new Option('Codex ' + codex, codex)));
  [...new Set(WORKS.map(work => work.theme))].sort().forEach(theme => {
    $('#themeFilter').add(new Option(theme, theme));
  });

  function renderCatalog() {
    const query = $('#search').value.trim().toLowerCase();
    const codex = $('#codexFilter').value;
    const theme = $('#themeFilter').value;
    const filtered = WORKS.filter(work =>
      (!codex || work.codex.split(', ').includes(codex)) &&
      (!theme || work.theme === theme) &&
      [work.title, work.codex, work.theme, work.summary].join(' ').toLowerCase().includes(query));
    $('#results').innerHTML = filtered.map(work => `
      <article>
        <div class="eyebrow">CODEX ${escapeHTML(work.codex)} · ${escapeHTML(work.theme)}</div>
        <h3>${escapeHTML(work.title)}</h3>
        <p>${escapeHTML(work.summary)}</p>
        <button data-open="${work.id}">Open study entry</button>
      </article>`).join('');
    $('#empty').hidden = filtered.length > 0;
  }

  function openWork(work, returnToLesson = false) {
    currentWork = work;
    $('#readerCodex').textContent = 'CODEX ' + work.codex + ' · ' + work.theme;
    $('#readerTitle').textContent = work.title;
    $('#readerTags').innerHTML = [work.theme, ...work.codex.split(', ').map(codex => 'Codex ' + codex)]
      .map(tag => `<span>${escapeHTML(tag)}</span>`).join('');
    $('#readerSummary').textContent = work.summary;
    $('#readerPrompt').textContent = `How does this work approach ${work.theme.toLowerCase()}? Which features of the passage support your reading?`;
    $('#sourceLink').href = work.source;
    $('#sourceLink').textContent = work.source === SOURCE ? 'Find a translation in the source index' : 'Open source translation';
    const back = $('#reader > .back');
    back.textContent = returnToLesson ? 'Return to module' : 'Back to library';
    back.onclick = () => show(returnToLesson ? 'lesson' : 'library');
    renderBookmark();
    reader.open(work.title);
    show('reader');
  }

  function renderBookmark() {
    const saved = load('bookmarks', []).includes(currentWork.id);
    $('#bookmark').textContent = saved ? '★ Saved' : '☆ Save';
    $('#bookmark').setAttribute('aria-pressed', String(saved));
  }

  ['search', 'codexFilter', 'themeFilter'].forEach(id => {
    $('#' + id).addEventListener(id === 'search' ? 'input' : 'change', renderCatalog);
  });
  $('#results').onclick = event => {
    const button = event.target.closest('[data-open]');
    if (button) openWork(WORKS.find(work => work.id === Number(button.dataset.open)));
  };
  $('#bookmark').onclick = () => {
    const bookmarks = load('bookmarks', []);
    const id = currentWork.id;
    const updated = bookmarks.includes(id) ? bookmarks.filter(saved => saved !== id) : [...bookmarks, id];
    if (save('bookmarks', updated)) renderBookmark();
  };
  $('#speak').onclick = () => reader.say(
    currentWork.title + '. ' + currentWork.summary + ' ' + $('#readerPrompt').textContent,
    $('#speak'), '▶ Listen to overview');
  $('#noteForWork').onclick = () => startNote(currentWork.title);

  $('#atlasGrid').innerHTML = CONCEPTS.map((concept, index) =>
    `<button data-concept="${index}">${escapeHTML(concept.name)}<span>${escapeHTML(concept.subtitle)}</span></button>`).join('');
  $('#atlasGrid').onclick = event => {
    const button = event.target.closest('[data-concept]');
    if (!button) return;
    const concept = CONCEPTS[Number(button.dataset.concept)];
    reader.stop();
    $('#atlasDetail').innerHTML = `<h3>${escapeHTML(concept.name)}</h3>
      <p>${escapeHTML(concept.description)}</p>
      <p>Related concepts: ${concept.related.map(escapeHTML).join(' · ')}</p>
      <p><button class="listen" id="atlasListen">▶ Listen</button></p>
      <p><a href="${SOURCE}" target="_blank" rel="noopener">Research in the Nag Hammadi source index</a></p>`;
    $('#atlasListen').onclick = () => reader.say(concept.name + '. ' + concept.description, $('#atlasListen'), '▶ Listen');
  };

  function moduleStatus(progress, module) {
    const entry = progress[module.id];
    if (entry?.complete) return 'Complete';
    return entry ? 'In progress' : 'Ready to start';
  }

  function renderProgress() {
    const progress = load('progress', {});
    const count = STUDY_MODULES.filter(module => progress[module.id]?.complete).length;
    const total = STUDY_MODULES.length;
    $('#homeProgress').max = total;
    $('#homeProgress').value = count;
    const label = `${count} of ${total} modules complete`;
    $('#homeProgressLabel').textContent = label;
    $('#studyProgress').textContent = label;
    $('#resumeStudy').textContent = count === total ? 'Review the study path' : Object.keys(progress).length ? 'Continue studying' : 'Start studying';
    $('#modules').innerHTML = STUDY_MODULES.map(module => {
      const entry = progress[module.id];
      return `<article class="module-card">
        <p class="eyebrow">${escapeHTML(module.theme)} · ${module.minutes} min</p>
        <h2>${escapeHTML(module.title)}</h2>
        <p>${escapeHTML(module.overview)}</p>
        <p class="module-status">${moduleStatus(progress, module)}${entry?.best != null ? ` · Best quiz ${entry.best}/${module.questions.length}` : ''}</p>
        <button class="back" data-module="${module.id}">Open module</button>
      </article>`;
    }).join('');
  }

  function updateProgress(patch) {
    const progress = load('progress', {});
    const id = currentModule.id;
    return save('progress', { ...progress, [id]: { ...progress[id], ...patch } });
  }

  $('#resumeStudy').onclick = () => {
    const progress = load('progress', {});
    const unfinished = STUDY_MODULES.filter(module => !progress[module.id]?.complete);
    const last = load('lastModule', '');
    const module = unfinished.find(entry => entry.id === last) || unfinished[0];
    if (module) openModule(module.id);
    else show('study');
  };
  $('#modules').onclick = event => {
    const button = event.target.closest('[data-module]');
    if (button) openModule(button.dataset.module);
  };

  const translationLink = (reading, label) =>
    `<a href="${escapeHTML(reading.url)}" target="_blank" rel="noopener">${escapeHTML(label)}</a>`;

  function openModule(id) {
    currentModule = STUDY_MODULES.find(module => module.id === id);
    const module = currentModule;
    cardIndex = 0;
    reviewing = false;
    quizResult = null;
    updateProgress({});
    save('lastModule', id);
    $('#lessonContent').innerHTML = `
      <div class="lesson-intro">
        <div class="eyebrow">${escapeHTML(module.theme)} · ${module.minutes} min</div>
        <h1>${escapeHTML(module.title)}</h1>
        <p>${escapeHTML(module.overview)}</p>
        <button class="listen" id="lessonListen">▶ Listen to lesson</button>
      </div>
      <div class="lesson-grid">
        <div>
          <section class="panel lesson-panel" aria-labelledby="readingHeading">
            <h2 id="readingHeading">Assigned reading</h2>
            ${module.readings.map((reading, index) => `
              <article class="reading">
                <h3>${escapeHTML(reading.work)}</h3>
                <p>${escapeHTML(reading.passage)}<br><small>${escapeHTML(reading.translator)}</small></p>
                <div class="reading-links">
                  ${translationLink(reading, 'Open source translation')}
                  ${reading.alternate ? translationLink({ url: reading.alternate }, 'Alternate translation by Samuel Zinner') : ''}
                  <button class="back" data-reading="${index}">Open library entry</button>
                </div>
                <h4>What the text says <span>Paraphrase</span></h4>
                <p>${escapeHTML(reading.evidence)}</p>
              </article>`).join('')}
            <div class="interpretation">
              <h3>One interpretation</h3><p>${escapeHTML(module.interpretation)}</p>
            </div>
            <h3>Journal prompt</h3><p>${escapeHTML(module.prompt)}</p>
            <button class="back" id="lessonNote">Write a linked note</button>
          </section>
        </div>
        <div>
          <section class="panel lesson-panel" aria-labelledby="cardsHeading">
            <h2 id="cardsHeading">Flashcards</h2>
            <p id="cardPosition"></p>
            <div id="cardContent" class="flashcard" aria-live="polite"></div>
            <div class="reading-links card-controls">
              <button class="back" id="previousCard">Previous</button>
              <button class="back" id="flipCard" aria-expanded="false" aria-controls="cardAnswer">Reveal answer</button>
              <button class="back" id="nextCard">Next card</button>
            </div>
            <button class="back" id="knowCard">Mark reviewed</button>
          </section>
          <section class="panel lesson-panel" aria-labelledby="quizHeading">
            <h2 id="quizHeading">Reading quiz</h2>
            <form id="quizForm">
              ${module.questions.map(([question, options], index) => `
                <fieldset>
                  <legend>${escapeHTML(question)}</legend>
                  ${options.map((option, choice) => `
                    <label class="choice"><input type="radio" name="q${index}" value="${choice}" required>${escapeHTML(option)}</label>`).join('')}
                  <div class="feedback" id="feedback${index}"></div>
                </fieldset>`).join('')}
              <button type="submit" class="primary">Check answers</button>
              <button type="button" class="back" id="retryQuiz" hidden>Try again</button>
              <p id="quizResult" role="status"></p>
            </form>
          </section>
        </div>
      </div>
      <div class="panel completion">
        <p id="completionStatus" role="status"></p>
        <button class="primary" id="completeModule"></button>
        <button class="back" data-go="study">All modules</button>
      </div>`;

    $$('[data-reading]').forEach(button => {
      const reading = module.readings[Number(button.dataset.reading)];
      button.onclick = () => openWork(WORKS.find(work => work.title === reading.work), true);
    });
    $('#lessonListen').onclick = () => reader.say(
      [module.title, module.overview, ...module.readings.map(reading => 'What the text says. ' + reading.evidence),
        'One interpretation. ' + module.interpretation, 'Journal prompt. ' + module.prompt].join(' '),
      $('#lessonListen'), '▶ Listen to lesson');
    $('#lessonNote').onclick = () => startNote(module.title);
    $('#lessonContent [data-go]').onclick = () => show('study');
    $('#flipCard').onclick = () => {
      reviewing = !reviewing;
      renderCard();
    };
    $('#previousCard').onclick = () => moveCard(-1);
    $('#nextCard').onclick = () => moveCard(1);
    $('#knowCard').onclick = () => {
      const reviewed = load('progress', {})[id]?.reviewed || [];
      if (!reviewed.includes(cardIndex) && updateProgress({ reviewed: [...reviewed, cardIndex] })) renderCard();
    };
    $('#quizForm').onsubmit = event => {
      event.preventDefault();
      const answers = new FormData(event.currentTarget);
      quizResult = module.questions.map((_, index) => Number(answers.get('q' + index)));
      const score = quizResult.filter((answer, index) => answer === module.questions[index][2]).length;
      const previous = load('progress', {})[id]?.best || 0;
      updateProgress({ best: Math.max(previous, score) });
      renderQuiz();
    };
    $('#retryQuiz').onclick = () => {
      $('#quizForm').reset();
      quizResult = null;
      renderQuiz();
      $('#quizForm input').focus();
    };
    $('#completeModule').onclick = () => {
      const complete = Boolean(load('progress', {})[id]?.complete);
      if (updateProgress({ complete: !complete })) renderCompletion();
    };
    renderCard();
    renderCompletion();
    show('lesson');
  }

  function moveCard(delta) {
    cardIndex += delta;
    reviewing = false;
    renderCard();
    $('#flipCard').focus();
  }

  function renderCard() {
    const cards = currentModule.cards;
    const [question, answer, sourceIndex] = cards[cardIndex];
    const reviewed = load('progress', {})[currentModule.id]?.reviewed || [];
    $('#cardPosition').textContent = `Card ${cardIndex + 1} of ${cards.length} · ${reviewed.length} reviewed`;
    $('#cardContent').innerHTML = `<p><strong>${escapeHTML(question)}</strong></p>
      <div id="cardAnswer" ${reviewing ? '' : 'hidden'}>
        <p>${escapeHTML(answer)}</p>
        ${translationLink(currentModule.readings[sourceIndex], currentModule.readings[sourceIndex].passage)}
      </div>`;
    $('#flipCard').textContent = reviewing ? 'Hide answer' : 'Reveal answer';
    $('#flipCard').setAttribute('aria-expanded', String(reviewing));
    $('#previousCard').disabled = cardIndex === 0;
    $('#nextCard').disabled = cardIndex === cards.length - 1;
    $('#knowCard').disabled = !reviewing || reviewed.includes(cardIndex);
    $('#knowCard').textContent = reviewed.includes(cardIndex) ? 'Reviewed' : 'Mark reviewed';
  }

  function renderQuiz() {
    const questions = currentModule.questions;
    questions.forEach(([, , correct, explanation, sourceIndex], index) => {
      const feedback = $('#feedback' + index);
      const source = currentModule.readings[sourceIndex];
      feedback.innerHTML = quizResult ? `<p><strong>${quizResult[index] === correct ? 'Correct.' : 'Review this passage.'}</strong>
        ${escapeHTML(explanation)} ${translationLink(source, source.passage)}</p>` : '';
    });
    const score = quizResult?.filter((answer, index) => answer === questions[index][2]).length;
    $('#quizResult').textContent = quizResult ? `Score: ${score} of ${questions.length}` : '';
    $('#retryQuiz').hidden = !quizResult;
    $('#quizForm button[type="submit"]').disabled = Boolean(quizResult);
    $$('#quizForm input').forEach(input => { input.disabled = Boolean(quizResult); });
  }

  function renderCompletion() {
    const complete = load('progress', {})[currentModule.id]?.complete;
    $('#completionStatus').textContent = complete ? 'Module complete' : 'Mark this module complete when you finish your study.';
    $('#completeModule').textContent = complete ? 'Mark incomplete' : 'Mark complete';
  }

  function startNote(context = '', entry = null) {
    noteContext = context;
    editingNote = entry?.id;
    $('#noteContext').textContent = context ? 'Linked to ' + context : '';
    $('#noteContext').hidden = !context;
    $('#noteTitle').value = entry?.title || context;
    $('#noteText').value = entry?.text || '';
    $('#saveNote').textContent = entry ? 'Save changes' : 'Save entry';
    $('#cancelNote').hidden = !entry;
    if (context || entry) {
      show('journal');
      $('#noteText').focus();
    }
  }

  function renderNotes() {
    const notes = load('notes', []);
    $('#notes').innerHTML = notes.length ? '<h2>Saved reflections</h2>' + notes.map((entry, index) => `
      <article>
        <div class="eyebrow">${escapeHTML(new Date(entry.created).toLocaleString())}</div>
        <h3>${escapeHTML(entry.title)}</h3>
        ${entry.context ? `<small>Linked to ${escapeHTML(entry.context)}</small>` : ''}
        ${STUDY_MODULES.some(module => module.title === entry.context) || WORKS.some(work => work.title === entry.context)
          ? `<div class="readerActions"><button data-note-link="${index}">Open linked reading</button></div>` : ''}
        <p>${escapeHTML(entry.text)}</p>
        <div class="readerActions"><button data-edit="${index}">Edit entry</button>
          <button data-delete="${index}">Delete entry</button></div>
      </article>`).join('') : '<p>No journal entries yet.</p>';
  }

  $('#notes').onclick = event => {
    const button = event.target.closest('[data-edit], [data-delete], [data-note-link]');
    if (!button) return;
    const notes = load('notes', []);
    if (button.dataset.noteLink != null) {
      const context = notes[Number(button.dataset.noteLink)].context;
      const module = STUDY_MODULES.find(entry => entry.title === context);
      const work = WORKS.find(entry => entry.title === context);
      if (module) openModule(module.id);
      else if (work) openWork(work);
    } else if (button.dataset.edit != null) {
      const entry = notes[Number(button.dataset.edit)];
      startNote(entry.context, entry);
    } else if (confirm('Delete this entry?')) {
      const entry = notes[Number(button.dataset.delete)];
      if (save('notes', notes.filter(note => note.id !== entry.id))) {
        if (editingNote === entry.id) startNote();
        renderNotes();
      }
    }
  };
  $('#cancelNote').onclick = () => {
    startNote();
    $('#noteTitle').focus();
  };
  $('#saveNote').onclick = () => {
    const title = $('#noteTitle').value.trim();
    const text = $('#noteText').value.trim();
    if (!title || !text) {
      alert('Add a title and reflection first.');
      return;
    }
    const notes = load('notes', []);
    const index = editingNote ? notes.findIndex(note => note.id === editingNote) : -1;
    if (index >= 0) notes[index] = { ...notes[index], title, text };
    else notes.unshift({ id: crypto.randomUUID?.() || String(Date.now()) + '-' + Math.random().toString(36),
      title, text, context: noteContext, created: new Date().toISOString() });
    if (save('notes', notes)) {
      startNote();
      renderNotes();
    }
  };
  $('#exportNotes').onclick = () => {
    const data = JSON.stringify({ format: 'gnosis-journal-v1', notes: load('notes', []) }, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gnosis-journal.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  $('#importNotes').onchange = async event => {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.format !== 'gnosis-journal-v1' || !Array.isArray(data.notes) || data.notes.length > 10000 ||
          !data.notes.every(note => note && ['title', 'text', 'id', 'created'].every(field => typeof note[field] === 'string'))) {
        throw new Error('Invalid journal format');
      }
      const notes = load('notes', []);
      const incoming = new Map();
      const known = new Set(notes.map(note => note.id));
      for (const entry of data.notes) {
        const id = entry.id.slice(0, 100);
        if (!known.has(id) && !incoming.has(id)) {
          incoming.set(id, { id, title: entry.title.slice(0, 120), text: entry.text.slice(0, 50000),
            created: entry.created, context: typeof entry.context === 'string' ? entry.context.slice(0, 120) : '' });
        }
      }
      if (save('notes', [...incoming.values(), ...notes])) {
        renderNotes();
        alert('Journal imported.');
      }
    } catch {
      alert('Could not import: invalid Gnosis journal JSON.');
    } finally {
      input.value = '';
    }
  };

  renderCatalog();
  renderNotes();
  renderProgress();
  $('.nav.active').setAttribute('aria-current', 'page');
  const requestedTitle = new URLSearchParams(location.search).get('read');
  const requestedWork = WORKS.find(work => work.title === requestedTitle);
  if (requestedWork) openWork(requestedWork);
})();
