import { Brick } from "./Brick";

export class Map {
  private level: number = 0;
  private brickColumnCount: number = 0;
  private brickRowCount: number = 0;
  private brickWidth: number = 0;
  private brickHeigth: number = 0;
  private brickPadding: number = 0;
  private brickOffsetTop: number = 0;
  private brickOffsetLeft: number = 0;
  private BRICK_STATUS: { ALIVE: number; DEAD: number } = {
    ALIVE: 1,
    DEAD: 0,
  };
  private bricks: Brick[][] = [];

  constructor() {}

  getBricks(): Brick[][] {
    return this.bricks;
  }

  getBrickColumnCount(): number {
    return this.brickColumnCount;
  }

  getBrickRowCount(): number {
    return this.brickRowCount;
  }

  getBrickWidth(): number {
    return this.brickWidth;
  }

  getBrickHeigth(): number {
    return this.brickHeigth;
  }

  selectLevel(level: number) {}
}