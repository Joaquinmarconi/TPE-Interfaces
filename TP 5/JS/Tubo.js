class Tubo {
    constructor(x, canvasHeight, gapSize) {
        this.gapSize = gapSize;
        this.x = x;
        this.width = 90;
        this.speed = 2;
        this.scored = false;

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

        // ============================================
        // DEGRADADO SUPERIOR (luz a la DERECHA)
        // ============================================
        const gradTop = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);

        gradTop.addColorStop(0.0,  "#26272c");
        gradTop.addColorStop(0.20, "#303238");
        gradTop.addColorStop(0.45, "#44464f");
        gradTop.addColorStop(0.70, "#7c7f8a");  // luz MUY suave
        gradTop.addColorStop(0.85, "#44464f");
        gradTop.addColorStop(1.0,  "#2a2b30");
        // ============================================
        //  DEGRADADO INFERIOR (luz a la IZQUIERDA)
        // ============================================
        const gradBottom = ctx.createLinearGradient(this.x + this.width, 0, this.x, 0);

        gradBottom.addColorStop(0.0,  "#26272c");
        gradBottom.addColorStop(0.20, "#303238");
        gradBottom.addColorStop(0.45, "#44464f");
        gradBottom.addColorStop(0.70, "#7c7f8a");  // luz suave → queda del otro lado
        gradBottom.addColorStop(0.85, "#44464f");
        gradBottom.addColorStop(1.0,  "#2a2b30");

        // ============================
        // TUBO SUPERIOR
        // ============================
        ctx.fillStyle = gradTop;
        ctx.fillRect(this.x, 0, this.width, this.topHeight);

        ctx.lineWidth = 6;
        ctx.strokeStyle = stroke;

        ctx.beginPath();
        ctx.moveTo(this.x, 0);
        ctx.lineTo(this.x, this.topHeight);
        ctx.moveTo(this.x + this.width, 0);
        ctx.lineTo(this.x + this.width, this.topHeight);
        ctx.stroke();

        // LABIO SUPERIOR
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
        // TUBO INFERIOR
        // ============================
        ctx.fillStyle = gradBottom;
        ctx.fillRect(this.x, this.bottomY, this.width, this.bottomHeight);

        ctx.beginPath();
        ctx.moveTo(this.x, this.bottomY);
        ctx.lineTo(this.x, this.bottomY + this.bottomHeight);
        ctx.moveTo(this.x + this.width, this.bottomY);
        ctx.lineTo(this.x + this.width, this.bottomY + this.bottomHeight);
        ctx.stroke();

        // LABIO INFERIOR
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

    // COLISIÓN 
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