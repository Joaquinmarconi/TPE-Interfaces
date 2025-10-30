/**
 * Clase Board - Representa el tablero del juego
 */
class Board extends VisualComponent {
    constructor(ctx, x, y, size) {
        super(ctx, x, y); // ⚡ AGREGADO: Llamada correcta con parámetros
        this.size = size;

        // Configuración del tablero (7x7 en forma de cruz)
        this.rows = 7;
        this.cols = 7;
        this.cellSize = size / 7;

        // Matriz que define la forma del tablero (cruz)
        // 0 = inválido, 1 = vacío, 2 = con ficha
        this.matrix = [
            [0, 0, 2, 2, 2, 0, 0],
            [0, 0, 2, 2, 2, 0, 0],
            [2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 1, 2, 2, 2], // Centro vacío
            [2, 2, 2, 2, 2, 2, 2],
            [0, 0, 2, 2, 2, 0, 0],
            [0, 0, 2, 2, 2, 0, 0]
        ];

        // Array de celdas
        this.cells = [];

        // Imagen de fondo del tablero
        this.backgroundImage = null;
        this.imageLoaded = false;

        this.initCells();
        this.loadBackground();
    }

    /**
     * Inicializa todas las celdas del tablero
     */
    initCells() {
        for (let row = 0; row < this.rows; row++) {
            this.cells[row] = [];
            for (let col = 0; col < this.cols; col++) {
                const cellValue = this.matrix[row][col];
                const isValid = cellValue !== 0;

                if (isValid) {
                    const cellX = this.x + col * this.cellSize;
                    const cellY = this.y + row * this.cellSize;

                    this.cells[row][col] = {
                        row: row,
                        col: col,
                        x: cellX,
                        y: cellY,
                        isValid: true,
                        isEmpty: cellValue === 1,
                        hasPiece: cellValue === 2
                    };
                } else {
                    this.cells[row][col] = null;
                }
            }
        }
    }

    /**
     * Carga la imagen de fondo del tablero
     */
    loadBackground() {
        this.imageLoaded = false;
    }

    draw() {
        this.drawCells();
    }

    /**
     * Obtiene la celda en una posición de la matriz
     */
    getCell(row, col) {
        if (row === undefined || col === undefined) return null;
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return null;
        if (!this.cells[row]) return null;
        return this.cells[row][col];
    }

    /**
     * Obtiene la celda en una posición de píxeles
     */
    getCellAtPosition(x, y) {
        if (x < this.x || x > this.x + this.size ||
            y < this.y || y > this.y + this.size) {
            return null;
        }

        const col = Math.floor((x - this.x) / this.cellSize);
        const row = Math.floor((y - this.y) / this.cellSize);

        return this.getCell(row, col);
    }

    /**
     * Verifica si una celda está vacía
     */
    isCellEmpty(row, col) {
        const cell = this.getCell(row, col);
        return cell && cell.isValid && cell.isEmpty;
    }

    /**
     * Verifica si una celda tiene una ficha
     */
    hasPieceAt(row, col) {
        const cell = this.getCell(row, col);
        return cell && cell.isValid && cell.hasPiece;
    }

    /**
     * Marca una celda como vacía
     */
    setCellEmpty(row, col) {
        const cell = this.getCell(row, col);
        if (cell && cell.isValid) {
            cell.isEmpty = true;
            cell.hasPiece = false;
            this.matrix[row][col] = 1;
        }
    }

    /**
     * Marca una celda como ocupada
     */
    setCellOccupied(row, col) {
        const cell = this.getCell(row, col);
        if (cell && cell.isValid) {
            cell.isEmpty = false;
            cell.hasPiece = true;
            this.matrix[row][col] = 2;
        }
    }

    /**
     * Obtiene el centro en píxeles de una celda
     */
    getCellCenter(row, col) {
        const cell = this.getCell(row, col);
        if (!cell) return null;

        return {
            x: cell.x + this.cellSize / 2,
            y: cell.y + this.cellSize / 2
        };
    }
}