import { GameView } from "../view/GameView";
import { Ball } from "../model/Ball";
import { Paddle } from "../model/Paddle";
import { Brick } from "../model/Brick";

export class GameController {
  private view: GameView;
  private isRunning: boolean = false;

  constructor(view: GameView) {
    this.view = view;
  }

  public startGame() {
    this.isRunning = true;
  }

  public gameLoop() {}

  public getIsRunning() {
    return this.isRunning;
  }
}
