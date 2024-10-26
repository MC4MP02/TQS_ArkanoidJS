export class Brick {
  public BrickX: number;
  public BrickY: number;
  public status: number;
  public color: number;
  private BRICK_STATUS: { ALIVE: number; DEAD: number } = {
    ALIVE: 1,
    DEAD: 0,
  };

  constructor(BrickX: number, BrickY: number, status: number, color: number) {
    this.BrickX = BrickX;
    this.BrickY = BrickY;
    this.status = status;
    this.color = color;
  }
}
