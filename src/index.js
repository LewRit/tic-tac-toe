import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button> // function that takes props as in input and returns what should be rendered.
    );
  }
  
  class Board extends React.Component {
    
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
        return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state={
            history:[{
                squares: Array(9).fill(null),
            }],
            stepNumber :0,
            xIsNext: true,
        };
        //setting up the inital state for Game component
    }

    handleClick(i) {
        const history =this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length - 1]  
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]){
          return;
          // ignores a click if game is won or square is occupied
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'; //conditional to make statement true(X) or false (O)
        this.setState({
          history: history.concat([{
              //concat doesn't mutate original array
              squares: squares
          }]), //brings history into state
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext, //flips the x's and o's
        });
      }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
      const history = this.state.history;
      const current= history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step,move) =>{
        const desc = move ?
        'Go to move #' + move:
        'Go to Game start';
        return(
            <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        ); //making a button to go back to moves.
      });

      let status;
      if (winner){
        status= 'Winner: ' + winner;
      }  else {
        status= 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O')
      } // moved from board state to game state so game can utilize history

      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
    // function to check for winner and returns x,o, or null
  }