class Bird {
    constructor() {
        this.x = 280;
        this.y = 250;
        this.width = 81;
        this.height = 89;

        this.vy = 0;
        this.gravity = 0.4;
        this.jumpStrength = -7;

        // === SONIDO DEL IMPULSO ===
        this.jumpSound = document.getElementById("soundJump");
    }

    update() {
        this.vy += this.gravity;
        this.y += this.vy;

        // ==== ANIMACIÓN DE ROTACIÓN SEGÚN VY ====
        const cuervo = document.getElementById("cuervo");

        if (this.vy > 2) {
            cuervo.style.transform = "rotate(22deg)"; // cayendo
        } 
        else if (this.vy < -3) {
            cuervo.style.transform = "rotate(-22deg)"; // subiendo fuerte
        } 
        else {
            cuervo.style.transform = "rotate(0deg)";  // estable
        }

        // límites verticales
        if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
        }
        if (this.y + this.height > 567) {
            this.y = 567 - this.height;
            this.vy = 0;
        }
    }
jump() {
    // si hay game over NO permitir saltos ni sonidos
    if (window.flappyGame && window.flappyGame.isGameOver) return;

    this.vy = this.jumpStrength;

    // rotación hacia arriba
    const cuervo = document.getElementById("cuervo");
    cuervo.style.transform = "rotate(-22deg)";

    // ==== SONIDO DE IMPULSO ====
    if (this.jumpSound) {
        this.jumpSound.pause();      // por si estaba sonando
        this.jumpSound.currentTime = 0;
        this.jumpSound.play().catch(() => {});
    }
}

    getBounds() {
        return {
            cx: this.x + this.width / 2,
            cy: this.y + this.height / 2,
            rx: this.width * 0.30,
            ry: this.height * 0.30
        };
    }
}
