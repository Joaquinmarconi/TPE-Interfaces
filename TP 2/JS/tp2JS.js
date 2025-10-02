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
}

/* input contraseña login 2 opciones, elegir cual*/

function togglePassword() {
    const input = document.querySelector("#contraseña");
    if(input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

/*function togglePassword(icon) {
  let input = document.querySelector("#contraseña");

  if (input.type === "password") {
    input.type = "text";                
    icon.classList.remove("fa-eye");    
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";            
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}*/

document.addEventListener("DOMContentLoaded", () => {
  const popover = document.querySelector("#acceso-popover");
  const form = document.querySelector(".form-login");

  form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    popover.showPopover(); // muestra el cartel
  });
});


