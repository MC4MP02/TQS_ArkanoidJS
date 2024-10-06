import { GameView } from "../view/GameView";

export class GameController {
  private view: GameView;

  constructor(view: GameView) {
    this.view = view;
  }

  public startGame() {
    console.log("Game has started!");
  }
}
