import { Ball } from "../model/Ball";
import { Paddle } from "../model/Paddle";
export class GameView {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private sprite: HTMLImageElement = document.querySelector(
    "#sprite"
  ) as HTMLImageElement;

  private canvasWidth: number = 448;
  private canvasHeight: number = 400;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  loadCanvas() {
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
  }

  drawBall(ball: Ball) {
    this.ctx.beginPath();
    this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "#fff";
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawPaddle(paddle: Paddle) {
    this.ctx.drawImage(
      this.sprite,
      29,
      174,
      paddle.paddleWidth,
      paddle.paddleHeight,
      paddle.paddleX,
      paddle.paddleY,
      paddle.paddleWidth,
      paddle.paddleHeight
    );
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}
