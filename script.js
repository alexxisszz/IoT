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