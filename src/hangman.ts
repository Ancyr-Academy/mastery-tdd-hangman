export interface InputInterface {
  read(): Promise<string | undefined>;
}

export interface DisplayInterface {
  revealed(word: string): void;
  wrongLetter(attemptsLeft: number): void;
  youWon(): void;
  youLost(word: string): void;
}

export interface WordGeneratorInterface {
  generate(): Promise<string>;
}

export class Game {
  private played = false;
  private revealed: string[] = [];
  private word: string = "";

  constructor(
    private generator: WordGeneratorInterface,
    private attempts: number,
    private input: InputInterface,
    private display: DisplayInterface
  ) {}

  async play() {
    this.word = await this.generator.generate();
    this.revealed = "_".repeat(this.word.length).split("");

    this.display.revealed(this.status());

    do {
      let letter = await this.input.read();
      if (!letter) {
        this.display.youLost(this.word);
        return;
      }

      let didReveal = this.revealLetter(letter);

      if (!didReveal) {
        this.attempts--;
        this.display.wrongLetter(this.attempts);

        if (this.attempts === 0) {
          this.display.youLost(this.word)
          return;
        }
      }

      this.display.revealed(this.status());

      if (this.isWordRevealed()) {
        this.display.youWon();
        return;
      }
    } while (true);
  }

  remainingAttempts() {
    return this.attempts;
  }


  private revealLetter(letter: string) {
    let didReveal: boolean = false;
    for (let i = 0; i < this.word.length; i++) {
      if (letter === this.word[i]) {
        this.revealed[i] = letter;
        didReveal = true;
      }
    }

    return didReveal;
  }

  private isWordRevealed() {
    return this.revealed.join("") === this.word;
  }


  private status(): string {
    if (this.played) {
      return this.word;
    }

    return this.revealed.join("");
  }
}