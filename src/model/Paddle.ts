export class Paddle {
  public paddleWidth: number;
  public paddleHeight: number;
  public paddleX: number;
  public paddleY: number;
  private canvasWidth: number = 448;

  private PADDLE_SENSITIVITY: number = 3;

  private collisionRight: boolean = false;
  private collisionLeft: boolean = false;

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

  checkCollision() {
    this.collisionRight = this.checkCollisionCanvasRight();
    this.collisionLeft = this.checkCollisionCanvasLeft();
  }

  checkCollisionCanvasRight(): boolean {
    return this.paddleX < this.canvasWidth - this.paddleWidth;
  }

  checkCollisionCanvasLeft(): boolean {
    return this.paddleX > 0;
  }

  move(rightPressed: boolean, leftPressed: boolean) {
    if (rightPressed && this.collisionRight) {
      this.paddleX += this.PADDLE_SENSITIVITY;
    }
  }
}
