class Timer {
    constructor(displayElement, duration = 300, onTimeUp = null) { 
        this.displayElement = displayElement;
        this.duration = duration; // tiempo total en segundos
        this.timeLeft = duration;
        this.interval = null;
        this.running = false; //temporizador está en marcha
        this.onTimeUp = onTimeUp; // callback cuando termina
    }


     // Inicia el temporizador
    start() {
        if (this.running) return;
        this.running = true;
        this.interval = setInterval(() => {
            this.timeLeft--; //resta 1seg
            this.updateDisplay();//actualiza visualización

            // Cambiar a rojo los últimos 30 segundos
            if (this.timeLeft <= 30) {
                this.displayElement.style.color = "red";
                this.displayElement.style.fontWeight = "bold";
            }
             
            // Si el tiempo se agotó
            if (this.timeLeft <= 0) {
                this.stop();//para
                if (this.onTimeUp) this.onTimeUp();
            }
        }, 1000);
    }

    // Detiene el temporizador
    stop() {
        clearInterval(this.interval);
        this.running = false;
    }

     // Reinicia el temporizador al tiempo inicial
    reset() {
        this.stop();
        this.timeLeft = this.duration;
        this.displayElement.style.color = "";      // vuelve al color original
        this.displayElement.style.fontWeight = "";
        this.updateDisplay();
    }

     // Actualiza el texto del display en formato mm:ss
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60).toString().padStart(2, "0");
        const seconds = (this.timeLeft % 60).toString().padStart(2, "0");
        this.displayElement.textContent = `${minutes}:${seconds}`;
    }
}
