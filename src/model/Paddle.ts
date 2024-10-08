export class Paddle {
  public paddleWidth: number;
  public paddleHeight: number;
  public paddleX: number;
  public paddleY: number;

  constructor(
    paddleWidth: number,
    paddleHeigth: number,
    paddleX: number,
    paddleY: number
  ) {
    this.paddleWidth = paddleWidth;
    this.paddleHeight = paddleHeigth;
    this.paddleX = paddleX;
    this.paddleY = paddleY;
  }
}
