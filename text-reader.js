(() => {
  const byId = id => document.getElementById(id);
  const editions = window.GNOSIS_EDITIONS;
  const speech = window.speechSynthesis;
  const voice = byId('editionVoice');
  const play = byId('editionPlay');
  const pause = byId('editionPause');
  const stopButton = byId('editionStop');
  const status = byId('editionStatus');
  let passages = [];
  let session = 0;
  let active = false;
  let utterance;

  function reset() {
    active = false;
    utterance = null;
    play.disabled = !speech;
    pause.disabled = stopButton.disabled = true;
    pause.textContent = 'Pause';
  }

  function stop() {
    if (!active) return;
    session += 1;
    speech.cancel();
    reset();
    status.textContent = '';
  }

  function refreshVoices() {
    const selected = voice.value;
    voice.replaceChildren(new Option('Device default', ''));
    for (const item of speech.getVoices().filter(item => /^en\b/i.test(item.lang))) {
      voice.add(new Option(item.name, item.voiceURI));
    }
    if ([...voice.options].some(option => option.value === selected)) voice.value = selected;
  }

  function open(title) {
    stop();
    speech?.cancel();
    byId('speak').textContent = '▶ Listen to overview';
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
    text.replaceChildren();
    status.textContent = speech ? '' : 'Read-aloud is unavailable in this browser.';
    if (!edition) return;
    const source = document.createElement('a');
    source.href = edition.url;
    source.target = '_blank';
    source.rel = 'noopener';
    source.textContent = 'Source edition ↗';
    byId('editionCredit').replaceChildren('English translation by ' + edition.credit + ' · Public domain · ', source);
    for (const block of edition.blocks) {
      if (block.heading) {
        const heading = document.createElement('h3');
        heading.textContent = block.heading;
        text.append(heading);
      }
      const body = document.createElement('div');
      body.style.whiteSpace = 'pre-line';
      body.textContent = block.lines.join('\n');
      text.append(body);
      const lines = block.lines.filter(Boolean).join(' ');
      const sentences = lines.match(/[^.!?]+[.!?]+[”"’']*|[^.!?]+$/g) || [lines];
      let part = block.heading ? block.heading + '. ' : '';
      for (const sentence of sentences) {
        if (part && part.length + sentence.length > 420) {
          passages.push(part.trim());
          part = '';
        }
        part += sentence;
      }
      if (part.trim()) passages.push(part.trim());
    }
  }

  function speak(index, token, selectedVoice) {
    if (session !== token) return;
    if (index >= passages.length) {
      reset();
      status.textContent = 'Finished reading.';
      return;
    }
    utterance = new SpeechSynthesisUtterance(passages[index]);
    utterance.lang = selectedVoice?.lang || 'en-US';
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.9;
    utterance.onend = () => speak(index + 1, token, selectedVoice);
    utterance.onerror = () => {
      if (session !== token) return;
      reset();
      status.textContent = 'Playback stopped. Choose another browser voice or try again.';
    };
    speech.speak(utterance);
  }

  if (speech) {
    refreshVoices();
    speech.addEventListener('voiceschanged', refreshVoices);
    play.onclick = () => {
      if (!passages.length) return;
      speech.cancel();
      active = true;
      play.disabled = true;
      pause.disabled = stopButton.disabled = false;
      status.textContent = 'Reading full text.';
      speak(0, ++session, speech.getVoices().find(item => item.voiceURI === voice.value));
    };
    pause.onclick = () => {
      if (speech.paused) {
        speech.resume();
        pause.textContent = 'Pause';
        status.textContent = 'Reading full text.';
      } else {
        speech.pause();
        pause.textContent = 'Resume';
        status.textContent = 'Paused.';
      }
    };
    stopButton.onclick = stop;
  }
  reset();
  window.GnosisTextReader = { open, stop, active: () => active };
})();
