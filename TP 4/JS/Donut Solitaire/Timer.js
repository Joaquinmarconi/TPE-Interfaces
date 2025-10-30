/**
 * Clase Timer - Controla el tiempo del juego
 * Responsabilidad: Gestionar el tiempo, no dibujarlo
 */
class Timer extends VisualComponent {
    constructor(ctx, x, y, timeLimit = null) {
        super(ctx, x, y);

        // Tiempo
        this.startTime = null;
        this.pausedTime = 0;
        this.elapsedTime = 0;
        this.timeLimit = timeLimit; // En segundos, null = sin límite

        // Estado
        this.isRunning = false;
        this.isPaused = false;
        this.timeUp = false;

        // Solo para advertencia (datos, no visualización)
        this.warningThreshold = 30; // Segundos para empezar a mostrar advertencia
        this.warningPulse = 0;
        this.warningSpeed = 0.1;
    }

    /**
     * Inicia el timer
     */
    start() {
        this.startTime = Date.now();
        this.isRunning = true;
        this.isPaused = false;
        this.timeUp = false;
    }

    /**
     * Pausa el timer
     */
    pause() {
        if (!this.isRunning || this.isPaused) return;

        this.isPaused = true;
        this.pausedTime = Date.now();
    }

    /**
     * Reanuda el timer
     */
    resume() {
        if (!this.isPaused) return;

        const pauseDuration = Date.now() - this.pausedTime;
        this.startTime += pauseDuration;
        this.isPaused = false;
    }

    /**
     * Detiene el timer
     */
    stop() {
        this.isRunning = false;
        this.isPaused = false;
    }

    /**
     * Reinicia el timer
     */
    reset() {
        this.startTime = Date.now();
        this.pausedTime = 0;
        this.elapsedTime = 0;
        this.timeUp = false;
        this.isRunning = false;
        this.isPaused = false;
    }

    /**
     * Actualiza el tiempo transcurrido
     */
    update() {
        if (!this.isRunning || this.isPaused) return;

        this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);

        // Verificar si se acabó el tiempo
        if (this.timeLimit && this.elapsedTime >= this.timeLimit) {
            this.timeUp = true;
            this.stop();
        }

        // Actualizar animación de advertencia
        if (this.isWarningTime()) {
            this.warningPulse += this.warningSpeed;
            if (this.warningPulse > Math.PI * 2) {
                this.warningPulse = 0;
            }
        }
    }

    /**
     * Verifica si está en tiempo de advertencia
     */
    isWarningTime() {
        if (!this.timeLimit) return false;

        const remainingTime = this.timeLimit - this.elapsedTime;
        return remainingTime > 0 && remainingTime <= this.warningThreshold;
    }

    /**
     * Obtiene el tiempo restante (si hay límite)
     */
    getRemainingTime() {
        if (!this.timeLimit) return null;

        const remaining = this.timeLimit - this.elapsedTime;
        return Math.max(0, remaining);
    }

    /**
     * Formatea el tiempo en formato MM:SS
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Obtiene el tiempo transcurrido en segundos
     */
    getElapsedTime() {
        return this.elapsedTime;
    }

    /**
     * Verifica si se acabó el tiempo
     */
    isTimeUp() {
        return this.timeUp;
    }

    // Implementación vacía para cumplir con VisualComponent
    draw() { }
}