class Bird {
    constructor() {
        this.x = 280;    // coincide con #cuervo.left
        this.y = 250;    // coincide con #cuervo.top
        this.width = 81;
        this.height = 89;

        this.vy = 0;
        this.gravity = 0.4;
        this.jumpStrength = -7;
    }

    update() {
        this.vy += this.gravity;
        this.y += this.vy;

        // límites verticales
        if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
        }
        if (this.y + this.height > 567) { // altura del canvas/parallax
            this.y = 567 - this.height;
            this.vy = 0;
        }
    }

    jump() {
        this.vy = this.jumpStrength;

        const cuervo = document.getElementById("cuervo");
        cuervo.style.transform = "rotate(-20deg)";
        setTimeout(() => {
            cuervo.style.transform = "rotate(0deg)";
        }, 150);
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