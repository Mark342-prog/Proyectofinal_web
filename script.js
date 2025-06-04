const input = document.getElementById("cmdInput");
const terminal = document.getElementById("terminal");

let blackjackGame = null;

const projectList = [
  { name: "Historia de Abadon", path: "proyectos/Lab3/index.html" },
  { name: "Dibujo one Div", path: "proyectos/Lab4css/index.html" },
  { name: "Chat en tiempo real", path: "proyectos/Lab5/" },
  { name: "Juego de memoria", path: "proyectos/Lab8/index.html" }
];

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const command = input.value.trim().toLowerCase();
    if (!command) return;

    const userLine = document.createElement("pre");
    userLine.className = "line";
    userLine.textContent = `➜ ${command}`;
    terminal.appendChild(userLine);

    if (blackjackGame) {
      handleBlackjackInput(command);
    } else {
      handleCommand(command);
    }

    input.value = "";
    terminal.scrollTop = terminal.scrollHeight;
  }
});

function handleCommand(command) {
  switch (command) {
    case "help":
      printLine("Comandos disponibles: about, projects, clear, blackjack");
      break;
    case "about":
      printLine("Soy Mark Pérez, desarrollador full stack especializado en React, Node.js y MongoDB.");
      break;
    case "projects":
      printLine("📁 Proyectos disponibles:");
      for (const proj of projectList) {
        const line = document.createElement("pre");
        line.className = "line";
        line.innerHTML = `📂 <a href="${proj.path}" target="_blank" class="proj-link">${proj.name}</a>`;
        terminal.appendChild(line);
      }
      break;
    case "clear":
      terminal.innerHTML = "";
      break;
    case "blackjack":
      startBlackjack();
      break;
    default:
      printLine(`Comando '${command}' no reconocido. Usa 'help'.`);
  }
}

// ========== Blackjack ==========
function startBlackjack() {
  blackjackGame = {
    deck: shuffleDeck(),
    player: [],
    dealer: [],
    done: false
  };

  blackjackGame.player.push(drawCard());
  blackjackGame.player.push(drawCard());
  blackjackGame.dealer.push(drawCard());

  printLine("🎴 Inicias una partida de Blackjack!");
  printLine("Tus cartas:");
  printLine(renderAsciiHand(blackjackGame.player));
  printLine("Carta del dealer:");
  printLine(renderAsciiHand(blackjackGame.dealer));
  printLine("Escribe 'hit' para pedir carta o 'stand' para plantarte.");
}

function handleBlackjackInput(command) {
  if (!blackjackGame || blackjackGame.done) return;

  if (command === "hit") {
    blackjackGame.player.push(drawCard());
    printLine("Pediste una carta.");
    printLine("Tus cartas:");
    printLine(renderAsciiHand(blackjackGame.player));

    if (getHandValue(blackjackGame.player) > 21) {
      printLine("💥 Te pasaste. Pierdes.");
      blackjackGame = null;
    }
  } else if (command === "stand") {
    printLine("Te plantas.");
    while (getHandValue(blackjackGame.dealer) < 17) {
      blackjackGame.dealer.push(drawCard());
    }

    const playerScore = getHandValue(blackjackGame.player);
    const dealerScore = getHandValue(blackjackGame.dealer);

    printLine("Cartas del dealer:");
    printLine(renderAsciiHand(blackjackGame.dealer));
    printLine(`Tu puntaje: ${playerScore} | Dealer: ${dealerScore}`);

    if (dealerScore > 21 || playerScore > dealerScore) {
      printLine("🎉 ¡Ganaste!");
    } else if (playerScore === dealerScore) {
      printLine("🤝 Empate.");
    } else {
      printLine("😞 Perdiste.");
    }

    blackjackGame = null;
  } else {
    printLine("Comando no válido en Blackjack. Usa 'hit' o 'stand'.");
  }
}

// ========== Utilidades ==========
function printLine(text) {
  const line = document.createElement("pre");
  line.className = "line";
  line.textContent = text;
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

function shuffleDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck = [];

  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank });
    }
  }

  return deck.sort(() => Math.random() - 0.5);
}

function drawCard() {
  return blackjackGame.deck.pop();
}

function getHandValue(hand) {
  let value = 0;
  let aces = 0;

  for (let card of hand) {
    if (['K', 'Q', 'J'].includes(card.rank)) {
      value += 10;
    } else if (card.rank === 'A') {
      value += 11;
      aces++;
    } else {
      value += parseInt(card.rank);
    }
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}

function renderAsciiHand(hand) {
  const lines = ['', '', '', '', ''];
  for (let card of hand) {
    const rank = card.rank.padEnd(2, ' ');
    const rankRight = card.rank.padStart(2, ' ');
    const suit = card.suit;

    lines[0] += '┌───────┐ ';
    lines[1] += `│${rank}     │ `;
    lines[2] += `│   ${suit}   │ `;
    lines[3] += `│     ${rankRight}│ `;
    lines[4] += '└───────┘ ';
  }

  return lines.join('\n');
}
