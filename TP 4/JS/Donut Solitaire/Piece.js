/**
 * Clase Piece - Representa una ficha (usando imagen)
 */
class Piece extends VisualComponent {
    static sharedImage = null; // 🔸 optimización: misma imagen para todas las fichas
    static sharedImageLoaded = false;

    constructor(row, col, board) {
        super();
        this.row = row;
        this.col = col;
        this.board = board;

        const cellCenter = this.board.getCellCenter(row, col);
        this.x = cellCenter.x;
        this.y = cellCenter.y;
        this.originalX = this.x;
        this.originalY = this.y;
        this.originalRow = this.row;
        this.originalCol = this.col;

        this.radius = board.cellSize * 0.40;
        this.isDragging = false;
        this.isSelected = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;

        // Animación de movimiento
        this.targetX = this.x;
        this.targetY = this.y;
        this.isAnimating = false;
        this.animationSpeed = 0.15;

        // Cargar imagen compartida
        this.loadSharedImage();
    }

    loadSharedImage() {
        if (Piece.sharedImageLoaded) return;
        Piece.sharedImage = new Image();
        Piece.sharedImage.src = 'Assets/dona.png'; // 🟣 cambiá la ruta si es necesario
        Piece.sharedImage.onload = () => {
            Piece.sharedImageLoaded = true;
        };
    }

    draw(ctx) {
        ctx.save();

        // Glow al seleccionar
        if (this.isSelected) {
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 25;
        }

        // Sombra si está siendo arrastrada
        if (this.isDragging) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
        }

        // Dibujar imagen de dona
        if (Piece.sharedImageLoaded && Piece.sharedImage) {
            const size = this.radius * 2.5;
            ctx.drawImage(Piece.sharedImage, this.x - size / 2, this.y - size / 2, size, size);
        } else {
            // Fallback visual si no cargó
            ctx.fillStyle = '#FF69B4';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    containsPoint(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return Math.sqrt(dx * dx + dy * dy) <= this.radius;
    }

    startDrag(mouseX, mouseY) {
        this.isDragging = true;
        this.isSelected = true;
        this.dragOffsetX = mouseX - this.x;
        this.dragOffsetY = mouseY - this.y;
    }

    updateDrag(mouseX, mouseY) {
        if (!this.isDragging) return;
        this.x = mouseX - this.dragOffsetX;
        this.y = mouseY - this.dragOffsetY;
    }

    endDrag() {
        this.isDragging = false;
    }

    /**
     * Movimiento con animación hacia celda destino
     */
    moveTo(row, col) {
        const cellCenter = this.board.getCellCenter(row, col);
        if (!cellCenter) return;

        this.targetX = cellCenter.x;
        this.targetY = cellCenter.y;
        this.row = row;
        this.col = col;
        this.isAnimating = true;
    }

    /**
     * Animación de interpolación
     */
    updateAnimation() {
        if (!this.isAnimating) return;

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;

        this.x += dx * this.animationSpeed;
        this.y += dy * this.animationSpeed;

        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.isAnimating = false;
        }
    }

    returnToOriginal(animated = false) {
        if (animated) {
            this.targetX = this.originalX;
            this.targetY = this.originalY;
            this.isAnimating = true;
        } else {
            this.x = this.originalX;
            this.y = this.originalY;
        }
    }

    select() {
        this.isSelected = true;
    }

    deselect() {
        this.isSelected = false;
    }
}