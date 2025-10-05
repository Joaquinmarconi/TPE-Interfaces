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
// Botón del header
const btnSus = document.getElementById('btn-suscribirse');
if (btnSus) {
    btnSus.addEventListener('click', () => {
        const overlay = document.querySelector('.overlay');
        const dialog = document.querySelector('.popover-suscripcion');
        if (overlay && dialog) {
            overlay.classList.add('visible');
            dialog.classList.add('open');
        }
    });
}

// Botón del footer
const btnFooter = document.getElementById('btn-suscribirse-footer');
const overlay = document.querySelector('.overlay');
const dialog = document.querySelector('.popover-suscripcion');

if (btnFooter && overlay && dialog) {
    btnFooter.addEventListener('click', () => {
        overlay.classList.add('visible');
        dialog.classList.add('open');
    });
}

// Cerrar al hacer click fuera
if (overlay && dialog) {
    window.addEventListener('click', function (e) {
        const isBtn = (btnSus && e.target === btnSus) || (btnFooter && e.target === btnFooter);
        
        if (!dialog.contains(e.target) && !isBtn) {
            overlay.classList.remove('visible');
            dialog.classList.remove('open');
        }
    });
}