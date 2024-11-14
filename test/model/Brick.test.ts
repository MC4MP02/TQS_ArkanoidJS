import { Brick } from "../../src/model/Brick";

describe("Brick", () => {
  let brick: Brick;
  let BRICK_STATUS: { ALIVE: number; DEAD: number } = {
    ALIVE: 1,
    DEAD: 0,
  };

  beforeEach(() => {
    brick = new Brick(10, 20, 1, 0);
  });

  // Test de inicialización
  it("debería inicializarse con las propiedades correctas", () => {
    expect(brick.BrickX).toBe(10);
    expect(brick.BrickY).toBe(20);
    expect(brick.status).toBe(BRICK_STATUS.ALIVE);
    expect(brick.color).toBe(0);
  });

  // Test de valores predeterminados del estado
  it("debería inicializarse con el estado ALIVE cuando el estado es 1", () => {
    const brickAlive = new Brick(5, 5, BRICK_STATUS.ALIVE, 100);
    expect(brickAlive.status).toBe(BRICK_STATUS.ALIVE);
  });

  it("debería inicializarse con el estado DEAD cuando el estado es 0", () => {
    const brickDead = new Brick(5, 5, BRICK_STATUS.DEAD, 100);
    expect(brickDead.status).toBe(BRICK_STATUS.DEAD);
  });
});
