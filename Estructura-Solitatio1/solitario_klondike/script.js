/*
 * SOLITARIO KLONDIKE - Proyecto de Estructuras de Datos
 * Las estructuras evaluadas se implementan manualmente con nodos y referencias.
 * No se usan Stack, Queue, LinkedList ni colecciones equivalentes.
 */

const SUITS = ["♥", "♦", "♣", "♠"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const RED_SUITS = ["♥", "♦"];

/* =========================================================
   1. PILA (LIFO): nodo + operaciones propias.
   Se usa para el historial de deshacer y las fundaciones.
   ========================================================= */
class StackNode {
  constructor(value) { this.value = value; this.next = null; }
}
class Stack {
  constructor() { this.top = null; this.count = 0; }
  push(value) {
    const node = new StackNode(value);
    node.next = this.top;
    this.top = node;
    this.count++;
  }
  pop() {
    if (this.isEmpty()) return null;
    const value = this.top.value;
    this.top = this.top.next;
    this.count--;
    return value;
  }
  peek() { return this.top ? this.top.value : null; }
  isEmpty() { return this.top === null; }
  size() { return this.count; }
  toArray() {
    const result = [];
    for (let node = this.top; node; node = node.next) result.push(node.value);
    return result;
  }
  clear() { this.top = null; this.count = 0; }
}

/* =========================================================
   2. COLA (FIFO): cartas robadas, en el orden en que salen.
   Se llena al robar hasta tres cartas y se vacía hacia waste.
   ========================================================= */
class QueueNode {
  constructor(value) { this.value = value; this.next = null; }
}
class Queue {
  constructor() { this.frontNode = null; this.rearNode = null; this.count = 0; }
  enqueue(value) {
    const node = new QueueNode(value);
    if (!this.rearNode) this.frontNode = this.rearNode = node;
    else { this.rearNode.next = node; this.rearNode = node; }
    this.count++;
  }
  dequeue() {
    if (this.isEmpty()) return null;
    const value = this.frontNode.value;
    this.frontNode = this.frontNode.next;
    if (!this.frontNode) this.rearNode = null;
    this.count--;
    return value;
  }
  peek() { return this.frontNode ? this.frontNode.value : null; }
  isEmpty() { return this.frontNode === null; }
  size() { return this.count; }
}

/* =========================================================
   3. LISTA CIRCULAR: mazo de robo. Al avanzar, el enlace
   vuelve al primer nodo; se recicla cuando se agota el mazo.
   ========================================================= */
class CircularNode {
  constructor(value) { this.value = value; this.next = null; }
}
class CircularList {
  constructor() { this.tail = null; this.count = 0; }
  insertEnd(value) {
    const node = new CircularNode(value);
    if (!this.tail) { node.next = node; this.tail = node; }
    else { node.next = this.tail.next; this.tail.next = node; this.tail = node; }
    this.count++;
  }
  insertStart(value) {
    if (!this.tail) return this.insertEnd(value);
    const node = new CircularNode(value);
    node.next = this.tail.next;
    this.tail.next = node;
    this.count++;
  }
  insertAt(index, value) {
    if (index < 0 || index > this.count) return false;
    if (index === 0) { this.insertStart(value); return true; }
    if (index === this.count) { this.insertEnd(value); return true; }
    let previous = this.tail.next;
    for (let i = 1; i < index; i++) previous = previous.next;
    const node = new CircularNode(value);
    node.next = previous.next;
    previous.next = node;
    this.count++;
    return true;
  }
  removeAt(index) {
    if (index < 0 || index >= this.count || !this.tail) return null;
    if (index === 0) return this.removeFirst();
    let previous = this.tail.next;
    for (let i = 1; i < index; i++) previous = previous.next;
    const target = previous.next;
    previous.next = target.next;
    if (target === this.tail) this.tail = previous;
    this.count--;
    return target.value;
  }
  search(valueOrTest) {
    if (!this.tail) return -1;
    let node = this.tail.next;
    for (let i = 0; i < this.count; i++) {
      const matches = typeof valueOrTest === "function"
        ? valueOrTest(node.value) : node.value === valueOrTest;
      if (matches) return i;
      node = node.next;
    }
    return -1;
  }
  traverse() { return this.toArray(); }
  removeFirst() {
    if (!this.tail) return null;
    const head = this.tail.next;
    if (head === this.tail) this.tail = null;
    else this.tail.next = head.next;
    this.count--;
    return head.value;
  }
  isEmpty() { return this.tail === null; }
  size() { return this.count; }
  toArray() {
    const result = [];
    if (!this.tail) return result;
    let node = this.tail.next;
    do { result.push(node.value); node = node.next; } while (node !== this.tail.next);
    return result;
  }
}

/* =========================================================
   4. LISTA DOBLEMENTE ENLAZADA: cada columna del tablero.
   Permite recorrer adelante/atrás y retirar una secuencia.
   ========================================================= */
class DoubleNode {
  constructor(value) { this.value = value; this.next = null; this.prev = null; }
}
class DoublyLinkedList {
  constructor() { this.head = null; this.tail = null; this.count = 0; }
  insertEnd(value) {
    const node = new DoubleNode(value);
    if (!this.tail) this.head = this.tail = node;
    else { node.prev = this.tail; this.tail.next = node; this.tail = node; }
    this.count++;
  }
  insertStart(value) {
    const node = new DoubleNode(value);
    if (!this.head) this.head = this.tail = node;
    else { node.next = this.head; this.head.prev = node; this.head = node; }
    this.count++;
  }
  insertAt(index, value) {
    if (index < 0 || index > this.count) return false;
    if (index === 0) { this.insertStart(value); return true; }
    if (index === this.count) { this.insertEnd(value); return true; }
    const current = this.getAt(index);
    const node = new DoubleNode(value);
    node.prev = current.prev;
    node.next = current;
    current.prev.next = node;
    current.prev = node;
    this.count++;
    return true;
  }
  removeAt(index) {
    const node = this.getAt(index);
    if (!node) return null;
    if (node.prev) node.prev.next = node.next; else this.head = node.next;
    if (node.next) node.next.prev = node.prev; else this.tail = node.prev;
    this.count--;
    return node.value;
  }
  search(valueOrTest) {
    let index = 0;
    for (let node = this.head; node; node = node.next, index++) {
      const matches = typeof valueOrTest === "function"
        ? valueOrTest(node.value) : node.value === valueOrTest;
      if (matches) return index;
    }
    return -1;
  }
  traverseForward() { return this.toArrayForward(); }
  traverseBackward() { return this.toArrayBackward(); }
  getAt(index) {
    if (index < 0 || index >= this.count) return null;
    let node;
    if (index < this.count / 2) {
      node = this.head;
      for (let i = 0; i < index; i++) node = node.next;
    } else {
      node = this.tail;
      for (let i = this.count - 1; i > index; i--) node = node.prev;
    }
    return node;
  }
  removeFrom(index) {
    const first = this.getAt(index);
    if (!first) return [];
    const values = [];
    let node = first;
    while (node) { values.push(node.value); node = node.next; }
    const before = first.prev;
    if (before) before.next = null; else this.head = null;
    if (before) this.tail = before; else this.tail = null;
    if (before) first.prev = null;
    this.count -= values.length;
    return values;
  }
  toArrayForward() {
    const result = [];
    for (let node = this.head; node; node = node.next) result.push(node.value);
    return result;
  }
  toArrayBackward() {
    const result = [];
    for (let node = this.tail; node; node = node.prev) result.push(node.value);
    return result;
  }
  size() { return this.count; }
  isEmpty() { return this.head === null; }
}

/* =========================================================
   5. ÁRBOL BINARIO DE BÚSQUEDA: registro de puntuaciones.
   La clave es el puntaje; insertar/buscar y recorridos propios.
   ========================================================= */
class TreeNode {
  constructor(score) { this.score = score; this.left = null; this.right = null; }
}
class ScoreBST {
  constructor() { this.root = null; }
  insert(score) {
    const add = (node, value) => {
      if (!node) return new TreeNode(value);
      if (value < node.score) node.left = add(node.left, value);
      else node.right = add(node.right, value);
      return node;
    };
    this.root = add(this.root, score);
  }
  search(score) {
    let node = this.root;
    while (node) {
      if (node.score === score) return true;
      node = score < node.score ? node.left : node.right;
    }
    return false;
  }
  remove(score) {
    const minNode = node => { while (node && node.left) node = node.left; return node; };
    const del = (node, value) => {
      if (!node) return null;
      if (value < node.score) node.left = del(node.left, value);
      else if (value > node.score) node.right = del(node.right, value);
      else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        const successor = minNode(node.right);
        node.score = successor.score;
        node.right = del(node.right, successor.score);
      }
      return node;
    };
    this.root = del(this.root, score);
  }
  inOrder() {
    const result = [];
    const walk = node => { if (!node) return; walk(node.left); result.push(node.score); walk(node.right); };
    walk(this.root); return result;
  }
  preOrder() {
    const result = [];
    const walk = node => { if (!node) return; result.push(node.score); walk(node.left); walk(node.right); };
    walk(this.root); return result;
  }
  postOrder() {
    const result = [];
    const walk = node => { if (!node) return; walk(node.left); walk(node.right); result.push(node.score); };
    walk(this.root); return result;
  }
}

