import { Ball } from "../model/Ball";
import { Paddle } from "../model/Paddle";
import { Brick } from "../model/Brick";
import { Map } from "../model/Map";
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
    this.sprite.src = "./assets/sprite.png";

    /*this.sprite.onload = () => {
      this.loadCanvas();

      this.drawBall(new Ball(50, 50, 10, 2, 2));
      const paddle = new Paddle(50, 10, (448 - 50) / 2, 400 - 10 - 20);
      this.drawPaddle(paddle);
    };*/
  }

  loadCanvas() {
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
  }

  render(ball: Ball, paddle: Paddle, map: Map): void {}

  private drawBall(ball: Ball) {
    this.ctx.beginPath();
    this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "#000";
    this.ctx.fill();
    this.ctx.closePath();
  }

  private drawPaddle(paddle: Paddle) {
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

  private drawMap(map: Map) {}

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}
