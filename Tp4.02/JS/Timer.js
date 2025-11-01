class Timer {
    constructor(displayElement, duration = 300) { // duración en segundos
        this.displayElement = displayElement;
        this.duration = duration; // tiempo total
        this.timeLeft = duration; // tiempo restante
        this.interval = null;
        this.running = false;
    }

    start() {
        if (this.running) return; // no iniciar varias veces
        this.running = true;
        this.interval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            if (this.timeLeft <= 0) {
                this.stop();
                alert("¡Se acabó el tiempo!");
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
        this.running = false;
    }

    reset() {
        this.timeLeft = this.duration;
        this.updateDisplay();
        this.stop();
    }

    updateDisplay() {
        let minutes = Math.floor(this.timeLeft / 60).toString().padStart(2, "0");
        let seconds = (this.timeLeft % 60).toString().padStart(2, "0");
        this.displayElement.textContent = `Tiempo: ${minutes}:${seconds}`;
    }
}