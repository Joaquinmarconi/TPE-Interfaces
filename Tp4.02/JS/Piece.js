class Piece {
    constructor(row, col, image) {
        this.row = row;
        this.col = col;
        this.image = image;
    }

    draw(ctx, cellSize) {
        // Centra la ficha dentro de la celda (con pequeño margen)
        const offset = 6;
        const x = this.col * cellSize + offset;
        const y = this.row * cellSize + offset;
        const size = cellSize - offset * 2;

        // Sombras suaves para dar relieve
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 5;

        ctx.drawImage(this.image, x, y, size, size);

        ctx.shadowBlur = 0; // reset
    }

    containsPoint(x, y, cellSize) {
        const px = this.col * cellSize;
        const py = this.row * cellSize;
        return (
            x >= px &&
            x <= px + cellSize &&
            y >= py &&
            y <= py + cellSize
        );
    }
}
