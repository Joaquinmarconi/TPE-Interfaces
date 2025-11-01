class GamePeg {
    constructor(canvas, boardImageSrc, pieceImageSrc1, pieceImageSrc2, pieceImageSrc3) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // Tablero
        this.board = new Board(canvas, boardImageSrc, pieceImageSrc1, pieceImageSrc2, pieceImageSrc3);

        this.selectedPiece = null;
        this.dragging = false;

        this.initEvents();

        // Overlay y contador
        this.overlay = document.getElementById("overlay-Peg");
        this.btnReiniciar = document.getElementById("btn-reiniciar");
        this.movesContainer = document.getElementById("moves-container");

        if (this.btnReiniciar)
            this.btnReiniciar.addEventListener("click", () => this.resetGame());

        this.updateMovesCount();
    }

    // -------------------- EVENTOS --------------------
    initEvents() {
        this.canvas.addEventListener("mousedown", e => this.onMouseDown(e));
        this.canvas.addEventListener("mousemove", e => this.onMouseMove(e));
        this.canvas.addEventListener("mouseup", e => this.onMouseUp(e));
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    getCellFromMouse(e) {
        const { x, y } = this.getMousePos(e);
        return {
            col: Math.floor(x / this.board.cellSize),
            row: Math.floor(y / this.board.cellSize)
        };
    }

    isValidCell(row, col) {
        return (
            row >= 0 &&
            col >= 0 &&
            row < this.board.rows &&
            col < this.board.cols &&
            this.board.matrix[row][col] !== 0
        );
    }

    // -------------------- MOUSE --------------------
    onMouseDown(e) {
        const { row, col } = this.getCellFromMouse(e);
        if (!this.isValidCell(row, col)) return;

        const cellType = this.board.matrix[row][col];
        if (cellType >= 2 && cellType <= 4) {
            this.selectedPiece = { row, col };
            this.dragging = true;
            this.board.drawBoard();
            this.highlightSelected(row, col);
            this.drawHints({ row, col });
        }
    }

    onMouseMove(e) {
        if (!this.dragging || !this.selectedPiece) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - this.board.cellSize / 2;
        const y = e.clientY - rect.top - this.board.cellSize / 2;

        this.board.drawBoard();
        this.drawHole(this.selectedPiece.row, this.selectedPiece.col);
        this.drawHints(this.selectedPiece);

        const type = this.board.matrix[this.selectedPiece.row][this.selectedPiece.col];
        const img =
            type === 2 ? this.board.pieceImages[0] :
            type === 3 ? this.board.pieceImages[1] :
            this.board.pieceImages[2];

        this.ctx.drawImage(img, x, y, this.board.cellSize - 10, this.board.cellSize - 10);
    }

    onMouseUp(e) {
        if (!this.selectedPiece || !this.dragging) return;

        const from = this.selectedPiece;
        const { row: toRow, col: toCol } = this.getCellFromMouse(e);

        if (this.validMove(from, { row: toRow, col: toCol })) {
            this.performMove(from, { row: toRow, col: toCol });
        }

        this.dragging = false;
        this.selectedPiece = null;
        this.board.drawBoard();
        this.checkGameOver();
    }

    // -------------------- LÓGICA --------------------
    validMove(from, to) {
        const dr = to.row - from.row;
        const dc = to.col - from.col;

        if (!(Math.abs(dr) === 2 && dc === 0) && !(Math.abs(dc) === 2 && dr === 0)) return false;

        const midRow = from.row + dr / 2;
        const midCol = from.col + dc / 2;

        if (!this.isValidCell(to.row, to.col)) return false;
        if (!this.isValidCell(midRow, midCol)) return false;

        const fromType = this.board.matrix[from.row][from.col];
        const midType = this.board.matrix[midRow][midCol];
        const toType = this.board.matrix[to.row][to.col];

        return (fromType >= 2 && fromType <= 4) && (midType >= 2 && midType <= 4) && toType === 1;
    }

    performMove(from, to) {
        const midRow = from.row + ((to.row - from.row) / 2 | 0);
        const midCol = from.col + ((to.col - from.col) / 2 | 0);

        const type = this.board.matrix[from.row][from.col];
        this.board.matrix[to.row][to.col] = type;
        this.board.matrix[from.row][from.col] = 1;
        this.board.matrix[midRow][midCol] = 1;

        this.updateMovesCount();
    }

    getPossibleMoves(piece) {
        const moves = [];
        const dirs = [[-2,0],[2,0],[0,-2],[0,2]];

        for (let [dr, dc] of dirs) {
            const r = piece.row + dr;
            const c = piece.col + dc;
            const midR = piece.row + dr / 2;
            const midC = piece.col + dc / 2;

            if (this.isValidCell(r,c) &&
                this.board.matrix[r][c] === 1 &&
                this.board.matrix[midR][midC] >=2 &&
                this.board.matrix[midR][midC] <=4) {
                moves.push({row: r, col: c});
            }
        }
        return moves;
    }

    drawHints(piece) {
        const moves = this.getPossibleMoves(piece);
        this.ctx.fillStyle = "rgba(255, 255, 0, 0.45)";
        for (let move of moves) {
            const cx = move.col * this.board.cellSize + this.board.cellSize/2;
            const cy = move.row * this.board.cellSize + this.board.cellSize/2;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, this.board.cellSize/5, 0, 2*Math.PI);
            this.ctx.fill();
        }
    }

    highlightSelected(row, col) {
        const cx = col * this.board.cellSize + this.board.cellSize/2;
        const cy = row * this.board.cellSize + this.board.cellSize/2;
        const radius = (this.board.cellSize - 6)/2;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius + 3, 0, Math.PI*2);
        this.ctx.strokeStyle = "yellow";
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
    }

    drawHole(row,col){
        const cx = col*this.board.cellSize + this.board.cellSize/2;
        const cy = row*this.board.cellSize + this.board.cellSize/2;
        const radius = (this.board.cellSize-10)/2;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius,0,Math.PI*2);
        this.ctx.fillStyle = "rgba(0,0,0,0.8)";
        this.ctx.fill();
    }

    // -------------------- ESTADO --------------------
    updateMovesCount() {
        let totalMoves = 0;
        for (let r=0;r<this.board.rows;r++){
            for (let c=0;c<this.board.cols;c++){
                const type = this.board.matrix[r][c];
                if (type>=2 && type<=4)
                    totalMoves += this.getPossibleMoves({row:r,col:c}).length;
            }
        }
        if (this.movesContainer)
            this.movesContainer.textContent = `Movimientos posibles: ${totalMoves}`;
        return totalMoves;
    }

    countPieces() {
        let count=0;
        for (let r=0;r<this.board.rows;r++){
            for (let c=0;c<this.board.cols;c++){
                const type = this.board.matrix[r][c];
                if (type>=2 && type<=4) count++;
            }
        }
        return count;
    }

  checkGameOver() {
    const totalMoves = this.updateMovesCount();
    if (totalMoves === 0 && this.overlay) {
        const overlayText = this.overlay.querySelector("h2");
        const piecesLeft = this.countPieces();
        overlayText.textContent = piecesLeft === 0 ? "¡Ganaste!" : "¡Juego terminado!";
        this.overlay.classList.remove("hidden");
        this.overlay.style.display= 'block';
    }
}

    resetGame() {
        this.board.reset();
        if (this.overlay) this.overlay.classList.add("hidden");
        this.updateMovesCount();
    }
}