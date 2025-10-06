"use strict"

/* === MENÚS DEL HEADER === */
let btnOpen = document.querySelector('#btn-open');
let btnMenuUsuario = document.querySelector('#btn-usuario');
let btnSubmenu = document.querySelector('#btn-submenu');

if (btnOpen) {
    btnOpen.addEventListener('click', toggleMenu);
}

if (btnMenuUsuario) {
    btnMenuUsuario.addEventListener('click', toggleMenu2);
}

if (btnSubmenu) {
    btnSubmenu.addEventListener('click', toggleSubMenu);
}

function toggleMenu() {
    let menu = document.querySelector('.main-nav');
    menu.classList.toggle('open');
}

function toggleMenu2() {
    let menu = document.querySelector('.main-nav-user');
    menu.classList.toggle('openUser');
}

function toggleSubMenu() {
    let menu = document.querySelector('.submenu');
    menu.classList.toggle('open');
    btnSubmenu.classList.toggle("open");
}

/* === POPOVERS DE SUSCRIPCIÓN === */
const btnSus = document.getElementById('btn-suscribirse');
const btnFooter = document.getElementById('btn-suscribirse-footer');
const overlay = document.querySelector('.overlay');

function abrirSuscripcion() {
    const dialogSuscripcion = document.getElementById('mensaje-subscripcion');

    // Abrir suscripción
    if (overlay && dialogSuscripcion) {
        overlay.classList.add('visible');
        dialogSuscripcion.classList.add('open');
    }
}

if (btnSus) {
    btnSus.addEventListener('click', abrirSuscripcion);
}

if (btnFooter) {
    btnFooter.addEventListener('click', abrirSuscripcion);
}

// Cerrar al hacer click fuera
if (overlay) {
    window.addEventListener('click', function (e) {
        const dialogSuscripcion = document.getElementById('mensaje-subscripcion');
        const popupPremium = document.getElementById('popup-premium');
        const isBtn = (btnSus && e.target === btnSus) || (btnFooter && e.target === btnFooter);

        // Solo cerrar si no es click en ningún popup ni en botones
        if (!dialogSuscripcion.contains(e.target) &&
            !popupPremium.contains(e.target) &&
            !isBtn) {
            overlay.classList.remove('visible');
            dialogSuscripcion.classList.remove('open');
            popupPremium.classList.remove('open');
        }
    });
}