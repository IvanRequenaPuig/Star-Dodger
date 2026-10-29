# Star Dodger

Juego de esquivar y saltar hecho solo con HTML, CSS y JavaScript, sin librerías ni instalación.

## Cómo ejecutarlo
Abre `index.html` en cualquier navegador moderno. Funciona sin conexión; solo la tipografía Fredoka se descarga de internet y, si no hay conexión, se usa otra parecida.

## Archivos
- `index.html`: estructura, menús y pantallas.
- `styles.css`: estilos, animaciones y diseño adaptable a móvil.
- `index.js`: toda la lógica del juego (físicas, objetos, niveles, sonido, logros).

## Objetivo
Cae de todo desde el cielo. Recoge estrellas hasta llenar la barra dorada antes de que se acabe el tiempo y pasa al siguiente nivel. Si un meteorito o su fuego te alcanza, pierdes una vida; sin vidas, termina la partida.

## Controles
| Acción | Teclado | Móvil |
|---|---|---|
| Moverte | Flechas o A / D | Botones ◀ ▶ |
| Saltar (doble salto) | Flecha arriba, W o espacio | Botón ⤒ |
| Pausa | P o Esc | Botón ⏸ |
| Empezar | Enter (en menú o fin de partida) | Botón Jugar |

## Objetos
| Objeto | Efecto |
|---|---|
| ⭐ Estrella | +10 puntos y avanza el objetivo |
| 💎 Gema | +50 puntos y cuenta como 3 estrellas |
| ❤️ Corazón | +1 vida (máximo 5) |
| ⏱️ Reloj | +6 segundos |
| 🛡️ Escudo | Bloquea un golpe |
| 🧲 Imán | Atrae estrellas y gemas durante 7 s |
| ❄️ Hielo | Ralentiza todo lo que cae durante 5 s |
| ☄️ Meteorito | Quita una vida. Su sombra roja avisa dónde caerá |
| 🔥 Fuego rodante | Aparece al caer el meteorito y se desliza por el suelo: hay que saltarlo |

## Funcionalidades
- **Niveles:** cada nivel pide más estrellas, da menos tiempo y todo cae más rápido. El cielo cambia de color con cada nivel.
- **Tiempo:** cuenta atrás por nivel. Si se acaba, pierdes una vida y se reinicia el reloj. Al pasar de nivel recibes un bonus por el tiempo que sobra.
- **Vidas:** hasta 5, con invulnerabilidad breve tras un golpe.
- **Combo:** recoger objetos seguidos sube el multiplicador hasta x5.
- **Lluvia de meteoritos:** desde el nivel 2, en un momento aleatorio del nivel, durante 6 segundos caen meteoritos sin parar tras un aviso en pantalla.
- **Dificultad:** Fácil (4 vidas, más lento, puntúa x0,8), Normal y Difícil (2 vidas, más rápido, puntúa x1,5).
- **Personajes:** 4 colores (Violeta, Esmeralda, Rubí y Océano).
- **Logros:** 7 logros con aviso en pantalla al conseguirlos.
- **Récords y estadísticas:** top 5 de partidas, partidas jugadas, estrellas y gemas totales. Se guardan en el navegador (`localStorage`).
- **Menús:** principal, cómo jugar, logros y récords, pausa (continuar, reiniciar, menú) y fin de partida.
- **Pausa automática** al cambiar de pestaña o perder el foco.
- **Sonido y música:** efectos y melodía generados con la Web Audio API, con interruptores independientes.
- **Pantalla completa** desde el menú.
- **Efectos visuales:** partículas, temblor de pantalla, personaje con estiramiento al saltar y aterrizar, luna, montañas y estrellas con parallax.
- **Adaptable:** se ajusta al tamaño de pantalla, respeta la zona segura del móvil y reduce animaciones si el sistema lo pide.

## Logros
| Logro | Cómo conseguirlo |
|---|---|
| Primeros pasos | Completa tu primer nivel |
| Racha total | Consigue un combo x5 |
| Superviviente | Llega al nivel 5 |
| Intocable | Pasa un nivel sin que te golpeen |
| Joyero | Recoge 10 gemas en total |
| Cazador de estrellas | Recoge 100 estrellas en total |
| Sin miedo | Llega al nivel 3 en difícil |

## Personalizarlo
Casi todo se ajusta con constantes al principio de `index.js`:
- `goalFor` y `timeFor`: estrellas y tiempo de cada nivel.
- `DS` y `DP`: velocidad y multiplicador de puntos por dificultad.
- `SK`: colores de los personajes.
- `ACH`: nombres y descripciones de los logros.
