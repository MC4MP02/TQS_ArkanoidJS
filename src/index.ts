// Punto de entrada

import { GameController } from "./controllers/GameController";
import { GameView } from "./view/GameView";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const canvasWidth = 448;
const canvasHeight = 400;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const view = new GameView(canvas, ctx);

const gameController = new GameController(view);

window.onload = () => {
  gameController.startGame();
};
