"use strict"

/* Frases que van apareciendo durante la carga */
const frases = [
  "Inicializando módulos...",
  "Cargando recursos...",
  "Preparando interfaz...",
  "Optimizando experiencia...",
  "¡Listo para jugar!"
];

let progreso = 0;
const loading = document.querySelector(".loading");
const loadingPorcentaje = document.querySelector(".loading-porcentaje");
const loadingTexto = document.querySelector(".loading-texto");
const loadingProgreso = document.querySelector(".loading-progreso");
const contenido = document.querySelector(".contenido");

const interval = setInterval(() => {
  progreso += 2; /* aumenta 2% cada 100ms → total 5 segundos */
  loadingProgreso.style.width = `${progreso}%`;
  loadingPorcentaje.textContent = `${progreso}%`;

  /* Cambia la frase según el progreso */
  const fraseIndex = Math.floor(progreso / 20);
  loadingTexto.textContent = frases[fraseIndex] || frases[frases.length - 1];

  if (progreso >= 100) {
    clearInterval(interval);
    setTimeout(() => {
      loading.classList.add("hidden");
      setTimeout(() => {
        loading.style.display = "none";
        contenido.style.display = "block";
      }, 800);
    }, 300);
  }
}, 100);
