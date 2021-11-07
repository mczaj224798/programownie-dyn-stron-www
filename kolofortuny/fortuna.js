
class Start {
  #wrap;
  #startButton;
  #authorButton;
  #backButton;
  #authorText;

  constructor(wrap) {
    this.#wrap = document.getElementById(wrap);
    this.#init();
  }

  #init() {
    this.#startButton = DOMHelper.addElementWithClass(this.#wrap, "button", ["center"], "Start");
    this.#authorButton = DOMHelper.addElementWithClass(this.#wrap, "button", ["center"], "Author");
    this.#startButton.addEventListener("click", func => {this.#startButtonHandler()});
    this.#authorButton.addEventListener("click", func => {this.#authorButtonHandler()});
  }

  #startButtonHandler() {
    this.#clearStartScreen();
    let game = new Game("wrap");
  }

  #authorButtonHandler() {
    this.#clearStartScreen();
    const string = "Maciej Czajkowski<br>Nr Albumu: 224798<br>Nieustannie przegrywana walka z CSS...";
    this.#authorText = DOMHelper.addElementWithClass(this.#wrap, "div", ["text-field"], string);
    this.#backButton = DOMHelper.addElementWithClass(this.#wrap, "button", ["back-button"], "X");
    this.#backButton.addEventListener("click", func => {this.#backButtonHandler()});
  }

  #backButtonHandler() {
    this.#clearAuthorScreen();
    this.#init();
  }

  #clearAuthorScreen() {
    this.#wrap.removeChild(this.#backButton);
    this.#wrap.removeChild(this.#authorText);
  }

  #clearStartScreen() {
    this.#wrap.removeChild(this.#startButton);
    this.#wrap.removeChild(this.#authorButton);
  }
}


class Game {
  #wrap;
  #letterBox;
  #playButton;
  #passInput;
  #lives;
  #word;
  #letters;
  #lettersSet;
  #lettersCount;
  #liveBox;
  #buttonBox;

  static COUTNRIES_COUNT = 247

  constructor(wrap) {
    this.#wrap = document.getElementById(wrap);
    this.#init();
  }

  #init() {
    this.#lives = 5;
    this.#liveBox =  DOMHelper.addElementWithClass(this.#wrap, "div", ["box", "text-right"], "Lives: " + this.#lives);

    this.#letterBox =  DOMHelper.addElementWithClass(this.#wrap, "div", ["box"], null);
    this.#buttonBox =  DOMHelper.addElementWithClass(this.#wrap, "div", ["box"], null);

    this.#playButton = DOMHelper.addElementWithClass(this.#buttonBox, "button", ["play-button"], "Graj");
    this.#passInput = DOMHelper.addElementWithClass(this.#buttonBox, "input", ["margin-null-auto"], "Graj");

    this.#playButton.addEventListener("click", func => {this.#checkButtonHandler()});

    this.#word = data[this.#getRandomInt()]['country'].toUpperCase();
    this.#letters = []
    this.#lettersSet = new Set();
    console.log(this.#word);
    for (let i = 0; i < this.#word.length; i += 1) {
      this.#letters[i] = document.createElement('span');
      this.#letters[i].classList.add("letter");
      if ( this.#word[i] === ' ') {
        this.#letters[i].classList.add("background-gray")
      } else {
        this.#lettersSet.add(this.#word[i]);
        this.#letters[i].classList.add("background-orange")
      }
      this.#letterBox.appendChild(this.#letters[i]);
    }
    this.#lettersCount = this.#lettersSet.size;
  }

  #checkButtonHandler() {
    let input = this.#passInput.value.toString().toUpperCase();
    let found = false;
    if ( this.#lettersSet.has(input)) {
      found = true;
      for (let i = 0; i < this.#word.length; i += 1) {
        if (input === this.#word[i]) {
          this.#letters[i].classList.remove("background-orange");
          this.#letters[i].classList.add("background-beige");
          this.#letters[i].innerHTML = this.#word[i];
        }
      }
      this.#lettersSet.delete(input);
      this.#lettersCount--;
      if (this.#lettersCount === 0) {
        console.log("Won!");
        this.#clear();
        this.#init();
      }
    }
    if (!found) {
      this.#decrementLives();
      if (this.#lives === 0) {
        console.log("Game Over!");
        this.#gameOver();
      }
    }

    this.#passInput.value = "";
  }

  #getRandomInt() {
    let min = Math.ceil(0);
    let max = Math.floor(Game.COUTNRIES_COUNT);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  #clear() {
    this.#wrap.removeChild(this.#letterBox);
    this.#wrap.removeChild(this.#liveBox);
    this.#wrap.removeChild(this.#buttonBox);

  }

  #decrementLives() {
    this.#lives--;
    this.#liveBox.innerHTML = "Lives: "  + this.#lives;
  }

  #gameOver() {
    this.#clear();
    let endBox = DOMHelper.addElementWithClass(this.#wrap, "div", ["text-center", "text-big"], "Game Over !");
  }

}

class DOMHelper {
  static addElementWithClass(parent, element, cl, tag) {
    let box =  document.createElement(element);
    cl.forEach(cls => {box.classList.add(cls);})
    if (tag !== null) {
      box.innerHTML = tag;
    }
    parent.appendChild(box);
    return box;
  }
}

let start = new Start("wrap");
