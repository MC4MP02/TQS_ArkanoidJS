import { GameView } from "../view/GameView";
import { Ball } from "../model/Ball";
import { Paddle } from "../model/Paddle";
import { Brick } from "../model/Brick";

export class GameController {
  private view: GameView;
  private isRunning: boolean = false;

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

  private keyDownHandler(event: KeyboardEvent) {}
  private keyUpHandler(event: KeyboardEvent) {}
}
