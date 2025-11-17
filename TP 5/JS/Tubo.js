class Tubo {
    constructor(x, canvasHeight) {
        this.x = x;
        this.width = 100;       // ★ ACHICADO
        this.speed = 2;

        const gap = 150;
        const minHeight = 80;

        const maxTop = canvasHeight - gap - minHeight * 2;
        this.topHeight = Math.floor(Math.random() * maxTop) + minHeight;

        this.bottomY = this.topHeight + gap;
        this.bottomHeight = canvasHeight - this.bottomY;

        this.canvasHeight = canvasHeight;
    }

    update() {
        this.x -= this.speed;
    }

    offScreen() {
        return this.x + this.width < 0;
    }

    draw(ctx) {
        ctx.save();

        const fill   = "#737786ff";   // gris lápida
        const stroke = "#272626ff";   // borde
        const lipHeight = 25;
        const lipMargin = 5;

        ctx.lineWidth = 6;
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;

        // ========== TUBO SUPERIOR ==========

        // cuerpo
        ctx.beginPath();
        ctx.rect(this.x, 0, this.width, this.topHeight);
        ctx.fill();
        ctx.stroke();

        // labio inferior
        ctx.beginPath();
        ctx.rect(
            this.x - lipMargin,
            this.topHeight - lipHeight,
            this.width + lipMargin * 2,
            lipHeight
        );
        ctx.fill();
        ctx.stroke();

        // ========== TUBO INFERIOR ==========

        // cuerpo
        ctx.beginPath();
        ctx.rect(this.x, this.bottomY, this.width, this.bottomHeight);
        ctx.fill();
        ctx.stroke();

        // labio superior
        ctx.beginPath();
        ctx.rect(
            this.x - lipMargin,
            this.bottomY,
            this.width + lipMargin * 2,
            lipHeight
        );
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    // ======== Colisión ========
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
}