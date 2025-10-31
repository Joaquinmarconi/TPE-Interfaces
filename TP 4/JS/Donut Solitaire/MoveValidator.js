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
        this.directions = [
            { row: -1, col: 0 }, { row: 1, col: 0 },
            { row: 0, col: -1 }, { row: 0, col: 1 }
        ];
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        const fromCell = this.board.getCell(fromRow, fromCol);
        const toCell = this.board.getCell(toRow, toCol);
        if (!fromCell?.hasPiece || !toCell?.isEmpty) return null;

        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        const isLineMove = (Math.abs(rowDiff) === 2 && colDiff === 0) ||
                           (Math.abs(colDiff) === 2 && rowDiff === 0);
        if (!isLineMove) return null;

        const midRow = fromRow + rowDiff / 2;
        const midCol = fromCol + colDiff / 2;
        if (!this.board.getCell(midRow, midCol)?.hasPiece) return null;

        return { fromRow, fromCol, toRow, toCol, jumpedRow: midRow, jumpedCol: midCol };
    }

    getPossibleMovesFrom(row, col) {
        return this.directions
            .map(d => this.isValidMove(row, col, row + d.row * 2, col + d.col * 2))
            .filter(Boolean);
    }

    getAllPossibleMoves() {
        const moves = [];
        for (let r = 0; r < this.board.rows; r++) {
            for (let c = 0; c < this.board.cols; c++) {
                if (this.board.getCell(r, c)?.hasPiece) moves.push(...this.getPossibleMovesFrom(r, c));
            }
        }
        return moves;
    }

    hasMovesAvailable() {
        return this.getAllPossibleMoves().length > 0;
    }

    executeMove(move, piece) {
        if (!move) return null;

        piece.moveTo(move.toRow, move.toCol, true);
        piece.row = move.toRow;
        piece.col = move.toCol;

        this.board.setCellEmpty(move.fromRow, move.fromCol);
        this.board.setCellOccupied(move.toRow, move.toCol);

        const jumpedPiece = this.findPieceAt(move.jumpedRow, move.jumpedCol);
        if (jumpedPiece) {
            this.removePiece(jumpedPiece);
            this.board.setCellEmpty(move.jumpedRow, move.jumpedCol);
        }

        return jumpedPiece;
    }

    findPieceAt(row, col) {
        return this.pieces.find(p => p.row === row && p.col === col) || null;
    }

    removePiece(piece) {
        const i = this.pieces.indexOf(piece);
        if (i > -1) this.pieces.splice(i, 1);
    }

    getRemainingPiecesCount() {
        return this.pieces.length;
    }

    isWinCondition() {
        return this.pieces.length === 1 && this.pieces[0].row === 3 && this.pieces[0].col === 3;
    }

    getGameStatus() {
        if (this.isWinCondition()) return 'won';
        return this.hasMovesAvailable() ? 'playing' : 'lost';
    }

    getGameInfo() {
        return {
            remainingPieces: this.getRemainingPiecesCount(),
            possibleMoves: this.getAllPossibleMoves().length,
            status: this.getGameStatus()
        };
    }
}