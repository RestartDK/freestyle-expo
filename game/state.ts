export type GameState = {
  worldTime: number;
  box: {
    rotation: { x: number; y: number };
  };
};

export function createInitialState(): GameState {
  return {
    worldTime: 0,
    box: {
      rotation: { x: 0, y: 0 },
    },
  };
}
