export function assertGame(game: any): asserts game is foundry.Game {
  if (!game) {
    throw new Error("Game not found");
  }
}
