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

  drawBall(ball: Ball) {}
}
