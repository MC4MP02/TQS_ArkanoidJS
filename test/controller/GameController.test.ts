import { GameController } from "../../src/controllers/GameController";
import { GameView } from "../../src/view/GameView";
import { Ball } from "../../src/model/Ball";
import { Paddle } from "../../src/model/Paddle";
import { Map } from "../../src/model/Map";

jest.mock("../../src/view/GameView");
jest.mock("../../src/controllers/GameController");
jest.mock("../../src/model/Ball");
jest.mock("../../src/model/Paddle");

describe("GameController", () => {
  let gameControllerMock: GameController;
  let mockCanvas: HTMLCanvasElement;
  let mockCtx: CanvasRenderingContext2D;
  let gameViewMock: GameView;
  let BallMock: Ball;
  let PaddleMock: Paddle;
  let MapMock: Map;

  let mockWidth = 448;
  let mockHeight = 400;

  let paddleWidth = 50;
  let paddleHeight = 10;
  let paddleX = (mockWidth - paddleWidth) / 2;
  let paddleY = mockHeight - paddleHeight - 20;

  beforeEach(() => {
    mockCanvas = document.createElement("canvas");
    mockCtx = {
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      closePath: jest.fn(),
      clearRect: jest.fn(),
      drawImage: jest.fn(),
    } as unknown as CanvasRenderingContext2D;

    BallMock = new Ball(50, 50, 10, 2, 2);
    PaddleMock = new Paddle(paddleWidth, paddleHeight, paddleX, paddleY);
    MapMock = new Map();

    const mockSprite = document.createElement("img");
    mockSprite.id = "sprite";
    document.body.appendChild(mockSprite);

    gameViewMock = new GameView(mockCanvas, mockCtx);

    gameViewMock["sprite"] = mockSprite;

    gameControllerMock = new GameController(gameViewMock);
  });

  it("debería inicializar el GameController", () => {
    //Comprobamos que se hayan creado las instancias de cada clase y las variables incializadas
    expect(gameControllerMock).toBeInstanceOf(GameController);
    expect(gameControllerMock["view"]).toBe(gameViewMock);
    expect(gameControllerMock["view"]).toBeInstanceOf(GameView);
  });

  it("debería inicar el juego y comenzar el bucle del juego", () => {
    /* Espiaremos el metodo startGame del controlador
    Esto nos permitira saber si se ha llamado a este metodo,
    cuantas veces se ha llamado y con que argumentos, etc. */
    const startGameSpy = jest.spyOn(gameControllerMock, "startGame");
    const gameLoopSpy = jest.spyOn(gameControllerMock, "gameLoop");

    // Iniciamos el juego
    gameControllerMock.startGame();

    // Comprobamos que el metodo startGame haya sido llamado
    expect(startGameSpy).toHaveBeenCalled();

    expect(gameLoopSpy).toHaveBeenCalled();

    // Comprobamos que el metodo render haya sido llamado

    // Comprobamos que el juego este funcionando
    expect(gameControllerMock.getIsRunning()).toBe(true);
  });

  it("debería actualizar y renderizar la escena en cada ciclo del bucle", () => {
    const renderSpy = jest.spyOn(gameViewMock, "render");

    // Renderizamos la escena
    gameViewMock.render(BallMock, PaddleMock, MapMock);
    expect(renderSpy).toHaveBeenCalled();
  });
});
