// Punto de entrada

import { GameController } from "./controllers/GameController";
import { GameView } from "./view/GameView";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const view = new GameView(canvas, ctx);

const gameController = new GameController(view);

view.loadCanvas();

window.onload = () => {
  gameController.startGameMethod();
};
