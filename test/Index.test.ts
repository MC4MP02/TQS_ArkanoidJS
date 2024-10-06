import { GameController } from "../src/controllers/GameController";
import { GameView } from "../src/view/GameView";

// Creamos mocks automaticos para las clases importadas
// Jest reemplaza las clases originales por clases "simuladas"
jest.mock("../src/view/GameView.ts");
jest.mock("../src/controllers/GameController.ts");

// Creamos un mock del canvas
jest.mock("canvas", () => {
  return {
    createCanvas: jest.fn(() => ({
      getContext: jest.fn(),
    })),
  };
});

describe("Index", () => {
  // Variables de los mocks de las clases que necesitaremos
  let mockView: GameView;
  let mockGameController: GameController;

  // Necesitamos un mock del canvas y del contexto para poder renderizar el GameView
  let mockCanvas: HTMLCanvasElement;
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    mockCanvas = document.createElement("canvas") as HTMLCanvasElement;
    mockCtx = mockCanvas.getContext("2d") as CanvasRenderingContext2D;

    mockView = new GameView(mockCanvas, mockCtx);
    mockGameController = new GameController(mockView);
  });

  it("debería inicializar el GameView llamando al constructor", () => {
    // Verificar si el constructor de GameView ha sido llamado
    expect(GameView).toHaveBeenCalledWith(mockCanvas, mockCtx);
  });

  it("debería crear una instancia de GameView", () => {
    expect(mockView).toBeInstanceOf(GameView);
  });

  it("debería inicializar el GameController llamando al constructor", () => {
    // Verificar si el constructor de GameController ha sido llamado
    expect(GameController).toHaveBeenCalledWith(mockView);
  });

  it("debería crear una instancia de GameController", () => {
    expect(mockGameController).toBeInstanceOf(GameController);
  });
});
