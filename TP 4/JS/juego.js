"use strict"

/*menus*/
let btnOpen = document.querySelector('#btn-open');
let btnMenuUsuario = document.querySelector('#btn-usuario');
let btnSubmenu = document.querySelector('#btn-submenu');

btnSubmenu.addEventListener('click', toggleSubMenu);
btnOpen.addEventListener('click', toggleMenu);
btnMenuUsuario.addEventListener('click', toggleMenu2);

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
    btnSubmenu.classList.toggle("open"); //cambiar el estilo del botón cuando el submenú está abierto
}

//animacion mouse click//
const mouseIcon = document.getElementById("mouseIcon");
const icons = ["Assets/left-click.png", "Assets/right-click.png"];
let index = 0;

setInterval(() => {
    index = (index + 1) % icons.length;
    mouseIcon.src = icons[index];
}, 5000); // cambia cada 5 segundos

//interaccion like comentario//
for (let i = 1; i <= 5; i++) {
    const likeIcon = document.getElementById(`icono-like-${i}`);
    const contador = document.getElementById(`contador-${i}`);
    const img = document.querySelector(`#icono-img-${i}`);

    if (likeIcon) {
        likeIcon.addEventListener('click', () => {
            let likes = parseInt(contador.textContent);

            if (likeIcon.classList.contains('liked')) {
                likeIcon.classList.remove('liked');
                img.src = 'Assets/like-sin.png';
                contador.textContent = likes - 1;
            } else {
                likeIcon.classList.add('liked');
                img.src = 'Assets/like-con.png';
                contador.textContent = likes + 1;
            }
        });
    }
}

const btnComentar = document.getElementById('btn-comentar');

if (btnComentar) {
    btnComentar.addEventListener('click', () => {
        // Reinicia la animación si ya se había hecho antes
        btnComentar.classList.remove('animar-comentar');
        void btnComentar.offsetWidth; // truco para forzar el reinicio
        btnComentar.classList.add('animar-comentar');
    });
}

//popovers
const btnCom = document.getElementById('btn-compartir');
const popcom = document.querySelector('.popover-compartir');
const botonSus = document.querySelectorAll('.suscribirse');
const popoversus = document.querySelector('.popover-suscripcion');
const overlay = document.querySelector('.overlayJuego');

// al hacer click en el botón, mostramos o cerramos el popover + overlay
if (btnCom) {
    btnCom.addEventListener('click', togglePopoverCom);
}

if (botonSus) {
    botonSus.forEach(btn => {
        btn.addEventListener('click', togglePopoverSus);
    });
}

// al hacer click en el overlay, cerramos todo
if (overlay) {
    overlay.addEventListener('click', cerrarPopovers);
}

function togglePopoverCom() {
    popcom.classList.toggle('open');
    overlay.classList.toggle('active');
}

function togglePopoverSus() {
    popoversus.classList.toggle('open');
    overlay.classList.toggle('active');
}

function cerrarPopovers() {
    // Solo cerrar popovers si no estamos en el juego
    if (!game || !game.isRunning) {
        popcom.classList.remove('open');
        popoversus.classList.remove('open');
        overlay.classList.remove('active');
    }
}

// ============================================
// CÓDIGO DEL JUEGO PEG SOLITAIRE
// ============================================

let game = null;
let gameCanvas = null;

// Esperar a que el DOM esté cargado para inicializar el juego
document.addEventListener('DOMContentLoaded', function () {
    const btnJugar = document.getElementById('btn-jugar');

    if (btnJugar) {
        btnJugar.addEventListener('click', iniciarJuego);
    }

    // Event listener para reiniciar con la tecla R
    document.addEventListener('keydown', function (event) {
        if (event.key === 'r' || event.key === 'R') {
            if (game && game.gameOver) {
                game.restart();
            }
        }

        // Pausa con ESC
        if (event.key === 'Escape') {
            if (game && !game.gameOver && game.isRunning) {
                if (game.isPaused) {
                    game.resume();
                } else {
                    game.pause();
                }
            } else if (game && game.isRunning) {
                // Si ESC y el juego está corriendo, cerrar el juego
                cerrarJuego();
            }
        }
    });
});

/**
 * Inicializa el juego cuando se presiona el botón
 */
function iniciarJuego() {
    console.log('🎮 Iniciando juego...');

    // Crear el canvas DENTRO del recuadro del juego
    crearCanvasEnRecuadro();

    // Crear nueva instancia del juego
    if (game) {
        game.destroy();
    }

    game = new Game('gameCanvas', null);
    game.init();
}
/**
 * Crea el elemento canvas
 */
function crearCanvasEnRecuadro() {
    const contenedorJuego = document.querySelector('.juego');

    if (!contenedorJuego) {
        console.error('❌ No se encontró el contenedor .juego');
        return;
    }

    // Marcar como activo (oculta Homer y botón via CSS)
    contenedorJuego.classList.add('game-active');

    // Crear o reutilizar el canvas
    gameCanvas = document.getElementById('gameCanvas');

    if (!gameCanvas) {
        gameCanvas = document.createElement('canvas');
        gameCanvas.id = 'gameCanvas';
        gameCanvas.width = 900;
        gameCanvas.height = 500;

        contenedorJuego.appendChild(gameCanvas);
        console.log('✅ Canvas creado en el recuadro');
    }

    // Botón para cerrar el juego
    let btnCerrar = document.getElementById('btn-cerrar-juego-canvas');
    if (!btnCerrar) {
        btnCerrar = document.createElement('button');
        btnCerrar.id = 'btn-cerrar-juego-canvas';
        btnCerrar.innerHTML = '✕';
        btnCerrar.addEventListener('click', cerrarJuego);
        contenedorJuego.appendChild(btnCerrar);
    }
}

/**
 * Cierra el juego y vuelve a la página
 */
function cerrarJuego() {
    console.log('Cerrando juego...');

    if (game) {
        game.destroy();
        game = null;
    }

    if (gameCanvas) {
        gameCanvas.remove();
        gameCanvas = null;
    }

    const btnCerrar = document.getElementById('btn-cerrar-juego-canvas');
    if (btnCerrar) {
        btnCerrar.remove();
    }

    // Quitar clase activa (muestra Homer y botón via CSS)
    const contenedorJuego = document.querySelector('.juego');
    if (contenedorJuego) {
        contenedorJuego.classList.remove('game-active');
    }
}