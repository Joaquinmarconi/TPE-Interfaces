window.onload = function() {
    const canvas = document.getElementById("canva-Blocka");
    const ctx = canvas.getContext("2d");
    const overlay = document.getElementById("ganasteOverlay");
    const nextBtn = document.getElementById("nextLevelBtn");
    const retryBtn = document.getElementById("retryLevelBtn"); // 👈 nuevo botón en el overlay
    const startBtn = document.getElementById("startBtn");
    const tiempoElem = document.getElementById("tiempo");
    const nivelTexto = document.getElementById("nivelTexto");

    const filters = ["grayscale", "brightness", "negative"];
    const imagePool = [
        "Assets/gato.jpeg",
        "Assets/luna.jpeg",
        "Assets/zootopia.jpeg",
        "Assets/flowerBoy.jpeg",
        "Assets/caballos.jpeg",
        "Assets/mineCraft.jpeg",
        "Assets/tierra.jpeg",
        "Assets/estrella.jpeg",
        "Assets/lineas.jpeg",
        "Assets/bloques.jpeg"
    ];

    let currentLevel = 0;
    const levels = [...imagePool];
    const pieces = [];
    const gridSize = 2;

    let timer;
    let seconds = 0;
    let gameActive = false;
    let timeLimit = 5; // ⏱️ tiempo máximo de cada nivel (5 segundos)

    function startTimer() {
        clearInterval(timer);
        seconds = 0;
        tiempoElem.textContent = "00:00";

        timer = setInterval(() => {
            if (!gameActive) return;

            seconds++;
            const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
            const secs = (seconds % 60).toString().padStart(2, "0");
            tiempoElem.textContent = `${mins}:${secs}`;

            if (seconds >= timeLimit) {
                clearInterval(timer);
                gameActive = false;
                overlay.style.display = "block";
                overlay.querySelector("h2").textContent = "⏰ ¡Tiempo agotado!";
                nextBtn.style.display = "none";
                retryBtn.style.display = "block";
            }
        }, 1000);
    }

    function getFilterForLevel() {
        if (currentLevel === 0) return "grayscale";
        if (currentLevel === 1) return "brightness";
        if (currentLevel === 2) return "negative";
        return filters[Math.floor(Math.random() * filters.length)];
    }

    function updateLevelText() {
        nivelTexto.textContent = `Nivel ${currentLevel + 1}`;
    }

    function startLevel() {
        pieces.length = 0;
        overlay.style.display = "none";
        gameActive = true;
        updateLevelText();

        if (currentLevel >= levels.length) {
            alert("🎉 ¡Has completado todos los niveles!");
            clearInterval(timer);
            return;
        }

        startTimer();

        const img = new Image();
        img.src = levels[currentLevel];
        img.onload = function() {
            const pieceWidth = img.width / gridSize;
            const pieceHeight = img.height / gridSize;

            const randomRotations = [0, 90, 180, 270];
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    pieces.push({
                        x: col * pieceWidth,
                        y: row * pieceHeight,
                        rotation: randomRotations[Math.floor(Math.random() * randomRotations.length)],
                        filter: getFilterForLevel(),
                        img: img
                    });
                }
            }
            draw();
        };
    }

    function draw(original = false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const pieceWidth = pieces[0].img.width / gridSize;
        const pieceHeight = pieces[0].img.height / gridSize;

        pieces.forEach((p, i) => {
            const col = i % gridSize;
            const row = Math.floor(i / gridSize);
            const destX = col * (canvas.width / gridSize);
            const destY = row * (canvas.height / gridSize);

            ctx.save();
            ctx.translate(destX + canvas.width / (gridSize * 2), destY + canvas.height / (gridSize * 2));
            ctx.rotate((p.rotation * Math.PI) / 180);

            if (!original) {
                if (p.filter === "grayscale") ctx.filter = "grayscale(100%)";
                else if (p.filter === "brightness") ctx.filter = "brightness(130%)";
                else if (p.filter === "negative") ctx.filter = "invert(100%)";
            } else {
                ctx.filter = "none";
            }

            ctx.drawImage(
                p.img,
                p.x, p.y, pieceWidth, pieceHeight,
                -canvas.width / (gridSize * 2), -canvas.height / (gridSize * 2),
                canvas.width / gridSize, canvas.height / gridSize
            );
            ctx.restore();
        });
    }

    canvas.addEventListener("mousedown", (e) => {
        if (!gameActive) return;

        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / (canvas.width / gridSize));
        const row = Math.floor(y / (canvas.height / gridSize));
        const index = row * gridSize + col;

        if (index < 0 || index >= pieces.length) return;

        if (e.button === 0) pieces[index].rotation -= 90;
        else if (e.button === 2) pieces[index].rotation += 90;

        pieces[index].rotation = (pieces[index].rotation + 360) % 360;

        if (pieces.every(p => p.rotation === 0)) {
            draw(true);
            overlay.style.display = "block";
            overlay.querySelector("h2").textContent = "🎉 ¡Ganaste!";
            clearInterval(timer);
            gameActive = false;

            retryBtn.style.display = "none";
            if (currentLevel < levels.length - 1) {
                nextBtn.style.display = "block";
            } else {
                nextBtn.style.display = "none";
            }
        } else {
            draw();
        }
    });

    canvas.addEventListener("contextmenu", e => e.preventDefault());

    nextBtn.addEventListener("click", () => {
        if (currentLevel < levels.length - 1) {
            currentLevel++;
            startLevel();
        } else {
            alert("🏁 ¡Juego terminado!");
        }
    });

    retryBtn.addEventListener("click", () => {
        startLevel();
    });

    startBtn.addEventListener("click", () => {
        startBtn.style.display = "none";
        startLevel();
    });

    // Mostrar primera imagen desordenada desde el inicio
    (function previewLevel() {
        pieces.length = 0;
        updateLevelText();

        const img = new Image();
        img.src = levels[currentLevel];
        img.onload = function() {
            const pieceWidth = img.width / gridSize;
            const pieceHeight = img.height / gridSize;
            const randomRotations = [0, 90, 180, 270];

            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    pieces.push({
                        x: col * pieceWidth,
                        y: row * pieceHeight,
                        rotation: randomRotations[Math.floor(Math.random() * randomRotations.length)],
                        filter: getFilterForLevel(),
                        img: img
                    });
                }
            }
            draw();
        };
    })();
};
