# Solitario Klondike

## Cómo ejecutar
1. Descarga y descomprime la carpeta.
2. Abre `index.html` con Chrome, Firefox o Brave.
3. No requiere instalación ni servidor.

## Archivos
- `index.html`: estructura y controles.
- `style.css`: apariencia visual adaptable.
- `script.js`: reglas del juego y estructuras de datos propias.

## Estructuras implementadas
- `Stack`: historial de deshacer, descarte y fundaciones.
- `Queue`: cola FIFO temporal de cartas robadas.
- `CircularList`: mazo que se recorre y se recicla.
- `DoublyLinkedList`: siete columnas del tablero.
- `ScoreBST`: árbol binario de búsqueda de puntuaciones.

## Controles
- Clic en el mazo: roba hasta tres cartas.
- Clic en una carta y después en otra columna: intenta moverla.
- Clic en una carta del descarte y luego en una fundación o columna: intenta moverla.
- Botón Deshacer: restaura el estado anterior.
- Nueva partida: reparte otro mazo.

## Nota académica
El proyecto implementa nodos y enlaces propios para las cinco estructuras exigidas. Los arreglos que aparecen en el código se usan como datos temporales para barajar, representar estados al deshacer o dibujar; no sustituyen las estructuras evaluadas.
