import { GameView } from "../view/GameView";
import { Ball } from "../model/Ball";
import { Paddle } from "../model/Paddle";
import { Brick } from "../model/Brick";

export class GameController {
  private view: GameView;
  private isRunning: boolean = false;
  private rightPressed: boolean = false;
  private leftPressed: boolean = false;
  private startGame: boolean = false;

  constructor(view: GameView) {
    this.view = view;
    this.initEvents();
  }

  public startGameMethod() {
    this.isRunning = true;
    this.gameLoop();
  }

  public gameLoop() {}

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
}
