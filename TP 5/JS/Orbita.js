class Orbita {
    constructor(x, y) {
        this.x = x;
        this.baseY = y;
        this.y = y;

        this.radius = 20;  // suficiente para la imagen 15x15

        this.vx = -3.2;  
        this.floatSpeed = 0.004;
        this.floatAmplitude = 8;

        this.collected = false;
    }

    update() {
        this.x += this.vx;
        this.y = this.baseY + Math.sin(Date.now() * this.floatSpeed) * this.floatAmplitude;
    }

    offScreen() {
        return this.x < -60;
    }

    draw(ctx) {
        const img = document.getElementById("powerShield");
        if (!img) return;

        ctx.drawImage(
            img,
            this.x - this.radius,
            this.y - this.radius,
            this.radius * 2,
            this.radius * 2
        );
    }

    collides(bird) {
        const bx = bird.x + bird.width / 2;
        const by = bird.y + bird.height / 2;

        const dx = bx - this.x;
        const dy = by - this.y;

        return (dx*dx + dy*dy) < (this.radius + 12) ** 2;
    }
}
