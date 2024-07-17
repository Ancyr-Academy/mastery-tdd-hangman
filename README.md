# Mastery TDD - Hangman

Write a program in which the user must guess a word, letter by letter.
The user can fail 6 times.
If the user types a letter that was already revealed, the program should not count it as a mistake.

You should end up with a `main.ts` file containing code that looks like the following :

```ts 
function main() {
  const game = new Game();
  return game.start();
}

main();
```

NOTE : the game will probably have constructor parameters, they will emerge as you develop unless you already know
which ones you need.

# Hints

You will need at least three collaborators : 
- A display to show information to the user
- An input to get the user's letter
- A word generator