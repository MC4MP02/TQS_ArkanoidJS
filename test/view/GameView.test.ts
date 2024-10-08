import { Ball } from "../../src/model/Ball";
import { GameView } from "../../src/view/GameView";

/* jest.mock("../../src/view/GameView.ts"); */

describe("GameView", () => {
  let mockCanvas: HTMLCanvasElement;
  let mockCtx: CanvasRenderingContext2D;
  let gameView: GameView;

  let mockWidth = 448;
  let mockHeight = 400;

  beforeEach(() => {
    mockCanvas = document.createElement("canvas");
    mockCtx = {
      // Simulamos los metodos de mockCtx (estos no haran nada)
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      closePath: jest.fn(),
      clearRect: jest.fn(),
    } as unknown as CanvasRenderingContext2D;

    gameView = new GameView(mockCanvas, mockCtx);
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
});
