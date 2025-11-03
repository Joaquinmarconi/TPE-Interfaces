// Representa una ficha individual del juego, con su posición(fila y columna) y su imagen correspondiente en el tablero.

class Piece {

      // Constructor: inicializa la posición y la imagen de la ficha
    constructor(row, col, image) {
        this.row = row;
        this.col = col;
        this.image = image;
    }

      // Dibuja la ficha en el canvas
    draw(ctx, cellSize) {
        // Centra la ficha dentro de la celda (con pequeño margen)
        const offset = 6;
        const x = this.col * cellSize + offset;
        const y = this.row * cellSize + offset;
        const size = cellSize - offset * 2;

        // Sombras suaves para dar relieve
        ctx.shadowColor = "rgba(114, 80, 28, 0.9)";
        ctx.shadowBlur = 5;

        // Dibuja la imagen de la ficha en la posición calculada
        ctx.drawImage(this.image, x, y, size, size);

        ctx.shadowBlur = 0; // reset
    }

      // Determina si una coordenada (x, y) del mouse cae dentro de la ficha
    containsPoint(x, y, cellSize) {
        const px = this.col * cellSize;
        const py = this.row * cellSize;
        return (
            x >= px &&                              // dentro del límite izquierdo
            x <= px + cellSize &&                  // dentro del límite derecho
            y >= py &&                            // dentro del límite superior
            y <= py + cellSize                   // dentro del límite inferior
        );
    }
}
