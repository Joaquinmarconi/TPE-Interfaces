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


let btnSubmenu= document.querySelector('#btn-submenu')
btnSubmenu.addEventListener('click', toggleSubMenu)

function toggleSubMenu() {
    let menu = document.querySelector('.submenu');
    menu.classList.toggle('open');
    btnSubmenu.classList.toggle("open"); //cambiar el estilo del botón cuando el submenú está abierto
}

const btnJugar = document.querySelector('#btn-jugar');
const homerImg = document.querySelector('.juego div img');

btnJugar.addEventListener('click', () => {
    // Quitar la clase si ya existía
    homerImg.classList.remove('animar');

    // Forzar reflow para reiniciar la animación
    void homerImg.offsetWidth;

    // Agregar la clase para que se ejecute la animación
    homerImg.classList.add('animar');
});


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
  })};


  const btnSus = document.getElementById('btn-suscribirse');

    // al hacer click, mostramos o cerramos el popover
    btnSus.addEventListener('click', togglePopoverSus)

    function togglePopoverSus() {
    let popsus = document.querySelector('.popover-suscripcion');
    popsus.classList.toggle('open');
}

let popsus = document.querySelector('.popover-suscripcion');
// cerrar popover al hacer click fuera de él
window.addEventListener('click', function(e) {
  // si el click NO es dentro del popover y NO es en el botón
  if (!popsus.contains(e.target) && e.target !== btnSus) {
    popsus.classList.remove('open');
  }
});