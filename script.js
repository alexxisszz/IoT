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