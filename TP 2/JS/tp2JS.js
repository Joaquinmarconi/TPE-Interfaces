"use strict"

let btnOpen = document.querySelector('#btn-open');
btnOpen.addEventListener('click', toggleMenu);

/* Abre o cierra el menú responsive*/
function toggleMenu() {
    let menu = document.querySelector('.main-nav');
    menu.classList.toggle('open');
}