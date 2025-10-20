window.onload = function() {
    const canvas = document.getElementById("canva-Blocka");
    const ctx = canvas.getContext("2d");
    const overlay = document.getElementById("ganasteOverlay");
    const nextBtn = document.getElementById("nextLevelBtn");
    const retryBtn = document.getElementById("retryLevelBtn");
    const startBtn = document.getElementById("startBtn");
    const startLevelBtn = document.getElementById("startLevelBtn");
    const backBtn = document.getElementById("backBtn");
    const menuBtn= document.getElementById("menuBtn");
    const tiempoElem = document.getElementById("tiempo");
    const nivelTexto = document.getElementById("nivelTexto");
    const instruccionesOverlay = document.getElementById("instruccionesOverlay");
    const entendidoBtn = document.getElementById("entendidoBtn");

    const filters = ["grayscale", "brightness", "negative"];
    let imagePool = [
        "Assets/gato.jpeg",
        "Assets/luna.jpeg",
        "Assets/flowerBoy.jpeg",
        "Assets/lineas.jpeg",
        "Assets/caballos.jpeg",
        "Assets/tierra.jpeg",
        "Assets/mineCraft.jpeg",
        "Assets/estrella.jpeg",
        "Assets/cubos.jpeg",
        "Assets/bloques.jpeg"
    ];

    let currentLevel = 0;
    let currentImage = null;
    const pieces = [];
    const gridSize = 2;
    let timer;
    let seconds = 0;
    let gameActive = false;
    const levelsUsed = [];
    let retrying = false; // indica si estamos reintentando la misma imagen

    function shuffle(array) { return array.sort(() => Math.random() - 0.5); }

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

            if (seconds > timeLimit) {
                clearInterval(timer);
                gameActive = false;
                overlay.style.display = "block";
                overlay.querySelector("h2").textContent = "¡Tiempo agotado!";
                overlay.querySelector("h2").style.color = "#f73d3dff";
                overlay.querySelector("h2").style.textShadow = "#ee0e0eff";
                overlay.querySelector("h2").style.width= "170px";
                overlay.querySelector("h2").style.marginLeft="88px";
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

    function showThumbnailsAndSelectImage() {
        const container = document.querySelector(".thumbnails");
        container.innerHTML = "";
        startLevelBtn.style.display = "none";
        if (imagePool.length === 0) return;

        imagePool.forEach((src) => {
            const img = document.createElement("img");
            img.src = src;
            container.appendChild(img);
        });

        const selectedIdx = Math.floor(Math.random() * imagePool.length);
        currentImage = imagePool[selectedIdx];
        const imgs = container.querySelectorAll("img");

        let i = 0;
        const highlightInterval = setInterval(() => {
            if (i > 0) imgs[i - 1].classList.remove("highlight");
            if (i >= imgs.length) {
                clearInterval(highlightInterval);
                const finalImg = Array.from(imgs).find(img => img.src.includes(currentImage.split("/").pop()));
                if (finalImg) {
                    finalImg.classList.add("highlight");
                    startLevelBtn.style.display = "block";
                    finalImg.addEventListener("click", () => {
                        startLevelBtn.style.display = "block";
                    });
                }
                return;
            }
            imgs[i].classList.add("highlight");
            i++;
        }, 300);

        currentLevel = levelsUsed.length;
    }

    function startLevel() {
        pieces.length = 0;
        overlay.style.display = "none";
        gameActive = true;
        updateLevelText();
        canvas.style.display = "block";

        if (!currentImage) return;
        if (!retrying) levelsUsed.push(currentImage);
        retrying = false;
        timeLimit = currentLevel < 6 ? 9 : 6;
        startTimer();

        const img = new Image();
        img.src = currentImage;
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
        if (pieces.length === 0) return;
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
            clearInterval(timer);
            gameActive = false;
            retryBtn.style.display = "none";

            const idx = imagePool.indexOf(currentImage);
            if (idx !== -1) imagePool.splice(idx, 1);

            if (imagePool.length > 0) {
                overlay.querySelector("h2").textContent = "¡Nivel superado!";
                overlay.querySelector("h2").style.color = "#d3d3d3ff";
                overlay.querySelector("h2").style.width= "152px";
                overlay.querySelector("h2").style.marginLeft="100px";
                nextBtn.style.display = "block";
            } else {
                overlay.querySelector("h2").textContent = "¡Ganaste todos los niveles!";
                overlay.querySelector("h2").style.color = "#58af58ff";
                overlay.querySelector("h2").style.width= "170px";
                overlay.style.transform = "translate(-50%, 200%)"; 
                backBtn.style.marginLeft="130px";
                nextBtn.style.display = "none";
                menuBtn.style.display= "none";
                backBtn.style.display = "block";
            }
            overlay.style.display = "block";
        } else {
            draw();
        }
    });

    canvas.addEventListener("contextmenu", e => e.preventDefault());

    startBtn.addEventListener("click", () => {
    // Muestra las instrucciones primero

    instruccionesOverlay.style.display = "flex";
    });

    // Cuando el usuario presiona "Entendido", recién inicia la selección de imagen
    entendidoBtn.addEventListener("click", () => {
        instruccionesOverlay.style.display = "none";
        startBtn.style.display = "none";
        document.querySelector('.header-juego').style.display="flex";
        document.getElementById("preNivel").style.display = "flex";
         updateLevelText();
        showThumbnailsAndSelectImage();
    });
    startLevelBtn.addEventListener("click", () => {
        document.getElementById("preNivel").style.display = "none";
        canvas.style.display = "block";
        startLevel();
    });

    nextBtn.addEventListener("click", () => {
        overlay.style.display = "none";
        document.getElementById("preNivel").style.display = "flex";
        showThumbnailsAndSelectImage();
    });

    retryBtn.addEventListener("click", () => {
        overlay.style.display = "none";
        document.getElementById("preNivel").style.display = "none";
        retrying = true;
        startLevel();
    });

    // ----- NUEVO: Función de reinicio compartida -----
    function resetGameToStart() {
        overlay.style.display = "none";
        document.getElementById("preNivel").style.display = "none";
        document.querySelector('.header-juego').style.display="none";
        canvas.style.display = "none";
        startBtn.style.display = "block";

        clearInterval(timer);
        gameActive = false;
        retrying = false;
        currentLevel = 0;
        seconds = 0;
        tiempoElem.textContent = "00:00";
        nivelTexto.textContent = "";
        levelsUsed.length = 0;

        imagePool = [
            "Assets/gato.jpeg",
            "Assets/luna.jpeg",
            "Assets/flowerBoy.jpeg",
            "Assets/lineas.jpeg",
            "Assets/caballos.jpeg",
            "Assets/tierra.jpeg",
            "Assets/mineCraft.jpeg",
            "Assets/estrella.jpeg",
            "Assets/cubos.jpeg",
            "Assets/bloques.jpeg"
        ];

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    document.getElementById("menuBtn").addEventListener("click", resetGameToStart);
    backBtn.addEventListener("click", resetGameToStart);
};
