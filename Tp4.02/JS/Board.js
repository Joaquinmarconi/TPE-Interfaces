class Board {
    constructor(canvas, boardImageSrc, pieceImageSrc1, pieceImageSrc2, pieceImageSrc3 = null, size = 400) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.size = size;

        this.rows = 7;
        this.cols = 7;
        this.cellSize = size / 7;

        // Matriz original del tablero
        this.originalMatrix = [
            [0, 0, 2, 3, 4, 0, 0],
            [0, 0, 4, 3, 2, 0, 0],
            [2, 2, 3, 4, 3, 2, 2],
            [4, 3, 3, 1, 3, 3, 2],
            [2, 2, 4, 3, 4, 2, 2],
            [0, 0, 2, 4, 3, 0, 0],
            [0, 0, 3, 2, 4, 0, 0]
        ];

        // Matriz activa
        this.matrix = JSON.parse(JSON.stringify(this.originalMatrix));

        // Cargar imágenes
        this.boardImage = new Image();
        this.boardImage.src = boardImageSrc;

        this.pieceImages = [];
        this.pieceImages[0] = new Image();
        this.pieceImages[0].src = pieceImageSrc1;

        this.pieceImages[1] = new Image();
        this.pieceImages[1].src = pieceImageSrc2;

        if (pieceImageSrc3) {
            this.pieceImages[2] = new Image();
            this.pieceImages[2].src = pieceImageSrc3;
        }

        // Flags de carga
        this.boardLoaded = false;
        this.piecesLoaded = [false, false, !!pieceImageSrc3 ? false : true];

        // Cargar fondo
        this.boardImage.onload = () => {
            this.boardLoaded = true;
            this.tryDraw();
        };

        // Cargar fichas
        this.pieceImages.forEach((img, i) => {
            img.onload = () => {
                this.piecesLoaded[i] = true;
                this.tryDraw();
            };
        });
    }

    tryDraw() {
        if (this.boardLoaded && this.piecesLoaded.every(v => v)) {
            this.drawBoard();
        }
    }

    drawBoard() {
        // Fondo del tablero
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.boardImage, 0, 0, this.canvas.width, this.canvas.height);

        // Dibujar huecos y fichas
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.matrix[row][col] !== 0) this.drawHole(row, col);
                if (this.matrix[row][col] >= 2) this.drawPiece(row, col);
            }
        }
    }

    drawHole(row, col) {
        const x = col * this.cellSize;
        const y = row * this.cellSize;
        const centerX = x + this.cellSize / 2;
        const centerY = y + this.cellSize / 2;
        const radius = (this.cellSize - 10) / 2;

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = "rgba(0, 0, 0, 10)";
        this.ctx.fill();
    }

    drawPiece(row, col) {
        const x = col * this.cellSize;
        const y = row * this.cellSize;
        const type = this.matrix[row][col];

        const img = this.pieceImages[type - 2];
        if (img) {
            this.ctx.drawImage(img, x + 5, y + 5, this.cellSize - 10, this.cellSize - 10);
        }
    }

    // -------------------- RESET --------------------
    reset() {
        this.matrix = JSON.parse(JSON.stringify(this.originalMatrix));
        this.drawBoard();
    }
}