/* ----------------------- Estado del juego ----------------------- */
let stock, waste, foundations, columns, drawQueue, undoStack, scoreTree;
let selected = null;
let moves = 0, score = 0, seconds = 0, timerHandle = null;
let gameFinished = false;

const $ = id => document.getElementById(id);
const rankValue = card => RANKS.indexOf(card.rank) + 1;
const isRed = card => RED_SUITS.includes(card.suit);
const makeDeck = () => {
  const deck = [];
  for (const suit of SUITS) for (const rank of RANKS) deck.push({ suit, rank, faceUp: false });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

/* Convierte estructuras a datos simples para guardar una jugada y poder deshacerla. */
function snapshot() {
  return {
    stock: stock.toArray(), waste: waste.toArray(),
    foundations: foundations.map(p => p.toArray()),
    columns: columns.map(c => c.toArrayForward()),
    moves, score
  };
}
function restore(state) {
  stock = new CircularList();
  // El orden del arreglo corresponde al recorrido desde el primer nodo.
  state.stock.forEach(card => stock.insertEnd({ ...card }));
  waste = new Stack();
  [...state.waste].reverse().forEach(card => waste.push({ ...card }));
  foundations = state.foundations.map(cards => {
    const pile = new Stack();
    [...cards].reverse().forEach(card => pile.push({ ...card }));
    return pile;
  });
  columns = state.columns.map(cards => {
    const list = new DoublyLinkedList();
    cards.forEach(card => list.insertEnd({ ...card }));
    return list;
  });
  moves = state.moves; score = state.score; selected = null;
  render();
}
function saveUndo() { undoStack.push(snapshot()); }
function undo() {
  if (undoStack.isEmpty()) return setMessage("No hay movimientos para deshacer.");
  restore(undoStack.pop());
  gameFinished = false;
  setMessage("Movimiento deshecho.");
}

/* Inicia y reparte las 52 cartas. */
function newGame() {
  if (timerHandle) clearInterval(timerHandle);
  stock = new CircularList();
  waste = new Stack();
  foundations = [new Stack(), new Stack(), new Stack(), new Stack()];
  columns = Array.from({ length: 7 }, () => new DoublyLinkedList());
  drawQueue = new Queue();
  undoStack = new Stack();
  if (!scoreTree) scoreTree = new ScoreBST();
  const deck = makeDeck();
  let cursor = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = deck[cursor++];
      card.faceUp = row === col;
      columns[col].insertEnd(card);
    }
  }
  while (cursor < deck.length) stock.insertEnd(deck[cursor++]);
  moves = 0; score = 0; seconds = 0; gameFinished = false; selected = null;
  $("winDialog").close();
  $("loseDialog").close();
  timerHandle = setInterval(() => {
    if (!gameFinished) { seconds++; updateStats(); }
  }, 1000);
  setMessage("Partida nueva. Selecciona una carta y después su destino.");
  render();
}

