class Piece extends VisualComponent {
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

        this.isDragging = false;
        this.isSelected = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;

        this.radius = board.cellSize * 0.40;

        this.image = null;
        this.imageLoaded = false;
        this.loadImage();
    }

    loadImage() {
        this.image = new Image();
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.image.src = 'Assets/dona.png';
    }

    draw(ctx) {
        ctx.save();

        // Efecto de selección CON GLOW
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

        // Dibujar la dona
        if (this.imageLoaded && this.image) {
            const size = this.radius * 2.5;
            ctx.drawImage(
                this.image,
                this.x - size / 2,
                this.y - size / 2,
                size,
                size
            );
        } else {
            ctx.fillStyle = '#FF1493';
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
        this.originalX = this.x;
        this.originalY = this.y;
    }

    updateDrag(mouseX, mouseY) {
        if (!this.isDragging) return;
        this.x = mouseX - this.dragOffsetX;
        this.y = mouseY - this.dragOffsetY;
    }

    endDrag() {
        this.isDragging = false;
    }

    returnToOriginal() {
        this.x = this.originalX;
        this.y = this.originalY;
    }

    moveTo(row, col) {
        if (row === undefined || col === undefined) return;

        const cellCenter = this.board.getCellCenter(row, col);
        if (!cellCenter) return;

        this.x = cellCenter.x;
        this.y = cellCenter.y;
        this.row = row;
        this.col = col;
        this.originalX = this.x;
        this.originalY = this.y;
        this.originalRow = row;
        this.originalCol = col;
    }

    select() {
        this.isSelected = true;
    }

    deselect() {
        this.isSelected = false;
    }
}