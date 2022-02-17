const statusDisplay = document.querySelector(".result-game");
const recordsView = document.querySelector(".records");
const contentPlay = document.querySelector(".content");
const contentTable = document.querySelector(".contentTable");
const tBody = document.querySelector("tbody");
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let gameActive = true;

const xPlayer = "X";
const oPlayer = "O";
let currentPlayer = xPlayer;
let countXPlayer = 0;
let countOPlayer = 0;
let currentCount;

let gameState = ["", "", "", "", "", "", "", "", ""];
const records = [];

const winningMessage = () => {
  if (records.length === 10) {
    records.shift();
  }
  records.push({
    winner: currentPlayer,
    totalMoves: countXPlayer + countOPlayer + 1,
    winningMove: currentCount,
  });
  localStorage.setItem("oksanaRecords", JSON.stringify(records));
  return `<h2 class="result-game">
    Player <span class="style-player ${classAdd()}">${currentPlayer}</span> won on turn ${currentCount}.
  </h2>
  <h2 class="result-game">
    A total of ${countXPlayer + countOPlayer + 1} moves were made.
  </h2>
  `;
};

const drawMessage = () => {
  if (records.length === 10) {
    records.shift();
  }
  records.push({
    winner: "Game ended in a draw",
    totalMoves: countXPlayer + countOPlayer + 1,
    winningMove: "-",
  });
  localStorage.setItem("oksanaRecords", JSON.stringify(records));
  return `<h2 class="result-game">
  Game ended in a draw!
  </h2>`;
};

const currentPlayerTurn = () => `
  <h2 class="result-game">
    It's <span class="style-player ${classAdd()}">${currentPlayer}</span> 's turn
  </h2>
  `;

statusDisplay.innerHTML = currentPlayerTurn();

function classAdd() {
  currentClass = currentPlayer === xPlayer ? "color-blue" : "color-pink";
  return currentClass;
}

function handleItemPlayed(clickedItem, clickedItemIndex) {
  gameState[clickedItemIndex] = currentPlayer;
  clickedItem.innerHTML = currentPlayer;
  if (currentPlayer === xPlayer) {
    document.querySelectorAll(".item")[clickedItemIndex].style.color =
      "#60d4cf";
  } else {
    document.querySelectorAll(".item")[clickedItemIndex].style.color =
      "#f662d1";
  }
}

function handlePlayerChange() {
  if (currentPlayer === xPlayer) {
    currentPlayer = oPlayer;
    countXPlayer += 1;
    currentCount = countXPlayer;
  } else {
    currentPlayer = xPlayer;
    countOPlayer += 1;
    currentCount = countOPlayer + 1;
  }
  statusDisplay.innerHTML = currentPlayerTurn();
  console.log(countXPlayer, countOPlayer);
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }
  if (roundWon) {
    statusDisplay.innerHTML = winningMessage();
    gameActive = false;
    return;
  }
  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    return;
  }
  handlePlayerChange();
}

function handleItemClick(e) {
  const clickedItem = e.target;
  const clickedItemIndex = parseInt(clickedItem.dataset.index);

  if (gameState[clickedItemIndex] !== "" || !gameActive) {
    return;
  }
  handleItemPlayed(clickedItem, clickedItemIndex);
  handleResultValidation();
}

function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.innerHTML = currentPlayerTurn();
  document.querySelectorAll(".item").forEach((elem) => (elem.innerHTML = ""));
  countXPlayer = 0;
  countOPlayer = 0;
  currentCount = 0;
}

function showTable() {
  contentPlay.classList.toggle("hide");
  contentTable.classList.toggle("hide");
  if (!contentTable.classList.contains("hide")) {
    recordsView.textContent = "play";
  } else {
    recordsView.textContent = "table of records";
  }
}

function renderTable() {
  let resultRecords = [];
  resultRecords = JSON.parse(localStorage.getItem("oksanaRecords"));
  tBody.innerHTML = "";
  for (let i = 0; i < resultRecords.length; i++) {
    let currentClass;
    if (resultRecords[i].winner === "X") {
      currentClass = "color-blue";
    } else if (resultRecords[i].winner === "O") {
      currentClass = "color-pink";
    } else {
      currentClass = "style-table";
    }
    tBody.innerHTML += `
    <tr>
        <td class="style-player ${currentClass}">${resultRecords[i].winner}</td>
        <td>${resultRecords[i].totalMoves}</td>
        <td>${resultRecords[i].winningMove}</td>
    </tr>
    `;
  }
}

document
  .querySelector(".container-game")
  .addEventListener("click", handleItemClick);
document
  .querySelector(".start-game")
  .addEventListener("click", handleRestartGame);
recordsView.addEventListener("click", showTable);
recordsView.addEventListener("click", renderTable);

/* function playAudio() {
    audio.currentTime = 0;
    if(!isPlay) {
      audio.play();
    } else {
      audio.pause();
    }
  } */