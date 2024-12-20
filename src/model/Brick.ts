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

  hit() {
    this.status = this.BRICK_STATUS.DEAD;
  }

  isHit(ballX: number, ballY: number, brickWidth: number, brickHeigth: number) {
    return (
      this.status === this.BRICK_STATUS.ALIVE &&
      ballX >= this.BrickX &&
      ballX <= this.BrickX + brickWidth &&
      ballY >= this.BrickY &&
      ballY <= this.BrickY + brickHeigth
    );
  }
}
