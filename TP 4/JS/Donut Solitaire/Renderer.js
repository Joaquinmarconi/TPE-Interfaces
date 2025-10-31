/**
 * Renderer - Maneja TODO el dibujado del juego
 */
class Renderer {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

    /**
     * Limpia el canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Dibuja el fondo del canvas
     */
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#585755ff');
        gradient.addColorStop(1, '#42413eff');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Dibuja todos los objetos del juego
     */
    drawGameObjects(objects) {
        objects.forEach(obj => {
            if (obj && obj.visible !== false) {
                obj.draw(this.ctx);
            }
        });
    }

    /**
     * Dibuja el tablero
     */
   drawBoard(board) {
    if (!board) return;

    const ctx = this.ctx;

    // 🔸 Dibujar imagen de fondo del tablero con esquinas redondeadas
    if (board.imageLoaded && board.backgroundImage) {
        const radius = 30; // ← ajustá el radio a gusto

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(board.x, board.y, board.size, board.size, radius);
        ctx.clip();

        ctx.drawImage(board.backgroundImage, board.x, board.y, board.size, board.size);
        ctx.restore();
    }

    // 🔸 Luego dibujar las celdas (agujeros)
    for (let row = 0; row < board.rows; row++) {
        for (let col = 0; col < board.cols; col++) {
            const cell = board.getCell(row, col);
            if (cell && cell.isValid) {
                this.drawCell(board, cell);
            }
        }
    }
}

