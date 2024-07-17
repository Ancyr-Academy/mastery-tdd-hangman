import {FileWordGenerator} from "./file-word-generator.js";

test('reading the document', async () => {
  const generator = new FileWordGenerator('./src/dictionnary.txt');
  const words = await generator.readWords();
  
  expect(words).toEqual(["CREPES", "SIMPSONS", "VOITURE", "GATEAU", "JOUET"])
})

test('reading a random word', async () => {
  const generator = new FileWordGenerator('./src/dictionnary.txt')
  const words = await generator.readWords();
  const word = await generator.generate();

  expect(words.includes(word)).toBe(true);
})