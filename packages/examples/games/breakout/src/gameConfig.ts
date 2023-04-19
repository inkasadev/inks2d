export const _gameConfig = {
  game: {
    best: 0,
    maxLives: 3,
    lastScore: -1,
  },
  tiles: {
    numberOfRows: 8,
    tilesPerRow: 8,
    chanceToSpawn: 0.55,
    scoresPerRow: [100, 90, 80, 70, 60, 50, 40, 30],
  },
  ball: {
    initialSpeed: {
      x: 4,
      y: -4,
    },
    maxSpeed: {
      x: 8,
      y: -8,
    },
  },
};
