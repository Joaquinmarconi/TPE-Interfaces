"use strict"

/* Mostrar-Ocultar contraseña */

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

/* Validar longitud mínima de contraseña */

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

/* Popover */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-registro");
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

/* reCAPTCHA */

document.querySelector(".form-registro").addEventListener("submit", function(event) {
  const response = grecaptcha.getResponse();

  if (response.length === 0) {
    event.preventDefault(); // frena el submit
    alert("Por favor confirma que no eres un robot");
  }
});