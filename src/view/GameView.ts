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

  private bricksSprite: HTMLImageElement = document.querySelector(
    "#bricks"
  ) as HTMLImageElement;

  private canvasWidth: number = 448;
  private canvasHeight: number = 400;

  private BRICK_STATUS: { ALIVE: number; DEAD: number } = {
    ALIVE: 1,
    DEAD: 0,
  };

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.sprite.src = "./assets/sprite.png";
    /* this.bricksSprite.src = "./assets/bricks.png"; */
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

  private drawMap(map: Map) {
    const bricks = map.getBricks();
    const brickWidth = map.getBrickWidth();
    const brickHeigth = map.getBrickHeigth();

    for (let c = 0; c < map.getBrickColumnCount(); c++) {
      for (let r = 0; r < map.getBrickRowCount(); r++) {
        const currentBrick = bricks[c][r];
        if (currentBrick.status === this.BRICK_STATUS.DEAD) continue;

        this.ctx.drawImage(
          this.bricksSprite,
          currentBrick.color * 32,
          0,
          brickWidth,
          brickHeigth,
          currentBrick.BrickX,
          currentBrick.BrickY,
          brickWidth,
          brickHeigth
        );
      }
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}
