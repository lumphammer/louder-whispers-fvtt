export function assertGame(game: any): asserts game is Game {
  if (!game) {
    throw new Error("Game not found");
  }
}
