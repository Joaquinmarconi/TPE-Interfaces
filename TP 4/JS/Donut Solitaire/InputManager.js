/**
 * InputManager - Maneja TODOS los eventos de entrada
 */
class InputManager {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.game = game;
        
        // Bind de métodos
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        
        this.setupListeners();
    }

    setupListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    removeListeners() {
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Convierte coordenadas del evento a coordenadas del canvas
     */
    getCanvasCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    }

    handleMouseDown(event) {
        if (this.game.gameOver || this.game.isPaused) return;
        
        const { x, y } = this.getCanvasCoordinates(event);
        
        // Buscar pieza clickeada
        const clickedPiece = this.findPieceAt(x, y);
        
        if (clickedPiece) {
            this.game.selectPiece(clickedPiece, x, y);
        } else {
            this.game.deselectPiece();
        }
    }

    handleMouseMove(event) {
        if (this.game.gameOver || this.game.isPaused) return;
        if (!this.game.selectedPiece) return;
        
        const { x, y } = this.getCanvasCoordinates(event);
        this.game.dragPiece(x, y);
    }

    handleMouseUp(event) {
        if (this.game.gameOver || this.game.isPaused) return;
        if (!this.game.selectedPiece) return;
        
        const { x, y } = this.getCanvasCoordinates(event);
        this.game.dropPiece(x, y);
    }

    handleKeyDown(event) {
        switch(event.key.toLowerCase()) {
            case 'r':
                if (this.game.gameOver) {
                    this.game.restart();
                }
                break;
            case 'p':
                this.game.togglePause();
                break;
            case 'h':
                this.game.toggleHints();
                break;
        }
    }

    /**
     * Encuentra la pieza en una posición
     */
    findPieceAt(x, y) {
        // Buscar de atrás hacia adelante (las últimas dibujadas están encima)
        for (let i = this.game.pieces.length - 1; i >= 0; i--) {
            const piece = this.game.pieces[i];
            if (piece.containsPoint(x, y)) {
                return piece;
            }
        }
        return null;
    }
}