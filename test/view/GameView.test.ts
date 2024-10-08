import { Ball } from "../../src/model/Ball";
import { Paddle } from "../../src/model/Paddle";
import { GameView } from "../../src/view/GameView";

/* jest.mock("../../src/view/GameView.ts"); */

describe("GameView", () => {
  let mockCanvas: HTMLCanvasElement;
  let mockCtx: CanvasRenderingContext2D;
  let gameView: GameView;

  let mockWidth = 448;
  let mockHeight = 400;

  let paddleWidth = 50;
  let paddleHeight = 10;
  let paddleX = (mockWidth - paddleWidth) / 2;
  let paddleY = mockHeight - paddleHeight - 20;

  beforeEach(() => {
    mockCanvas = document.createElement("canvas");
    mockCtx = {
      // Simulamos los metodos de mockCtx (estos no haran nada)
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      closePath: jest.fn(),
      clearRect: jest.fn(),
      drawImage: jest.fn(),
    } as unknown as CanvasRenderingContext2D;

    gameView = new GameView(mockCanvas, mockCtx);

    const mockImage = new Image();
    gameView["sprite"] = mockImage;
  });

  it("debería crear una instancia de GameView", () => {
    expect(gameView).toBeInstanceOf(GameView);
  });

  it("debería inicializar el canvas con el tamaño correcto", () => {
    gameView.loadCanvas();
    expect(mockCanvas.width).toBe(mockWidth);
    expect(mockCanvas.height).toBe(mockHeight);
  });

  it("debería dibujar la bola en el canvas", () => {
    gameView.loadCanvas();

    const ball = new Ball(50, 50, 10, 2, 2);

    gameView.drawBall(ball);

    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.arc).toHaveBeenCalledWith(50, 50, 10, 0, Math.PI * 2);
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.closePath).toHaveBeenCalled();
  });

  it("debería dibujar el paddle en el canvas", () => {
    gameView.loadCanvas();

    const paddle = new Paddle(paddleWidth, paddleHeight, paddleX, paddleY);

    gameView.drawPaddle(paddle);

    expect(mockCtx.drawImage).toHaveBeenCalled();
    expect(mockCtx.drawImage).toHaveBeenCalledWith(
      expect.any(HTMLImageElement),
      29,
      174,
      paddle.paddleWidth,
      paddle.paddleHeight,
      paddle.paddleX,
      paddle.paddleY,
      paddle.paddleWidth,
      paddle.paddleHeight
    );
  });

  it("debería limpiar el canvas", () => {
    gameView.clearCanvas();

    expect(mockCtx.clearRect).toHaveBeenCalled();
    expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, mockWidth, mockHeight);
  });
});
