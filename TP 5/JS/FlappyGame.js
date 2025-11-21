class FlappyGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.bird = new Bird();
        this.tubos = [];
        this.calaveras = [];

        this.orbitas = [];
        this.lastOrbitaCount = 0;  
        this.hasShield = false;  // ← nuevo

        this.spawnGap = 300;
        this.score = 0;
        this.isGameOver = false;
        this.frameId = null;

        this.started = false;
        this.maxScore = 50;

        this.tuboCount = 0;
        this.skullCount = 0;

        // Distancias dinámicas
        this.spawnGapMin = 140;
        this.spawnGapMax = 420;

        this.gapMin = 85;
        this.gapMax = 240;

        this.setupControls();

        const cuervoDiv = document.getElementById("cuervo");
        cuervoDiv.classList.add("cuervo-vuelo");

        this.scoreDisplay = document.getElementById("score");
        this.scoreMaxDisplay = document.getElementById("scoreMaximo");

        this.bestScore = parseInt(localStorage.getItem("flappyBestScore") || "0", 10);

        if (this.scoreMaxDisplay) {
            this.scoreMaxDisplay.textContent = "Record: " + this.bestScore;
        }

        this.soundPoint = document.getElementById("soundPoint");
        this.soundSkull = document.getElementById("soundSkull");

        cuervoDiv.style.left = this.bird.x + "px";
        cuervoDiv.style.top = this.bird.y + "px";

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
    // PARALLAX
    // =======================
    stopParallax() {
        document.querySelectorAll(".layer").forEach(l => {
            l.style.animationPlayState = "paused";
        });
    }

    startParallax() {
        document.querySelectorAll(".layer").forEach(l => {
            l.style.animationPlayState = "running";
        });
    }

    // ============================
    // COIN ENTRE PARES DE TUBOS
    // ============================
  createCoinBetweenTubes(tuboAnterior, tuboNuevo) {
  
    // 1.5 significa que aparece cuando se aproxima el siguiente tubo
    const x = tuboAnterior.x + (tuboNuevo.x - tuboAnterior.x) * 1.5;

    // ============================================
    // 2) Variación vertical fuerte (más notoria)
    // ============================================
    const gapTop = tuboAnterior.topHeight;
    const gapBottom = tuboAnterior.bottomY;

    // Distancia total del hueco
    const gapHeight = gapBottom - gapTop;

    // Variación vertical proporcional al tamaño del hueco
    const verticalOffset = (gapHeight * 0.55); // 55% del hueco hacia arriba o abajo

    // elegimos posición: arriba / medio / abajo
    const choices = [-verticalOffset, 0, verticalOffset];
    const offset = choices[Math.floor(Math.random() * choices.length)];

   const safeMargin = gapHeight * 0.15; // evita que toque extremos del hueco

    // coinY final con margen de seguridad
    const coinY =
        Math.min(gapBottom - safeMargin,
            Math.max(gapTop + safeMargin,
                gapTop + gapHeight / 2 + offset
            )
        );
    // ============================================
    // 3) Crear la calavera
    // ============================================
    const skull = new Calavera(x, coinY);

    skull.vx = -2;          // misma velocidad de tubos
    skull.floatAmplitude = 5; // fija para que no moleste visualmente

    this.calaveras.push(skull);
}


