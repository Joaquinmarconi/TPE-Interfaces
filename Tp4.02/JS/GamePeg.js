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

        // Timer y su contenedor
        this.timerContainer = document.querySelector(".ui");
        this.timerDisplay = document.getElementById("timer");
        this.timer = new Timer(this.timerDisplay, 300, () => this.handleTimeOver()); // 5 min

        // Escucha fin del tiempo
        this.timer.onTimeUp = () => this.handleTimeUp();

        if (this.btnReiniciar)
            this.btnReiniciar.addEventListener("click", () => this.resetGame());

        this.updateMovesCount();

        // Iniciar animación de llenado
        this.animateFillBoard();
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
            if (!this.timer.running) {
                this.timer.start();
                if (this.timerContainer)
                    this.timerContainer.style.display = "block";
            }

            this.selectedPiece = { row, col };
            this.dragging = true;
            this.board.drawBoard();
            this.highlightSelected(row, col);
            this.drawHints(this.selectedPiece);

            // 🔹 Inicia animación de hints constante
            this.startHintAnimation();
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

    // -------------------- HINTS --------------------
    startHintAnimation() {
        if (this.hintAnimId) return;

        const animate = () => {
            if (!this.selectedPiece) {
                cancelAnimationFrame(this.hintAnimId);
                this.hintAnimId = null;
                return;
            }

            const moves = this.getPossibleMoves(this.selectedPiece);
            const time = Date.now() / 200;

            for (let move of moves) {
                const cx = move.col * this.board.cellSize + this.board.cellSize/2;
                const cy = move.row * this.board.cellSize + this.board.cellSize/2;

                const radius = this.board.cellSize / 5 + Math.sin(time) * 3;

                this.ctx.beginPath();
                this.ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
                this.ctx.fillStyle = "rgba(72, 131, 6, 1)";
                this.ctx.fill();
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = "rgba(96, 212, 0, 1)";
                this.ctx.stroke();
            }

            this.hintAnimId = requestAnimationFrame(animate);
        };

        animate();
    }

    drawHints(piece) {
        if (!piece) return;
        const moves = this.getPossibleMoves(piece);
        for (let move of moves) {
            const cx = move.col * this.board.cellSize + this.board.cellSize/2;
            const cy = move.row * this.board.cellSize + this.board.cellSize/2;
            const radius = this.board.cellSize / 5;

            this.ctx.beginPath();
            this.ctx.arc(cx, cy, radius, 0, 2*Math.PI);
            this.ctx.fillStyle = "rgba(72, 131, 6, 1)";
            this.ctx.fill();
        }
    }

    highlightSelected(row, col) {
        const cx = col * this.board.cellSize + this.board.cellSize/2;
        const cy = row * this.board.cellSize + this.board.cellSize/2;
        const radius = (this.board.cellSize - 6)/2;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius + 3, 0, Math.PI*2);
        this.ctx.strokeStyle = "rgba(72, 131, 6, 1)";
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

    // -------------------- FIN DEL JUEGO --------------------
    handleTimeUp() {
        this.timer.stop();

        if (!this.overlay) return;

        const overlayText = this.overlay.querySelector("h2");
        const overlayTime = this.overlay.querySelector("p");

        overlayText.textContent = "⏰ ¡Se acabó el tiempo!";
        overlayTime.textContent = "";

        this.overlay.classList.remove("hidden");
        this.overlay.style.display = "block";
    }

    checkGameOver() {
        const totalMoves = this.updateMovesCount();
        const piecesLeft = this.countPieces();

        if (this.timer.timeLeft <= 0) {
            this.handleTimeUp();
            return;
        }

        if (totalMoves === 0 && this.overlay) {
            this.timer.stop();

            const overlayText = this.overlay.querySelector("h2");
            const overlayTime = this.overlay.querySelector("p");

            if (piecesLeft === 1) {
                overlayText.textContent = "🏆 ¡Ganaste!";
            } else {
                overlayText.textContent = "😢 ¡Te quedaste sin movimientos!";
            }

            overlayTime.textContent = "";
            this.overlay.classList.remove("hidden");
            this.overlay.style.display = "block";
        }
    }

    resetGame() {
        this.board.reset();
        if (this.overlay) this.overlay.classList.add("hidden");
        this.updateMovesCount();
        this.overlay.style.display="none";

        this.timer.reset();
        if (this.timerContainer)
            this.timerContainer.style.display = "block";

        // Animación al reiniciar
        this.animateFillBoard();
    }

    // -------------------- ANIMACIÓN DE LLENADO --------------------
    animateFillBoard() {
        const rows = this.board.rows;
        const cols = this.board.cols;
        let currentRow = 0;
        let currentCol = 0;

        const drawnPieces = [];

        const animate = () => {
            while (currentRow < rows) {
                const type = this.board.matrix[currentRow][currentCol];
                if (type >= 2 && type <= 4) {
                    const img =
                        type === 2 ? this.board.pieceImages[0] :
                        type === 3 ? this.board.pieceImages[1] :
                        this.board.pieceImages[2];

                    const x = currentCol * this.board.cellSize + 5;
                    const y = currentRow * this.board.cellSize + 5;
                    const size = this.board.cellSize - 10;

                    let scale = 0;
                    const step = () => {
                        scale += 0.1;
                        if (scale > 1) scale = 1;

                        // dibujar tablero hasta esta celda
                        this.board.drawBoard(currentRow, currentCol);

                        // dibujar piezas ya animadas
                        for (const p of drawnPieces) {
                            const t = p.type;
                            const imgPiece = t === 2 ? this.board.pieceImages[0] :
                                             t === 3 ? this.board.pieceImages[1] :
                                             this.board.pieceImages[2];
                            this.ctx.drawImage(imgPiece, p.x, p.y, size, size);
                        }

                        // dibujar la ficha actual animándose
                        this.ctx.drawImage(img, x, y + size * (1 - scale), size, size * scale);

                        if (scale < 1) {
                            requestAnimationFrame(step);
                        } else {
                            drawnPieces.push({type, x, y});
                            currentCol++;
                            if (currentCol >= cols) {
                                currentCol = 0;
                                currentRow++;
                            }
                            requestAnimationFrame(animate);
                        }
                    };
                    step();
                    return;
                }
                currentCol++;
                if (currentCol >= cols) {
                    currentCol = 0;
                    currentRow++;
                }
            }

            // animación completa: dibujar tablero completo
            this.board.drawBoard();
        };

        animate();
    }
}