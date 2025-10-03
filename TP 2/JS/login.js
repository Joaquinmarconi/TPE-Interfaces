"use strict"

/* input contraseña login 2 opciones, elegir cual */

/*function togglePassword() {
    const input = document.querySelector("#contraseña");
    if(input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}*/

function togglePassword(icon) {
  const input = document.querySelector("#contraseña");

  if (input.type === "password") {
    input.type = "text";                
    icon.classList.remove("fa-eye");    
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";            
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

/* popover */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-login");
  const popover = document.getElementById("acceso-popover");

  form.addEventListener("submit", (e) => {
  e.preventDefault();

  popover.classList.add("visible"); // aparece con animación

  setTimeout(() => {
    window.location.href = "home.html"; // redirige automáticamente
  }, 3000); // 3 segundos
  });
});
