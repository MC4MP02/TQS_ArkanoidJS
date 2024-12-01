import { GameController } from "../../src/controllers/GameController";
import { GameView } from "../../src/view/GameView";
import { Ball } from "../../src/model/Ball";
import { Paddle } from "../../src/model/Paddle";
import { Map } from "../../src/model/Map";

jest.mock("../../src/view/GameView");
jest.mock("../../src/model/Ball");
jest.mock("../../src/model/Paddle");

class PaddleMock implements Paddle {
  public paddleWidth = 75;
  public paddleHeight = 10;
  public paddleX = 0;
  public paddleY = 0;
  public canvasWidth: number = 448; // Coincide con 'Paddle'
  public PADDLE_SENSITIVITY: number = 3;
  public collisionRight: boolean = false;
  public collisionLeft: boolean = false;

  constructor(
    paddleWidth: number,
    paddleHeight: number,
    paddleX: number,
    paddleY: number
  ) {
    // do nothing
  }

  checkCollision() {
    // do nothing
  }

  checkCollisionCanvasRight(): boolean {
    return false;
  }

  checkCollisionCanvasLeft(): boolean {
    return false;
  }

  move(rightPressed: boolean, leftPressed: boolean) {
    return 0;
  }
}

describe("GameController", () => {
  let gameViewMock: jest.Mocked<GameView>;
  let BallMock: jest.Mocked<Ball>;
  let MapMock: jest.Mocked<Map>;
  let gameControllerMock: GameController;
  let mockCanvas: HTMLCanvasElement;
  let mockCtx: CanvasRenderingContext2D;
  const paddleMock = new PaddleMock(0, 0, 0, 0);

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

    BallMock = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      radius: 5,
      move: jest.fn(),
      checkCollision: jest.fn(),
    } as unknown as jest.Mocked<Ball>;

    MapMock = {
      bricks: [],
      initializeMap: jest.fn(),
      checkCollision: jest.fn(),
    } as unknown as jest.Mocked<Map>;

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
    gameViewMock.render(BallMock, paddleMock, MapMock);
    expect(renderSpy).toHaveBeenCalled();
  });

  it("debería devolver la variable isRunning", () => {
    gameControllerMock["isRunning"] = true;
    expect(gameControllerMock.getIsRunning()).toBe(true);
    gameControllerMock["isRunning"] = false;
    expect(gameControllerMock.getIsRunning()).toBe(false);
  });

  describe("initEvents", () => {
    let addEventListenerSpy: jest.SpyInstance;

    beforeEach(() => {
      addEventListenerSpy = jest.spyOn(document, "addEventListener");
    });

    afterEach(() => {
      addEventListenerSpy.mockRestore();
    });

    it('debería registrar un evento "keydown"', () => {
      const mockView = {} as GameView; // Mock básico de GameView
      new GameController(mockView); // Deberia llamar automaticamente al initEvents

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );
    });

    it('debería registrar un evento "keyup"', () => {
      const mockView = {} as GameView; // Mock básico de GameView
      new GameController(mockView); // Deberia llamar automaticamente al initEvents

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "keyup",
        expect.any(Function)
      );
    });

    it("debería vincular los manejadores de eventos al contexto de GameController", () => {
      const mockView = {} as GameView; // Mock básico de GameView
      const gameController = new GameController(mockView);

      // Crear mocks para los métodos keyDownHandler y keyUpHandler
      const keyDownHandlerMock = jest.fn();
      const keyUpHandlerMock = jest.fn();

      // Sobrescribir los métodos en la instancia del controlador
      gameController["keyDownHandler"] = keyDownHandlerMock;
      gameController["keyUpHandler"] = keyUpHandlerMock;

      // Forzar la llamada a initEvents para garantizar que se añadan los listeners
      gameController["initEvents"]();

      // Disparar eventos
      document.dispatchEvent(new KeyboardEvent("keydown"));
      document.dispatchEvent(new KeyboardEvent("keyup"));

      // Verificar que los métodos sean llamados
      expect(keyDownHandlerMock).toHaveBeenCalled();
      expect(keyUpHandlerMock).toHaveBeenCalled();
    });
  });

  describe("keyDownHandler", () => {
    let gameController: GameController;

    beforeEach(() => {
      const mockView = {
        clearCanvas: jest.fn(),
        render: jest.fn(),
      } as unknown as GameView;

      gameController = new GameController(mockView);
      gameController["isTesting"] = true; // Evitar que se llame a requestAnimationFrame
    });

    it("debería establecer rightPressed en true cuando se presiona 'ArrowRight'", () => {
      const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
      gameController["keyDownHandler"](event);

      expect(gameController["rightPressed"]).toBe(true);
    });

    it("debería establecer leftPressed en true cuando se presiona 'ArrowLeft'", () => {
      const event = new KeyboardEvent("keydown", { key: "ArrowLeft" });
      gameController["keyDownHandler"](event);

      expect(gameController["leftPressed"]).toBe(true);
    });

    it("debería iniciar el juego si se presiona la barra espaciadora cuando startGame es true y isRunning es false", () => {
      const startGameMethodSpy = jest.spyOn(gameController, "startGameMethod");
      gameController["startGame"] = true;
      gameController["isRunning"] = false;

      const event = new KeyboardEvent("keydown", { key: " " });
      gameController["keyDownHandler"](event);

      expect(startGameMethodSpy).toHaveBeenCalled();
      expect(gameController["isRunning"]).toBe(true);
    });

    it("debería detener el juego si se presiona la barra espaciadora cuando isRunning es true", () => {
      gameController["startGame"] = true;
      gameController["isRunning"] = true;

      const event = new KeyboardEvent("keydown", { key: " " });
      gameController["keyDownHandler"](event);

      expect(gameController["isRunning"]).toBe(false);
    });

    it("no debería cambiar propiedades para teclas irrelevantes", () => {
      const event = new KeyboardEvent("keydown", { key: "A" });
      gameController["keyDownHandler"](event);

      expect(gameController["rightPressed"]).toBe(false);
      expect(gameController["leftPressed"]).toBe(false);
    });
  });

  describe("keyUpHandler", () => {
    let gameController: GameController;

    beforeEach(() => {
      const mockView = {} as GameView;
      gameController = new GameController(mockView);
    });

    // Condition coverage de keyUpHandler
    it("debería establecer rightPressed en false cuando se suelta 'ArrowRight'", () => {
      gameController["rightPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "ArrowRight" });
      gameController["keyUpHandler"](event);

      expect(gameController["rightPressed"]).toBe(false);
    });

    it("no debería establecer rightPressed en false cuando no es 'ArrowRight'", () => {
      gameController["rightPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "NotArrowRight" }); //Forzamos que la key === ArrowRight de false
      gameController["keyUpHandler"](event);

      expect(gameController["rightPressed"]).not.toBe(false);
    });

    it("debería establecer rightPressed en false cuando se suelta 'Right'", () => {
      gameController["rightPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "Right" });
      gameController["keyUpHandler"](event);

      expect(gameController["rightPressed"]).toBe(false);
    });

    it("no debería establecer rightPressed en false cuando no es 'Right'", () => {
      gameController["rightPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "NotRight" }); //Forzamos que la key === Right de false
      gameController["keyUpHandler"](event);

      expect(gameController["rightPressed"]).not.toBe(false);
    });

    it("debería establecer leftPressed en false cuando se suelta 'ArrowLeft'", () => {
      gameController["leftPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "ArrowLeft" });
      gameController["keyUpHandler"](event);

      expect(gameController["leftPressed"]).toBe(false);
    });

    it("no debería establecer leftPressed en false cuando no es 'ArrowLeft'", () => {
      gameController["leftPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "NotArrowLeft" }); //Forzamos que la key === ArrowLeft de false
      gameController["keyUpHandler"](event);

      expect(gameController["leftPressed"]).not.toBe(false);
    });

    it("debería establecer leftPressed en false cuando se suelta 'Left'", () => {
      gameController["leftPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "Left" });
      gameController["keyUpHandler"](event);

      expect(gameController["leftPressed"]).toBe(false);
    });

    it("no debería establecer leftPressed en false cuando no es 'Left'", () => {
      gameController["leftPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "NotLeft" }); //Forzamos que la key === Left de false
      gameController["keyUpHandler"](event);

      expect(gameController["leftPressed"]).not.toBe(false);
    });

    it("no debería cambiar propiedades para teclas irrelevantes", () => {
      const event = new KeyboardEvent("keyup", { key: "A" });
      gameController["keyUpHandler"](event);

      expect(gameController["rightPressed"]).toBe(false);
      expect(gameController["leftPressed"]).toBe(false);
    });
  });

  describe("checkCollisions", () => {
    let gameController: GameController;
    let mockBall: jest.Mocked<Ball>;
    let mockPaddle: jest.Mocked<Paddle>;
    let mockMap: jest.Mocked<Map>;
    let mockView: jest.Mocked<GameView>;

    beforeEach(() => {
      mockBall = new Ball(0, 0, 0, 0, 0) as jest.Mocked<Ball>;
      mockPaddle = new Paddle(0, 0, 0, 0) as jest.Mocked<Paddle>;
      mockMap = new Map() as jest.Mocked<Map>;
      mockView = {} as jest.Mocked<GameView>;

      gameController = new GameController(mockView);
      gameController["ball"] = mockBall;
      gameController["paddle"] = mockPaddle;
      gameController["map"] = mockMap;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("debería finalizar el juego y recargar la página si la bola se sale del mapa", () => {
      // Configurar el mock para que `ballDownMap` devuelva true (bola fuera del mapa)
      mockBall.ballDownMap.mockReturnValue(true);

      // Llamar al método que se va a probar
      gameController["checkCollisions"]();

      // Verificar que se llamó a ballDownMap con el canvasHeight
      expect(mockBall.ballDownMap).toHaveBeenCalledWith(
        gameController["canvasHeight"]
      );

      // Verificar que se detuvo el juego
      expect(gameController["isRunning"]).toBe(false);
      expect(gameController["startGame"]).toBe(false);
    });

    it("no debería finalizar el juego ni recargar la página si la bola no se sale del mapa", () => {
      // Configurar el mock para que `ballDownMap` devuelva false (bola dentro del mapa)
      mockBall.ballDownMap.mockReturnValue(false);

      // Llamar al método que se va a probar
      gameController["checkCollisions"]();

      // Verificar que se llamó a ballDownMap con el canvasHeight
      expect(mockBall.ballDownMap).toHaveBeenCalledWith(
        gameController["canvasHeight"]
      );

      // Verificar que no se cambió el estado del juego
      expect(gameController["isRunning"]).toBe(false); // No cambia porque el juego no estaba corriendo
      expect(gameController["startGame"]).toBe(false); // No cambia porque el juego no estaba iniciado
    });

    it("debería verificar la colisión en la Ball", () => {
      // Configurar el mock para que `ballDownMap` devuelva false
      mockBall.ballDownMap.mockReturnValue(false);

      const checkCollisionSpy = jest.fn();
      mockBall["checkCollision"] = checkCollisionSpy;

      // Llamar al método que se va a probar
      gameController["checkCollisions"]();

      // Verificar que se llamó a `checkCollision` de la bola con los parámetros correctos
      expect(checkCollisionSpy).toHaveBeenCalledWith(
        mockPaddle.paddleX,
        mockPaddle.paddleY,
        mockPaddle.paddleWidth,
        mockPaddle.paddleHeight,
        gameController["canvasWidth"],
        gameController["canvasHeight"]
      );
    });

    it("debería verificar la colisión en el Paddle", () => {
      // Configurar el mock para que `ballDownMap` devuelva false
      mockBall.ballDownMap.mockReturnValue(false);

      const checkCollisionSpy = jest.fn();
      mockPaddle["checkCollision"] = checkCollisionSpy;

      // Llamar al método que se va a probar
      gameController["checkCollisions"]();

      // Verificar que se llamó a `checkCollision`
      expect(checkCollisionSpy).toHaveBeenCalled();
    });

    it("debería llamar a mapCollision()", () => {
      // Configurar el mock para que `ballDownMap` devuelva false
      mockBall.ballDownMap.mockReturnValue(false);

      // Reemplazar mapCollision con un mock para poder espiarlo
      gameController["mapCollision"] = jest.fn();

      // Llamar al método que se va a probar
      gameController["checkCollisions"]();

      // Verificar que se llamó a `mapCollision`
      expect(gameController["mapCollision"]).toHaveBeenCalled();
    });
  });

  describe("gameLoop", () => {
    let controller: GameController;
    let mockView: any;
    let mockBall: jest.Mocked<Ball>;
    let mockPaddle: jest.Mocked<Paddle>;
    let mockMap: jest.Mocked<Map>;

    beforeEach(() => {
      mockView = {
        clearCanvas: jest.fn(),
        render: jest.fn(),
      };

      mockBall = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        radius: 5,
        move: jest.fn(),
        checkCollision: jest.fn(),
      } as unknown as jest.Mocked<Ball>;

      mockMap = {
        bricks: [],
        initializeMap: jest.fn(),
        checkCollision: jest.fn(),
      } as unknown as jest.Mocked<Map>;

      mockPaddle = {
        paddleWidth: 75,
        paddleHeight: 10,
        paddleX: 0,
        paddleY: 0,
        canvasWidth: 448,
        PADDLE_SENSITIVITY: 3,
        collisionRight: false,
        collisionLeft: false,
        checkCollision: jest.fn(),
        checkCollisionCanvasRight: jest.fn(),
        checkCollisionCanvasLeft: jest.fn(),
        move: jest.fn(),
      } as unknown as jest.Mocked<Paddle>;

      controller = new GameController(mockView);
      controller["checkCollisions"] = jest.fn();
      controller["ballMove"] = jest.fn();
      controller["paddleMove"] = jest.fn();
      controller["ball"] = mockBall;
      controller["paddle"] = mockPaddle;
      controller["map"] = mockMap;

      controller["isTesting"] = true; // Evitar que se llame a requestAnimationFrame
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("debería llamar a clearCanvas cuando gameLoop es ejecutado", () => {
      controller["isRunning"] = true;
      controller["startGame"] = true;

      controller["gameLoop"](); // Llamamos a la función

      expect(mockView.clearCanvas).toHaveBeenCalled();
    });

    it("debería llamar a render con ball, paddle y map cuando gameLoop es ejecutado", () => {
      controller["isRunning"] = true;
      controller["startGame"] = true;

      controller["gameLoop"](); // Llamamos a la función

      expect(mockView.render).toHaveBeenCalledWith(
        controller["ball"],
        controller["paddle"],
        controller["map"]
      );
    });

    it("no debería llamar a clearCanvas ni render si startGame es false", () => {
      controller["isRunning"] = true;
      controller["startGame"] = false;

      controller["gameLoop"](); // Llamamos a la función

      expect(mockView.clearCanvas).not.toHaveBeenCalled();
      expect(mockView.render).not.toHaveBeenCalled();
    });

    it("debería llamar a checkCollisions, ballMove y paddleMove si game está en ejecución", () => {
      controller["isRunning"] = true;
      controller["startGame"] = true;

      controller["gameLoop"](); // Llamamos a la función

      expect(controller["checkCollisions"]).toHaveBeenCalled();
      expect(controller["ballMove"]).toHaveBeenCalled();
      expect(controller["paddleMove"]).toHaveBeenCalled();
    });

    it("debería llamar a requestAnimationFrame si isTesting es false y isRunning es true", () => {
      // Mockear requestAnimationFrame
      const requestAnimationFrameMock = jest
        .spyOn(window, "requestAnimationFrame")
        .mockImplementation((cb) => {
          // Llamar al callback solo una vez
          setTimeout(() => cb(0), 0);
          return 0;
        });

      // Configurar estado
      controller["isRunning"] = true;
      controller["startGame"] = true;
      controller["isTesting"] = false;

      // Llamar al método que inicia el bucle
      controller["gameLoop"]();

      // Verificar que se llama a requestAnimationFrame
      expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);

      requestAnimationFrameMock.mockRestore();
    });

    // PAIRWISE TESTING
    describe("Pairwise Testing de gameLoop", () => {
      const testCases = [
        { startGame: true, isRunning: true },
        { startGame: true, isRunning: false },
        { startGame: false, isRunning: true },
        { startGame: false, isRunning: false },
      ];

      testCases.forEach(({ startGame, isRunning }) => {
        it(`debería manejar startGame=${startGame} y isRunning=${isRunning}`, () => {
          controller["startGame"] = startGame;
          controller["isRunning"] = isRunning;

          controller["gameLoop"]();

          if (startGame && isRunning) {
            expect(mockView.clearCanvas).toHaveBeenCalled();
            expect(mockView.render).toHaveBeenCalledWith(
              controller["ball"],
              controller["paddle"],
              controller["map"]
            );
          } else {
            expect(mockView.clearCanvas).not.toHaveBeenCalled();
            expect(mockView.render).not.toHaveBeenCalled();
          }
        });
      });
    });
  });
});
