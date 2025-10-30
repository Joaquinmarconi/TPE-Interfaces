/**
 * HintManager - Gestiona la animación de pistas visuales
 */
class HintManager {
    constructor(board, moveValidator) {
        this.board = board;
        this.moveValidator = moveValidator;
        
        this.animationTime = 0;
        this.animationSpeed = 0.1;
    }

    /**
     * Actualiza el valor de animación
     */
    update() {
        this.animationTime += this.animationSpeed;
        if (this.animationTime > Math.PI * 2) {
            this.animationTime = 0;
        }
    }
    
    /**
     * Obtiene los movimientos posibles para una ficha
     */
    getPossibleMovesFor(piece) {
        if (!piece) return [];
        
        return this.moveValidator.getPossibleMovesFrom(
            piece.row, 
            piece.col
        );
    }
}