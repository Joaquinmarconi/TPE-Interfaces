class Tubo {
    constructor(x, canvasHeight) {
        this.x = x;
        this.width = 90;      // un poco más fino
        this.speed = 2;
        this.scored = false;

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

        const fill   = "#737786ff";
        const stroke = "#2A2A2A";
        const lipHeight = 25;
        const lipMargin = 5;

        ctx.lineWidth = 6;
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;

        // ===== TUBO SUPERIOR =====
        ctx.beginPath();
        ctx.rect(this.x, 0, this.width, this.topHeight);
        ctx.fill();
        ctx.stroke();

        // labio
        ctx.beginPath();
        ctx.rect(
            this.x - lipMargin,
            this.topHeight - lipHeight,
            this.width + lipMargin * 2,
            lipHeight
        );
        ctx.fill();
        ctx.stroke();

        // ===== TUBO INFERIOR =====
        ctx.beginPath();
        ctx.rect(this.x, this.bottomY, this.width, this.bottomHeight);
        ctx.fill();
        ctx.stroke();

        // labio
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

    // ⭐ AHORA Usa ELIPSE en lugar de círculo
    collides(bird) {
        const b = bird.getBounds(); // cx, cy, rx, ry

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
            this.ellipseRectCollision(b, rectTop) ||
            this.ellipseRectCollision(b, rectBottom)
        );
    }

    // ⭐ Colisión ELIPSE vs RECT
    ellipseRectCollision(b, r) {
        // punto más cercano del rectángulo al centro de la elipse
        const closestX = Math.max(r.x, Math.min(b.cx, r.x + r.width));
        const closestY = Math.max(r.y, Math.min(b.cy, r.y + r.height));

        const dx = closestX - b.cx;
        const dy = closestY - b.cy;

        // ecuación de la elipse: (dx² / rx²) + (dy² / ry²) < 1
        const value = (dx * dx) / (b.rx * b.rx) + (dy * dy) / (b.ry * b.ry);
        return value < 1;
    }
}