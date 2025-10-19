// Ruteo mínimo por hash: #home muestra la Home screen
function showView(hash){
  const showHome = hash === '#home';
  const welcome = document.querySelector('.welcome');
  const home = document.getElementById('home-screen');
  
  if (welcome) {
    if (showHome) welcome.setAttribute('hidden', '');
    else welcome.removeAttribute('hidden');
  }
  
  if (home) {
    if (showHome) home.removeAttribute('hidden');
    else home.setAttribute('hidden', '');
  }
}

window.addEventListener('hashchange', () => showView(location.hash));
showView(location.hash || '');

// Fecha en header
const dateEl = document.getElementById('app-date');
if (dateEl){
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('es-ES', { day:'2-digit', month:'short', year:'numeric' });
  dateEl.textContent = fmt.format(now);
}

// Manejo simple de tabs (Iluminación / Temperatura)
(function setupTabs(){
  const tabs = Array.from(document.querySelectorAll('.tabs .tab'));
  const cards = document.querySelector('.cards');
  const tempPanel = document.getElementById('temperature-panel');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const isTemp = tab.textContent.trim().toLowerCase().includes('temperatura');

      if (cards) {
        if (isTemp) cards.setAttribute('hidden','');
        else cards.removeAttribute('hidden');
      }
      if (tempPanel) {
        if (isTemp) tempPanel.removeAttribute('hidden');
        else tempPanel.setAttribute('hidden','');
      }
    });
  });
})();

// Mostrar/ocultar pantallas simples
(function setupViews(){
  const home = document.getElementById('home-screen');
  const voice = document.getElementById('voice-screen');
  const navMic = document.querySelector('.nav__mic');
  const voiceBack = document.querySelector('.voice__back');

  function showScreen(el){
    if (home) home.hidden = true;
    if (voice) voice.hidden = true;
    if (!el) return;
    el.hidden = false;
  }

  if (navMic){
    navMic.addEventListener('click', (e) => {
      e.preventDefault();
      showScreen(voice || null);
    });
  }
  if (voiceBack){
    voiceBack.addEventListener('click', () => showScreen(home || null));
  }

  // Mic control + SpeechRecognition
  const micBtn = document.getElementById('voice-mic');
  const cmdEl = document.querySelector('.voice__command');
  const wave = document.querySelector('.voice__wave');

  let recognition = null;
  let listening = false;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  if (SpeechRecognition){
    recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.addEventListener('start', () => {
      listening = true;
      micBtn.setAttribute('aria-pressed', 'true');
      micBtn.classList.add('listening');
      cmdEl.textContent = 'Escuchando...';
      wave.classList.add('listening');
    });

    recognition.addEventListener('end', () => {
      listening = false;
      micBtn.setAttribute('aria-pressed', 'false');
      micBtn.classList.remove('listening');
      wave.classList.remove('listening');
      // mantener la última transcripción ya mostrada por 'result'
    });

    recognition.addEventListener('result', (ev) => {
      const transcript = Array.from(ev.results)
        .map(r => r[0].transcript)
        .join('');
      cmdEl.textContent = transcript || 'Sin resultado';
      // Aquí podrías procesar el comando (ej. enviar a backend o mapas de intención).
    });

    recognition.addEventListener('error', (ev) => {
      cmdEl.textContent = 'Error: ' + (ev.error || 'desconocido');
    });
  } else {
    // Fallback si no hay API
    if (cmdEl) cmdEl.textContent = 'Reconocimiento no soportado en este navegador.';
    if (micBtn) micBtn.disabled = true;
  }

  if (micBtn){
    micBtn.addEventListener('click', () => {
      if (!recognition) return;
      if (!listening){
        try { recognition.start(); }
        catch(e){ /* algunos navegadores lanzan si ya se estaba llamando start */ }
      } else {
        recognition.stop();
      }
    });
  }
})();

// Voice "Ver comandos" panel
(function setupCommandsPanel(){
  const openBtn = document.querySelector('.voice__commands');
  const panel = document.getElementById('voice-commands-panel');
  const closeBtn = document.getElementById('commands-close');
  const backdrop = panel ? panel.querySelector('.voice__commands-backdrop') : null;

  function openPanel(){
    if (!panel) return;
    panel.hidden = false;
    document.body.style.overflow = 'hidden';
    // focus manejo accesible
    const close = panel.querySelector('#commands-close');
    if (close) close.focus();
  }
  function closePanel(){
    if (!panel) return;
    panel.hidden = true;
    document.body.style.overflow = '';
    if (openBtn) openBtn.focus();
  }

  if (openBtn) openBtn.addEventListener('click', (e) => { e.preventDefault(); openPanel(); });
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (backdrop) backdrop.addEventListener('click', closePanel);

  // cerrar con ESC
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && panel && !panel.hidden) closePanel();
  });
})();