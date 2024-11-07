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
    paddleWidth: number,
    paddleHeight: number
  ): boolean {
    return (
      this.x + this.speedX < paddleX + paddleWidth &&
      this.x + this.speedX > paddleX &&
      this.y + this.speedY > paddleY &&
      this.y + this.speedY < paddleY + paddleHeight
    );
  }

  private checkCollisionCanvasX(canvasWidth: number): boolean {
    return (
      this.x + this.speedX > canvasWidth - this.radius ||
      this.x + this.speedX < this.radius
    );
  }

  private checkCollisionCanvasY(canvasHeight: number): boolean {
    return (
      this.y + this.speedY < this.radius ||
      this.y + this.speedY > canvasHeight - this.radius
    );
  }

  private checkCollision(
    paddleX: number,
    paddleY: number,
    paddleWidth: number,
    paddleHeight: number,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.collisionPaddle = this.checkCollisionPaddle(
      paddleX,
      paddleY,
      paddleWidth,
      paddleHeight,
    );

    this.collisionCanvasX = this.checkCollisionCanvasX(canvasWidth);
    this.collisionCanvasY = this.checkCollisionCanvasY(canvasHeight);
  }
}
