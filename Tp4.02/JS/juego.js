"use strict"

/*menus*/
let btnOpen = document.querySelector('#btn-open');
let btnMenuUsuario= document.querySelector('#btn-usuario');
let btnSubmenu= document.querySelector('#btn-submenu');

btnSubmenu.addEventListener('click', toggleSubMenu)
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





//interaccion like comentario//

for (let i = 1; i <= 5; i++) {
  const likeIcon = document.getElementById(`icono-like-${i}`);
  const contador = document.getElementById(`contador-${i}`);
  const img=document.querySelector(`#icono-img-${i}`);

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
  })
};


const btnComentar = document.getElementById('btn-comentar');

btnComentar.addEventListener('click', () => {
  // Reinicia la animación si ya se había hecho antes
  btnComentar.classList.remove('animar-comentar');
  void btnComentar.offsetWidth; // truco para forzar el reinicio
  btnComentar.classList.add('animar-comentar');
});

//popovers

const btnCom = document.getElementById('btn-compartir');
const popcom = document.querySelector('.popover-compartir');
const botonSus = document.querySelectorAll('.suscribirse');
const popoversus = document.querySelector('.popover-suscripcion');
const overlay = document.querySelector('.overlayJuego');

// al hacer click en el botón, mostramos o cerramos el popover + overlay
btnCom.addEventListener('click', togglePopoverCom);
botonSus.forEach(btn => {
  btn.addEventListener('click', togglePopoverSus);
});

// al hacer click en el overlay, cerramos todo
 overlay.addEventListener('click', () => {
  popcom.classList.remove('open');
  popoversus.classList.remove('open');
  overlay.classList.remove('active');
});

function togglePopoverCom() {
  popcom.classList.toggle('open');
  overlay.classList.toggle('active');
}
function togglePopoverSus() {
  popoversus.classList.toggle('open');
  overlay.classList.toggle('active');
}
 
  //lamados POO

window.onload = function() {
    const btnJugar = document.querySelector('#btn-jugar');
    const homerImg = document.querySelector('#img-homer');
    const botonJugar = document.querySelector('.boton-jugar');
    const canvas = document.getElementById('canva-Peg');
    const timer = document.querySelector('.ui');
    const overlayPeg=document.getElementById('overlay-Peg');
     const movimiento=document.getElementById('moves-container');

    // Rutas de imágenes
    const boardImageSrc = "Assets/MADERA.png";
    const pieceImageSrc1 = "Assets/fichaDona.png";
    const pieceImageSrc2 = "Assets/donaAmarilla.png";
    const pieceImageSrc3 = "Assets/donaVioleta.png";


    let game;

    btnJugar.addEventListener('click', () => {
    movimiento.style.display = 'block';
    homerImg.style.display = 'none';
    botonJugar.style.display = 'none';
    timer.style.display = 'block';
    canvas.style.display = 'block';
    canvas.style.marginLeft = '250px';
    canvas.style.marginTop = '45px';
    canvas.style.borderRadius='20px';
    overlayPeg.style.display= 'none';

    // Iniciar juego con tres tipos de ficha
    game = new GamePeg(canvas, boardImageSrc, pieceImageSrc1, pieceImageSrc2, pieceImageSrc3);

    // 🔹 Llamar animación de llenado de fichas
    game.animateFillBoard();
});
};
 const boardImageSrc = "Assets/MADERA.png";
    const pieceImageSrc = "Assets/fichaDona.png";