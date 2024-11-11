export class Paddle {
  public paddleWidth: number;
  public paddleHeight: number;
  public paddleX: number;
  public paddleY: number;


  constructor(paddleWidth: number, paddleHeight: number, paddleX: number, paddleY: number) {
    this.paddleWidth = paddleWidth;
    this.paddleHeight = paddleHeight;
    this.paddleX = paddleX;
    this.paddleY = paddleY;
  }
}