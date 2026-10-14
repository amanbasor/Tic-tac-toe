const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetEl = document.getElementById("reset");

let squares = Array(9).fill(null);
let current = "X";
let locked = false;

function winner() {
  for (const [a, b, c] of WIN_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function render() {
  const result = winner();
  locked = Boolean(result) || squares.every(Boolean);

  boardEl.replaceChildren(
    ...squares.map((mark, index) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.index = String(index);
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `Square ${index + 1}`);

      if (mark) {
        cell.textContent = mark;
        cell.classList.add(mark.toLowerCase());
      }

      if (result?.line.includes(index)) {
        cell.classList.add("win");
      }

      cell.disabled = locked || Boolean(mark);
      return cell;
    })
  );

  if (result) {
    statusEl.textContent = `${result.player} wins`;
  } else if (locked) {
    statusEl.textContent = "Draw";
  } else {
    statusEl.textContent = `${current} to move`;
  }
}

boardEl.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell || locked) return;

  const index = Number(cell.dataset.index);
  if (squares[index]) return;

  squares[index] = current;
  current = current === "X" ? "O" : "X";
  render();
});

resetEl.addEventListener("click", () => {
  squares = Array(9).fill(null);
  current = "X";
  locked = false;
  render();
});

render();
