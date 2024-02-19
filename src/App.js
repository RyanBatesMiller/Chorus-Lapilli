
import './App.css';

import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, moveNum, middlePiece, squareSelected, selectedSquare }) {
  function handleClick(i) {
    if (calculateWinner(squares)) { //there's a winner !!
      return;
    }
    const nextSquares = squares.slice();
    if (moveNum < 6) { //normal rules !!
      if (squares[i]) {
        return;
      }
      if (xIsNext) {
        nextSquares[i] = "X";
      } else {
        nextSquares[i] = "O";
      }
    } else { // chorus lapilli rules !!
      let currentPiece = xIsNext ? "X" : "O";

      if (!squareSelected) { // this game requires two selections, so check if we made first one
        if (!squares[i] || squares[i] !== currentPiece) {
          return; //can only click on your own piece (so they can move that piece)
        }
        else {
          squareSelected = true;
          selectedSquare = i;
          return;
        }
      }
      else { //horray! we made the first selection, time for the second
        if (squares[i] || !isAdjacent(selectedSquare, i)){
          squareSelected = false;
          selectedSquare = -1;
          return; //second click must be an adjacent, empty square. ALSO IF PLAYER WON RETURN
        }
        //determine if current player owns the middle
        if (middlePiece === currentPiece) {
          let testNextSquares = nextSquares;
          testNextSquares[selectedSquare] = null;
          testNextSquares[i] = currentPiece;
          if (!calculateWinner(testNextSquares) && selectedSquare !== 4) {
            squareSelected = false;
            selectedSquare = -1;
            return;
          }
        }
        
        nextSquares[selectedSquare] = null;
        nextSquares[i] = currentPiece;
        
      }
    }
    
    onPlay(nextSquares);
  }


  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }


  return (
   <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
   </>
  );
}

export default function Game() {
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const middlePiece = currentSquares[4];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setCurrentMove(currentMove + 1);
  }

  function restartGame() {
    setCurrentMove(0);
    setHistory([history[0]]);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          moveNum={currentMove}
          middlePiece={middlePiece}
        />
      </div>
      <div className="game-info">
        <button className="restart" onClick={() => restartGame()}>
          Restart Game
        </button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isAdjacent(i, j) {
  if ( i === j ) { return false; }
  else if (i===0 && (j === 1 || j === 3 || j === 4)) {}
  else if (i === 1 && (j !== 6 && j !== 7 && j !== 8)) {}
  else if (i === 2 && (j === 1 || j === 4 || j === 5)) {}
  else if (i === 3 && (j !== 2 && j !== 5 && j !== 8)) {}
  else if (i === 4) {}
  else if (i === 5 && (j !== 0 && j!== 3 && j !== 6)) {}
  else if (i === 6 && (j === 3 || j === 4 || j === 7)) {}
  else if (i === 7 && (j !== 0 || j !== 1 || j !== 2)) {}
  else if (i === 8 && (j === 4 || j === 5 || j === 7)) {}
  else { return false; }
  return true;
}