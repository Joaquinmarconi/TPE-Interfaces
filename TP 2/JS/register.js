"use strict"

function togglePassword(icon) {
  const input = icon.closest('.input-contenedor').querySelector(".campo-password");

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

/* input contraseña error */

const passwordInput = document.querySelectorAll('.campo-password');

passwordInput.forEach(input => {
    input.addEventListener('input', () => {
        if(input.value.length < 8) {
            input.style.border = '1px solid #ff4d4d';
        } else {
            input.style.border = '1px solid #fafafa';
        }
    });
});

/* popover */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-registro");
  const popover = document.getElementById("acceso-popover");

  form.addEventListener("submit", (e) => {
  e.preventDefault();

  popover.classList.add("visible"); // aparece con animación

  setTimeout(() => {
    window.location.href = "home.html"; // redirige automáticamente
  }, 3000); // 3 segundos
  });
});