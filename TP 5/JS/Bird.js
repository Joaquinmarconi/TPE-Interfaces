class Bird {
    constructor() {
        this.x = 280;
        this.y = 250;
        this.width = 81;
        this.height = 89;

        this.vy = 0;
        this.gravity = 0.4;
        this.jumpStrength = -7;
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
        this.vy = this.jumpStrength;

        // rotación hacia arriba
        const cuervo = document.getElementById("cuervo");
        cuervo.style.transform = "rotate(-22deg)";
    }

    getBounds() {
        const r = Math.min(this.width, this.height) * 0.38;
        return {
            cx: this.x + this.width / 2,
            cy: this.y + this.height / 2,
            r: r
        };
    }
}