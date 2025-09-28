class GameManager {
    constructor() {
        this.todosLosJuegos = [];
        this.itemsVisibles = 4; // Cuántos elementos se ven a la vez
        this.anchoItem = 250; // Ancho aproximado de cada item (incluye margen)
    }

    async pedirJuegos() {
        try {
            const respuesta = await fetch('https://vj.interfaces.jima.com.ar/api');
            if (!respuesta.ok) {
                throw new Error('Error en la respuesta de la API');
            }

            this.todosLosJuegos = await respuesta.json();

            this.llenarSeccion('novedades-carrusel', 5);
            this.llenarSeccion('parati-carrusel', 6);
            this.llenarSeccion('deportes-carrusel', 6);
            this.llenarSeccion('puzzle-carrusel', 6);
            this.llenarSeccion('aventura-carrusel', 6);

            // Configurar los botones después de cargar los juegos
            this.configurarNavegacionCarruseles();

        } catch (error) {
            console.error('Error al cargar los juegos:', error);
            this.mostrarErrorEnCarruseles();
        }
    }

    llenarSeccion(idDelContenedor, cuantosJuegos) {
        const contenedor = document.getElementById(idDelContenedor);
        if (!contenedor) {
            console.warn(`Contenedor ${idDelContenedor} no encontrado`);
            return;
        }
        contenedor.innerHTML = '';

        const juegosParaEstaSeccion = this.todosLosJuegos.slice(0, cuantosJuegos);

        juegosParaEstaSeccion.forEach(juego => {
            const tarjeta = this.crearTarjetaDeJuego(juego);
            contenedor.appendChild(tarjeta);
        });
    }

    crearTarjetaDeJuego(juego) {
        if (!juego || !juego.background_image || !juego.name) {
            console.warn('Datos de juego incompletos');
            return null;
        }

        const tarjeta = document.createElement('li');

        const article = document.createElement('article');

        const figure = document.createElement('figure');

        const img = document.createElement('img');
        img.src = juego.background_image;
        img.alt = juego.name;
        img.loading = 'lazy';
        img.width = 240;
        img.height = 135;

        const titulo = document.createElement('h3');
        titulo.textContent = juego.name;

        const rating = document.createElement('p');
        rating.textContent = `★ ${juego.rating}/5`;

        // Armamos la estructura
        figure.appendChild(img);
        article.appendChild(figure);
        article.appendChild(titulo);
        article.appendChild(rating);
        tarjeta.appendChild(article);

        return tarjeta;
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