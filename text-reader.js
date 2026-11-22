(() => {
  const byId = id => document.getElementById(id);
  const editions = window.GNOSIS_EDITIONS;
  const speech = window.speechSynthesis;
  const voiceSelect = byId('editionVoice');
  const rateSelect = byId('narratorRate');
  const play = byId('editionPlay');
  const pause = byId('editionPause');
  const stopButton = byId('editionStop');
  const prev = byId('editionPrev');
  const next = byId('editionNext');
  const status = byId('editionStatus');
  const settingsKey = 'gnosis-narrator-v1';

  // passages: [{ text, block }] — block is the element highlighted while it is read
  let passages = [];
  let session = 0;
  let active = false;
  let index = 0;
  let mode = null; // 'edition' | 'snippet'
  let snippetButton = null;
  let snippetLabel = '';

  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(settingsKey)) || {}; } catch { return {}; }
  }
  function saveSettings() {
    try { localStorage.setItem(settingsKey, JSON.stringify({ voice: voiceSelect.value, rate: rateSelect.value })); } catch {}
  }

  // Rank voices so the most natural-sounding installed voice is chosen first.
  function score(v) {
    const n = v.name.toLowerCase();
    let s = 0;
    if (/premium/.test(n)) s += 60;
    if (/enhanced|natural|neural|online/.test(n)) s += 45;
    if (/google/.test(n)) s += 30;
    if (/\b(ava|zoe|evan|nathan|joelle|noelle|serena|jamie|samantha|daniel|aria|jenny|guy|libby|sonia|ryan)\b/.test(n)) s += 20;
    if (/^en-(us|gb)/i.test(v.lang)) s += 8;
    if (v.localService) s += 2;
    if (/compact|espeak|zarvox|whisper|bells|bubbles|cellos|trinoids|albert|bad news|good news|jester|organ|superstar|wobble|boing|deranged|hysterical|pipe organ/.test(n)) s -= 100;
    return s;
  }
  function englishVoices() {
    return speech.getVoices().filter(v => /^en\b/i.test(v.lang)).sort((a, b) => score(b) - score(a));
  }
  function selectedVoice() {
    return speech?.getVoices().find(v => v.voiceURI === voiceSelect.value) || null;
  }
  function rate() {
    return Number(rateSelect.value) || 0.95;
  }

  function refreshVoices() {
    const saved = loadSettings();
    const keep = voiceSelect.value || saved.voice || '';
    const voices = englishVoices();
    voiceSelect.replaceChildren();
    voices.forEach((v, i) => voiceSelect.add(new Option(v.name + (i === 0 ? ' — recommended' : ''), v.voiceURI)));
    voiceSelect.add(new Option('Device default', ''));
    if ([...voiceSelect.options].some(o => o.value === keep) && keep) voiceSelect.value = keep;
    else voiceSelect.value = voices[0]?.voiceURI || '';
  }

  function clearHighlight() {
    document.querySelectorAll('.reading').forEach(el => el.classList.remove('reading'));
  }

  function setButtons() {
    const editionRunning = active && mode === 'edition';
    play.disabled = !speech || editionRunning || !passages.length;
    pause.disabled = stopButton.disabled = !editionRunning;
    prev.disabled = next.disabled = !editionRunning;
    if (!editionRunning) pause.textContent = 'Pause';
  }

  function reset() {
    active = false;
    clearHighlight();
    if (snippetButton) snippetButton.textContent = snippetLabel;
    snippetButton = null;
    setButtons();
  }

  function stop() {
    if (!active) return;
    session += 1;
    speech.cancel();
    const wasEdition = mode === 'edition';
    reset();
    if (wasEdition) status.textContent = '';
  }

  function speakQueue(queue, start, token) {
    if (session !== token) return;
    if (start >= queue.length) {
      const wasEdition = mode === 'edition';
      reset();
      if (wasEdition) { status.textContent = 'Finished reading.'; index = 0; }
      return;
    }
    index = start;
    const item = queue[start];
    clearHighlight();
    if (item.block) {
      item.block.classList.add('reading');
      const r = item.block.getBoundingClientRect();
      if (r.top < 80 || r.bottom > innerHeight - 40) item.block.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (mode === 'edition') status.textContent = `Reading passage ${start + 1} of ${queue.length}.`;
    const u = new SpeechSynthesisUtterance(item.text);
    const v = selectedVoice();
    u.lang = v?.lang || 'en-US';
    if (v) u.voice = v;
    u.rate = rate();
    u.onend = () => speakQueue(queue, start + 1, token);
    u.onerror = e => {
      if (session !== token || e.error === 'interrupted' || e.error === 'canceled') return;
      reset();
      if (mode === 'edition') status.textContent = 'Playback stopped. Choose another voice or try again.';
    };
    speech.speak(u);
  }

  function begin(queue, start, newMode) {
    speech.cancel();
    if (snippetButton) snippetButton.textContent = snippetLabel;
    mode = newMode;
    active = true;
    const token = ++session;
    setButtons();
    // Small delay lets Safari/Chrome finish cancelling before speaking again.
    setTimeout(() => speakQueue(queue, start, token), 60);
  }

  function chunk(text, block, out, prefix = '') {
    const sentences = text.match(/[^.!?]+[.!?]+[”"’')\]]*|[^.!?]+$/g) || [text];
    let part = prefix;
    for (const s of sentences) {
      if (part && part.length + s.length > 380) { out.push({ text: part.trim(), block }); part = ''; }
      part += s;
    }
    if (part.trim()) out.push({ text: part.trim(), block });
  }

  // Read any short text (overview, atlas concept, study pathway). Toggles on repeat click.
  function say(text, button, label) {
    if (!speech) { alert('Read-aloud is not supported by this browser.'); return; }
    if (active && mode === 'snippet' && snippetButton === button) { stop(); return; }
    if (active) stop();
    const queue = [];
    chunk(text.replace(/\s+/g, ' ').trim(), null, queue);
    snippetLabel = label || button?.textContent || '';
    begin(queue, 0, 'snippet');
    snippetButton = button || null;
    if (button) button.textContent = '■ Stop listening';
  }

  function open(title) {
    stop();
    speech?.cancel();
    const edition = editions[title];
    byId('fullEdition').hidden = !edition;
    byId('externalEdition').hidden = Boolean(edition);
    const external = byId('externalEditionLink');
    const john = title === 'The Apocryphon of John';
    external.href = john
      ? 'https://www.academia.edu/127214950/The_Secret_Writing_According_to_John_A_Public_Domain_Synoptic_Translation'
      : 'https://www.luminescence-llc.net/nag-hammadi';
    external.textContent = john ? 'Read the public-domain Apocryphon of John ↗' : 'Find a public-domain translation ↗';
    const text = byId('editionText');
    passages = [];
    index = 0;
    text.replaceChildren();
    status.textContent = speech ? '' : 'Read-aloud is unavailable in this browser.';
    if (edition) {
      const source = document.createElement('a');
      source.href = edition.url;
      source.target = '_blank';
      source.rel = 'noopener';
      source.textContent = 'Source edition ↗';
      byId('editionCredit').replaceChildren('English translation by ' + edition.credit + ' · Public domain · ', source);
      edition.blocks.forEach(block => {
        const wrap = document.createElement('div');
        wrap.className = 'passage';
        wrap.title = 'Click to read from here';
        if (block.heading) {
          const heading = document.createElement('h3');
          heading.textContent = block.heading;
          wrap.append(heading);
        }
        const body = document.createElement('div');
        body.style.whiteSpace = 'pre-line';
        body.textContent = block.lines.join('\n');
        wrap.append(body);
        text.append(wrap);
        const first = passages.length;
        chunk(block.lines.filter(Boolean).join(' '), wrap, passages, block.heading ? block.heading + '. ' : '');
        wrap.addEventListener('click', () => { if (speech && passages.length) { status.textContent = ''; begin(passages, first, 'edition'); } });
      });
    }
    setButtons();
  }

  if (speech) {
    const saved = loadSettings();
    if (saved.rate && [...rateSelect.options].some(o => o.value === saved.rate)) rateSelect.value = saved.rate;
    refreshVoices();
    speech.addEventListener('voiceschanged', refreshVoices);
    voiceSelect.addEventListener('change', saveSettings);
    rateSelect.addEventListener('change', saveSettings);
    play.onclick = () => { if (passages.length) begin(passages, index, 'edition'); };
    pause.onclick = () => {
      if (speech.paused) {
        speech.resume();
        pause.textContent = 'Pause';
        status.textContent = `Reading passage ${index + 1} of ${passages.length}.`;
      } else {
        speech.pause();
        pause.textContent = 'Resume';
        status.textContent = 'Paused.';
      }
    };
    prev.onclick = () => begin(passages, Math.max(0, index - 1), 'edition');
    next.onclick = () => begin(passages, Math.min(passages.length - 1, index + 1), 'edition');
    stopButton.onclick = () => { stop(); index = 0; };
  } else {
    byId('narrator').hidden = true;
  }
  reset();
  window.GnosisTextReader = { open, stop, say, active: () => active };
})();
