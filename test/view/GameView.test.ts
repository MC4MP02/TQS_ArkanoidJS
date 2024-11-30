import { Ball } from "../../src/model/Ball";
import { Paddle } from "../../src/model/Paddle";
import { GameView } from "../../src/view/GameView";
import { Map } from "../../src/model/Map";
import { Brick } from "../../src/model/Brick";

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
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      closePath: jest.fn(),
      clearRect: jest.fn(),
      drawImage: jest.fn(),
    } as unknown as CanvasRenderingContext2D;

    const mockSprite = document.createElement("img");
    mockSprite.id = "sprite";
    document.body.appendChild(mockSprite);

    gameView = new GameView(mockCanvas, mockCtx);

    gameView["sprite"] = mockSprite;
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

    gameView["drawBall"](ball);

    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.arc).toHaveBeenCalledWith(50, 50, 10, 0, Math.PI * 2);
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.closePath).toHaveBeenCalled();
  });

  it("debería dibujar el paddle en el canvas", () => {
    gameView.loadCanvas();

    const paddle = new Paddle(paddleWidth, paddleHeight, paddleX, paddleY);

    gameView["drawPaddle"](paddle);

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

describe("GameView.drawMap() con mock del Map", () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let gameView: GameView;

  //Partial es para crear un mock con solo algunos objetos o variables
  let mockMap: Partial<Map>;

  beforeEach(() => {
    canvas = document.createElement("canvas");
    ctx = {
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      closePath: jest.fn(),
      clearRect: jest.fn(),
      drawImage: jest.fn(),
    } as unknown as CanvasRenderingContext2D;

    gameView = new GameView(canvas, ctx);
    gameView["bricksSprite"] = new Image(); // Simula un sprite para evitar el valor null

    // Mock del contexto de dibujo
    jest.spyOn(ctx, "drawImage").mockImplementation(jest.fn());
    jest.spyOn(ctx, "clearRect").mockImplementation(jest.fn());

    mockMap = {
      getBricks: jest.fn(),
      getBrickColumnCount: jest.fn(),
      getBrickRowCount: jest.fn(),
      getBrickWidth: jest.fn(),
      getBrickHeigth: jest.fn(),
    };

    // Configuramos valores por defecto para el mock de Map
    (mockMap.getBrickWidth as jest.Mock).mockReturnValue(32);
    (mockMap.getBrickHeigth as jest.Mock).mockReturnValue(16);
    (mockMap.getBrickColumnCount as jest.Mock).mockReturnValue(3);
    (mockMap.getBrickRowCount as jest.Mock).mockReturnValue(2);

    const brickAlive = new Brick(0, 0, 1, 0); // Ladrillo vivo
    const brickDead = new Brick(0, 0, 0, 0); // Ladrillo muerto
    (mockMap.getBricks as jest.Mock).mockReturnValue([
      [brickAlive, brickDead],
      [brickAlive, brickAlive],
      [brickDead, brickAlive],
    ]);
  });

  it("debería dibujar solo los ladrillos con estado ALIVE", () => {
    gameView["drawMap"](mockMap as Map);

    // Comprobamos llamadas a drawImage solo para ladrillos ALIVE
    expect(ctx.drawImage).toHaveBeenCalledTimes(4); // Solo ladrillos vivos en el mock
    expect(ctx.drawImage).toHaveBeenCalledWith(
      gameView["bricksSprite"], // Seria el sprite
      0, // Color
      0,
      32, // Ancho del ladrillo
      16, // Alto del ladrillo
      expect.any(Number), // X
      expect.any(Number), // Y
      32,
      16
    );
  });

  it("no debería dibujar ladrillos con estado DEAD", () => {
    gameView["drawMap"](mockMap as Map);

    const bricks = (mockMap.getBricks as jest.Mock).mock.results[0].value;
    const calledCoords = (ctx.drawImage as jest.Mock).mock.calls.map((args) => [
      args[4],
      args[5],
    ]);

    bricks.forEach((col: Brick[], colIndex: number) => {
      col.forEach((brick: Brick, rowIndex: number) => {
        if (brick.status === 0) {
          // Verifica que las coordenadas del ladrillo DEAD no están en las llamadas a drawImage
          expect(calledCoords).not.toContainEqual([brick.BrickX, brick.BrickY]);
        }
      });
    });
  });

  it("debería manejar un array vacio de ladrillos correctamente", () => {
    // Configuramos el mock para devolver un array vacio
    (mockMap.getBricks as jest.Mock).mockReturnValue([]);

    gameView["drawMap"](mockMap as Map);

    // Verificamos que no se llamó a drawImage
    expect(ctx.drawImage).not.toHaveBeenCalled();
  });

  describe("render", () => {
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let gameView: GameView;
    let mockBall: Ball;
    let mockPaddle: Paddle;
    let mockMap: Map;

    beforeEach(() => {
      // Crear elementos mock para las dependencias
      canvas = document.createElement("canvas");
      ctx = canvas.getContext("2d")!;
      gameView = new GameView(canvas, ctx);

      mockBall = {} as unknown as Ball;

      mockPaddle = {} as unknown as Paddle;

      mockMap = {
        getBricks: jest.fn().mockReturnValue([]), // Mock de la funciongetBricks
        getBrickWidth: jest.fn().mockReturnValue(50), // Mock de la función getBrickWidth
        getBrickHeigth: jest.fn().mockReturnValue(20), // Mock de la función getBrickHeigth
        getBrickColumnCount: jest.fn().mockReturnValue(5), // Mock de la función getBrickColumnCount
        getBrickRowCount: jest.fn().mockReturnValue(5), // Mock de la funcion getBrickRowCount
      } as unknown as Map;
    });

    it("debería llamar a drawBall cuando render es llamado", () => {
      // Espiar los métodos internos
      const drawBallSpy = jest.spyOn(gameView as any, "drawBall");

      // Llamar a la función que se va a probar
      gameView.render(mockBall, mockPaddle, mockMap);

      // Verificar que las funciones internas fueron llamadas
      expect(drawBallSpy).toHaveBeenCalledWith(mockBall);
    });
  });
});
