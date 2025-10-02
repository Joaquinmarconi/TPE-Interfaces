"use strict"

let btnOpen = document.querySelector('#btn-open');
btnOpen.addEventListener('click', toggleMenu);



/* Abre o cierra el menú responsive*/
function toggleMenu() {
    let menu = document.querySelector('.main-nav');
    menu.classList.toggle('open');
}

let btnMenuUsuario= document.querySelector('#btn-usuario')
btnMenuUsuario.addEventListener('click', toggleMenu2)

function toggleMenu2() {
    let menu = document.querySelector('.main-nav-user');
    menu.classList.toggle('openUser');
}



