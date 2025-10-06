class GameManager {
    constructor() {
        this.todosLosJuegos = [];
    }

    async pedirJuegos() {
        try {
            const respuesta = await fetch('https://vj.interfaces.jima.com.ar/api/v2');
            if (!respuesta.ok) {
                throw new Error('Error en la respuesta de la API');
            }

            this.todosLosJuegos = await respuesta.json();
            console.log(`Total de juegos cargados: ${this.todosLosJuegos.length}`);

            // Llenar los carruseles con todos los juegos disponibles de cada categoría
            this.llenarSeccion('novedades-carrusel');
            this.llenarSeccion('parati-carrusel');
            this.llenarSeccion('deportes-carrusel');
            this.llenarSeccion('puzzle-carrusel');
            this.llenarSeccion('aventura-carrusel');

            this.configurarNavegacionCarruseles();

        } catch (error) {
            console.error('Error al cargar los juegos:', error);
            this.mostrarErrorEnCarruseles();
        }
    }

    llenarSeccion(idDelContenedor) {
        const contenedor = document.getElementById(idDelContenedor);
        if (!contenedor) return;

        contenedor.innerHTML = '';

        // Función para filtrar por género
        const filtrarPorGenero = genero => this.todosLosJuegos.filter(juego =>
            juego.genres && juego.genres.some(g =>
                g.name.toLowerCase().includes(genero)));

        // Mapeo de estrategias
        const estrategias = {
            'deportes-carrusel': () => filtrarPorGenero('action'),
            'puzzle-carrusel': () => filtrarPorGenero('shooter'),
            'aventura-carrusel': () => filtrarPorGenero('adventure'),
            'novedades-carrusel': () => [...this.todosLosJuegos].sort((a, b) =>
                new Date(b.released || 0) - new Date(a.released || 0)),
            'parati-carrusel': () => [...this.todosLosJuegos].sort((a, b) =>
                (b.rating || 0) - (a.rating || 0))
        };

        // Obtener los juegos filtrados
        let juegosFiltrados = estrategias[idDelContenedor]
            ? estrategias[idDelContenedor]()
            : this.todosLosJuegos;

        // Mostrar mensaje si no hay juegos
        if (juegosFiltrados.length === 0) {
            const mensajeVacio = document.createElement('li');
            mensajeVacio.textContent = 'No hay juegos disponibles en esta categoría';
            contenedor.appendChild(mensajeVacio);
            return;
        }

        // Mostrar todos los juegos filtrados
        juegosFiltrados.forEach(juego => {
            const tarjeta = this.crearTarjetaDeJuego(juego);
            if (tarjeta) {
                contenedor.appendChild(tarjeta);
            }
        });

        // Registrar cuántos juegos se mostraron
        console.log(`Carrusel ${idDelContenedor}: ${juegosFiltrados.length} juegos`);
    }
    crearTarjetaDeJuego(juego) {
        if (!juego || !juego.name) {
            console.warn('Datos de juego incompletos');
            return null;
        }

        if (juego.id === this.todosLosJuegos[0].id) {
            return this.crearCardSimpson();
        }

        const tarjeta = document.createElement('li');
        const article = document.createElement('article');
        const figure = document.createElement('figure');
        const img = document.createElement('img');

        img.src = juego.background_image_low_res || juego.background_image || '';
        img.alt = juego.name;
        img.loading = 'lazy';
        img.width = 240;
        img.height = 135;

        // Determinar si el juego es premium
        const esPremium = this.esJuegoPremium(juego);

        // Si es premium, agregar badge y evento
        if (esPremium) {
            const badge = document.createElement('div');
            badge.className = 'premium-badge';

            const coronaImg = document.createElement('img');
            coronaImg.src = './assets/etiqueta-premium.png';
            coronaImg.alt = 'Premium';
            coronaImg.className = 'corona-icon';

            badge.appendChild(coronaImg);
            figure.appendChild(badge);

            // Marcar el article como premium
            article.dataset.premium = 'true';
            article.dataset.juegoId = juego.id;
            article.style.cursor = 'pointer';

            // Evento click aquí con stopPropagation
            article.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const overlay = document.querySelector('.overlay');
                const popup = document.getElementById('popup-premium');

                if (overlay && popup) {
                    overlay.classList.add('visible');
                    popup.classList.add('open');
                }
            });
        }
        figure.appendChild(img);

        const titulo = document.createElement('h3');
        titulo.textContent = juego.name;

        const rating = document.createElement('p');
        rating.textContent = `★ ${juego.rating || 0}/5`;

        article.appendChild(figure);
        article.appendChild(titulo);
        article.appendChild(rating);
        tarjeta.appendChild(article);

        return tarjeta;
    }

    crearCardSimpson() {
        const tarjeta = document.createElement('li');
        const article = document.createElement('article');
        const figure = document.createElement('figure');
        const img = document.createElement('img');

        img.src = 'Assets/homer_card.png'; // ← Cambiar por la ruta correcta
        img.alt = 'Los Simpson Game';
        img.loading = 'lazy';
        img.width = 240;
        img.height = 135;

        const titulo = document.createElement('h3');
        titulo.textContent = 'Los Simpson: Peg Solitaire';

        const rating = document.createElement('p');
        rating.textContent = '★ 4.8/5';

        figure.appendChild(img);
        article.appendChild(figure);
        article.appendChild(titulo);
        article.appendChild(rating);
        tarjeta.appendChild(article);

        // Click redirecciona a la página
        article.style.cursor = 'pointer';
        article.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'juego.html';
        });

        return tarjeta;
    }

    esJuegoPremium(juego) {
        return juego.rating >= 4.5;
    }

    mostrarPopoverPremium(juego) {

        const overlay = document.querySelector('.overlay');
        const popup = document.getElementById('popup-premium');
         const popoversus = document.getElementById('mensaje-subscripcion');
       const btnSuscribirse = popup.querySelector('.suscribirse input');

        overlay.classList.add('visible');
        popup.classList.add('open');

        const btnCerrar = popup.querySelector('.popup-close');
        btnCerrar.onclick = () => {
            overlay.classList.remove('visible');
            popup.classList.remove('open');
            
        };
    } 

    configurarNavegacionCarruseles() {
        // Obtener todos los botones de navegación
        const botones = document.querySelectorAll('button[aria-controls]');

        // Asignar evento click a cada botón
        botones.forEach(boton => {
            boton.addEventListener('click', (evento) => {
                // Prevenir comportamiento predeterminado del botón
                evento.preventDefault();

                // Obtener el ID del carrusel que controla este botón
                const carruselId = boton.getAttribute('aria-controls');

                // Determinar si es botón anterior o siguiente
                const esAnterior = boton.getAttribute('aria-label').includes('Anterior');

                // Mover el carrusel en la dirección correspondiente
                this.moverCarrusel(carruselId, esAnterior);
            });
        });
    }

    moverCarrusel(carruselId, esAnterior) {
        // Obtener el contenedor del carrusel
        const contenedor = document.getElementById(carruselId);
        if (!contenedor) return;

        // Calcular el ancho real del primer elemento si existe
        const primerElemento = contenedor.querySelector('li');
        if (!primerElemento) return;

        // Obtener el ancho real del elemento (incluye el margen)
        const anchoElemento = primerElemento.offsetWidth +
            parseInt(window.getComputedStyle(primerElemento).marginRight);

        // Calcular cuánto desplazar
        const desplazamiento = anchoElemento * (esAnterior ? -1 : 1);

        // Posición actual + desplazamiento
        const nuevaPosicion = contenedor.scrollLeft + desplazamiento;

        
        // Aplicar el desplazamiento con animación suave
        contenedor.scrollTo({
            left: nuevaPosicion,
            behavior: 'smooth'
        });
    }

    mostrarErrorEnCarruseles() {
        const contenedores = [
            'novedades-carrusel',
            'parati-carrusel',
            'deportes-carrusel',
            'puzzle-carrusel',
            'aventura-carrusel'
        ];

        contenedores.forEach(id => {
            const contenedor = document.getElementById(id);
            if (!contenedor) return;

            contenedor.innerHTML = ''; // Limpiamos el contenedor

            const mensajeError = document.createElement('li');
            mensajeError.className = 'error-mensaje';

            const texto = document.createElement('p');
            texto.textContent = 'No pudimos cargar los juegos.';

            const boton = document.createElement('button');
            boton.textContent = 'Reintentar';
            boton.onclick = () => location.reload();

            mensajeError.appendChild(texto);
            mensajeError.appendChild(boton);
            contenedor.appendChild(mensajeError);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const gameManager = new GameManager();
    gameManager.pedirJuegos();
});


