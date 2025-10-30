/**
 * Clase Game - Controlador principal 
 */
class Game {
    constructor(canvasId, timeLimit = null) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Estado del juego 
        this.stateManager = new GameStateManager();

        // Configuración del tablero
        this.boardSize = 450;
        this.boardX = (this.canvas.width - this.boardSize) / 2;
        this.boardY = (this.canvas.height - this.boardSize) / 2;

        // Componentes del juego
        this.board = null;
        this.pieces = [];
        this.moveValidator = null;
        this.hintManager = null;
        this.timer = null;
        this.renderer = null;
        this.inputManager = null;
        this.selectedPiece = null;
        this.timeLimit = timeLimit;
    }

    /**
     * Inicializa el juego
     */
    init() {
        // Crear componentes
        this.board = new Board(this.ctx, this.boardX, this.boardY, this.boardSize);
        this.createPieces();
        this.moveValidator = new MoveValidator(this.board, this.pieces);
        this.hintManager = new HintManager(this.board, this.moveValidator);
        this.timer = new Timer(this.ctx, 20, 20, this.timeLimit);
        this.renderer = new Renderer(this.ctx, this.canvas);
        this.inputManager = new InputManager(this.canvas, this);

        // Cambiar estado a PLAYING
        this.stateManager.setState('PLAYING');
        this.timer.start();

        this.gameLoop();
    }


    /**
     * Crea todas las fichas según la configuración inicial del tablero
     */
    createPieces() {
        this.pieces = [];

        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const cell = this.board.getCell(row, col);

                if (cell && cell.hasPiece) {
                    const piece = new Piece(row, col, this.board);
                    this.pieces.push(piece);
                }
            }
        }
    }

    /**
     * Game loop principal
     */
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Actualiza los componentes que cambian a cada frame
     */
    update() {
        // Verificar estado con stateManager
        if (this.stateManager.isPaused() || this.stateManager.isGameOver()) {
            return;
        }

        // Actualizar componentes
        this.timer.update();
        this.hintManager.update();

        // Verificar si se acabó el tiempo
        if (this.timer.isTimeUp()) {
            this.endGame('LOST', '¡Se acabó el tiempo!');
            return;
        }

        // Actualizar animaciones de piezas
        this.pieces.forEach(piece => {
            if (piece.isAnimating) {
                piece.updateAnimation();
            }
        });
    }

    /**
     * Dibuja todos los elementos del juego
     */
    draw() {
        this.renderer.clear();
        this.renderer.drawBackground();
        this.renderer.drawBoard(this.board);
        this.renderer.drawPieces(this.pieces, this.selectedPiece);

        // Dibujar hints si hay pieza seleccionada
        if (this.selectedPiece) {
            const possibleMoves = this.hintManager.getPossibleMovesFor(this.selectedPiece);
            this.renderer.drawHints(
                this.board,
                possibleMoves,
                this.hintManager.animationTime
            );
        }

        this.renderer.drawSelectedPiece(this.selectedPiece);
        this.renderer.drawTimer(this.timer);
        this.renderer.drawGameInfo(
            this.moveValidator.getGameInfo(),
            this.canvas.width
        );

        if (this.stateManager.isGameOver()) {
            this.renderer.drawGameOverScreen(
                this.stateManager.state,
                this.moveValidator.getGameInfo(),
                this.timer,
                this.canvas.width,
                this.canvas.height
            );
        }
    }

    /**
     * Selecciona una pieza (llamado por InputManager)
     */
    selectPiece(piece, x, y) {
        if (this.selectedPiece) {
            this.selectedPiece.deselect();
        }

        this.selectedPiece = piece;
        this.selectedPiece.startDrag(x, y);
    }

    /**
     * Deselecciona la pieza actual
     */
    deselectPiece() {
        if (this.selectedPiece) {
            this.selectedPiece.deselect();
            this.selectedPiece = null;
        }
    }

    /**
     * Arrastra la pieza seleccionada (llamado por InputManager)
     */
    dragPiece(x, y) {
        if (this.selectedPiece) {
            this.selectedPiece.updateDrag(x, y);
        }
    }

    /**
     * Suelta la pieza 
     */
    dropPiece(x, y) {
        if (!this.selectedPiece) return;

        this.selectedPiece.endDrag();

        // Obtener la celda donde se soltó
        const targetCell = this.board.getCellAtPosition(x, y);

        if (targetCell) {
            // Validar el movimiento
            const move = this.moveValidator.isValidMove(
                this.selectedPiece.row,
                this.selectedPiece.col,
                targetCell.row,
                targetCell.col
            );

            if (move) {
                this.executeMove(move);
            } else {
                this.selectedPiece.returnToOriginal(true);
            }
        } else {
            this.selectedPiece.returnToOriginal(true);
        }
    }

    /**
     * Ejecuta un movimiento válido
     */
    executeMove(move) {
        this.moveValidator.executeMove(move, this.selectedPiece);
        this.checkGameStatus();
    }

    /**
     * Verifica el estado del juego después de cada movimiento
     */
    checkGameStatus() {
        const status = this.moveValidator.getGameStatus();

        if (status === 'won') {
            this.endGame('WON', '¡Ganaste! 🎉');
        } else if (status === 'lost') {
            this.endGame('LOST', 'Game Over - No hay más movimientos');
        }
    }

    /**
     * Termina el juego
     */
    endGame(state, message) {
        // Usar stateManager para estado
        this.stateManager.setState(state);
        this.timer.stop();
        console.log(message);
    }

    /**
     * Limpia todos los recursos antes de reiniciar
     */
    cleanup() {
        // Usar inputManager para limpiar eventos
        if (this.inputManager) {
            this.inputManager.removeListeners();
        }
    }

    /**
     * Reinicia el juego
     */
    restart() {
        this.cleanup();

        // Reiniciar componentes
        this.pieces = [];
        this.selectedPiece = null;

        // Reiniciar estado con stateManager
        this.stateManager.setState('PLAYING');

        this.init();
    }

    /**
     * Pausa/reanuda el juego
     */
    togglePause() {
        if (this.stateManager.isGameOver()) return;

        if (this.stateManager.isPaused()) {
            this.stateManager.setState('PLAYING');
            this.timer.resume();
        } else {
            this.stateManager.setState('PAUSED');
            this.timer.pause();
        }
    }

    /**
     * Destruye el juego y limpia eventos
     */
    destroy() {
        this.stateManager.setState('MENU');
        if (this.inputManager) {
            this.inputManager.removeListeners();
        }
    }
}