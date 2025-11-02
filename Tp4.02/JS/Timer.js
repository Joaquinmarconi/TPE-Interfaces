class Timer {
    constructor(displayElement, duration = 300, onTimeUp = null) { 
        this.displayElement = displayElement;
        this.duration = duration; // tiempo total en segundos
        this.timeLeft = duration;
        this.interval = null;
        this.running = false;
        this.onTimeUp = onTimeUp; // callback cuando termina
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.interval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            // 🔴 Cambiar a rojo los últimos 30 segundos
            if (this.timeLeft <= 30) {
                this.displayElement.style.color = "red";
                this.displayElement.style.fontWeight = "bold";
            }

            if (this.timeLeft <= 0) {
                this.stop();
                if (this.onTimeUp) this.onTimeUp();
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
        this.running = false;
    }

    reset() {
        this.stop();
        this.timeLeft = this.duration;
        this.displayElement.style.color = "";      // vuelve al color original
        this.displayElement.style.fontWeight = "";
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60).toString().padStart(2, "0");
        const seconds = (this.timeLeft % 60).toString().padStart(2, "0");
        this.displayElement.textContent = `${minutes}:${seconds}`;
    }
}
