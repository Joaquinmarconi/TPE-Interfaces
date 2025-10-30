window.onload = function() {
    const canvas = document.getElementById("canva-Blocka");
    const ctx = canvas.getContext("2d");
    const overlay = document.getElementById("ganasteOverlay");
    const nextBtn = document.getElementById("nextLevelBtn");
    const retryBtn = document.getElementById("retryLevelBtn");
    const startBtn = document.getElementById("startBtn");
    const startLevelBtn = document.getElementById("startLevelBtn");
    const backBtn = document.getElementById("backBtn");
    const menuBtn = document.getElementById("menuBtn");
    const tiempoElem = document.getElementById("tiempo");
    const nivelTexto = document.getElementById("nivelTexto");
    const instruccionesOverlay = document.getElementById("instruccionesOverlay");
    const entendidoBtn = document.getElementById("entendidoBtn");

    const filters = ["grayscale", "brightness", "negative", "blur"];
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
    let timer;
    let seconds = 0;
    let gameActive = false;
    const levelsUsed = [];
    let retrying = false;
    let timeLimit = 30;

    // --- TIMER ---
    function startTimer() {
        clearInterval(timer);
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

                    if(currentLevel===0){ overlay.style.transform = "translate(-41%, 280%)"; 

                    }else if(currentLevel===1){ overlay.style.transform = "translate(-41%, 200%)";

                    }else if(currentLevel===2){ overlay.style.transform = "translate(-41%, 150%)";

                    }else if(currentLevel===3){ overlay.style.transform = "translate(-41%, 260%)";

                    }else{ overlay.style.transform = "translate(-41%, 200%)"; } 
                }
        }, 1000);
    }

        // --- FILTROS ---
        function getFilterForLevel() {
            if (currentLevel === 0) return "grayscale";
            if (currentLevel === 1) return "brightness";
            if (currentLevel === 2) return "negative";
            if (currentLevel === 3) return "blur";
            return filters[Math.floor(Math.random() * filters.length)];
        }

        function applyFilter(imageData, filter) {
            const data = imageData.data;
            const width = imageData.width;
            const height = imageData.height;

            if (filter === "blur") {
                const copy = new Uint8ClampedArray(data);
                for (let y = 1; y < height - 1; y++) {
                    for (let x = 1; x < width - 1; x++) {
                        let i = (y * width + x) * 4;
                        let r = 0, g = 0, b = 0;
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                let ni = ((y + dy) * width + (x + dx)) * 4;
                                r += copy[ni];
                                g += copy[ni + 1];
                                b += copy[ni + 2];
                            }
                        }
                        data[i] = r / 9;
                        data[i + 1] = g / 9;
                        data[i + 2] = b / 9;
                    }
                }
                return imageData;
            }

            for (let i = 0; i < data.length; i += 4) {
                let r = data[i], g = data[i + 1], b = data[i + 2];
                
                if (filter === "grayscale") {
                    const avg = (r + g + b) / 3;
                    data[i] = data[i + 1] = data[i + 2] = avg;
                } 
                else if (filter === "brightness") {
                    data[i] = Math.min(255, r * 1.3);
                    data[i + 1] = Math.min(255, g * 1.5);
                    data[i + 2] = Math.min(255, b * 1.5);
                } 
                else if (filter === "negative") {
                    data[i] = 255 - r;
                    data[i + 1] = 255 - g;
                    data[i + 2] = 255 - b;
                }
            }
            return imageData;
        }

        function updateLevelText() {
            nivelTexto.textContent = `Nivel ${currentLevel + 1}`;
        }

    function getGridSizeForLevel(level) {
        if (level === 0) return { filas: 2, columnas: 2 };
        if (level === 1) return { filas: 2, columnas: 3 };
        if (level === 2) return { filas: 2, columnas: 4 };
        if (level === 3) return { filas: 3, columnas: 3 };
        return { filas: 3, columnas: 4 };
    }

    // --- MINIATURAS ---
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

    // --- INICIO DE NIVEL ---
    function startLevel() {
        pieces.length = 0;
        overlay.style.display = "none";
        gameActive = true;
        updateLevelText();
        canvas.style.display = "block";
        nextBtn.style.display = "none";
        retryBtn.style.display = "none";

        if (!currentImage) return;
        if (!retrying) levelsUsed.push(currentImage);
        retrying = false;

        clearInterval(timer);
        seconds = 0;
        tiempoElem.textContent = "00:00";
        timeLimit = currentLevel < 6 ? 29 : 19;
        startTimer();

        const img = new Image();
        img.src = currentImage;
        img.onload = function() {
            const { filas, columnas } = getGridSizeForLevel(currentLevel);

            // 🔸 Ajuste del tamaño máximo visible del canvas
            const maxCanvasSize = 400;
            const pieceSize = Math.floor(maxCanvasSize / Math.max(filas, columnas));
            canvas.width = pieceSize * columnas;
            canvas.height = pieceSize * filas;

            // 🔸 Escalado proporcional (mantiene toda la imagen visible)
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const offsetX = (canvas.width - scaledWidth) / 2;
            const offsetY = (canvas.height - scaledHeight) / 2;

            const randomRotations = [0, 90, 180, 270];

            for (let row = 0; row < filas; row++) {
                for (let col = 0; col < columnas; col++) {
                    pieces.push({
                        row,
                        col,
                        rotation: randomRotations[Math.floor(Math.random() * randomRotations.length)],
                        filter: getFilterForLevel(),
                        img,
                        filas,
                        columnas,
                        scale,
                        offsetX,
                        offsetY,
                        scaledWidth,
                        scaledHeight
                    });
                }
            }
            draw(filas, columnas);
        };
    }

    // --- DIBUJO DE PIEZAS ---
    function draw(filas, columnas, original = false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (pieces.length === 0) return;

        const pieceWidth = canvas.width / columnas;
        const pieceHeight = canvas.height / filas;

        pieces.forEach((p, i) => {
            const col = i % columnas;
            const row = Math.floor(i / columnas);
            const destX = col * pieceWidth;
            const destY = row * pieceHeight;

            const srcX = (p.img.width / columnas) * col;
            const srcY = (p.img.height / filas) * row;
            const srcW = p.img.width / columnas;
            const srcH = p.img.height / filas;

            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = srcW;
            tempCanvas.height = srcH;
            const tempCtx = tempCanvas.getContext("2d");
            tempCtx.drawImage(p.img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);

            if (!original) {
                const imageData = tempCtx.getImageData(0, 0, srcW, srcH);
                const filteredData = applyFilter(imageData, p.filter);
                tempCtx.putImageData(filteredData, 0, 0);
            }

            ctx.save();
            ctx.translate(destX + pieceWidth / 2, destY + pieceHeight / 2);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.drawImage(tempCanvas, -pieceWidth / 2, -pieceHeight / 2, pieceWidth, pieceHeight);
            ctx.restore();
        });
    }

    // --- CLICK ROTACIÓN ---
    canvas.addEventListener("mousedown", (e) => {
        if (!gameActive) return;
        e.preventDefault();
        const { filas, columnas } = getGridSizeForLevel(currentLevel);
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const col = Math.floor(x / (canvas.width / columnas));
        const row = Math.floor(y / (canvas.height / filas));
        const index = row * columnas + col;
        if (index < 0 || index >= pieces.length) return;

        if (e.button === 0) pieces[index].rotation -= 90;
        else if (e.button === 2) pieces[index].rotation += 90;
        pieces[index].rotation = (pieces[index].rotation + 360) % 360;

        if (pieces.every(p => p.rotation === 0)) {
            draw(filas, columnas, true);
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
                    if(currentLevel===0){ 
                        overlay.style.transform = "translate(-41%, 280%)";
                    }else if(currentLevel===1){
                     overlay.style.transform = "translate(-41%, 200%)"; 
                        } else if(currentLevel===2){ 
                            overlay.style.transform = "translate(-41%, 150%)"; 

                        } else if(currentLevel===3){
                             overlay.style.transform = "translate(-41%, 280%)";
                             }
                         else{ 
                            overlay.style.transform = "translate(-41%, 220%)"; } 
                        } else {
                             overlay.querySelector("h2").textContent = "¡Ganaste todos los niveles!";
                              overlay.querySelector("h2").style.color = "#58af58ff";
                               overlay.querySelector("h2").style.width= "170px"; 
                               overlay.style.transform = "translate(-48%, 150%)";
                                backBtn.style.marginLeft="130px"; 
                                nextBtn.style.display = "none"; 
                                menuBtn.style.display= "none"; 
                                backBtn.style.display = "block"; 
                            } 
                            overlay.style.display = "block"; 
                        } 
                          else { draw(filas, columnas);

                          }
    });

    canvas.addEventListener("contextmenu", e => e.preventDefault());

    // --- BOTONES ---
    startBtn.addEventListener("click", () => {
        document.querySelector(".contenedor-menuPrincipal").style.display = "none";
        document.querySelector(".contenedor-blocka").style.backgroundImage = "none";
        document.querySelector('.header-juego').style.display = "flex";
        document.getElementById("preNivel").style.display = "flex";
        updateLevelText();
        showThumbnailsAndSelectImage();
    });

    entendidoBtn.addEventListener("click", () => {
        instruccionesOverlay.style.display = "none";
    });

    startLevelBtn.addEventListener("click", () => {
        document.getElementById("preNivel").style.display = "none";
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

    document.getElementById("menuBtn").addEventListener("click", () => location.reload());
    backBtn.addEventListener("click", () => location.reload());
};
