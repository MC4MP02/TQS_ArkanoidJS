export class Paddle {
  public paddleWidth: number;
  public paddleHeight: number;
  public paddleX: number;
  public paddleY: number;
  private canvasWidth: number = 448;

  constructor(
    paddleWidth: number,
    paddleHeight: number,
    paddleX: number,
    paddleY: number
  ) {
    this.paddleWidth = paddleWidth;
    this.paddleHeight = paddleHeight;
    this.paddleX = paddleX;
    this.paddleY = paddleY;
  }

  checkCollisionCanvasRight(): boolean {
    return this.paddleX < this.canvasWidth - this.paddleWidth;
  }

  checkCollisionCanvasLeft(): boolean {
    return this.paddleX > 0;
  }
}
