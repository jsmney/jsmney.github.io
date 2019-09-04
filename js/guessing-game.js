/*

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/

const generateWinningNumber = () => {
  return Math.ceil(Math.random() * 100)
}

const shuffle = arr => {
  let m = arr.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
}

class Game {
  constructor () {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
  }

  difference () {
    return Math.abs(this.playersGuess - this.winningNumber)
  }

  isLower () {
    if (this.playersGuess < this.winningNumber) {
      return true;
    }
    return false;
  }

  playersGuessSubmission (num) {
    if (num < 1 || num > 100 || typeof num !== 'number') {
      return 'That is an invalid guess.'
    }
    this.playersGuess = num;
    return this.checkGuess();
  }

  checkGuess () {
    if (this.playersGuess === this.winningNumber) {
      return `You guessed the winning number, ${this.winningNumber}. You win!`
    } else if (this.pastGuesses.includes(this.playersGuess)) {
      return 'You have already guessed that number.'
    } else  {
      this.pastGuesses.push(this.playersGuess);

      if (this.pastGuesses.length < 5) {
        if (this.difference() < 10) {
          return `You have ${5 - this.pastGuesses.length} guess(es) remaining. You\'re burning up!`;
        } else if (this.difference() < 25) {
          return `You have ${5 - this.pastGuesses.length} guess(es) remaining. You\'re lukewarm.`;
        } else if (this.difference() < 50) {
          return `You have ${5 - this.pastGuesses.length} guess(es) remaining. You\'re a bit chilly.`;
        } else if (this.difference() < 100) {
          return `You have ${5 - this.pastGuesses.length} guess(es) remaining. You\'re ice cold!`;
        }
      }
      if (this.pastGuesses.length >= 5) {
        return `You Lose. The number I was thinking of was ${this.winningNumber}.`
      }
    }
  }

  provideHint () {
    return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
  }
}

function newGame () {
  return new Game();
}

function playGame () {
  let game = newGame();
  const submit = document.getElementById('submit'); //submit button
  const hint = document.getElementById('hint'); //hint button
  const guess = document.getElementById('guess'); //text input
  const reset = document.getElementById('reset');
  const guesses = document.getElementsByTagName('li');
  const headline = document.getElementsByTagName('h2');

  submit.addEventListener('click', function () {
    headline[0].textContent = game.playersGuessSubmission(Number(guess.value));
    guesses[game.pastGuesses.length - 1].textContent = game.pastGuesses[game.pastGuesses.length - 1];
  })

  hint.addEventListener('click', () => {
    headline[0].textContent = `You asked for a hint. One of the following is the winning number: ${game.provideHint().join(', ')}`;
  })
  reset.addEventListener('click', () => {
    for (let i = 0; i < guesses.length; i++) {
      guesses[i].textContent = "";
    }
    headline[0].textContent = 'You have five guesses.'
    game = newGame();
  })
}

playGame();
