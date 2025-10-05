"use strict"

// Frases que van apareciendo durante la carga
const frases = [
  "Inicializando módulos...",
  "Cargando recursos...",
  "Preparando interfaz...",
  "Optimizando experiencia...",
  "¡Listo para jugar!"
];

let progress = 0;
const loading = document.querySelector(".loading");
const loadingPercent = document.querySelector(".loading-percent");
const loadingText = document.querySelector(".loading-text");
const loadingProgress = document.querySelector(".loading-progress");
const contenido = document.querySelector(".contenido");

const interval = setInterval(() => {
  progress += 2; // aumenta 2% cada 100ms → total 5 segundos
  loadingProgress.style.width = `${progress}%`;
  loadingPercent.textContent = `${progress}%`;

  // Cambia la frase según el progreso
  const fraseIndex = Math.floor(progress / 20);
  loadingText.textContent = frases[fraseIndex] || frases[frases.length - 1];

  if (progress >= 100) {
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
