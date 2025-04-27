// app.js — punto de entrada
import { SceneEngine } from './engine.js';

const KEY = 'sharedMorph';

// 1) Determinar “instancia” para el color base
let count = parseInt(localStorage.getItem('instanceCount')||'0',10);
count++;
localStorage.setItem('instanceCount', count);
const baseColor = (count % 2 === 1) ? 0x00ff77 : 0xff0044;

// 2) Crear engine
const engine = new SceneEngine({
  container: document.body,
  baseColor,
  onParamChange: throttle((f) => {
    localStorage.setItem(KEY, f);
  }, 50)
});

// 3) Leer valor inicial compartido
const initial = parseFloat(localStorage.getItem(KEY)) || 0;
engine.setMorph(initial);

// 4) Escuchar cambios desde otras ventanas
window.addEventListener('storage', (e) => {
  if (e.key === KEY && e.newValue !== null) {
    engine.setMorph(parseFloat(e.newValue));
  }
});

// — utilidad throttle — para limitar writes a localStorage
function throttle(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}
