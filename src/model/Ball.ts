export class Ball {
  public x: number;
  public y: number;
  public radius: number;
  public speedX: number;
  public speedY: number;
  private collisionPaddle: boolean = false;
  private collisionCanvasX: boolean = false;
  private collisionCanvasY: boolean = false;

  constructor(
    x: number,
    y: number,
    radius: number,
    speedX: number,
    speedY: number
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  changeX() {
    this.speedX = -this.speedX;
    this.x += this.speedX;
  }

  changeY() {
    this.speedY = -this.speedY;
    this.y += this.speedY;
  }

  move() {
    if (this.collisionPaddle) this.speedY = -this.speedY;
    if (this.collisionCanvasX) this.speedX = -this.speedX;
    if (this.collisionCanvasY) this.speedY = -this.speedY;

    this.x += this.speedX;
    this.y += this.speedY;
  }

  private checkCollisionPaddle(
    paddleX: number,
    paddleY: number,
    paddleWidth: number
  ): boolean {
    return (
      this.x + this.speedX < paddleX + paddleWidth &&
      this.x + this.speedX > paddleX
    );
  }
}
