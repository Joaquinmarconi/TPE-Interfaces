class GamePeg {
    constructor(canvas, boardImageSrc, pieceImageSrc1, pieceImageSrc2) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // Board
        this.board = new Board(canvas, boardImageSrc, pieceImageSrc1, pieceImageSrc2);

        this.selectedPiece = null;
        this.dragging = false;

        this.initEvents();
    }

    initEvents() {
        // -------------------- MOUSE DOWN --------------------
        this.canvas.addEventListener("mousedown", e => {
            const { row, col } = this.getCellFromMouse(e);
            if (!this.isValidCell(row, col)) return;

            const cellType = this.board.matrix[row][col];
            if (cellType === 2 || cellType === 3) {
                this.selectedPiece = { row, col };
                this.dragging = true;
                this.board.drawBoard();
                this.highlightSelected(row, col);
                this.drawHints({ row, col });
            }
        });

        // -------------------- MOUSE MOVE --------------------
        this.canvas.addEventListener("mousemove", e => {
            if (!this.dragging || !this.selectedPiece) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - this.board.cellSize / 2;
            const y = e.clientY - rect.top - this.board.cellSize / 2;

            // 1️⃣ Redibuja tablero
            this.board.drawBoard();

            // 2️⃣ Hueco de origen
            this.drawHole(this.selectedPiece.row, this.selectedPiece.col);

            // 3️⃣ Hints
            this.drawHints(this.selectedPiece);

            // 4️⃣ Pieza flotante
            const type = this.board.matrix[this.selectedPiece.row][this.selectedPiece.col];
            const img = type === 2 ? this.board.pieceImages[0] : this.board.pieceImages[1];
            this.ctx.drawImage(img, x, y, this.board.cellSize - 10, this.board.cellSize - 10);
        });

        // -------------------- MOUSE UP --------------------
        this.canvas.addEventListener("mouseup", e => {
            if (!this.selectedPiece || !this.dragging) return;

            const from = this.selectedPiece;
            const { row: toRow, col: toCol } = this.getCellFromMouse(e);

            // Cancelar si fuera del tablero
            if (!this.isValidCell(toRow, toCol)) {
                this.dragging = false;
                this.selectedPiece = null;
                this.board.drawBoard();
                return;
            }

            if (this.validMove(from, { row: toRow, col: toCol })) {
                this.performMove(from, { row: toRow, col: toCol });
            }

            this.dragging = false;
            this.selectedPiece = null;
            this.board.drawBoard();
            this.checkGameOver();
        });
    }

    // -------------------- UTILIDADES --------------------
    getCellFromMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return {
            col: Math.floor(x / this.board.cellSize),
            row: Math.floor(y / this.board.cellSize)
        };
    }

    isValidCell(row, col) {
        return (
            row >= 0 &&
            row < this.board.rows &&
            col >= 0 &&
            col < this.board.cols &&
            this.board.matrix[row][col] !== 0
        );
    }

    // -------------------- LÓGICA --------------------
    validMove(from, to) {
        const dr = to.row - from.row;
        const dc = to.col - from.col;

        // Saltos de 2 solo vertical u horizontal
        if (!(Math.abs(dr) === 2 && dc === 0) && !(Math.abs(dc) === 2 && dr === 0)) return false;

        const midRow = from.row + (dr / 2 | 0);
        const midCol = from.col + (dc / 2 | 0);

        if (!this.isValidCell(to.row, to.col)) return false;
        if (!this.isValidCell(midRow, midCol)) return false;

        return (
            (this.board.matrix[from.row][from.col] === 2 || this.board.matrix[from.row][from.col] === 3) &&
            (this.board.matrix[midRow][midCol] === 2 || this.board.matrix[midRow][midCol] === 3) &&
            this.board.matrix[to.row][to.col] === 1
        );
    }

    performMove(from, to) {
        const midRow = from.row + ((to.row - from.row) / 2 | 0);
        const midCol = from.col + ((to.col - from.col) / 2 | 0);

        // Mover ficha
        this.board.matrix[to.row][to.col] = this.board.matrix[from.row][from.col];
        this.board.matrix[from.row][from.col] = 1; // origen vacío
        this.board.matrix[midRow][midCol] = 1;     // ficha saltada eliminada
    }

    checkGameOver() {
        for (let r = 0; r < this.board.rows; r++) {
            for (let c = 0; c < this.board.cols; c++) {
                const type = this.board.matrix[r][c];
                if (type === 2 || type === 3) {
                    const moves = this.getPossibleMoves({ row: r, col: c });
                    if (moves.length > 0) return; // sigue jugando
                }
            }
        }
        alert("Juego terminado — no hay más movimientos posibles 🎉");
    }

    getPossibleMoves(piece) {
        const moves = [];
        const dirs = [
            [-2, 0], [2, 0], [0, -2], [0, 2]
        ];

        const type = this.board.matrix[piece.row][piece.col];

        for (let [dr, dc] of dirs) {
            const r = piece.row + dr;
            const c = piece.col + dc;
            const midRow = piece.row + (dr / 2 | 0);
            const midCol = piece.col + (dc / 2 | 0);

            if (
                this.isValidCell(r, c) &&
                this.board.matrix[r][c] === 1 &&
                (this.board.matrix[midRow][midCol] === 2 || this.board.matrix[midRow][midCol] === 3)
            ) {
                moves.push({ row: r, col: c });
            }
        }
        return moves;
    }

    // -------------------- VISUAL --------------------
    drawHints(piece) {
        const moves = this.getPossibleMoves(piece);
        this.ctx.fillStyle = "rgba(255, 255, 0, 0.4)";
        for (let move of moves) {
            const cx = move.col * this.board.cellSize + this.board.cellSize / 2;
            const cy = move.row * this.board.cellSize + this.board.cellSize / 2;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, this.board.cellSize / 5, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    highlightSelected(row, col) {
        const cx = col * this.board.cellSize + this.board.cellSize / 2;
        const cy = row * this.board.cellSize + this.board.cellSize / 2;
        const radius = (this.board.cellSize - 6) / 2;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius + 3, 0, Math.PI * 2);
        this.ctx.strokeStyle = "yellow";
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
    }

    drawHole(row, col) {
        const cx = col * this.board.cellSize + this.board.cellSize / 2;
        const cy = row * this.board.cellSize + this.board.cellSize / 2;
        const radius = (this.board.cellSize - 10) / 2;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        this.ctx.fill();
    }
}