// Format du ruban : Brother TZe 18 mm (Laminated White) sur P-touch D610BT.
const TAPE_WIDTH_MM = 18;
const MAX_PREVIEW_SCALE = 4;

const $ = (id) => document.getElementById(id);
const inputs = ['text', 'length', 'vmargin', 'frame'].map($);

function settings() {
  return {
    text: $('text').value,
    length: Math.max(20, Number($('length').value) || 60),
    vmargin: Math.max(0, Number($('vmargin').value) || 0),
    frame: $('frame').checked,
  };
}

// Remplit un élément .label aux dimensions réelles de l'étiquette.
function renderLabel(el, s) {
  el.classList.toggle('framed', s.frame);
  el.style.width = `${s.length}mm`;
  el.style.height = `${TAPE_WIDTH_MM}mm`;
  el.style.padding = `${s.vmargin}mm 2mm`;
  el.style.fontSize = `${(TAPE_WIDTH_MM - 2 * s.vmargin) * 0.75}mm`;
  el.textContent = s.text;
}

// Réduit la police jusqu'à ce que le texte tienne dans la longueur.
// L'élément doit être affiché pour être mesuré.
function fitText(el) {
  let size = parseFloat(getComputedStyle(el).fontSize);
  while (el.scrollWidth > el.clientWidth && size > 4) {
    size *= 0.95;
    el.style.fontSize = `${size}px`;
  }
  return el.style.fontSize;
}

function render() {
  const s = settings();

  const preview = $('preview');
  preview.innerHTML = '<div class="label"></div>';
  const shown = preview.firstChild;
  renderLabel(shown, s);
  const fontSize = fitText(shown);

  const available = preview.parentElement.clientWidth - 32;
  const scale = Math.min(MAX_PREVIEW_SCALE, available / shown.offsetWidth);
  shown.style.transform = `scale(${scale})`;
  preview.style.height = `${shown.offsetHeight * scale}px`;
  $('scale').textContent = scale.toFixed(1).replace('.', ',');

  renderLabel($('label'), s);
  $('label').style.fontSize = fontSize;

  // Format de page = taille exacte de l'étiquette, sans marge.
  $('page-style').textContent =
    `@page { size: ${s.length}mm ${TAPE_WIDTH_MM}mm; margin: 0; }`;
}

inputs.forEach((el) => el.addEventListener('input', render));
$('print').addEventListener('click', () => window.print());
window.addEventListener('resize', render);
render();
