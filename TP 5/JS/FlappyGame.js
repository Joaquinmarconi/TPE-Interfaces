class FlappyGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.bird = new Bird();
        this.tubos = [];
        this.spawnGap = 300;  // distancia horizontal entre tubos
        this.score = 0;
        this.isGameOver = false;
        this.frameId = null;
    }

    spawnTubo() {
        if (this.tubos.length === 0) {
            this.tubos.push(new Tubo(this.canvas.width, this.canvas.height));
        } else {
            const ultimo = this.tubos[this.tubos.length - 1];
            if (ultimo.x < this.canvas.width - this.spawnGap) {
                this.tubos.push(new Tubo(this.canvas.width, this.canvas.height));
            }
        }
    }

    update() {
        if (this.isGameOver) return;

        this.bird.update();
        this.spawnTubo();

        this.tubos.forEach(t => t.update());
        this.tubos = this.tubos.filter(t => !t.offScreen());

        // sincronizar posición visual del DIV
        const cuervoDiv = document.getElementById("cuervo");
        cuervoDiv.style.top = this.bird.y + "px";
        cuervoDiv.style.left = this.bird.x + "px";

        // colisiones
        for (let t of this.tubos) {
            if (t.collides(this.bird)) {
                this.gameOver();
                break;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.tubos.forEach(t => t.draw(this.ctx));
    }

 gameOver() {
    if (this.isGameOver) return;

    this.isGameOver = true;

    cancelAnimationFrame(this.frameId);

    const overlay = document.getElementById("gameOverOverlay");
    overlay.classList.remove("hidden");
}

reset() {
    // parar animación previa SI EXISTE
    if (this.frameId !== null) {
        cancelAnimationFrame(this.frameId);
    }

    // resetear pájaro
    this.bird = new Bird();

    // resetear tubos
    this.tubos = [];

    // resetear estados
    this.isGameOver = false;
    this.score = 0;

    // resetear posición visual del cuervo
    const cuervoDiv = document.getElementById("cuervo");
    cuervoDiv.style.top = this.bird.y + "px";
    cuervoDiv.style.left = this.bird.x + "px";
    cuervoDiv.style.transform = "rotate(0deg)"; // ← muy importante

    // ocultar overlay
    document.getElementById("gameOverOverlay").classList.add("hidden");

    // limpiar frameId
    this.frameId = null;

    // arrancar loop NUEVO
    this.loop();
}

    loop() {
        this.update();
        this.draw();
        this.frameId = requestAnimationFrame(() => this.loop());
    }
}