    /**
     * Dibuja una celda individual (lo que antes estaba en Board)
     */
    drawCell(board, cell) {
        const centerX = cell.x + board.cellSize / 2;
        const centerY = cell.y + board.cellSize / 2;
        const radius = board.cellSize * 0.35;

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

        if (cell.isEmpty) {
            this.ctx.fillStyle = '#3d2812';
            this.ctx.fill();
            this.ctx.strokeStyle = '#2A1810';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        } else {
            this.ctx.fillStyle = '#654321';
            this.ctx.fill();
            this.ctx.strokeStyle = '#4A2C17';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }

    /**
     * Dibuja todas las piezas (excepto la seleccionada)
     */
    drawPieces(pieces, selectedPiece) {
        pieces.forEach(piece => {
            if (piece !== selectedPiece) {
                piece.draw(this.ctx);
            }
        });
    }

    /**
     * Dibuja la pieza seleccionada (siempre encima)
     */
    drawSelectedPiece(selectedPiece) {
        if (selectedPiece) {
            selectedPiece.draw(this.ctx);
        }
    }

    /**
  * Dibuja los hints de movimientos posibles
  * @param {Board} board - El tablero
  * @param {Array} possibleMoves - Los movimientos posibles
  * @param {number} pulseAnimation - Valor de animación pulsante
  */
    drawHints(board, possibleMoves, pulseAnimation) {
        if (!possibleMoves || possibleMoves.length === 0) return;

        const pulse = (Math.sin(pulseAnimation) + 1) / 2;

        possibleMoves.forEach(move => {
            const center = board.getCellCenter(move.toRow, move.toCol);
            if (!center) return;

            this.ctx.save();

            // Anillos expansivos
            for (let i = 0; i < 3; i++) {
                this.ctx.beginPath();
                this.ctx.arc(center.x, center.y, 15 + i * 10 + pulse * 8, 0, Math.PI * 2);
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.globalAlpha = 0.5 - i * 0.15 - pulse * 0.2;
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
            }

            // Punto central brillante
            this.ctx.shadowColor = '#FFD700';
            this.ctx.shadowBlur = 20;
            this.ctx.globalAlpha = 1;
            this.ctx.beginPath();
            this.ctx.arc(center.x, center.y, 10, 0, Math.PI * 2);
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fill();

            this.ctx.restore();
        });
    }

    /**
 * Dibuja el timer
 */
    drawTimer(timer) {
        if (!timer) return;

        this.ctx.save();

        // Determinar qué tiempo mostrar
        let displayTime;
        let label;

        if (timer.timeLimit) {
            // Mostrar tiempo restante si hay límite
            displayTime = timer.getRemainingTime();
            label = 'Tiempo: ';
        } else {
            // Mostrar tiempo transcurrido si no hay límite
            displayTime = timer.getElapsedTime();
            label = 'Tiempo: ';
        }

        const timeString = timer.formatTime(displayTime);

        // Fondo del timer
        this.drawTimerBackground(timer.x, timer.y);

        // Determinar color según el estado
        let textColor = '#333';  // Color por defecto
        let alpha = 1;

        if (timer.isWarningTime()) {
            // Pulsar entre rojo y color normal
            const pulse = (Math.sin(timer.warningPulse) + 1) / 2;
            textColor = '#FF0000';  // Rojo
            alpha = 0.6 + pulse * 0.4;
        }

        // Dibujar texto
        this.ctx.font = `bold 20px Arial`;
        this.ctx.fillStyle = textColor;
        this.ctx.globalAlpha = alpha;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        // Label
        this.ctx.fillText(label, timer.x + 15, timer.y + 10);

        // Tiempo
        this.ctx.font = `bold 24px Arial`;
        const labelWidth = this.ctx.measureText(label).width;
        this.ctx.fillText(timeString, timer.x + 15 + labelWidth, timer.y + 10);

        // Icono de reloj (opcional)
        this.drawClockIcon(timer.x + 5, timer.y + 12);

        this.ctx.restore();
    }

    /**
     * Dibuja el fondo del timer
     */
    drawTimerBackground(x, y) {
        const width = 180;
        const height = 50;

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;

        // Rectángulo con bordes redondeados
        this.roundRect(x, y, width, height, 10);
        this.ctx.fill();
        this.ctx.stroke();
    }

    /**
     * Dibuja un icono de reloj simple
     */
    drawClockIcon(x, y) {
        const radius = 12;

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Manecillas
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y - radius * 0.6);
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + radius * 0.5, y);
        this.ctx.stroke();
    }


    /**
     * Dibuja la información del juego
     */
    drawGameInfo(gameInfo, canvasWidth) {
        const infoX = canvasWidth - 220;
        const infoY = 20;
        const infoWidth = 200;
        const infoHeight = 120;

        this.ctx.save();

        // Fondo
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.roundRect(infoX, infoY, infoWidth, infoHeight, 10);
        this.ctx.fill();
        this.ctx.stroke();

        // Texto
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'left';

        this.ctx.fillText('Fichas restantes:', infoX + 15, infoY + 25);
        this.ctx.fillText(gameInfo.remainingPieces.toString(), infoX + 15, infoY + 50);

        this.ctx.fillText('Movimientos:', infoX + 15, infoY + 75);
        this.ctx.fillText(gameInfo.possibleMoves.toString(), infoX + 15, infoY + 100);

        this.ctx.restore();
    }

    /**
     * Dibuja la pantalla de Game Over
     */
    drawGameOverScreen(gameStatus, gameInfo, timer, canvasWidth, canvasHeight) {
        this.ctx.save();

        // Overlay oscuro
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Panel central
        const panelWidth = 500;
        const panelHeight = 300;
        const panelX = (canvasWidth - panelWidth) / 2;
        const panelY = (canvasHeight - panelHeight) / 2;

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.roundRect(panelX, panelY, panelWidth, panelHeight, 15);
        this.ctx.fill();
        this.ctx.stroke();

        // Título
        this.ctx.fillStyle = gameStatus === 'won' ? '#4CAF50' : '#F44336';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const title = gameStatus === 'won' ? '¡GANASTE! 🎉' : 'GAME OVER';
        this.ctx.fillText(title, canvasWidth / 2, panelY + 80);

        // Información
        this.ctx.fillStyle = '#333';
        this.ctx.font = '24px Arial';

        const timeText = `Tiempo: ${timer.formatTime(timer.getElapsedTime())}`;
        const piecesText = `Fichas restantes: ${gameInfo.remainingPieces}`;

        this.ctx.fillText(timeText, canvasWidth / 2, panelY + 140);
        this.ctx.fillText(piecesText, canvasWidth / 2, panelY + 175);

        // Instrucciones
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Presiona R para reiniciar', canvasWidth / 2, panelY + 240);

        this.ctx.restore();
    }

    /**
     * Utilidad: Dibuja rectángulo con bordes redondeados
     */
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }
}