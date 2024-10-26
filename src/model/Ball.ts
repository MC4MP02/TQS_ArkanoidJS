export class Ball {
  public x: number;
  public y: number;
  public radius: number;
  public speedX: number;
  public speedY: number;

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
}
