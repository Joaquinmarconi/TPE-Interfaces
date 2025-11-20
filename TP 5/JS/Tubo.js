class Tubo {
    constructor(x, canvasHeight, gapSize) {
        this.gapSize = gapSize;
        this.x = x;
        this.width = 90;
        this.speed = 2;
        this.scored = false;

        this.gapSize = gapSize;

        const minHeight = 80;
        const maxTop = canvasHeight - gapSize - minHeight * 2;

        this.topHeight = Math.floor(Math.random() * maxTop) + minHeight;

        this.bottomY = this.topHeight + gapSize;
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

        const stroke = "#2A2A2A";
        const lipHeight = 25;
        const lipMargin = 5;

        // 🎨 Degradado gótico realista (metal bruñido)
        const grad = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
        grad.addColorStop(0, "#2c2d33");
        grad.addColorStop(0.15, "#3e4048");
        grad.addColorStop(0.35, "#4f515c");
        grad.addColorStop(0.5, "#8a8e99");
        grad.addColorStop(0.65, "#4f515c");
        grad.addColorStop(0.85, "#3e4048");
        grad.addColorStop(1, "#2c2d33");

        ctx.fillStyle = grad;

        // ============================
        // TUBO SUPERIOR (solo laterales)
        // ============================
        ctx.fillRect(this.x, 0, this.width, this.topHeight);

        ctx.lineWidth = 6;
        ctx.strokeStyle = stroke;

        ctx.beginPath();
        ctx.moveTo(this.x, 0);
        ctx.lineTo(this.x, this.topHeight);
        ctx.moveTo(this.x + this.width, 0);
        ctx.lineTo(this.x + this.width, this.topHeight);
        ctx.stroke();

        // ============================
        // LABIO SUPERIOR (borde completo)
        // ============================
        ctx.beginPath();
        ctx.rect(
            this.x - lipMargin,
            this.topHeight - lipHeight,
            this.width + lipMargin * 2,
            lipHeight
        );
        ctx.fill();
        ctx.stroke();

        // ============================
        // TUBO INFERIOR (solo laterales)
        // ============================
        ctx.fillRect(this.x, this.bottomY, this.width, this.bottomHeight);

        ctx.beginPath();
        ctx.moveTo(this.x, this.bottomY);
        ctx.lineTo(this.x, this.bottomY + this.bottomHeight);
        ctx.moveTo(this.x + this.width, this.bottomY);
        ctx.lineTo(this.x + this.width, this.bottomY + this.bottomHeight);
        ctx.stroke();

        // ============================
        // LABIO INFERIOR (borde completo)
        // ============================
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

    // ⭐ COLISIÓN ELIPSE VS RECT
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
            this.ellipseRectCollision(b, rectTop) ||
            this.ellipseRectCollision(b, rectBottom)
        );
    }

    ellipseRectCollision(b, r) {
        const closestX = Math.max(r.x, Math.min(b.cx, r.x + r.width));
        const closestY = Math.max(r.y, Math.min(b.cy, r.y + r.height));

        const dx = closestX - b.cx;
        const dy = closestY - b.cy;

        const value = (dx * dx) / (b.rx * b.rx) + (dy * dy) / (b.ry * b.ry);
        return value < 1;
    }
}