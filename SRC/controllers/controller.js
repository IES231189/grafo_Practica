import { Grafo } from "../models/Graph.js";

const laberintoElement = document.getElementById('laberinto');
const mensajeElement = document.getElementById('mensaje');

let grafo;
let posicionJugador;
let obstaculos;

function iniciarLaberinto() {
    laberintoElement.innerHTML = '';
    mensajeElement.style.display = 'none';

    
    grafo = new Grafo();
    const filas = 5;
    const columnas = 5;

    
    obstaculos = new Set(['1-1', '2-2', '3-3']);

    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const clave = `${i}-${j}`;
            grafo.agregarNodo(clave);

            const celda = document.createElement('div');
            celda.classList.add('celda');
            celda.setAttribute('id', clave);

            if (clave === '0-0') {
                celda.classList.add('inicio');
                const jugador = document.createElement('div');
                jugador.classList.add('jugador');
                celda.appendChild(jugador);
                jugador.style.display = 'block';
            } else if (clave === '4-4') {
                celda.classList.add('fin');
            }

            if (obstaculos.has(clave)) {
                celda.classList.add('obstaculo');
                grafo.nodos.get(clave).esObstaculo = true;
            }

            laberintoElement.appendChild(celda);
        }
    }

    
    const direcciones = [
        [0, 1], 
        [1, 0], 
        [0, -1], 
        [-1, 0] 
    ];

    const esValido = (x, y) => x >= 0 && x < filas && y >= 0 && y < columnas;

    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            for (const [dx, dy] of direcciones) {
                const x = i + dx;
                const y = j + dy;
                if (esValido(x, y)) {
                    grafo.agregarArista(`${i}-${j}`, `${x}-${y}`);
                }
            }
        }
    }

    posicionJugador = { x: 0, y: 0 };
}

iniciarLaberinto();

window.addEventListener('keydown', (e) => {
    const { x, y } = posicionJugador;
    let nuevoX = x;
    let nuevoY = y;

    switch (e.key) {
        case 'ArrowUp':
            nuevoX = x - 1;
            break;
        case 'ArrowDown':
            nuevoX = x + 1;
            break;
        case 'ArrowLeft':
            nuevoY = y - 1;
            break;
        case 'ArrowRight':
            nuevoY = y + 1;
            break;
        default:
            return;
    }

    if (esValido(nuevoX, nuevoY)) {
        const nuevaPosicion = `${nuevoX}-${nuevoY}`;
        const nodo = grafo.nodos.get(nuevaPosicion);

        if (nodo && !nodo.esObstaculo) {
            moverJugador(nuevaPosicion);
            posicionJugador = { x: nuevoX, y: nuevoY };
            if (nuevaPosicion === '4-4') {
                mensajeElement.textContent = '¡Felicidades! Has llegado al destino.';
                mensajeElement.style.display = 'block';
            }
        }
    }
});

function moverJugador(nuevaPosicion) {
    const jugador = document.querySelector('.jugador');
    const nuevaCelda = document.getElementById(nuevaPosicion);
    nuevaCelda.appendChild(jugador);
}

window.verRuta = function() {
    const rutaMasCorta = grafo.dfsCaminoMasCorto('0-0', '4-4');
    if (rutaMasCorta) {
        for (const celda of rutaMasCorta) {
            const celdaElemento = document.getElementById(celda);
            if (!celdaElemento.classList.contains('inicio') && !celdaElemento.classList.contains('fin')) {
                celdaElemento.classList.add('ruta');
            }
        }
    } else {
        alert('No hay camino disponible.');
    }
}

window.resetJuego = function() {
    iniciarLaberinto();
    mensajeElement.style.display = 'none';
}

function esValido(x, y) {
    return x >= 0 && x < 5 && y >= 0 && y < 5;
}
