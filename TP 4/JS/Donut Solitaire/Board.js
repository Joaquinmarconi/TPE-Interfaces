/**
 * Clase Board - Representa el tablero del juego (Peg Solitaire)
 */
class Board extends VisualComponent {
    constructor(ctx, x, y, size) {
        super(ctx, x, y);
        this.size = size;

        // Configuración base 7x7
        this.rows = 7;
        this.cols = 7;
        this.cellSize = size / 7;

        // 0 = inválido, 1 = vacío, 2 = con ficha
        this.matrix = [
            [0, 0, 2, 2, 2, 0, 0],
            [0, 0, 2, 2, 2, 0, 0],
            [2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 1, 2, 2, 2], // centro vacío
            [2, 2, 2, 2, 2, 2, 2],
            [0, 0, 2, 2, 2, 0, 0],
            [0, 0, 2, 2, 2, 0, 0]
        ];

        this.cells = [];

        // Imagen de fondo del tablero
        this.backgroundImage = new Image();
        this.imageLoaded = false;

        this.initCells();
        this.loadBackground();
    }

    /**
     * Inicializa las celdas según la matriz
     */
    initCells() {
        for (let row = 0; row < this.rows; row++) {
            this.cells[row] = [];
            for (let col = 0; col < this.cols; col++) {
                const cellValue = this.matrix[row][col];
                const isValid = cellValue !== 0;

                const cellX = this.x + col * this.cellSize;
                const cellY = this.y + row * this.cellSize;

                this.cells[row][col] = isValid
                    ? {
                          row,
                          col,
                          x: cellX,
                          y: cellY,
                          isValid: true,
                          isEmpty: cellValue === 1,
                          hasPiece: cellValue === 2,
                      }
                    : null;
            }
        }
    }

    /**
     * Carga una imagen de fondo (temática del juego)
     */
 loadBackground() {
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'Assets/tableroDonuts.jpg';
    this.backgroundImage.onload = () => {
        this.imageLoaded = true;
    };
}
    /**
     * Dibuja el tablero (con fondo + celdas)
     */
    draw() {
        const ctx = this.ctx;

        // Dibujar fondo
        if (this.imageLoaded) {
            ctx.drawImage(this.backgroundImage, this.x, this.y, this.size, this.size);
        } else {
            // Fallback visual si la imagen no cargó
            const grad = ctx.createLinearGradient(this.x, this.y, this.x + this.size, this.y + this.size);
            grad.addColorStop(0, "#f6e4b5");
            grad.addColorStop(1, "#e0b973");
            ctx.fillStyle = grad;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }

        // Dibujar cuadrícula de celdas válidas
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = this.cells[r][c];
                if (!cell) continue;

                const { x, y } = cell;

                // Efecto visual leve para cada celda
                ctx.save();
                ctx.fillStyle = cell.isEmpty ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)";
                ctx.strokeStyle = "rgba(0,0,0,0.2)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.roundRect(x + 3, y + 3, this.cellSize - 6, this.cellSize - 6, 6);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
        }
    }

    /** 🔹 Métodos auxiliares **/
    getCell(row, col) {
        if (row < 0 || col < 0 || row >= this.rows || col >= this.cols) return null;
        return this.cells[row]?.[col] || null;
    }

    getCellAtPosition(x, y) {
        if (x < this.x || x > this.x + this.size || y < this.y || y > this.y + this.size)
            return null;

        const col = Math.floor((x - this.x) / this.cellSize);
        const row = Math.floor((y - this.y) / this.cellSize);
        return this.getCell(row, col);
    }

    isCellEmpty(row, col) {
        const cell = this.getCell(row, col);
        return cell && cell.isValid && cell.isEmpty;
    }

    hasPieceAt(row, col) {
        const cell = this.getCell(row, col);
        return cell && cell.isValid && cell.hasPiece;
    }

    setCellEmpty(row, col) {
        const cell = this.getCell(row, col);
        if (cell) {
            cell.isEmpty = true;
            cell.hasPiece = false;
            this.matrix[row][col] = 1;
        }
    }

    setCellOccupied(row, col) {
        const cell = this.getCell(row, col);
        if (cell) {
            cell.isEmpty = false;
            cell.hasPiece = true;
            this.matrix[row][col] = 2;
        }
    }

    getCellCenter(row, col) {
        const cell = this.getCell(row, col);
        if (!cell) return null;
        return {
            x: cell.x + this.cellSize / 2,
            y: cell.y + this.cellSize / 2,
        };
    }
}