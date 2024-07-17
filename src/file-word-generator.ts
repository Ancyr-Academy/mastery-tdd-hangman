import {WordGeneratorInterface} from "./hangman.js";
import {readFileSync} from "node:fs";

export class FileWordGenerator implements WordGeneratorInterface {
  constructor(private readonly fileName: string) {

  }

  async readWords() {
    const content = readFileSync(this.fileName, 'utf-8');
    return content.split("\n");
  }

  async generate(): Promise<string> {
    const words = await this.readWords();
    return words[Math.floor(Math.random() * words.length)];
  }
}