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

        this.setupControls();

        document.getElementById("cuervo").classList.add("cuervo-vuelo");
    }

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

    handleStartAndJump() {
        if (!this.started && !this.isGameOver) {
            this.started = true;
            const overlay = document.getElementById("startOverlay");
            if (overlay) overlay.style.display = "none";
        }
        if (this.started && !this.isGameOver) {
            this.bird.jump();
        }
    }

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

    update() {
        if (this.isGameOver) return;
        if (!this.started) return;

        this.bird.update();
        this.spawnTubo();

        this.tubos.forEach(t => t.update());
        this.tubos = this.tubos.filter(t => !t.offScreen());

        const cuervoDiv = document.getElementById("cuervo");
        cuervoDiv.style.top = this.bird.y + "px";
        cuervoDiv.style.left = this.bird.x + "px";

        // COLISIÓN — explosión en el MISMO FRAME
        for (let t of this.tubos) {
            if (t.collides(this.bird)) {

                // EXPLOSION INSTANTÁNEA SIN DELAY NI FRAME EXTRA
                this.runExplosion();

                this.isGameOver = true;
                return;
            }
        }
    }

    // 🔥 EXPLOSIÓN REAL INSTANTÁNEA — SIN PARPADEO NI FRAMES EXTRAS
    runExplosion() {
        const cuervoDiv = document.getElementById("cuervo");
        const particles = document.getElementById("cuervoParticles");

        // desaparecer cuervo YA (antes de redraw)
        cuervoDiv.style.opacity = "0";
        cuervoDiv.classList.remove("cuervo-vuelo");

        // cancelar animaciones CSS si hay
        cuervoDiv.getAnimations().forEach(a => a.cancel());

        // generar partículas
        particles.innerHTML = "";

        const cx = this.bird.x + this.bird.width / 2;
        const cy = this.bird.y + this.bird.height / 2;

        const total = 1200;
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

        // overlay luego de animación
        setTimeout(() => {
            const overlay = document.getElementById("gameOverOverlay");
            if (overlay) overlay.classList.remove("hidden");
        }, 2400);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.tubos.forEach(t => t.draw(this.ctx));
    }

    reset() {
        if (this.frameId !== null) cancelAnimationFrame(this.frameId);

        this.bird = new Bird();
        this.tubos = [];
        this.isGameOver = false;
        this.started = false;

        const cuervoDiv = document.getElementById("cuervo");
        const particles = document.getElementById("cuervoParticles");

        cuervoDiv.style.backgroundPosition = "0px 0px";
        cuervoDiv.style.opacity = "1";
        cuervoDiv.style.filter = "none";
        cuervoDiv.style.transform = "rotate(0deg) scale(1)";

        cuervoDiv.classList.add("cuervo-vuelo");

        cuervoDiv.style.left = this.bird.x + "px";
        cuervoDiv.style.top = this.bird.y + "px";

        particles.innerHTML = "";

        document.getElementById("gameOverOverlay").classList.add("hidden");

        const startOverlay = document.getElementById("startOverlay");
        if (startOverlay) startOverlay.style.display = "flex";

        this.frameId = null;
        this.loop();
    }

    loop() {
        this.update();
        this.draw();
        this.frameId = requestAnimationFrame(() => this.loop());
    }
}