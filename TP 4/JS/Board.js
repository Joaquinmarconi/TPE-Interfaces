class Board {
    constructor(canvas, boardImageSrc, pieceImageSrc1, pieceImageSrc2, pieceImageSrc3 = null, size = 400) {
        // Inicializa propiedades del canvas, tamaño del tablero y tamaño de celdas
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.size = size;

        this.rows = 7;
        this.cols = 7;
        this.cellSize = size / 7;

        
        // Matriz original del tablero (0: vacío, 1: agujero central, 2-4: fichas)
        this.originalMatrix = [
            [0, 0, 2, 3, 4, 0, 0],
            [0, 0, 4, 3, 2, 0, 0],
            [2, 2, 3, 4, 3, 2, 2],
            [4, 3, 3, 1, 3, 3, 2],
            [2, 2, 4, 3, 4, 2, 2],
            [0, 0, 2, 4, 3, 0, 0],
            [0, 0, 3, 2, 4, 0, 0]
        ];

        // Copia de la matriz que se puede modificar durante el juego
        this.matrix = JSON.parse(JSON.stringify(this.originalMatrix));

        // Carga de imagen del tablero
        this.boardImage = new Image();
        this.boardImage.src = boardImageSrc;

         // Carga de imágenes de las fichas
        this.pieceImages = [];
        this.pieceImages[0] = new Image();
        this.pieceImages[0].src = pieceImageSrc1;

        this.pieceImages[1] = new Image();
        this.pieceImages[1].src = pieceImageSrc2;

        if (pieceImageSrc3) {
            this.pieceImages[2] = new Image();
            this.pieceImages[2].src = pieceImageSrc3;
        }


         // Flags para saber si las imágenes ya se cargaron
        this.boardLoaded = false;
        this.piecesLoaded = [false, false, !!pieceImageSrc3 ? false : true];

       // Cuando se carga la imagen del tablero, intenta dibujar el tablero
        this.boardImage.onload = () => {
            this.boardLoaded = true;
            this.tryDraw();
        };

         // Cuando se carga cada imagen de ficha, intenta dibujar el tablero
        this.pieceImages.forEach((img, i) => {
            img.onload = () => {
                this.piecesLoaded[i] = true;
                this.tryDraw();
            };
        });
    }

      // Intenta dibujar el tablero solo si todas las imágenes están cargadas
    tryDraw() {
        if (this.boardLoaded && this.piecesLoaded.every(v => v)) {
            this.drawBoard();
        }
    }

    

    //Dibuja el tablero completo y las fichas
    drawBoard(limitRow = this.rows, limitCol = this.cols) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.boardImage, 0, 0, this.canvas.width, this.canvas.height);

          // Itera por cada celda y dibuja agujero o ficha según corresponda
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

      // Dibuja un agujero en la celda especificada
    drawHole(row, col) {
        const x = col * this.cellSize;
        const y = row * this.cellSize;
        const centerX = x + this.cellSize / 2;
        const centerY = y + this.cellSize / 2;
        const radius = (this.cellSize - 10) / 2;

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = "rgba(92, 51, 23, 1)";
        this.ctx.fill();
    }


    // Dibuja una ficha en la celda especificada
    drawPiece(row, col) {
        const x = col * this.cellSize;
        const y = row * this.cellSize;
        const type = this.matrix[row][col];

        const img = this.pieceImages[type - 2];
        if (img) {
            this.ctx.drawImage(img, x + 5, y + 5, this.cellSize - 10, this.cellSize - 10);
        }
    }
   
      // Reinicia el tablero a su estado original
    reset() {
        this.matrix = JSON.parse(JSON.stringify(this.originalMatrix));
        this.drawBoard();
    }
}