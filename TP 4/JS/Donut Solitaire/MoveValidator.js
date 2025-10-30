/**
 * Clase MoveValidator - Valida y ejecuta los movimientos del juego
 * Responsabilidades:
 * - Validar si un movimiento es legal según las reglas de Peg Solitaire
 * - Encontrar todos los movimientos posibles desde una ficha
 * - Encontrar todos los movimientos posibles en el tablero
 * - Ejecutar movimientos (mover ficha, eliminar ficha saltada)
 * - Detectar si el juego terminó (no hay más movimientos)
 */
class MoveValidator {
    constructor(board, pieces) {
        this.board = board;
        this.pieces = pieces;
        
        // Direcciones posibles: arriba, abajo, izquierda, derecha
        this.directions = [
            { row: -1, col: 0 },  // Arriba
            { row: 1, col: 0 },   // Abajo
            { row: 0, col: -1 },  // Izquierda
            { row: 0, col: 1 }    // Derecha
        ];
    }
    
    /**
     * Valida si un movimiento es legal
     * @param {number} fromRow - Fila origen
     * @param {number} fromCol - Columna origen
     * @param {number} toRow - Fila destino
     * @param {number} toCol - Columna destino
     * @returns {Object|null} - Objeto con info del movimiento si es válido, null si no
     */
    isValidMove(fromRow, fromCol, toRow, toCol) {
        // Verificar que origen y destino estén en el tablero
        const fromCell = this.board.getCell(fromRow, fromCol);
        const toCell = this.board.getCell(toRow, toCol);
        
        if (!fromCell || !toCell) {
            return null;
        }
        
        // Verificar que el origen tenga una ficha
        if (!fromCell.hasPiece) {
            return null;
        }
        
        // Verificar que el destino esté vacío
        if (!toCell.isEmpty) {
            return null;
        }
        
        // Calcular la diferencia
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        
        // Debe ser un movimiento en línea recta de exactamente 2 celdas
        const isVertical = colDiff === 0 && Math.abs(rowDiff) === 2;
        const isHorizontal = rowDiff === 0 && Math.abs(colDiff) === 2;
        
        if (!isVertical && !isHorizontal) {
            return null;
        }
        
        // Calcular la celda intermedia (la que se va a saltar)
        const midRow = fromRow + rowDiff / 2;
        const midCol = fromCol + colDiff / 2;
        const midCell = this.board.getCell(midRow, midCol);
        
        // Verificar que la celda intermedia tenga una ficha
        if (!midCell || !midCell.hasPiece) {
            return null;
        }
        
        // El movimiento es válido
        return {
            fromRow: fromRow,
            fromCol: fromCol,
            toRow: toRow,
            toCol: toCol,
            jumpedRow: midRow,
            jumpedCol: midCol
        };
    }
    
    /**
     * Encuentra todos los movimientos posibles desde una posición
     * @param {number} row - Fila de la ficha
     * @param {number} col - Columna de la ficha
     * @returns {Array} - Array de movimientos válidos
     */
    getPossibleMovesFrom(row, col) {
        const possibleMoves = [];
        
        // Verificar cada dirección
        for (const dir of this.directions) {
            const toRow = row + dir.row * 2;
            const toCol = col + dir.col * 2;
            
            const move = this.isValidMove(row, col, toRow, toCol);
            if (move) {
                possibleMoves.push(move);
            }
        }
        
        return possibleMoves;
    }
    
    /**
     * Encuentra todos los movimientos posibles en todo el tablero
     * @returns {Array} - Array de todos los movimientos válidos
     */
    getAllPossibleMoves() {
        const allMoves = [];
        
        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const cell = this.board.getCell(row, col);
                if (cell && cell.hasPiece) {
                    const moves = this.getPossibleMovesFrom(row, col);
                    allMoves.push(...moves);
                }
            }
        }
        
        return allMoves;
    }
    
    /**
     * Verifica si quedan movimientos posibles
     * @returns {boolean}
     */
    hasMovesAvailable() {
        return this.getAllPossibleMoves().length > 0;
    }
    
    /**
     * Ejecuta un movimiento
     * @param {Object} move - Objeto con la información del movimiento
     * @param {Piece} piece - La ficha que se mueve
     * @returns {Piece|null} - La ficha que fue eliminada (saltada), o null
     */
    executeMove(move, piece) {
        if (!move) return null;
        
        // Mover la ficha a la nueva posición
        piece.moveTo(move.toRow, move.toCol, true);
        
        // Actualizar el tablero
        this.board.setCellEmpty(move.fromRow, move.fromCol);
        this.board.setCellOccupied(move.toRow, move.toCol);
        
        // Encontrar y eliminar la ficha saltada
        const jumpedPiece = this.findPieceAt(move.jumpedRow, move.jumpedCol);
        if (jumpedPiece) {
            this.removePiece(jumpedPiece);
            this.board.setCellEmpty(move.jumpedRow, move.jumpedCol);
        }
        
        return jumpedPiece;
    }
    
    /**
     * Encuentra una ficha en una posición específica
     * @param {number} row
     * @param {number} col
     * @returns {Piece|null}
     */
    findPieceAt(row, col) {
        return this.pieces.find(p => p.row === row && p.col === col) || null;
    }
    
    /**
     * Elimina una ficha del array de fichas
     * @param {Piece} piece
     */
    removePiece(piece) {
        const index = this.pieces.indexOf(piece);
        if (index > -1) {
            this.pieces.splice(index, 1);
        }
    }
    
    /**
     * Cuenta cuántas fichas quedan en el tablero
     * @returns {number}
     */
    getRemainingPiecesCount() {
        return this.pieces.length;
    }
    
    /**
     * Verifica si el jugador ganó (solo queda una ficha en el centro)
     * @returns {boolean}
     */
    isWinCondition() {
        if (this.pieces.length !== 1) {
            return false;
        }
        
        const lastPiece = this.pieces[0];
        // El centro del tablero es la posición [3, 3]
        return lastPiece.row === 3 && lastPiece.col === 3;
    }
    
    /**
     * Verifica el estado del juego
     * @returns {string} - 'playing', 'won', 'lost'
     */
    getGameStatus() {
        if (this.isWinCondition()) {
            return 'won';
        }
        
        if (!this.hasMovesAvailable()) {
            return 'lost';
        }
        
        return 'playing';
    }
    
    /**
     * Obtiene información del estado actual del juego
     * @returns {Object}
     */
    getGameInfo() {
        return {
            remainingPieces: this.getRemainingPiecesCount(),
            possibleMoves: this.getAllPossibleMoves().length,
            status: this.getGameStatus()
        };
    }
}