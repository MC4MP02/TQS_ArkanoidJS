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

  selectLevel(level: number) {
    if (level === 1) {
      this.brickColumnCount = 13;
      this.brickRowCount = 7;
      this.brickWidth = 32;
      this.brickHeigth = 16;
      this.brickPadding = 0;
      this.brickOffsetLeft = 16;
      this.brickOffsetTop = 80;
    } else {
      this.brickColumnCount = 0;
      this.brickRowCount = 0;
      this.brickWidth = 0;
      this.brickHeigth = 0;
      this.brickPadding = 0;
      this.brickOffsetLeft = 0;
      this.brickOffsetTop = 0;
    }

    this.generateBricks();
  }

  generateBricks() {
    for (let c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRowCount; r++) {
        const brickX =
          c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
        const brickY =
          r * (this.brickHeigth + this.brickPadding) + this.brickOffsetTop;

        this.bricks[c][r] = new Brick(brickX, brickY, 0, 0); // Inicializamos con posiciones
      }
    }
  }
}
