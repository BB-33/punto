export type Color = "red" | "yellow" | "green" | "blue";

export interface Card {
  value: number;
  color: Color;
}
/**
 * holds the game state
 */
export interface PlaceDetails {
  state: "open" | "closed";
  card?: Card;
}

export type Board = PlaceDetails[][];
function newBoard(size: number) {
  const board: PlaceDetails[][] = [];
  for (let i = 0; i < size; i++) {
    board.push([]);
    for (let j = 0; j < size; j++) {
      board[i][j] = { state: "closed" };
    }
  }
  board[Math.floor(size / 2)][Math.floor(size / 2)].state = "open";
  return board;
}

function place(
  board: Board,
  x: number,
  y: number,
  color: Color,
  value: number
) {
  console.log(`card placed at ${x},${y} by ${color}`);
  board[y][x].card = { value, color };

  for (let j = y - 1; j < y + 2; j++) {
    for (let i = x - 1; i < x + 2; i++) {
      if (canBeOpened(board, i, j)) {
        board[j][i].state = "open";
      }
    }
  }
  const finalBoard = closeInvalidOpenPlaces(board);
  return finalBoard;
}

function closeInvalidOpenPlaces(board: Board) {
  const b = [...board];
  //if the width is 6 and there is no placed cards in the row then close it all
  b.forEach((row) => {
    if (row.find((p) => !!p.card)) return;
    if (getHeight(board) >= 6) {
      row.forEach((p) => (p.state = "closed"));
    }
  });
  // now do the same for the columns
  const bT = transpose<PlaceDetails>(b);
  bT.forEach((row) => {
    if (row.find((p) => !!p.card)) return;
    if (getWidth(board) >= 6) {
      row.forEach((p) => (p.state = "closed"));
    }
  });

  return transpose(bT);
}

function getHighestFilledRow(board: Board) {
  const b = [...board];
  return b.findIndex((row) => row.findIndex((p) => !!p.card) >= 0);
}

function getLeftestFilledCol(board: Board) {
  const b = transpose([...board]);
  return b.findIndex((row) => row.findIndex((p) => !!p.card) >= 0);
}

function canBeOpened(board: Board, x: number, y: number) {
  const width = getWidth(board);
  const height = getHeight(board);
  const leftest = getLeftestFilledCol(board);
  const highest = getHighestFilledRow(board);
  //   console.log(`checking x:${x} y:${y}`);
  //   console.log({ leftest, width, highest, height });
  //   console.log(`${leftest + width - 6} =< x <  ${leftest + 6}`);
  //   console.log(`y ${highest + height - 6} =< y < ${highest + 6}`);

  if (x < 0 || y < 0 || x >= board.length || y >= board.length) {
    return false;
  }
  if (leftest + width - 6 > x || x >= leftest + 6) {
    console.log(`${x} not within allowed width`);
    return false;
  }
  if (highest + height - 6 > y || y > highest + 6) {
    console.log(`${y} not within allowed height`);
    return false;
  }

  if (board[y][x].state !== "closed") {
    return false;
  }
  return true;
}

function transpose<T>(matrix: T[][]) {
  let [row] = matrix;
  return row.map((value, column) => matrix.map((row) => row[column]));
}

function getWidth(board: Board) {
  const b = [...board];
  return transpose(b).filter((row) => row.find((p) => !!p.card)).length;
}

function getHeight(board: Board) {
  const b = [...board]; // dont want to ruin the board
  return b.filter((row) => row.find((p) => !!p.card)).length;
}

const GameLogic = {
  newBoard,
  place,
};

export default GameLogic;