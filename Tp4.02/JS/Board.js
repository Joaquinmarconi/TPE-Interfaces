class Board {
    constructor(canvas, boardImageSrc, pieceImageSrc1, pieceImageSrc2, pieceImageSrc3 = null, size = 400) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.size = size;

        this.rows = 7;
        this.cols = 7;
        this.cellSize = size / 7;

        this.originalMatrix = [
            [0, 0, 2, 3, 4, 0, 0],
            [0, 0, 4, 3, 2, 0, 0],
            [2, 2, 3, 4, 3, 2, 2],
            [4, 3, 3, 1, 3, 3, 2],
            [2, 2, 4, 3, 4, 2, 2],
            [0, 0, 2, 4, 3, 0, 0],
            [0, 0, 3, 2, 4, 0, 0]
        ];

        this.matrix = JSON.parse(JSON.stringify(this.originalMatrix));

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

        this.boardLoaded = false;
        this.piecesLoaded = [false, false, !!pieceImageSrc3 ? false : true];

        this.boardImage.onload = () => {
            this.boardLoaded = true;
            this.tryDraw();
        };

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

    /**
     * @param {number} limitRow - opcional: dibuja fichas solo hasta esta fila (para animación)
     * @param {number} limitCol - opcional: dibuja fichas solo hasta esta columna en la fila actual
     */
    drawBoard(limitRow = this.rows, limitCol = this.cols) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.boardImage, 0, 0, this.canvas.width, this.canvas.height);

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.matrix[row][col] !== 0) this.drawHole(row, col);
                
                // dibujar solo hasta la fila y columna límite
                if (this.matrix[row][col] >= 2) {
                    if (row < limitRow || (row === limitRow && col < limitCol)) {
                        this.drawPiece(row, col);
                    }
                }
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
        this.ctx.fillStyle = "rgba(92, 51, 23, 0.8)";
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

    reset() {
        this.matrix = JSON.parse(JSON.stringify(this.originalMatrix));
        this.drawBoard();
    }
}