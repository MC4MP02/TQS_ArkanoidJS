import { Ball } from "../../src/model/Ball";
import { Paddle } from "../../src/model/Paddle";
import { GameView } from "../../src/view/GameView";
import { Map } from "../../src/model/Map";
import { Brick } from "../../src/model/Brick";

// Mock de la clase Ball
describe("GameView", () => {
  let mockCanvas: HTMLCanvasElement; // Mock del canvas
  let mockCtx: CanvasRenderingContext2D; // Mock del contexto de dibujo
  let gameView: GameView; // Instancia de GameView

  let mockWidth = 448; // Ancho del canvas
  let mockHeight = 400; // Alto del canvas

  let paddleWidth = 50; // Ancho del paddle
  let paddleHeight = 10; // Alto del paddle
  let paddleX = (mockWidth - paddleWidth) / 2; // Posición X del paddle
  let paddleY = mockHeight - paddleHeight - 20; // Posición Y del paddle

  // Configuración inicial
  beforeEach(() => {
    mockCanvas = document.createElement("canvas"); // Crear un canvas
    // Mock del contexto de dibujo
    mockCtx = {
      beginPath: jest.fn(), // Mock automatico de beginPath
      arc: jest.fn(), // Mock automatico de arc
      fill: jest.fn(), // Mock automatico de fill
      closePath: jest.fn(), // Mock automatico de closePath
      clearRect: jest.fn(), // Mock automatico de clearRect
      drawImage: jest.fn(), // Mock automatico de drawImage
    } as unknown as CanvasRenderingContext2D; // Conversión a tipo CanvasRenderingContext2D

    const mockSprite = document.createElement("img"); // Crear un elemento img
    mockSprite.id = "sprite";
    document.body.appendChild(mockSprite); // Agregarlo al DOM

    gameView = new GameView(mockCanvas, mockCtx); // Crear una instancia de GameView

    gameView["sprite"] = mockSprite; // Asignar el mock de sprite a la instancia
  });

  // Test de la creación de la instancia
  it("debería crear una instancia de GameView", () => {
    expect(gameView).toBeInstanceOf(GameView);
  });

  // Test de la inicialización del canvas
  it("debería inicializar el canvas con el tamaño correcto", () => {
    gameView.loadCanvas();
    expect(mockCanvas.width).toBe(mockWidth);
    expect(mockCanvas.height).toBe(mockHeight);
  });

  // Test de la función render
  it("debería dibujar la bola en el canvas", () => {
    gameView.loadCanvas();

    const ball = new Ball(50, 50, 10, 2, 2);

    gameView["drawBall"](ball); // Llamar al método drawBall

    // Verificar que se llamaron los métodos
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.arc).toHaveBeenCalledWith(50, 50, 10, 0, Math.PI * 2);
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.closePath).toHaveBeenCalled();
  });

  // Test de la función drawPaddle
  it("debería dibujar el paddle en el canvas", () => {
    gameView.loadCanvas();

    const paddle = new Paddle(paddleWidth, paddleHeight, paddleX, paddleY); // Crear un paddle

    gameView["drawPaddle"](paddle); // Llamar al método drawPaddle

    expect(mockCtx.drawImage).toHaveBeenCalled(); // Verificar que se llamó a drawImage
    expect(mockCtx.drawImage).toHaveBeenCalledWith(
      // Verificar los argumentos de drawImage
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

  // Test de la función clearCanvas
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
      // Mock del contexto de dibujo
      beginPath: jest.fn(), // Mock automatico de beginPath
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
      // Mock del Map
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

  // Test de la función drawMap
  it("debería dibujar solo los ladrillos con estado ALIVE", () => {
    gameView["drawMap"](mockMap as Map); // Llamar al método drawMap

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
    gameView["drawMap"](mockMap as Map); // Llamar al método drawMap

    const bricks = (mockMap.getBricks as jest.Mock).mock.results[0].value; // Obtener los ladrillos
    // Obtener las coordenadas de los ladrillos en las llamadas a drawImage
    const calledCoords = (ctx.drawImage as jest.Mock).mock.calls.map((args) => [
      args[4],
      args[5],
    ]);

    // Verificar que no se dibujaron ladrillos muertos
    bricks.forEach((col: Brick[], colIndex: number) => {
      col.forEach((brick: Brick, rowIndex: number) => {
        if (brick.status === 0) {
          // Verifica que las coordenadas del ladrillo DEAD no están en las llamadas a drawImage
          expect(calledCoords).not.toContainEqual([brick.BrickX, brick.BrickY]);
        }
      });
    });
  });

  // Test de la función drawMap con ladrillos fuera del canvas
  it("debería manejar un array vacio de ladrillos correctamente", () => {
    // Configuramos el mock para devolver un array vacio
    (mockMap.getBricks as jest.Mock).mockReturnValue([]);

    gameView["drawMap"](mockMap as Map); // Llamar al método drawMap

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
      ctx = canvas.getContext("2d")!; // Obtener el contexto de dibujo
      let mockSprite = { src: "" } as HTMLImageElement; // Mock del sprite
      let mockBricksSprite = { src: "" } as HTMLImageElement; // Mock del sprite de ladrillos
      gameView = new GameView(canvas, ctx, mockSprite, mockBricksSprite); // Crear una instancia de GameView

      mockBall = {} as unknown as Ball; // Mock vacio de la bola

      mockPaddle = {} as unknown as Paddle; // Mock vacio de la paleta

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

    it("debería llamar a drawBall, drawPaddle y drawMap cuando render es llamado", () => {
      // Espiar los métodos internos
      const drawBallSpy = jest.spyOn(gameView as any, "drawBall"); // Espiar drawBall
      const drawPaddleSpy = jest.spyOn(gameView as any, "drawPaddle"); // Espiar drawPaddle
      const drawMapSpy = jest.spyOn(gameView as any, "drawMap"); // Espiar drawMap

      // Llamar a la función que se va a probar
      gameView.render(mockBall, mockPaddle, mockMap);

      // Verificar que las funciones internas fueron llamadas
      expect(drawBallSpy).toHaveBeenCalledWith(mockBall);
      expect(drawPaddleSpy).toHaveBeenCalledWith(mockPaddle);
      expect(drawMapSpy).toHaveBeenCalledWith(mockMap);
    });
  });

  describe("updateScore", () => {
    let gameView: GameView;
    let mockScoreDiv: HTMLElement;

    beforeEach(() => {
      // Crear un mock del div del score
      mockScoreDiv = document.createElement("div");
      mockScoreDiv.id = "score"; // Asignar un id
      document.body.appendChild(mockScoreDiv); // Agregarlo al DOM para pruebas

      // Crear una instancia de GameView sin acceso real al DOM
      const mockCanvas = document.createElement("canvas");
      const mockCtx = mockCanvas.getContext("2d")!;

      // Mockear las propiedades 'sprite' y 'bricksSprite' directamente
      const mockSprite = { src: "" } as HTMLImageElement;
      const mockBricksSprite = { src: "" } as HTMLImageElement;

      gameView = new GameView( // Crear una instancia de GameView
        mockCanvas,
        mockCtx,
        mockSprite,
        mockBricksSprite
      );
    });

    afterEach(() => {
      // Limpiar el DOM después de cada prueba
      document.body.innerHTML = "";
    });

    it("debería actualizar el contenido del scoreDiv con el puntaje proporcionado", () => {
      // Llamar al método con un puntaje de prueba
      gameView.updateScore(10);

      // Verificar si el innerHTML del scoreDiv se actualizó correctamente
      expect(mockScoreDiv.innerHTML).toBe("Score: 10");
    });

    it("debería actualizar el contenido del scoreDiv con el puntaje de 0", () => {
      // Llamar al método con un puntaje de 0
      gameView.updateScore(0);

      // Verificar si el innerHTML del scoreDiv se actualizó correctamente
      expect(mockScoreDiv.innerHTML).toBe("Score: 0");
    });

    it("debería actualizar el contenido del scoreDiv con un puntaje negativo", () => {
      // Llamar al método con un puntaje negativo
      gameView.updateScore(-5);

      // Verificar si el innerHTML del scoreDiv se actualizó correctamente
      expect(mockScoreDiv.innerHTML).toBe("Score: -5");
    });
  });

  //-------------------------------------------------------------------------------------------------------------
  //-------------------- TESTS PARTICIONES EQUIVALENTES, VALORES LÍMITE Y VALORES FRONTERA ----------------------
  //-------------------------------------------------------------------------------------------------------------

  describe("GameView.drawBall() - particiones, fronteras y límites", () => {
    const canvasWidth = 448;
    const canvasHeight = 400;
    let mockCtx: CanvasRenderingContext2D;
    let gameView: GameView;

    beforeEach(() => {
      // Configuración inicial
      const mockCanvas = document.createElement("canvas");
      mockCtx = {
        beginPath: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        closePath: jest.fn(),
      } as unknown as CanvasRenderingContext2D;
      gameView = new GameView(mockCanvas, mockCtx);
    });

    describe("Particiones equivalentes", () => {
      it("Debería dibujar la bola dentro del canvas", () => {
        const ball = new Ball(200, 200, 10, 0, 0); // Bola completamente dentro
        gameView["drawBall"](ball);
        expect(mockCtx.arc).toHaveBeenCalledWith(200, 200, 10, 0, Math.PI * 2);
        expect(mockCtx.fill).toHaveBeenCalled();
      });

      it("Debería dibujar la bola parcialmente fuera del canvas", () => {
        const ball = new Ball(5, 200, 10, 0, 0); // Parte del círculo fuera
        gameView["drawBall"](ball);
        expect(mockCtx.arc).toHaveBeenCalledWith(5, 200, 10, 0, Math.PI * 2);
        expect(mockCtx.fill).toHaveBeenCalled();
      });

      it("Debería dibujar la bola completamente fuera del canvas", () => {
        const ball = new Ball(-10, -10, 10, 0, 0); // Bola completamente fuera
        gameView["drawBall"](ball);
        expect(mockCtx.arc).toHaveBeenCalledWith(-10, -10, 10, 0, Math.PI * 2);
        expect(mockCtx.fill).toHaveBeenCalled();
      });
    });

    describe("Fronteras y límites", () => {
      it("Debería dibujar la bola en la frontera del borde izquierdo", () => {
        const ball = new Ball(10, 200, 10, 0, 0); // x - radius = 0
        gameView["drawBall"](ball);
        expect(mockCtx.arc).toHaveBeenCalledWith(10, 200, 10, 0, Math.PI * 2);
      });

      it("Debería dibujar la bola en el límite inferior del borde izquierdo", () => {
        const ball = new Ball(9, 200, 10, 0, 0); // x - radius < 0
        gameView["drawBall"](ball);
        expect(mockCtx.arc).toHaveBeenCalledWith(9, 200, 10, 0, Math.PI * 2);
      });

      it("Debería dibujar la bola en el límite superior del borde izquierdo", () => {
        const ball = new Ball(11, 200, 10, 0, 0); // x - radius > 0
        gameView["drawBall"](ball);
        expect(mockCtx.arc).toHaveBeenCalledWith(11, 200, 10, 0, Math.PI * 2);
      });

      it("Debería dibujar la bola en la frontera del borde derecho", () => {
        const ball = new Ball(438, 200, 10, 0, 0); // x + radius = canvasWidth
        gameView["drawBall"](ball);
        expect(mockCtx.arc).toHaveBeenCalledWith(438, 200, 10, 0, Math.PI * 2);
      });

      it("Debería dibujar la bola en el límite inferior del borde derecho", () => {
        const ball = new Ball(437, 200, 10, 0, 0); // x + radius < canvasWidth
        gameView["drawBall"](ball);
        expect(mockCtx.arc).toHaveBeenCalledWith(437, 200, 10, 0, Math.PI * 2);
      });

      it("Debería dibujar la bola en el límite superior del borde derecho", () => {
        const ball = new Ball(439, 200, 10, 0, 0); // x + radius > canvasWidth
        gameView["drawBall"](ball);
        expect(mockCtx.arc).toHaveBeenCalledWith(439, 200, 10, 0, Math.PI * 2);
      });
    });
  });

  describe("GameView.drawPaddle() - particiones, fronteras y límites", () => {
    const canvasWidth = 448;
    const canvasHeight = 400;
    let mockCtx: CanvasRenderingContext2D;
    let gameView: GameView;

    beforeEach(() => {
      const mockCanvas = document.createElement("canvas");
      mockCtx = {
        drawImage: jest.fn(),
      } as unknown as CanvasRenderingContext2D;
      gameView = new GameView(mockCanvas, mockCtx);
    });

    describe("Particiones equivalentes", () => {
      it("Debería dibujar el paddle completamente dentro del canvas", () => {
        const paddle = new Paddle(100, 10, 50, 390); // Paddle completamente dentro
        gameView["drawPaddle"](paddle);
        expect(mockCtx.drawImage).toHaveBeenCalledWith(
          // Verificar que se llamó a drawImage
          gameView["sprite"],
          29,
          174,
          100,
          10,
          50,
          390,
          100,
          10
        );
      });

      it("Debería dibujar el paddle parcialmente fuera del canvas", () => {
        const paddle = new Paddle(100, 10, -10, 390); // Parte del paddle fuera
        gameView["drawPaddle"](paddle);
        expect(mockCtx.drawImage).toHaveBeenCalledWith(
          // Verificar que se llamó a drawImage
          gameView["sprite"],
          29,
          174,
          100,
          10,
          -10,
          390,
          100,
          10
        );
      });

      it("Debería dibujar el paddle completamente fuera del canvas", () => {
        const paddle = new Paddle(100, 10, -200, 390); // Paddle completamente fuera
        gameView["drawPaddle"](paddle);
        expect(mockCtx.drawImage).toHaveBeenCalledWith(
          gameView["sprite"],
          29,
          174,
          100,
          10,
          -200,
          390,
          100,
          10
        );
      });
    });

    describe("Fronteras y límites", () => {
      describe("Borde izquierdo", () => {
        it("Debería dibujar el paddle en la frontera izquierda del canvas", () => {
          const paddle = new Paddle(50, 10, 0, 390); // paddleX = 0
          gameView["drawPaddle"](paddle);
          expect(mockCtx.drawImage).toHaveBeenCalledWith(
            // Verificar que se llamó a drawImage
            gameView["sprite"],
            29,
            174,
            50,
            10,
            0,
            390,
            50,
            10
          );
        });

        it("Debería dibujar el paddle fuera del canvas (límite inferior izquierdo)", () => {
          const paddle = new Paddle(50, 10, -1, 390); // paddleX < 0
          gameView["drawPaddle"](paddle);
          expect(mockCtx.drawImage).toHaveBeenCalledWith(
            // Verificar que se llamó a drawImage
            gameView["sprite"],
            29,
            174,
            50,
            10,
            -1,
            390,
            50,
            10
          );
        });

        it("Debería dibujar el paddle dentro del canvas (límite superior izquierdo)", () => {
          const paddle = new Paddle(50, 10, 1, 390); // paddleX > 0
          gameView["drawPaddle"](paddle);
          expect(mockCtx.drawImage).toHaveBeenCalledWith(
            // Verificar que se llamó a drawImage
            gameView["sprite"],
            29,
            174,
            50,
            10,
            1,
            390,
            50,
            10
          );
        });
      });

      describe("Borde derecho", () => {
        it("Debería dibujar el paddle en la frontera derecha del canvas", () => {
          const paddle = new Paddle(50, 10, 398, 390); // paddleX + paddleWidth = canvasWidth
          gameView["drawPaddle"](paddle);
          expect(mockCtx.drawImage).toHaveBeenCalledWith(
            // Verificar que se llamó a drawImage
            gameView["sprite"],
            29,
            174,
            50,
            10,
            398,
            390,
            50,
            10
          );
        });

        it("Debería dibujar el paddle dentro del canvas (límite inferior derecho)", () => {
          const paddle = new Paddle(50, 10, 397, 390); // paddleX + paddleWidth < canvasWidth
          gameView["drawPaddle"](paddle);
          expect(mockCtx.drawImage).toHaveBeenCalledWith(
            gameView["sprite"],
            29,
            174,
            50,
            10,
            397,
            390,
            50,
            10
          );
        });

        it("Debería dibujar el paddle fuera del canvas (límite superior derecho)", () => {
          const paddle = new Paddle(50, 10, 399, 390); // paddleX + paddleWidth > canvasWidth
          gameView["drawPaddle"](paddle);
          expect(mockCtx.drawImage).toHaveBeenCalledWith(
            gameView["sprite"],
            29,
            174,
            50,
            10,
            399,
            390,
            50,
            10
          );
        });
      });
    });
  });

  describe("GameView.updateScore() - particiones equivalentes", () => {
    let gameView: GameView;
    let mockScoreDiv: HTMLElement;

    beforeEach(() => {
      // Configuración inicial
      mockScoreDiv = document.createElement("div");
      mockScoreDiv.id = "score";
      document.body.appendChild(mockScoreDiv);

      const mockCanvas = document.createElement("canvas");
      const mockCtx = mockCanvas.getContext("2d")!;
      gameView = new GameView(mockCanvas, mockCtx);
    });

    afterEach(() => {
      document.body.innerHTML = ""; // Limpiar el DOM después de cada prueba
    });

    it("Debería actualizar el puntaje a un valor positivo", () => {
      gameView.updateScore(100);
      expect(mockScoreDiv.innerHTML).toBe("Score: 100"); // Verificar el valor del scoreDiv
    });

    it("Debería actualizar el puntaje a un valor negativo", () => {
      gameView.updateScore(-50);
      expect(mockScoreDiv.innerHTML).toBe("Score: -50"); // Verificar el valor del scoreDiv
    });

    it("Debería actualizar el puntaje a cero", () => {
      gameView.updateScore(0);
      expect(mockScoreDiv.innerHTML).toBe("Score: 0"); // Verificar el valor del scoreDiv
    });
  });
});