/* Roba tres cartas: cola FIFO temporal y luego pila de descarte. */
function drawCards() {
  if (gameFinished) return;
  if (stock.isEmpty()) {
    if (waste.isEmpty()) return setMessage("No quedan cartas para robar.");
    saveUndo();
    const recycled = [];
    while (!waste.isEmpty()) recycled.push(waste.pop());
    // El descarte se devuelve al mazo en el orden correcto.
    for (let i = recycled.length - 1; i >= 0; i--) {
      recycled[i].faceUp = false;
      stock.insertEnd(recycled[i]);
    }
    moves++; setMessage("Has reciclado el mazo."); render(); return;
  }
  saveUndo();
  for (let i = 0; i < 3 && !stock.isEmpty(); i++) {
    const card = stock.removeFirst();
    card.faceUp = true;
    drawQueue.enqueue(card);
  }
  while (!drawQueue.isEmpty()) waste.push(drawQueue.dequeue());
  moves++;
  setMessage("Cartas robadas. Puedes mover la carta superior del descarte.");
  render();
}

function setMessage(text) { $("message").textContent = text; }
function updateStats() {
  $("moves").textContent = moves;
  $("score").textContent = score;
  $("timer").textContent = `${String(Math.floor(seconds / 60)).padStart(2,"0")}:${String(seconds % 60).padStart(2,"0")}`;
}
function cardHTML(card, extraClass = "") {
  const red = isRed(card) ? "red" : "";
  if (!card.faceUp) return `<div class="card back ${extraClass}"></div>`;
  return `<div class="card ${red} ${extraClass}">
    <span class="rank">${card.rank}</span><span class="suit">${card.suit}</span>
    <span class="center-suit">${card.suit}</span>
    <span class="corner-bottom"><span class="rank">${card.rank}</span><span class="suit">${card.suit}</span></span>
  </div>`;
}
function render() {
  $("stock").innerHTML = stock.isEmpty() ? "<span>↻</span>" : cardHTML({ faceUp:false });
  $("stock").classList.toggle("recycle", stock.isEmpty() && !waste.isEmpty());
  const wasteEl = $("waste");
  wasteEl.innerHTML = "";
  const wasteTop = waste.peek();
  if (wasteTop) {
    wasteEl.innerHTML = cardHTML(wasteTop, selected?.type === "waste" ? "selected" : "");
    wasteEl.onclick = () => selectWaste();
  } else wasteEl.onclick = null;

  document.querySelectorAll(".foundation").forEach((el, index) => {
    const top = foundations[index].peek();
    el.innerHTML = top ? cardHTML(top) : "";
    el.onclick = () => tryMoveToFoundation(index);
  });

  const tableau = $("tableau");
  tableau.innerHTML = "";
  columns.forEach((column, colIndex) => {
    const colEl = document.createElement("div");
    colEl.className = `column ${column.isEmpty() ? "empty" : ""}`;
    colEl.dataset.column = colIndex;
    const cards = column.toArrayForward();
    let offset = 0;
    cards.forEach((card, cardIndex) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = cardHTML(card,
        selected?.type === "column" && selected.col === colIndex && cardIndex >= selected.index ? "selected" : "");
      const cardEl = wrapper.firstElementChild;
      cardEl.style.top = `${offset}px`;
      cardEl.style.zIndex = String(cardIndex + 1);
      cardEl.dataset.column = colIndex;
      cardEl.dataset.cardIndex = cardIndex;
      cardEl.addEventListener("click", event => {
        event.stopPropagation();
        handleColumnCard(colIndex, cardIndex);
      });
      colEl.appendChild(cardEl);
      offset += card.faceUp ? 27 : 16;
    });
    colEl.style.height = `${Math.max(140, offset + 110)}px`;
    colEl.addEventListener("click", () => tryMoveToColumn(colIndex));
    tableau.appendChild(colEl);
  });
  updateStats();
  checkWin();
  checkStuck();
}

