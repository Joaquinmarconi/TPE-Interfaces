class Tubo {
    constructor(x, canvasHeight) {
        this.x = x;
        this.width = 130;   // recomendado para la nueva textura
        this.speed = 2;

        const gap = 150;
        const minHeight = 60;

        const maxTop = canvasHeight - gap - minHeight * 2;
        this.topHeight = Math.floor(Math.random() * maxTop) + minHeight;

        this.bottomY = this.topHeight + gap;
        this.bottomHeight = canvasHeight - this.bottomY;

        this.passed = false;

        this.canvasHeight = canvasHeight;
    }

    update() {
        this.x -= this.speed;
    }

    offScreen() {
        return this.x + this.width < 0;
    }

    // ⭐⭐ AQUÍ — este draw REEMPLAZA al viejo ⭐⭐
    draw(ctx) {
        const img = document.getElementById("tuboHuesos");

        // TUBO SUPERIOR (invertido)
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.topHeight);
        ctx.scale(1, -1);
        ctx.drawImage(
            img,
            -this.width / 2,
            0,
            this.width,
            this.topHeight
        );
        ctx.restore();

        // TUBO INFERIOR
        ctx.drawImage(
            img,
            this.x,
            this.bottomY,
            this.width,
            this.bottomHeight
        );
    }
collides(bird) {
    const b = bird.getBounds();

    const rectTop = {
        x: this.x,
        y: 0,
        width: this.width,
        height: this.topHeight
    };

    const rectBottom = {
        x: this.x,
        y: this.bottomY,
        width: this.width,
        height: this.bottomHeight
    };

    return (
        this.circleRectCollision(b, rectTop) ||
        this.circleRectCollision(b, rectBottom)
    );
}

circleRectCollision(b, r) {
    const closestX = Math.max(r.x, Math.min(b.cx, r.x + r.width));
    const closestY = Math.max(r.y, Math.min(b.cy, r.y + r.height));

    const dx = b.cx - closestX;
    const dy = b.cy - closestY;

    return (dx * dx + dy * dy) < (b.r * b.r);
}
    // (tu colisión circular queda como está)
}