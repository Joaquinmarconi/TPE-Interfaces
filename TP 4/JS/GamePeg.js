class GamePeg {
    
    constructor(canvas, boardImageSrc, pieceImageSrc1, pieceImageSrc2, pieceImageSrc3) {

          // Inicializa el canvas, el contexto de dibujo y el tablero de juego
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // Tablero
        this.board = new Board(canvas, boardImageSrc, pieceImageSrc1, pieceImageSrc2, pieceImageSrc3);
       
         // Variables de control del arrastre
        this.selectedPiece = null;
        this.dragging = false;

          // Configura los eventos de mouse para el arrastre
        this.initEvents();

       // Elementos visuales del overlay y el contador
        this.overlay = document.getElementById("overlay-Peg");
        this.btnReiniciar = document.getElementById("btn-reiniciar");
         this.btnReiniciarRedondo = document.getElementById("btn-reiniciar-redondo");
        this.movesContainer = document.getElementById("moves-container");
       this.btnAyuda= document.getElementById('btn-ayuda-redondo');

          // Configura el temporizador del juego
        this.timerContainer = document.querySelector(".ui");
        this.timerDisplay = document.getElementById("timer");
        this.timer = new Timer(this.timerDisplay, 300, () => this.handleTimeUp()); // 5 min
   
         //btn reiniciar overlay
        if (this.btnReiniciar)
            this.btnReiniciar.addEventListener("click", () => this.resetGame());

        //btn reiniciar constante
        if (this.btnReiniciarRedondo) {
            this.btnReiniciarRedondo.addEventListener("click", () => this.resetGame());
        }

        // Muestra los movimientos posibles al iniciar
        this.updateMovesCount();

        // Iniciar animación para llenar el tablero
        this.animateFillBoard();
    }

    // -------------------- EVENTOS --------------------



     // Registra los eventos del mouse sobre el canvas
    initEvents() {
        this.canvas.addEventListener("mousedown", e => this.onMouseDown(e));
        this.canvas.addEventListener("mousemove", e => this.onMouseMove(e));
        this.canvas.addEventListener("mouseup", e => this.onMouseUp(e));
    }

    
    // Obtiene la posición del mouse dentro del canvas
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    // Convierte la posición del mouse a coordenadas de celda(devuelve columna y fila)
    getCellFromMouse(e) {
        const { x, y } = this.getMousePos(e);
        return {
            col: Math.floor(x / this.board.cellSize),
            row: Math.floor(y / this.board.cellSize)
        };
    }


    // Verifica si una celda pertenece al tablero y es válida
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

    //onMouseDown → equivalente a ondragstart (inicio del arrastre)
    // Detecta si se hace clic sobre una ficha válida y la marca como seleccionada
    onMouseDown(e) {
          //if (this.isAnimating) return; //  No permitir clics durante la animación
        const { row, col } = this.getCellFromMouse(e);
        if (!this.isValidCell(row, col)) return;

        const cellType = this.board.matrix[row][col];
        if (cellType >= 2 && cellType <= 4) {
            if (!this.timer.running) {
                this.timer.start();//corre el tiempo
                if (this.timerContainer)
                    this.timerContainer.style.display = "block";
            }

            this.selectedPiece = { row, col };
            this.dragging = true;//se empieza a arrastrar 
            this.board.drawBoard();
            this.highlightSelected(row, col);
            this.drawHints(this.selectedPiece);

            // Inicia animación de hints constante
            this.startHintAnimation();
        }
    }
       
     //onMouseMove → equivalente a ondrag (mientras se arrastra)
     // Redibuja el tablero y la ficha siguiendo la posición del mouse
    onMouseMove(e) {
         // if (this.isAnimating) return; //  No permitir clics durante la animación
        if (!this.dragging || !this.selectedPiece) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - this.board.cellSize / 2;//centra cursor en el medio de la img
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


   //onMouseUp → equivalente a ondrop / ondragend (soltar)
    // Verifica si el movimiento realizado es válido y lo ejecuta
   onMouseUp(e) {
    // if (this.isAnimating) return;
    if (!this.selectedPiece || !this.dragging) return;

    const from = this.selectedPiece;
    const { row: toRow, col: toCol } = this.getCellFromMouse(e);

    // obtener todos los movimientos posibles desde 'from'
    const possible = this.getPossibleMoves(from);

    // buscar un movimiento que coincida con la celda donde soltó
    const match = possible.find(m => m.row === toRow && m.col === toCol);

    if (match) {
        // match incluye .comidas (array) según tu getPossibleMoves()
        this.performMove(from, match);
    }

    // detener hint animation si está corriendo
    if (this.hintAnimId) {
        cancelAnimationFrame(this.hintAnimId);
        this.hintAnimId = null;
    }

    this.dragging = false;
    this.selectedPiece = null;
    this.board.drawBoard();
    this.checkGameOver();
} 


    // -------------------- LÓGICA --------------------


     // Determina si un movimiento entre dos celdas es valido
     validMove(from, to) {
        const possible = this.getPossibleMoves(from);
        return possible.find(m => m.row === to.row && m.col === to.col) || null;
    }


    // Aplica un movimiento válido en el tablero (salta una ficha)
    performMove(from, move) {
        const type = this.board.matrix[from.row][from.col];
        this.board.matrix[from.row][from.col] = 1; // deja hueco

        // eliminar fichas comidas
        if (move.comidas) {
            for (const f of move.comidas) {
                this.board.matrix[f.row][f.col] = 1;
            }
        }

        // colocar ficha en el destino
        this.board.matrix[move.row][move.col] = type;

        // actualizar contadores / UI
        this.updateMovesCount();
    }



        // Calcula todos los movimientos posibles para una ficha
    getPossibleMoves(piece, visitadas = []) {
        const moves = [];
        const direcciones = [
            [-1, 0], [1, 0], [0, -1], [0, 1] // arriba, abajo, izquierda, derecha
        ];

        const posicion = `${piece.row},${piece.col}`;

        // Si ya analizamos esta celda, no seguir
        if (visitadas.includes(posicion)) return [];

        // Marcamos esta celda como visitada
        visitadas.push(posicion);

        for (let [dr, dc] of direcciones) {
            const r1 = piece.row + dr;
            const c1 = piece.col + dc;
            const r2 = piece.row + 2 * dr;
            const c2 = piece.col + 2 * dc;

            if (!this.isValidCell(r2, c2)) continue;

            const mid = this.board.matrix[r1][c1]; // ficha intermedia
            const end = this.board.matrix[r2][c2]; // destino

            // movimiento válido: ficha en medio + hueco al final
            if (mid >= 2 && mid <= 4 && end === 1) {
                const move = { row: r2, col: c2, comidas: [{ row: r1, col: c1 }] };
                moves.push(move);

                // llamada recursiva desde la nueva posición
                const nuevosSaltos = this.getPossibleMoves({ row: r2, col: c2 }, [...visitadas]);

                for (let salto of nuevosSaltos) {
                    moves.push({
                        row: salto.row,
                        col: salto.col,
                        comidas: move.comidas.concat(salto.comidas)
                    });
                }
            }
        }

        return moves;
    }


    // -------------------- HINTS --------------------

     // Crea una animación intermitente sobre los movimientos posibles
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
                const cx = move.col * this.board.cellSize + this.board.cellSize/2; // calcula el centro de cada posible celda
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

            this.hintAnimId = requestAnimationFrame(animate); // lo ejecuta en bucle
        };

        animate();
    }


     // Dibuja círculos fijos en las posiciones posibles de movimiento
    drawHints(piece) {
        if (!piece) return;
        const moves = this.getPossibleMoves(piece);
        for (let move of moves) {
            // pos y tamaño de los circulos
            const cx = move.col * this.board.cellSize + this.board.cellSize/2;
            const cy = move.row * this.board.cellSize + this.board.cellSize/2;
            const radius = this.board.cellSize / 5;

            this.ctx.beginPath();
            this.ctx.arc(cx, cy, radius, 0, 2*Math.PI);
            this.ctx.fillStyle = "rgba(72, 131, 6, 1)";
            this.ctx.fill();
        }
    }
     // Resalta visualmente la ficha seleccionada
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


    // Dibuja el agujero vacío cuando se mueve una ficha
    drawHole(row,col){
        const cx = col*this.board.cellSize + this.board.cellSize/2;
        const cy = row*this.board.cellSize + this.board.cellSize/2;
        const radius = (this.board.cellSize-10)/2;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius,0,Math.PI*2);
        this.ctx.fillStyle = "rgba(92, 73, 34, 0.8)";
        this.ctx.fill();
    }


    // -------------------- ESTADO Y CONTADORES--------------------

      // Actualiza y muestra la cantidad de movimientos posibles
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


       // Cuenta cuántas fichas quedan en el tablero
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


      // Muestra el overlay cuando se acaba el tiempo del juego
    handleTimeUp() {
        this.timer.stop();

        if (!this.overlay) return;

        const overlayText = this.overlay.querySelector("h2");
        const overlayTime = this.overlay.querySelector("p");

        overlayText.textContent = "¡Se acabó el tiempo!";

        this.overlay.classList.remove("hidden");
        this.overlay.style.display = "block";
       
    }

     // Verifica si el juego terminó por tiempo o falta de movimientos
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
                overlayText.textContent = "¡Ganaste!";
                overlayText.style.color = "limegreen";
            } else {
                overlayText.textContent = "¡Te quedaste sin movimientos!";
            }

            
            this.overlay.classList.remove("hidden");
            this.overlay.style.display = "block";
        }
    }


      // Reinicia el juego: tablero, contador y animación
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

     // Crea una animación de aparición de fichas al iniciar o reiniciar
    animateFillBoard() {
         // this.isAnimating = true; //  Bloquea interacción
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

                        // Dibuja progresivamente las fichas del tablero
                        this.board.drawBoard(currentRow, currentCol);

                        // dibuja piezas ya animadas
                        for (const p of drawnPieces) {
                            const t = p.type;
                            const imgPiece = t === 2 ? this.board.pieceImages[0] :
                                             t === 3 ? this.board.pieceImages[1] :
                                             this.board.pieceImages[2];
                            this.ctx.drawImage(imgPiece, p.x, p.y, size, size);
                        }

                        // dibuja la ficha actual animándose
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
       // this.isAnimating = false;
       //  if (this.timer && !this.timer.running) {
          //  this.timer.start(); //  Inicia el tiempo al finalizar animación
          // if (this.timerContainer)
       // this.timerContainer.style.display = "block";
       // }
        };

        animate();
    }
}