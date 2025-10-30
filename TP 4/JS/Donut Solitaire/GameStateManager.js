console.log("✅ GameStateManager cargado");

class GameStateManager {
    constructor() {
        this.state = 'MENU'; // MENU, PLAYING, PAUSED, WON, LOST
    }
    
    setState(newState) {
        this.state = newState;
    }
    
    isPlaying() { return this.state === 'PLAYING'; }
    isPaused() { return this.state === 'PAUSED'; }
    isGameOver() { return ['WON', 'LOST'].includes(this.state); }
}