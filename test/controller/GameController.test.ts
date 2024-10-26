import { GameController } from "../../src/controllers/GameController";
import { GameView } from "../../src/view/GameView";
import { Ball } from "../../src/model/Ball";
import { Paddle } from "../../src/model/Paddle";
import { Map } from "../../src/model/Map";

jest.mock("../../src/view/GameView");
jest.mock("../../src/model/Ball");
jest.mock("../../src/model/Paddle");

describe("GameController", () => {
  let gameViewMock: jest.Mocked<GameView>;
  let BallMock: jest.Mocked<Ball>;
  let PaddleMock: jest.Mocked<Paddle>;
  let MapMock: jest.Mocked<Map>;
  let gameControllerMock: GameController;

  let mockCanvas: HTMLCanvasElement;
  let mockCtx: CanvasRenderingContext2D;

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

    // Mock del requestAnimationFrame
    global.requestAnimationFrame = jest.fn((callback) => {
      callback(0);
      return 0; // Retorna un ID de frame ficticio
    });

    gameViewMock = {
      clearCanvas: jest.fn(),
      drawBall: jest.fn(),
      drawMap: jest.fn(),
      drawPaddle: jest.fn(),
      loadCanvas: jest.fn(),
      render: jest.fn(),
      sprite: document.createElement("img"),
    } as any;

    gameControllerMock = new GameController(gameViewMock);
  });

  it("debería inicializar el GameController", () => {
    //Comprobamos que se hayan creado las instancias de cada clase y las variables incializadas
    expect(gameControllerMock).toBeInstanceOf(GameController);
    expect(gameControllerMock["view"]).toBe(gameViewMock);
  });

  it("debería inicar el juego y comenzar el bucle del juego", () => {
    // Spy sobre el método gameLoop
    const gameLoopSpy = jest.spyOn(GameController.prototype as any, "gameLoop");

    // Llama al método startGameMethod para iniciar el juego
    gameControllerMock.startGameMethod();

    // Verifica que gameLoop se haya llamado
    expect(gameLoopSpy).toHaveBeenCalled();
  });

  it("debería actualizar y renderizar la escena en cada ciclo del bucle", () => {
    const renderSpy = jest.spyOn(gameViewMock, "render");

    // Renderizamos la escena
    gameViewMock.render(BallMock, PaddleMock, MapMock);
    expect(renderSpy).toHaveBeenCalled();
  });
});
