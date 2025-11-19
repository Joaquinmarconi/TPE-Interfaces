class FlappyGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.bird = new Bird();
        this.tubos = [];
        this.calaveras = [];

        this.spawnGap = 300;
        this.score = 0;
        this.isGameOver = false;
        this.frameId = null;

        this.started = false;
        this.maxScore = 50;

        this.tuboCount = 0; // <<< para saber cuántos tubos van
         this.skullCount=0;

        this.setupControls();

        // activar animación del cuervo
        const c = document.getElementById("cuervo");
        if (c) c.classList.add("cuervo-vuelo");

        // puntajes visibles
        this.scoreDisplay = document.getElementById("score");
        this.scoreMaxDisplay = document.getElementById("scoreMaximo");

        // récord
        this.bestScore = parseInt(localStorage.getItem("flappyBestScore") || "0");
        if (this.scoreMaxDisplay)
            this.scoreMaxDisplay.textContent = "Puntaje máximo: " + this.bestScore;

        this.soundPoint = document.getElementById("soundPoint");
        this.soundSkull = document.getElementById("soundSkull");

        window.flappyGame = this;
    }

    // =======================
    // CONTROLES
    // =======================
    setupControls() {
        document.addEventListener("keydown", e => {
            if (e.key === "ArrowUp") this.handleStartAndJump();
        });

        const overlay = document.getElementById("startOverlay");
        overlay.addEventListener("mousedown", () => this.handleStartAndJump());
        overlay.addEventListener("touchstart", () => this.handleStartAndJump());

        this.canvas.addEventListener("mousedown", () => {
            if (this.started && !this.isGameOver) this.bird.jump();
        });

        this.canvas.addEventListener("touchstart", () => {
            if (this.started && !this.isGameOver) this.bird.jump();
        });

        const btnR = document.getElementById("btnReintentar");
        btnR.addEventListener("click", () => this.reset());
    }

    handleStartAndJump() {
        if (!this.started && !this.isGameOver) {
            this.started = true;
            document.getElementById("startOverlay").style.display = "none";
        }
        if (!this.isGameOver) this.bird.jump();
    }

    // =======================
    // CREACIÓN DE TUBOS Y MONEDAS
    // =======================
    spawnTubo() {
        if (!this.started) return;

        let nuevoTubo = null;

        if (this.tubos.length === 0) {

            nuevoTubo = new Tubo(this.canvas.width, this.canvas.height);
            this.tubos.push(nuevoTubo);

        } else {

            const ultimo = this.tubos[this.tubos.length - 1];

            if (ultimo.x < this.canvas.width - this.spawnGap) {

                nuevoTubo = new Tubo(this.canvas.width, this.canvas.height);
                this.tubos.push(nuevoTubo);
            }
        }

        if (!nuevoTubo) return;

        // contamos tubos creados
        this.tuboCount++;

        // cada 3 tubos → una moneda entre el hueco
        if (this.tuboCount % 3 === 0) {
            this.createCoinInsideGap(nuevoTubo);
        }
    }

    // =======================
    // CREAR MONEDA ENTRE LOS 2 TUBOS
    // =======================
 createCoinInsideGap(tubo) {

    // moneda entra lentamente desde la derecha (no queda atrapada)
    const x = this.canvas.width + 40;

    // centro del hueco
    const gapCenterY = tubo.topHeight + (tubo.bottomY - tubo.topHeight) / 2;

    const skull = new Calavera(x, gapCenterY);

    // velocidad propia, más lenta que los tubos
    this.vx = -0.150; 
    skull.floatAmplitude = 20;

    this.calaveras.push(skull);
}

    // =======================
    // UPDATE
    // =======================
    update() {
        if (this.isGameOver || !this.started) return;

        this.bird.update();
        this.spawnTubo();

        // tubos
        this.tubos.forEach(t => t.update());
        this.tubos = this.tubos.filter(t => !t.offScreen());

        // cuervo visual
        const cuervoDiv = document.getElementById("cuervo");
        cuervoDiv.style.left = this.bird.x + "px";
        cuervoDiv.style.top = this.bird.y + "px";

        // ===== MONEDAS =====
        this.calaveras.forEach(c => c.update());

       
      
// COLISIÓN con monedas
for (let c of this.calaveras) {
    if (!c.collected && c.collides(this.bird)) {

        c.collected = true;

        // SUMA SIN RESETEAR
        this.skullCount++;
        document.getElementById("skullCount").textContent = this.skullCount;

       if (this.soundSkull) {
    this.soundSkull.currentTime = 0;
    this.soundSkull.play().catch(() => {});
}
    }
}

// eliminar solo las recolectadas
this.calaveras = this.calaveras.filter(c => !c.collected);

        // ===== PUNTOS POR PASAR TUBOS =====
        for (let t of this.tubos) {
            if (!t.passed && t.x + t.width < this.bird.x) {
                t.passed = true;

                this.score++;
                this.scoreDisplay.textContent = this.score;

                if (this.soundPoint) {
                    this.soundPoint.currentTime = 0;
                    this.soundPoint.play().catch(() => {});
                }

                if (this.score >= this.maxScore) {
                    this.handleWin();
                    return;
                }
            }
        }

        // ===== COLISIÓN TUBOS =====
        for (let t of this.tubos) {
            if (t.collides(this.bird)) {
                this.runExplosion();
                this.isGameOver = true;
                return;
            }
        }

        // ===== COLISIÓN PISO =====
        if (this.bird.y + this.bird.height >= 567) {
            this.runExplosion();
            this.isGameOver = true;
            return;
        }
    }

    // =======================
    // RECORD
    // =======================
    updateBestScore() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem("flappyBestScore", this.bestScore);
        }

        this.scoreMaxDisplay.textContent = "Puntaje máximo: " + this.bestScore;
    }

    // =======================
    // GANAR
    // =======================
    handleWin() {
        this.isGameOver = true;

        const cuervoDiv = document.getElementById("cuervo");
        cuervoDiv.classList.remove("cuervo-vuelo");

        document.getElementById("goTitle").textContent = "¡GANASTE!";
        document.getElementById("goMessage").textContent = "Superaste todos los tubos";
        document.getElementById("scoreFinal").textContent = "Puntaje: " + this.score;

        this.updateBestScore();

        document.getElementById("gameOverOverlay").classList.remove("hidden");
    }

    // =======================
    // GAME OVER
    // =======================
    runExplosion() {
    const cuervoDiv = document.getElementById("cuervo");
    const particles = document.getElementById("cuervoParticles");

    const jumpSound = document.getElementById("soundJump");
    if (jumpSound) {
        jumpSound.pause();
        jumpSound.currentTime = 0;
    }

    const hit = document.getElementById("soundHit");
    if (hit) {
        hit.currentTime = 0;
        hit.play().catch(() => {});
    }

    cuervoDiv.style.opacity = "0";
    cuervoDiv.classList.remove("cuervo-vuelo");

    particles.innerHTML = "";

    const cx = this.bird.x + this.bird.width / 2;
    const cy = this.bird.y + this.bird.height / 2;

    for (let i = 0; i < 900; i++) {
        const p = document.createElement("div");
        p.classList.add("particle");

        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 200;

        p.style.setProperty("--dx", Math.cos(angle) * radius + "px");
        p.style.setProperty("--dy", Math.sin(angle) * radius + "px");

        p.style.left = cx + "px";
        p.style.top = cy + "px";

        particles.appendChild(p);
    }

    // ACTUALIZAR EL RÉCORD 
    this.updateBestScore();

    document.getElementById("scoreFinal").textContent =
        "Puntaje: " + this.score;

    setTimeout(() => {
        document.getElementById("gameOverOverlay").classList.remove("hidden");
    }, 2000);
}

    // =======================
    // DRAW
    // =======================
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.tubos.forEach(t => t.draw(this.ctx));
        this.calaveras.forEach(c => c.draw(this.ctx));
    }

    // =======================
    // RESET
    // =======================
    reset() {
        if (this.frameId !== null) cancelAnimationFrame(this.frameId);

        this.bird = new Bird();
        this.tubos = [];
        this.calaveras = [];
        this.score = 0;
        this.tuboCount = 0;
        this.isGameOver = false;
        this.started = false;
        this.skullCount=0;
        document.getElementById("skullCount").textContent = 0;
        const cuervoDiv = document.getElementById("cuervo");
        cuervoDiv.style.opacity = "1";
        cuervoDiv.style.transform = "rotate(0deg)";
        cuervoDiv.classList.add("cuervo-vuelo");

        document.getElementById("cuervoParticles").innerHTML = "";

        document.getElementById("gameOverOverlay").classList.add("hidden");
        document.getElementById("startOverlay").style.display = "flex";

        this.scoreDisplay.textContent = 0;
        this.scoreMaxDisplay.textContent = "Puntaje máximo: " + this.bestScore;

        this.frameId = null;
        this.loop();
    }

    // =======================
    // LOOP
    // =======================
    loop() {
        this.update();
        this.draw();
        this.frameId = requestAnimationFrame(() => this.loop());
    }
}