spawnOrbita() {
    if (this.tubos.length < 2) return;

    const anterior = this.tubos[this.tubos.length - 2];
    const ultimo = this.tubos[this.tubos.length - 1];

    const x = anterior.x + (ultimo.x - anterior.x) * 1.7;

    const gapTop = anterior.topHeight;
    const gapBottom = anterior.bottomY;
    const gapHeight = gapBottom - gapTop;

    const safe = gapHeight * 0.25;
    const yMin = gapTop + safe;
    const yMax = gapBottom - safe;

    const y = yMin + Math.random() * (yMax - yMin);

    const orb = new Orbita(x, y);
    this.orbitas.push(orb);
}

    // =======================
    // CREACIÓN DE TUBOS
    // =======================
    spawnTubo() {
        if (!this.started) return;

        // Distancia horizontal dinámica
        this.spawnGap =
            this.spawnGapMax -
            (this.spawnGapMax - this.spawnGapMin) *
            Math.min(this.score / 50, 1);

        // Hueco vertical dinámico
        const dynamicGap =
            this.gapMax -
            (this.gapMax - this.gapMin) *
            Math.min(this.score / 45, 1);

        let nuevoTubo = null;

        // Primer tubo
        if (this.tubos.length === 0) {
            nuevoTubo = new Tubo(this.canvas.width, this.canvas.height, dynamicGap);
            this.tubos.push(nuevoTubo);
            return; // no hay moneda todavía
        }

        const ultimo = this.tubos[this.tubos.length - 1];

        // ¿Ya entró en distancia para crear otro tubo?
        if (ultimo.x < this.canvas.width - this.spawnGap) {
            nuevoTubo = new Tubo(this.canvas.width, this.canvas.height, dynamicGap);
            this.tubos.push(nuevoTubo);

            // ✔ Moneda entre este tubo y el anterior
            this.createCoinBetweenTubes(ultimo, nuevoTubo);
        }
    }

    // =======================
    // UPDATE
    // =======================
    update() {
        if (this.isGameOver || !this.started) return;

        this.bird.update();
        this.spawnTubo();

        this.tubos.forEach(t => t.update());
        this.tubos = this.tubos.filter(t => !t.offScreen());

        // sincronicemos el cuervo-DIV
        const cuervoDiv = document.getElementById("cuervo");
        cuervoDiv.style.left = this.bird.x + "px";
        cuervoDiv.style.top = this.bird.y + "px";

        // actualizar monedas
        this.calaveras.forEach(c => c.update());

        // colisión monedas
        for (let c of this.calaveras) {
            if (!c.collected && c.collides(this.bird)) {
                c.collected = true;

                this.skullCount++;
                document.getElementById("skullCount").textContent = this.skullCount;

                // generar una órbita cada 8 calaveras
if (this.skullCount >= this.lastOrbitaCount + 2) {
    this.lastOrbitaCount = this.skullCount;
    this.spawnOrbita();
}

                if (this.soundSkull) {
                    this.soundSkull.currentTime = 0;
                    this.soundSkull.play().catch(() => {});
                }
            }
        }

        this.calaveras = this.calaveras.filter(c => !c.collected);
// actualizar órbitas
for (let o of this.orbitas) {
    o.update();

    if (!o.collected && o.collides(this.bird)) {
        o.collected = true;

        //  activar escudo por 5 segundos
        this.activateShield();

        // efecto visual
        document.getElementById("cuervo").classList.add("shield-effect");

        // opcional: sonido
        const snd = document.getElementById("soundOrb");
        if (snd) { snd.currentTime = 0; snd.play().catch(() => {}); }
    }
}

this.orbitas = this.orbitas.filter(o => !o.collected);

        // puntaje por tubos pasados
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

        // colisión con tubos
// colisión con tubos
for (let t of this.tubos) {
    if (t.collides(this.bird)) {

        // 🛡 Si tiene escudo → NO muere
        if (this.hasShield) {
            continue;  // ignora el golpe, escudo sigue activo
        }

        // muerte normal
        this.runExplosion();
        this.isGameOver = true;
        this.stopParallax();
        return;
    }
}


        // colisión con piso
        if (this.bird.y + this.bird.height >= 567) {
            this.runExplosion();
            this.isGameOver = true;
            this.stopParallax();
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

        if (this.scoreMaxDisplay) {
            this.scoreMaxDisplay.textContent = "Record: " + this.bestScore;
        }
    }

    // =======================
    // GANAR
    // =======================
    handleWin() {
        this.isGameOver = true;
        this.stopParallax();

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

        this.updateBestScore();
        document.getElementById("scoreFinal").textContent = "Puntaje: " + this.score;

        setTimeout(() => {
            document.getElementById("gameOverOverlay").classList.remove("hidden");
        }, 2000);
    }



    activateShield() {
    // activar escudo
    this.hasShield = true;

    const cuervoDiv = document.getElementById("cuervo");
    cuervoDiv.classList.add("shield-effect");

    // si ya tenía un timeout previo → se cancela
    if (this.shieldTimeout) clearTimeout(this.shieldTimeout);

    //  Escudo dura 10 segundos
    this.shieldTimeout = setTimeout(() => {

        // apagar escudo
        this.hasShield = false;

        // quitar efecto visual
        cuervoDiv.classList.remove("shield-effect");

    }, 10000); // ← 10,000 ms = 10 segundos
}
    // =======================
    // DRAW
    // =======================
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.tubos.forEach(t => t.draw(this.ctx));
        this.calaveras.forEach(c => c.draw(this.ctx));
        this.orbitas.forEach(o => o.draw(this.ctx));
    }

    // =======================
    // RESET
    // =======================
    reset() {
        if (this.frameId !== null) cancelAnimationFrame(this.frameId);

        this.startParallax();

        this.bird = new Bird();
        this.tubos = [];
        this.calaveras = [];
        this.orbitas = [];
this.lastOrbitaCount = 0;
        this.score = 0;
        this.tuboCount = 0;
        this.isGameOver = false;
        this.started = false;
        this.skullCount = 0;

        document.getElementById("skullCount").textContent = "0";

        const cuervoDiv = document.getElementById("cuervo");
        cuervoDiv.style.opacity = "1";
        cuervoDiv.style.transform = "rotate(0deg)";
        cuervoDiv.classList.add("cuervo-vuelo");

        cuervoDiv.style.left = this.bird.x + "px";
        cuervoDiv.style.top = this.bird.y + "px";

        document.getElementById("cuervoParticles").innerHTML = "";

        document.getElementById("gameOverOverlay").classList.add("hidden");
        document.getElementById("startOverlay").style.display = "flex";

        this.scoreDisplay.textContent = 0;
        this.scoreMaxDisplay.textContent = "Record: " + this.bestScore;

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