/* Selección de origen: solo una secuencia visible y ordenada puede moverse. */
function selectWaste() {
  if (waste.isEmpty()) return;
  selected = { type:"waste" };
  setMessage("Carta seleccionada. Elige una columna o fundación.");
  render();
}
function handleColumnCard(col, index) {
  const card = columns[col].getAt(index)?.value;
  if (!card) return;
  if (selected) {
    if (tryMoveToColumn(col)) return;
    if (tryMoveToFoundationFromColumn(col, index)) return;
  }
  if (!card.faceUp) {
    if (index === columns[col].size() - 1) {
      saveUndo();
      card.faceUp = true; moves++; score += 5;
      selected = null; setMessage("Carta volteada."); render();
    }
    return;
  }
  const cards = columns[col].toArrayForward();
  if (!isValidSequence(cards, index)) return setMessage("Esa secuencia no se puede mover.");
  selected = { type:"column", col, index };
  setMessage("Secuencia seleccionada. Elige su nueva columna.");
  render();
}
function isValidSequence(cards, start) {
  for (let i = start; i < cards.length; i++) {
    if (!cards[i].faceUp) return false;
    if (i > start && (isRed(cards[i]) === isRed(cards[i-1]) ||
      rankValue(cards[i]) !== rankValue(cards[i-1]) - 1)) return false;
  }
  return true;
}
function selectedCards() {
  if (!selected) return [];
  if (selected.type === "waste") return waste.peek() ? [waste.peek()] : [];
  return columns[selected.col].toArrayForward().slice(selected.index);
}
function removeSelected() {
  if (selected.type === "waste") return [waste.pop()];
  return columns[selected.col].removeFrom(selected.index);
}
function canPlaceOnColumn(cards, targetTop) {
  if (!cards.length) return false;
  if (!targetTop) return cards[0].rank === "K";
  return targetTop.faceUp && isRed(targetTop) !== isRed(cards[0]) &&
    rankValue(targetTop) === rankValue(cards[0]) + 1;
}
function tryMoveToColumn(targetCol) {
  if (!selected) return false;
  if (selected.type === "column" && selected.col === targetCol) {
    selected = null; render(); return true;
  }
  const moving = selectedCards();
  const target = columns[targetCol];
  const top = target.isEmpty() ? null : target.tail.value;
  if (!canPlaceOnColumn(moving, top)) {
    setMessage("Movimiento no válido: alterna colores y baja un número.");
    return false;
  }
  saveUndo();
  const source = selected.type === "column" ? selected.col : null;
  const cards = removeSelected();
  cards.forEach(card => target.insertEnd(card));
  score += 5;
  moves++; selected = null;
  if (source !== null) revealColumn(source);
  setMessage("Movimiento realizado.");
  render(); return true;
}
function revealColumn(colIndex) {
  const top = columns[colIndex].tail;
  if (top && !top.value.faceUp) { top.value.faceUp = true; score += 5; }
}
function tryMoveToFoundation(index) {
  if (!selected) return;
  if (selected.type === "waste") {
    const card = waste.peek();
    moveCardToFoundation(card, index, () => waste.pop());
  } else if (selected.type === "column") {
    const sourceCol = selected.col;
    const sourceCards = columns[sourceCol].toArrayForward();
    if (selected.index !== sourceCards.length - 1) {
      setMessage("Solo puedes enviar una carta individual a la fundación.");
      return;
    }
    const card = sourceCards[selected.index];
    moveCardToFoundation(card, index, () => columns[sourceCol].removeFrom(selected.index)[0]);
  }
}
function tryMoveToFoundationFromColumn(col, cardIndex) {
  if (cardIndex !== columns[col].size() - 1 || selected) return false;
  const card = columns[col].tail.value;
  const index = SUITS.indexOf(card.suit);
  return moveCardToFoundation(card, index, () => columns[col].removeFrom(cardIndex)[0]);
}
function moveCardToFoundation(card, index, removeFn) {
  if (!card || SUITS[index] !== card.suit) return false;
  const top = foundations[index].peek();
  const expected = top ? rankValue(top) + 1 : 1;
  if (rankValue(card) !== expected) {
    setMessage("La fundación debe comenzar con As y seguir en orden ascendente.");
    return false;
  }
  saveUndo();
  const sourceType = selected?.type;
  const sourceCol = sourceType === "column" ? selected.col : null;
  removeFn();
  foundations[index].push(card);
  score += 10; moves++; selected = null;
  if (sourceCol !== null) revealColumn(sourceCol);
  setMessage("Carta colocada en la fundación.");
  render(); return true;
}


