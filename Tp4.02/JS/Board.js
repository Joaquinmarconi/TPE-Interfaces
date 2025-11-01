class Board {
    constructor(canvas, boardImageSrc, pieceImageSrc1, pieceImageSrc2, size = 400) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.size = size;

        this.rows = 7;
        this.cols = 7;
        this.cellSize = size / 7;

        // Matriz del tablero: 0 = inválido, 1 = vacío, 2 = ficha tipo 1, 3 = ficha tipo 2
        this.matrix = [
            [0, 0, 2, 3, 2, 0, 0],
            [0, 0, 2, 3, 2, 0, 0],
            [2, 2, 3, 3, 3, 2, 2],
            [2, 3, 3, 1, 3, 3, 2],
            [2, 2, 3, 3, 3, 2, 2],
            [0, 0, 2, 3, 2, 0, 0],
            [0, 0, 2, 3, 2, 0, 0]
        ];

        // Cargar imágenes
        this.boardImage = new Image();
        this.boardImage.src = boardImageSrc;

        this.pieceImages = [];
        this.pieceImages[0] = new Image();
        this.pieceImages[0].src = pieceImageSrc1;

        this.pieceImages[1] = new Image();
        this.pieceImages[1].src = pieceImageSrc2;

        // Flags de carga
        this.boardLoaded = false;
        this.piecesLoaded = [false, false];

        this.boardImage.onload = () => {
            this.boardLoaded = true;
            this.tryDraw();
        };

        this.pieceImages[0].onload = () => {
            this.piecesLoaded[0] = true;
            this.tryDraw();
        };
        this.pieceImages[1].onload = () => {
            this.piecesLoaded[1] = true;
            this.tryDraw();
        };
    }

    tryDraw() {
        if (this.boardLoaded && this.piecesLoaded[0] && this.piecesLoaded[1]) {
            this.drawBoard();
        }
    }

    drawBoard() {
        // Fondo del tablero
        this.ctx.drawImage(this.boardImage, 0, 0, this.canvas.width, this.canvas.height);

        // Dibujar huecos circulares
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.matrix[row][col] !== 0) {
                    this.drawHole(row, col);
                }
            }
        }

        // Dibujar fichas
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.matrix[row][col] === 2 || this.matrix[row][col] === 3) {
                    this.drawPiece(row, col);
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
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        this.ctx.fill();
    }

    drawPiece(row, col) {
        const x = col * this.cellSize;
        const y = row * this.cellSize;

        // Elegir imagen según tipo de ficha
        const type = this.matrix[row][col];
        let img = null;
        if (type === 2) img = this.pieceImages[0];
        else if (type === 3) img = this.pieceImages[1];

        if (img) {
            this.ctx.drawImage(img, x + 5, y + 5, this.cellSize - 10, this.cellSize - 10);
        }
    }
}