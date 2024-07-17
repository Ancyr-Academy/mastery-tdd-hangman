import {DisplayInterface, Game, InputInterface, WordGeneratorInterface} from "./hangman.js";

class Input implements InputInterface {
  constructor(private readonly letters: string[] = []) {}

  async read() {
    return this.letters.shift();
  }
}

class LogDisplay implements DisplayInterface {
  public readonly messages: string[] = [];

  revealed(word: string) {
    this.messages.push(word);
  }

  wrongLetter(attempsLeft: number) {
    this.messages.push(`INCORRECT LETTER, ${attempsLeft} ATTEMPTS LEFT`);
  }

  youWon() {
    this.messages.push("YOU WON!");
  }

  youLost(word: string) {
    this.messages.push("YOU LOST! THE WORD WAS: " + word)
  }
}

class FixedWordGenerator implements WordGeneratorInterface {
  constructor(private readonly word: string) {}

  async generate() {
    return this.word;
  }
}

// Write your tests here
const createSut = (word: string, attempts: number, input: InputInterface) => {
  const display = new LogDisplay();
  const game = new Game(new FixedWordGenerator(word), attempts, input, display);
  return { game, display }
}

test('showing a word', async () => {
  const { game, display } = createSut("S", 6, new Input([]));

  await game.play();

  expect(display.messages[0]).toBe("_");
})

test('showing a longer word', async () => {
  const { game, display } = createSut("WORD", 6, new Input([]));

  await game.play();

  expect(display.messages[0]).toBe("____");
})

test('revealing a letter', async () => {
  const { game, display } = createSut("S", 6, new Input(["S"]));

  await game.play();

  expect(display.messages[1]).toBe("S");
})

test('revealing the first letter of a long word',async  () => {
  const { game, display } = createSut("WORD", 6, new Input(["W"]));

  await game.play();

  expect(display.messages[1]).toBe("W___");
})

test('revealing the same letter many times in a long word',async  () => {
  const { game, display } = createSut("SOS", 6, new Input(["S"]));

  await game.play();

  expect(display.messages[1]).toBe("S_S");
})

test('when I type a wrong letter, nothing should be revealed', async () => {
  const { game, display } = createSut("SOS", 6, new Input(["P"]));

  await game.play();

  expect(display.messages[2]).toBe("___");
})

test('when I type a wrong letter, I should have one less attempt', async () => {
  const { game, display } = createSut("SOS", 6, new Input(["P"]));

  await game.play();

  expect(display.messages[1]).toBe("INCORRECT LETTER, 5 ATTEMPTS LEFT");
})

test('when I type the correct letter, I should still have 6 attempts', async () => {
  const { game } = createSut("SOS", 6, new Input(["S"]));

  await game.play();

  expect(game.remainingAttempts()).toBe(6);
})

test('reading many letters', async () => {
  const { game, display } = createSut("SOS", 6, new Input(["S", "O"]));

  await game.play();

  expect(display.messages[1]).toBe("S_S");
  expect(display.messages[2]).toBe("SOS");
})

test('when all letters are revealed, should win the game', async () => {
  const { game, display } = createSut("SOS", 6, new Input(["S", "O"]));

  await game.play();

  expect(display.messages[1]).toBe("S_S");
  expect(display.messages[2]).toBe("SOS");
  expect(display.messages[3]).toBe("YOU WON!");
})

test('when the game is won, the game should stop', async () => {
  const { game, display } = createSut("SOS", 6, new Input(["S", "O", "P"]));

  await game.play();

  expect(display.messages).toEqual(["___", "S_S", "SOS", "YOU WON!"])
})

test('when the word is not revealed and there is no more input, the game is lost', async () => {
  const { game, display } = createSut("SOS", 6, new Input([]));

  await game.play();

  expect(display.messages[1]).toBe("YOU LOST! THE WORD WAS: SOS");
})

test('when the word is not revealed and there is no more input, the game is lost', async () => {
  const { game, display } = createSut("SOS", 2, new Input(["P", "T", "K"]));

  await game.play();

  expect(display.messages).toEqual([
    "___",
    "INCORRECT LETTER, 1 ATTEMPTS LEFT",
    "___",
    "INCORRECT LETTER, 0 ATTEMPTS LEFT",
    "YOU LOST! THE WORD WAS: SOS"
  ])
})