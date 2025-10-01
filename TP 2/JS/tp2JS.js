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

/* input contraseña login */

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