/* Eventos de la interfaz */
$("stock").addEventListener("click", drawCards);
$("undoBtn").addEventListener("click", undo);
$("newGameBtn").addEventListener("click", newGame);
$("rulesBtn").addEventListener("click", () => $("rulesDialog").showModal());
$("closeRulesBtn").addEventListener("click", () => $("rulesDialog").close());
$("playAgainBtn").addEventListener("click", newGame);
$("restartLostBtn").addEventListener("click", newGame);

/* Victoria: todas las fundaciones contienen 13 cartas. */
function checkWin() {
  if (gameFinished || !foundations || foundations.reduce((sum, pile) => sum + pile.size(), 0) !== 52) return;
  gameFinished = true;
  scoreTree.insert(score);
  const orderedScores = scoreTree.inOrder();
  const bestScore = orderedScores.length ? orderedScores[orderedScores.length - 1] : score;
  const isRecorded = scoreTree.search(score);
  $("finalScore").textContent = `Puntuación: ${score} · Movimientos: ${moves} · Mejor puntuación de esta sesión: ${bestScore}${isRecorded ? " ✓" : ""}`;
  $("winDialog").showModal();
}

/* Detecta bloqueo solo cuando ya no hay mazo ni descarte para reciclar. */
function checkStuck() {
  if (gameFinished || !stock || !stock.isEmpty() || !waste.isEmpty()) return;
  for (let source = 0; source < columns.length; source++) {
    const cards = columns[source].toArrayForward();
    for (let start = 0; start < cards.length; start++) {
      if (!isValidSequence(cards, start)) continue;
      const moving = cards.slice(start);
      for (let target = 0; target < columns.length; target++) {
        if (target === source) continue;
        const destination = columns[target];
        const top = destination.isEmpty() ? null : destination.tail.value;
        if (canPlaceOnColumn(moving, top)) return;
      }
    }
    const topCard = cards[cards.length - 1];
    if (topCard) {
      const foundation = foundations[SUITS.indexOf(topCard.suit)].peek();
      if (rankValue(topCard) === (foundation ? rankValue(foundation) + 1 : 1)) return;
    }
  }
  gameFinished = true;
  $("loseDialog").showModal();
}

/* Inicialización */
newGame();
