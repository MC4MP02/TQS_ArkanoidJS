import { GameView } from "../view/GameView";
import { Ball } from "../model/Ball";
import { Paddle } from "../model/Paddle";
import { Brick } from "../model/Brick";
import { Map } from "../model/Map";

export class GameController {
  private view: GameView;
  private isRunning: boolean = false;
  private rightPressed: boolean = false;
  private leftPressed: boolean = false;
  private startGame: boolean = false;
  private isTesting: boolean = false;
  private score: number = 0;

  private ball: Ball;
  private paddle: Paddle;
  private map: Map;

  private canvasWidth: number = 448;
  private canvasHeight: number = 400;

  constructor(view: GameView) {
    this.view = view;
    this.ball = new Ball(0, 0, 0, 0, 0); // Inicializacion por defecto
    this.paddle = new Paddle(0, 0, 0, 0); // Inicializacion por defecto
    this.map = new Map(); // Inicializacion por defecto
    this.initEvents();
  }

  public startGameMethod() {
    console.log("GAME STARTED");
    this.view.updateScore(this.score);

    this.isRunning = true;
    this.startGame = true;

    // Inicialización de la bola
    let ballX: number = this.canvasWidth / 2;
    let ballY: number = this.canvasHeight - 40;
    let ballRadius: number = 4;
    let speedX: number = 1;
    let speedY: number = -1;

    this.ball = new Ball(ballX, ballY, ballRadius, speedX, speedY);

    // Inicialización de la paleta
    let paddleWidth: number = 50;
    let paddleHeight: number = 10;
    let paddleX: number = (this.canvasWidth - paddleWidth) / 2;
    let paddleY: number = this.canvasHeight - paddleHeight - 20;

    this.paddle = new Paddle(paddleWidth, paddleHeight, paddleX, paddleY);

    // Inicialización del mapa
    this.map.selectLevel(1);

    // Llamada al gameLoop (puede ser mockeada)
    this.gameLoop();
  }

  private gameLoop() {
    if (this.startGame && this.isRunning) {
      // Limpiar el canvas
      this.view.clearCanvas();

      // Renderizar el juego
      this.view.render(this.ball, this.paddle, this.map);

      // Verificar colisiones y mover objetos
      this.checkCollisions();
      this.ballMove();
      this.paddleMove();

      // Continuar el bucle del juego si sigue ejecutándose
      if (!this.isTesting) {
        if (this.isRunning) {
          window.requestAnimationFrame(this.gameLoop.bind(this));
        }
      }
    }
  }

  private ballMove() {
    this.ball.move();
  }

  private paddleMove() {
    this.paddle.move(this.rightPressed, this.leftPressed);
  }

  public getIsRunning() {
    return this.isRunning;
  }

  private initEvents() {
    document.addEventListener("keydown", this.keyDownHandler.bind(this));
    document.addEventListener("keyup", this.keyUpHandler.bind(this));
  }

  private keyDownHandler(event: KeyboardEvent) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      this.rightPressed = true;
    } else if (key === "Left" || key === "ArrowLeft") {
      this.leftPressed = true;
    }

    if (key === " ") {
      if (this.startGame && !this.isRunning) {
        this.startGameMethod(); // Iniciar el juego solo si startGame es true y isRunning es false
      } else {
        this.isRunning = false; // Si el juego ya está corriendo, se detiene
      }
    }
  }

  private keyUpHandler(event: KeyboardEvent) {
    const { key } = event;
    if (key === "Right" || key === "ArrowRight") {
      this.rightPressed = false;
    } else if (key === "Left" || key === "ArrowLeft") {
      this.leftPressed = false;
    }
  }

  private checkCollisions() {
    //BALL COLLISION
    if (this.ball.ballDownMap(this.canvasHeight)) {
      console.log("GAME OVER. REALOAD THE PAGE TO PLAY AGAIN.");
      this.isRunning = false;
      this.startGame = false;
      return;
    }

    this.ball["checkCollision"](
      this.paddle.paddleX,
      this.paddle.paddleY,
      this.paddle.paddleWidth,
      this.paddle.paddleHeight,
      this.canvasWidth,
      this.canvasHeight
    );

    // PADDLE COLLISION
    this.paddle.checkCollision();

    // MAP COLLISION
    this.mapCollision();
  }

  private mapCollision() {}
}
