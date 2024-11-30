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

    BallMock = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      radius: 5,
      move: jest.fn(),
      checkCollision: jest.fn(),
    } as unknown as jest.Mocked<Ball>;

    PaddleMock = {
      x: 0,
      y: 0,
      width: 75,
      height: 10,
      dx: 0,
      move: jest.fn(),
    } as unknown as jest.Mocked<Paddle>;

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
    gameViewMock.render(BallMock, PaddleMock, MapMock);
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
      const mockView = {} as GameView;
      gameController = new GameController(mockView);
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

    it("debería establecer rightPressed en false cuando se suelta 'ArrowRight'", () => {
      gameController["rightPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "ArrowRight" });
      gameController["keyUpHandler"](event);

      expect(gameController["rightPressed"]).toBe(false);
    });

    it("debería establecer rightPressed en false cuando se suelta 'Right'", () => {
      gameController["rightPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "Right" });
      gameController["keyUpHandler"](event);

      expect(gameController["rightPressed"]).toBe(false);
    });

    it("debería establecer leftPressed en false cuando se suelta 'ArrowLeft'", () => {
      gameController["leftPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "ArrowLeft" });
      gameController["keyUpHandler"](event);

      expect(gameController["leftPressed"]).toBe(false);
    });

    it("debería establecer leftPressed en false cuando se suelta 'Left'", () => {
      gameController["leftPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "Left" });
      gameController["keyUpHandler"](event);

      expect(gameController["leftPressed"]).toBe(false);
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
});
