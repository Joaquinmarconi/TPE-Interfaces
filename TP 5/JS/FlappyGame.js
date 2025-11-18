class FlappyGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.bird = new Bird();
        this.tubos = [];

        this.spawnGap = 300;
        this.score = 0;
        this.isGameOver = false;
        this.frameId = null;

        this.started = false;

        // puntaje necesario para "ganar"
        this.maxScore = 50;

        this.setupControls();

        // activar animación de vuelo desde inicio
        const c = document.getElementById("cuervo");
        if (c) c.classList.add("cuervo-vuelo");

        // referencia al score visible
        this.scoreDisplay = document.getElementById("score");

        // referencia al puntaje máximo visible
        this.scoreMaxDisplay = document.getElementById("scoreMaximo");

        // leer récord desde localStorage
        this.bestScore = parseInt(localStorage.getItem("flappyBestScore") || "0", 10);

        // mostrar récord inicial
        if (this.scoreMaxDisplay) {
            this.scoreMaxDisplay.textContent = "Puntaje máximo: " + this.bestScore;
        }
    }

    // --------------------------------------
    // CONTROLES
    // --------------------------------------
    setupControls() {
        document.addEventListener("keydown", e => {
            if (e.key === "ArrowUp") this.handleStartAndJump();
        });

        const overlay = document.getElementById("startOverlay");
        if (overlay) {
            overlay.addEventListener("mousedown", () => this.handleStartAndJump());
            overlay.addEventListener("touchstart", () => this.handleStartAndJump());
        }

        this.canvas.addEventListener("mousedown", () => {
            if (this.started && !this.isGameOver) this.bird.jump();
        });

        this.canvas.addEventListener("touchstart", () => {
            if (this.started && !this.isGameOver) this.bird.jump();
        });

        const btnR = document.getElementById("btnReintentar");
        if (btnR) btnR.addEventListener("click", () => this.reset());
    }

    // --------------------------------------
    // START + JUMP
    // --------------------------------------
    handleStartAndJump() {
        if (!this.started && !this.isGameOver) {
            this.started = true;
            const overlay = document.getElementById("startOverlay");
            if (overlay) overlay.style.display = "none";
        }
        if (this.started && !this.isGameOver) this.bird.jump();
    }

    // --------------------------------------
    // TUBOS
    // --------------------------------------
    spawnTubo() {
        if (!this.started) return;

        if (this.tubos.length === 0) {
            this.tubos.push(new Tubo(this.canvas.width, this.canvas.height));
        } else {
            const ultimo = this.tubos[this.tubos.length - 1];
            if (ultimo.x < this.canvas.width - this.spawnGap) {
                this.tubos.push(new Tubo(this.canvas.width, this.canvas.height));
            }
        }
    }

    // --------------------------------------
    // UPDATE
    // --------------------------------------
    update() {
        if (this.isGameOver) return;
        if (!this.started) return;

        this.bird.update();
        this.spawnTubo();

        this.tubos.forEach(t => t.update());
        this.tubos = this.tubos.filter(t => !t.offScreen());

        // mover sprite del cuervo
        const cuervoDiv = document.getElementById("cuervo");
        cuervoDiv.style.top = this.bird.y + "px";
        cuervoDiv.style.left = this.bird.x + "px";

        // === SUMA PUNTOS ===
        for (let t of this.tubos) {
            if (!t.passed && t.x + t.width < this.bird.x) {
                t.passed = true;
                this.score++;

                // actualizar contador en pantalla
                if (this.scoreDisplay)
                    this.scoreDisplay.textContent = this.score;

                // ¿LLEGÓ AL MÁXIMO? => GANASTE
                if (this.score >= this.maxScore) {
                    this.handleWin();
                    return;
                }
            }
        }

        // === COLISION TUBOS ===
        for (let t of this.tubos) {
            if (t.collides(this.bird)) {
                this.runExplosion();
                this.isGameOver = true;
                return;
            }
        }

        // === COLISION PISO ===
        if (this.bird.y + this.bird.height >= 567) {
            this.runExplosion();
            this.isGameOver = true;
            return;
        }
    }

    // --------------------------------------
    // ACTUALIZAR RÉCORD
    // --------------------------------------
    updateBestScore() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem("flappyBestScore", this.bestScore);
        }

        if (this.scoreMaxDisplay) {
            this.scoreMaxDisplay.textContent = "Puntaje máximo: " + this.bestScore;
        }
    }

    // --------------------------------------
    // MODO GANASTE (50 puntos)
    // --------------------------------------
    handleWin() {
        this.isGameOver = true;

        // detener animación del cuervo
        const cuervoDiv = document.getElementById("cuervo");
        cuervoDiv.classList.remove("cuervo-vuelo");
        cuervoDiv.getAnimations().forEach(a => a.cancel());

        // actualizar textos overlay
        const title = document.getElementById("goTitle");
        const msg = document.getElementById("goMessage");

        if (title) title.textContent = "¡GANASTE!";
        if (msg) msg.textContent = "Superaste todos los tubos";

        // mostrar puntaje final
        const scoreFinal = document.getElementById("scoreFinal");
        if (scoreFinal) scoreFinal.textContent = "Puntaje: " + this.score;

        // actualizar récord
        this.updateBestScore();

        const overlay = document.getElementById("gameOverOverlay");
        if (overlay) overlay.classList.remove("hidden");
    }

    // --------------------------------------
    // EXPLOSION (GAME OVER)
    // --------------------------------------
    runExplosion() {
        const cuervoDiv = document.getElementById("cuervo");
        const particles = document.getElementById("cuervoParticles");

        // desaparecer YA
        cuervoDiv.style.opacity = "0";
        cuervoDiv.classList.remove("cuervo-vuelo");
        cuervoDiv.getAnimations().forEach(a => a.cancel());

        // partículas
        particles.innerHTML = "";

        const cx = this.bird.x + this.bird.width / 2;
        const cy = this.bird.y + this.bird.height / 2;

        const total = 1200; // explosión grande
        for (let i = 0; i < total; i++) {
            const p = document.createElement("div");
            p.classList.add("particle");

            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 260;

            p.style.setProperty("--dx", Math.cos(angle) * radius + "px");
            p.style.setProperty("--dy", Math.sin(angle) * radius + "px");

            p.style.left = cx + "px";
            p.style.top = cy + "px";

            particles.appendChild(p);
        }

        // configurar textos como "perdiste"
        const title = document.getElementById("goTitle");
        const msg = document.getElementById("goMessage");

        if (title) title.textContent = "¡GAME OVER!";
        if (msg) msg.textContent = "Chocaste contra un tubo o el piso.";

        // mostrar puntaje final
        const scoreFinal = document.getElementById("scoreFinal");
        if (scoreFinal) scoreFinal.textContent = "Puntaje: " + this.score;

        // actualizar récord
        this.updateBestScore();

        setTimeout(() => {
            const overlay = document.getElementById("gameOverOverlay");
            if (overlay) overlay.classList.remove("hidden");
        }, 2400);
    }

    // --------------------------------------
    // DRAW
    // --------------------------------------
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.tubos.forEach(t => t.draw(this.ctx));
    }

    // --------------------------------------
    // RESET
    // --------------------------------------
    reset() {
        if (this.frameId !== null) cancelAnimationFrame(this.frameId);

        this.bird = new Bird();
        this.tubos = [];
        this.score = 0;
        this.isGameOver = false;
        this.started = false;

        const cuervoDiv = document.getElementById("cuervo");
        const particles = document.getElementById("cuervoParticles");

        cuervoDiv.style.backgroundPosition = "0px 0px";
        cuervoDiv.style.opacity = "1";
        cuervoDiv.style.transform = "rotate(0deg)";
        cuervoDiv.classList.add("cuervo-vuelo");

        cuervoDiv.style.left = this.bird.x + "px";
        cuervoDiv.style.top = this.bird.y + "px";

        particles.innerHTML = "";

        const gameOverOverlay = document.getElementById("gameOverOverlay");
        if (gameOverOverlay) gameOverOverlay.classList.add("hidden");

        const startOverlay = document.getElementById("startOverlay");
        if (startOverlay) startOverlay.style.display = "flex";

        // reiniciar marcador visible (pero NO el récord)
        if (this.scoreDisplay)
            this.scoreDisplay.textContent = 0;

        // volver a mostrar el récord por las dudas
        if (this.scoreMaxDisplay)
            this.scoreMaxDisplay.textContent = "Puntaje máximo: " + this.bestScore;

        this.frameId = null;
        this.loop();
    }

    // --------------------------------------
    // LOOP
    // --------------------------------------
    loop() {
        this.update();
        this.draw();
        this.frameId = requestAnimationFrame(() => this.loop());
    }
}