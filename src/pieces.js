// Original vector pieces, kept local so the game also works without a CDN.
const paths = {
 p: '<circle cx="32" cy="17" r="8"/><path d="M27 25h10l-1 7 5 13H23l5-13z"/><path d="M22 46h20l3 8H19z"/>',
 r: '<path d="M19 10h7v8h5v-8h5v8h5v-8h6v15l-6 5v16H23V30l-4-5z"/><path d="M20 46h24l3 8H17z"/><path d="M24 26h16M25 40h14" fill="none"/>',
 n: '<path d="M21 46c0-12 13-12 14-23l-9 9-10-6L29 10l3-4 5 6c16 1 17 21 10 34z"/><path d="M20 46h27l3 8H17z"/><path d="m28 19 3-2M35 16c7 7 8 17 4 25" fill="none"/>',
 b: '<path d="M32 9c-3 7-12 10-12 19 0 7 6 10 12 10s12-3 12-10c0-9-9-12-12-19z"/><circle cx="32" cy="7" r="3"/><path d="m35 20-7 9M28 38l-5 9h18l-5-9"/><path d="M21 47h22l4 7H17z"/>',
 q: '<path d="m18 18 7 8 7-14 7 14 7-8-5 25H23z"/><circle cx="17" cy="14" r="4"/><circle cx="32" cy="9" r="4"/><circle cx="47" cy="14" r="4"/><path d="M23 38h18M22 44h20l5 10H17z"/>',
 k: '<path d="M32 7v13M26 12h12" fill="none" stroke-width="4"/><path d="M32 24c-13-15-23-1-15 8l7 8h16l7-8c8-9-2-23-15-8z"/><path d="M25 40h14l3 7H22zM21 47h22l4 7H17z"/>'
};
export function pieceSvg(type, color='w') { return `<svg class="piece ${color}" viewBox="0 0 64 64" aria-hidden="true"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.4">${paths[type] || ''}</g></svg>`; }
export const names = {p:'Пешка',r:'Ладья',n:'Конь',b:'Слон',q:'Ферзь',k:'Король'};
export const rules = {p:'Вперёд на одну клетку, с начальной позиции — на две. Взятие по диагонали. На последней горизонтали — превращение.',r:'По вертикали или горизонтали на любое число свободных клеток.',n:'Буквой «Г»: две клетки по одной оси и одна по другой. Может перепрыгивать фигуры.',b:'По диагонали на любое число свободных клеток.',q:'По вертикали, горизонтали или диагонали на любое число свободных клеток.',k:'На одну клетку в любом направлении, но не под шах. Рокировка — ход короля на две клетки.'};
