"use strict"

/* abrir y cerrar ícono de ojo en input contraseña */

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
  const popover = document.querySelector(".acceso-popover");
  const overlay = document.querySelector(".overlay");

  form.addEventListener("submit", (e) => {
  e.preventDefault();

  popover.classList.add("visible"); // aparece con animación
  overlay.classList.add("visible");

  setTimeout(() => {
    window.location.href = "home.html"; // redirige automáticamente
  }, 3500); // segundos
  });
});
