import { GameView } from "../../src/view/GameView";

jest.mock("../../src/view/GameView.ts");

describe("GameView", () => {
  let mockCanvas: HTMLCanvasElement;
  let mockCtx: CanvasRenderingContext2D;
  let gameView: GameView;

  // Valores por defecto para el mock del canvas
  let mockWidth = 300;
  let mockHeight = 150;

  beforeEach(() => {
    mockCanvas = document.createElement("canvas");
    mockCtx = mockCanvas.getContext("2d") as CanvasRenderingContext2D;
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
});
