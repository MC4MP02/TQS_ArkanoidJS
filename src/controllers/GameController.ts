import { GameView } from "../view/GameView";
import { Ball } from "../model/Ball";
import { Paddle } from "../model/Paddle";
import { Brick } from "../model/Brick";

export class GameController {
  private view: GameView;
  private isRunning: boolean = false;
  private rightPressed: boolean = false;
  private leftPressed: boolean = false;

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
    if (key === "ArrowRight") {
      this.rightPressed = true;
    } else if (key === "ArrowLeft") {
      this.leftPressed = true;
    }
  }

  private keyUpHandler(event: KeyboardEvent) {}
}
