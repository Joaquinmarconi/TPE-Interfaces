class Calavera {
    constructor(x, y) {
        this.x = x;
        this.baseY = y;
        this.y = y;

        this.radius = 25;

        // velocidad horizontal (más lenta que los tubos que van a -3)
        this.vx = -1.2;

        // animación flotante
        this.floatSpeed = 0.004;
        this.floatAmplitude = 10;

        this.collected = false;
    }

    update() {
        // movimiento horizontal lento
        this.x += this.vx;

        // flotación vertical
        this.y = this.baseY + Math.sin(Date.now() * this.floatSpeed) * this.floatAmplitude;
    }

    offScreen() {
        return this.x < -50;  // permitir eliminarla
    }

    draw(ctx) {
        const img = document.getElementById("skullCoin");
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
        const cx = bird.x + bird.width / 2;
        const cy = bird.y + bird.height / 2;

        const dx = cx - this.x;
        const dy = cy - this.y;

        return dx*dx + dy*dy < (this.radius + 20) * (this.radius + 20);
    }
}
