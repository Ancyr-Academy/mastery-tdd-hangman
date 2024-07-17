import {DisplayInterface, Game, InputInterface, WordGeneratorInterface} from "./hangman.js";
import prompt from 'prompt';
import {FileWordGenerator} from "./file-word-generator.js";

class ConsoleInput implements InputInterface {
  constructor() {
    prompt.start();
  }

  async read() {
    const { letter } = await prompt.get(['letter']);
    return letter as string | undefined;
  }
}

class ConsoleDisplay implements DisplayInterface {
  revealed(word: string): void {
    console.log(word);
  }

  wrongLetter(attemptsLeft: number): void {
    console.log(`Wrong letter, ${attemptsLeft} attempts left`);
  }

  youLost(word: string): void {
    console.log(`You lost! The word was: ${word}`);
  }

  youWon(): void {
    console.log("You won!");
  }
}

function main() {
  const game = new Game(
    new FileWordGenerator('./src/dictionnary.txt'),
    10,
    new ConsoleInput(),
    new ConsoleDisplay()
  );

  return game.play();
}

main();