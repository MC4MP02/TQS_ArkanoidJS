import { Ball } from "../model/Ball";
export class GameView {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

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

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}
