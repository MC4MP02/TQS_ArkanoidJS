import { GameController } from "../../src/controllers/GameController";
import { GameView } from "../../src/view/GameView";
import { Ball } from "../../src/model/Ball";
import { Paddle } from "../../src/model/Paddle";
import { Map } from "../../src/model/Map";
import { Brick } from "../../src/model/Brick";

// Mocks automaticos de las clases importadas
jest.mock("../../src/view/GameView");
jest.mock("../../src/model/Ball");
jest.mock("../../src/model/Paddle");

// Mock de la clase Paddle MANUAL
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
    mockCanvas = document.createElement("canvas"); // Crea un canvas falso
    mockCtx = {
      // Mock del contexto del canvas
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
      return 0; // Retorna un ID de frame ficticio para detenerlo
    });

    gameViewMock = {
      // Mock de GameView
      clearCanvas: jest.fn(), // Mock de clearCanvas
      drawBall: jest.fn(), // Mock de drawBall
      drawMap: jest.fn(), // Mock de drawMap
      drawPaddle: jest.fn(),
      loadCanvas: jest.fn(),
      render: jest.fn(),
      updateScore: jest.fn(),
      sprite: document.createElement("img"),
    } as any;

    BallMock = {
      // Mock de Ball
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      radius: 5,
      move: jest.fn(),
      checkCollision: jest.fn(),
    } as unknown as jest.Mocked<Ball>;

    MapMock = {
      // Mock de Map
      bricks: [],
      initializeMap: jest.fn(),
      checkCollision: jest.fn(),
    } as unknown as jest.Mocked<Map>;

    gameControllerMock = new GameController(gameViewMock); // Crea una instancia de GameController
    gameControllerMock["isTesting"] = true; // Evitar que se llame a requestAnimationFrame
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
    const renderSpy = jest.spyOn(gameViewMock, "render"); // Spy sobre el método render

    // Renderizamos la escena
    gameViewMock.render(BallMock, paddleMock, MapMock);
    expect(renderSpy).toHaveBeenCalled();
  });

  it("debería devolver la variable isRunning", () => {
    gameControllerMock["isRunning"] = true; // Establece isRunning en true
    expect(gameControllerMock.getIsRunning()).toBe(true); // Comprueba que isRunning sea true
    gameControllerMock["isRunning"] = false; // Establece isRunning en false
    expect(gameControllerMock.getIsRunning()).toBe(false); // Comprueba que isRunning sea false
  });

  describe("initEvents", () => {
    let addEventListenerSpy: jest.SpyInstance; // Definir Spy para addEventListener

    beforeEach(() => {
      addEventListenerSpy = jest.spyOn(document, "addEventListener"); // Crear un Spy para addEventListener
    });

    afterEach(() => {
      addEventListenerSpy.mockRestore(); // Restaurar el Spy después de cada prueba
    });

    it('debería registrar un evento "keydown"', () => {
      const mockView = {} as GameView; // Mock básico de GameView
      new GameController(mockView); // Deberia llamar automaticamente al initEvents

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        // Verificar que se llamó a addEventListener con "keydown"
        "keydown",
        expect.any(Function)
      );
    });

    it('debería registrar un evento "keyup"', () => {
      const mockView = {} as GameView; // Mock básico de GameView
      new GameController(mockView); // Deberia llamar automaticamente al initEvents

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        // Verificar que se llamó a addEventListener con "keyup"
        "keyup",
        expect.any(Function)
      );
    });

    it("debería vincular los manejadores de eventos al contexto de GameController", () => {
      const mockView = {} as GameView; // Mock básico de GameView
      const gameController = new GameController(mockView); // Deberia llamar automaticamente al initEvents

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
        // Mock de GameView
        clearCanvas: jest.fn(),
        render: jest.fn(),
        updateScore: jest.fn(),
      } as unknown as GameView;

      gameController = new GameController(mockView);
      gameController["isTesting"] = true; // Evitar que se llame a requestAnimationFrame
    });

    it("debería establecer rightPressed en true cuando se presiona 'ArrowRight'", () => {
      const event = new KeyboardEvent("keydown", { key: "ArrowRight" }); // Crear un evento de teclado
      gameController["keyDownHandler"](event); // Llamar al manejador de eventos

      expect(gameController["rightPressed"]).toBe(true); // Verificar que rightPressed sea true
    });

    it("debería establecer leftPressed en true cuando se presiona 'ArrowLeft'", () => {
      const event = new KeyboardEvent("keydown", { key: "ArrowLeft" }); // Crear un evento de teclado
      gameController["keyDownHandler"](event); // Llamar al manejador de eventos

      expect(gameController["leftPressed"]).toBe(true); // Verificar que leftPressed sea true
    });

    it("debería iniciar el juego si se presiona la barra espaciadora cuando startGame es true y isRunning es false", () => {
      const startGameMethodSpy = jest.spyOn(gameController, "startGameMethod"); // Spy sobre startGameMethod
      gameController["startGame"] = true; // Establecer startGame en true
      gameController["isRunning"] = false; // Establecer isRunning en false

      const event = new KeyboardEvent("keydown", { key: " " }); // Crear un evento de teclado
      gameController["keyDownHandler"](event); // Llamar al manejador de eventos

      expect(startGameMethodSpy).toHaveBeenCalled(); // Verificar que se llamó a startGameMethod
      expect(gameController["isRunning"]).toBe(true); // Verificar que isRunning sea true
    });

    it("debería detener el juego si se presiona la barra espaciadora cuando isRunning es true", () => {
      gameController["startGame"] = true; // Establecer startGame en true
      gameController["isRunning"] = true; // Establecer isRunning en true

      const event = new KeyboardEvent("keydown", { key: " " }); // Crear un evento de teclado
      gameController["keyDownHandler"](event); // Llamar al manejador de eventos

      expect(gameController["isRunning"]).toBe(false); // Verificar que isRunning sea false
    });

    it("no debería cambiar propiedades para teclas irrelevantes", () => {
      const event = new KeyboardEvent("keydown", { key: "A" }); // Crear un evento de teclado con tecla irrelevante
      gameController["keyDownHandler"](event); // Llamar al manejador de eventos

      expect(gameController["rightPressed"]).toBe(false); // Verificar que rightPressed sea false
      expect(gameController["leftPressed"]).toBe(false); // Verificar que leftPressed sea false
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
      const event = new KeyboardEvent("keyup", { key: "ArrowRight" }); // Creamos un evento de teclado
      gameController["keyUpHandler"](event); // Llamar al manejador de eventos

      expect(gameController["rightPressed"]).toBe(false); // Verificar que rightPressed sea false
    });

    it("no debería establecer rightPressed en false cuando no es 'ArrowRight'", () => {
      gameController["rightPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "NotArrowRight" }); //Forzamos que la key === ArrowRight de false
      gameController["keyUpHandler"](event);

      expect(gameController["rightPressed"]).not.toBe(false);
    });

    it("debería establecer rightPressed en false cuando se suelta 'Right'", () => {
      gameController["rightPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "Right" }); // Creamos un evento de teclado
      gameController["keyUpHandler"](event); // Llamar al manejador de eventos

      expect(gameController["rightPressed"]).toBe(false);
    });

    it("no debería establecer rightPressed en false cuando no es 'Right'", () => {
      gameController["rightPressed"] = true; // Simulamos que estaba presionado
      const event = new KeyboardEvent("keyup", { key: "NotRight" }); //Forzamos que la key === Right de false
      gameController["keyUpHandler"](event);

      expect(gameController["rightPressed"]).not.toBe(false); // Verificar que rightPressed no sea false
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

      expect(gameController["leftPressed"]).not.toBe(false); // Verificar que leftPressed no sea false
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
      const event = new KeyboardEvent("keyup", { key: "A" }); // Crear un evento de teclado con tecla irrelevante
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
      // Configuración inicial
      mockBall = new Ball(0, 0, 0, 0, 0) as jest.Mocked<Ball>; // Crear un mock de Ball con Jest, del tipo Jest.Mocked<Ball>
      mockPaddle = new Paddle(0, 0, 0, 0) as jest.Mocked<Paddle>; // Crear un mock de Paddle con Jest, del tipo Jest.Mocked<Paddle>
      mockMap = new Map() as jest.Mocked<Map>; // Crear un mock de Map con Jest, del tipo Jest.Mocked<Map>
      mockView = {} as jest.Mocked<GameView>; // Crear un mock vacio de GameView con Jest, del tipo Jest.Mocked<GameView>

      gameController = new GameController(mockView);
      gameController["ball"] = mockBall; // Establecer el mock de Ball
      gameController["paddle"] = mockPaddle; // Establecer el mock de Paddle
      gameController["map"] = mockMap; // Establecer el mock de Map
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
        // Mock de GameView
        clearCanvas: jest.fn(),
        render: jest.fn(),
      };

      mockBall = {
        // Mock de Ball
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        radius: 5,
        move: jest.fn(),
        checkCollision: jest.fn(),
      } as unknown as jest.Mocked<Ball>;

      mockMap = {
        // Mock de Map
        bricks: [],
        initializeMap: jest.fn(),
        checkCollision: jest.fn(),
      } as unknown as jest.Mocked<Map>;

      mockPaddle = {
        // Mock de Paddle
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
      controller["checkCollisions"] = jest.fn(); // Mockear checkCollisions
      controller["ballMove"] = jest.fn(); // Mockear ballMove
      controller["paddleMove"] = jest.fn(); // Mockear paddleMove
      controller["ball"] = mockBall; // Establecer el mock de Ball
      controller["paddle"] = mockPaddle; // Establecer el mock de Paddle
      controller["map"] = mockMap; // Establecer el mock de Map

      controller["isTesting"] = true; // Evitar que se llame a requestAnimationFrame
    });

    afterEach(() => {
      jest.restoreAllMocks(); // Restaurar todos los mocks después de cada prueba
    });

    it("debería llamar a clearCanvas cuando gameLoop es ejecutado", () => {
      controller["isRunning"] = true; // Establecer isRunning en true
      controller["startGame"] = true; // Establecer startGame en true

      controller["gameLoop"](); // Llamamos a la función

      expect(mockView.clearCanvas).toHaveBeenCalled(); // Verificar que se llamó a clearCanvas
    });

    it("debería llamar a render con ball, paddle y map cuando gameLoop es ejecutado", () => {
      controller["isRunning"] = true; // Establecer isRunning en true
      controller["startGame"] = true; // Establecer startGame en true

      controller["gameLoop"](); // Llamamos a la función

      expect(mockView.render).toHaveBeenCalledWith(
        // Verificar que se llamó a render con los objetos correctos
        controller["ball"],
        controller["paddle"],
        controller["map"]
      );
    });

    it("no debería llamar a clearCanvas ni render si startGame es false", () => {
      controller["isRunning"] = true; // Establecer isRunning en true
      controller["startGame"] = false; // Establecer startGame en false

      controller["gameLoop"](); // Llamamos a la función

      expect(mockView.clearCanvas).not.toHaveBeenCalled(); // Verificar que clearCanvas no se llamó
      expect(mockView.render).not.toHaveBeenCalled(); // Verificar que render no se llamó
    });

    it("debería llamar a checkCollisions, ballMove y paddleMove si game está en ejecución", () => {
      controller["isRunning"] = true; // Establecer isRunning en true
      controller["startGame"] = true; // Establecer startGame en true

      controller["gameLoop"](); // Llamamos a la función

      expect(controller["checkCollisions"]).toHaveBeenCalled(); // Verificar que checkCollisions se llamó
      expect(controller["ballMove"]).toHaveBeenCalled(); // Verificar que ballMove se llamó
      expect(controller["paddleMove"]).toHaveBeenCalled(); // Verificar que paddleMove se llamó
    });

    it("debería llamar a requestAnimationFrame si isTesting es false y isRunning es true", () => {
      // Mockear requestAnimationFrame
      const requestAnimationFrameMock = jest
        .spyOn(window, "requestAnimationFrame")
        .mockImplementation((cb) => {
          // Llamar al callback solo una vez
          setTimeout(() => cb(0), 0);
          return 0; // Retornar un ID de frame ficticio para detenerlo
        });

      // Configurar estado
      controller["isRunning"] = true;
      controller["startGame"] = true;
      controller["isTesting"] = false;

      // Llamar al método que inicia el bucle
      controller["gameLoop"]();

      // Verificar que se llama a requestAnimationFrame
      expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);

      requestAnimationFrameMock.mockRestore(); // Restaurar el mock por seguridad
    });

    // PAIRWISE TESTING
    describe("Pairwise Testing de gameLoop", () => {
      // Casos de prueba
      const testCases = [
        { startGame: true, isRunning: true },
        { startGame: true, isRunning: false },
        { startGame: false, isRunning: true },
        { startGame: false, isRunning: false },
      ];

      testCases.forEach(({ startGame, isRunning }) => {
        // Crear un caso de prueba para cada combinación de valores
        it(`debería manejar startGame=${startGame} y isRunning=${isRunning}`, () => {
          controller["startGame"] = startGame; // Configurar startGame
          controller["isRunning"] = isRunning; // Configurar isRunning

          controller["gameLoop"](); // Llamar al método

          if (startGame && isRunning) {
            // Si startGame y isRunning son true
            expect(mockView.clearCanvas).toHaveBeenCalled(); // Se llama a clearCanvas
            expect(mockView.render).toHaveBeenCalledWith(
              // Se llama a render con los objetos correctos
              controller["ball"],
              controller["paddle"],
              controller["map"]
            );
          } else {
            // Si startGame o isRunning son false
            expect(mockView.clearCanvas).not.toHaveBeenCalled(); // No se llama a clearCanvas
            expect(mockView.render).not.toHaveBeenCalled(); // No se llama a render
          }
        });
      });
    });
  });

  describe("ballMove", () => {
    let controller: GameController;
    let mockBall: jest.Mocked<Ball>;

    beforeEach(() => {
      mockBall = {
        // Mock de Ball
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        radius: 5,
        move: jest.fn(),
        checkCollision: jest.fn(),
      } as unknown as jest.Mocked<Ball>;

      controller = new GameController({} as GameView);
      controller["ball"] = mockBall; // Establecer el mock de Ball
    });

    it("debería llamar a move de la bola", () => {
      controller["ballMove"]();

      expect(mockBall.move).toHaveBeenCalled(); // Verificar que se llamó a move de la bola
    });
  });

  describe("paddleMove", () => {
    let controller: GameController;
    let mockPaddle: jest.Mocked<Paddle>;

    beforeEach(() => {
      mockPaddle = {
        // Mock de Paddle
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

      controller = new GameController({} as GameView); // Crear una instancia de GameController con un mock vacío de GameView
      controller["paddle"] = mockPaddle;
    });

    it("debería llamar a move del paddle", () => {
      controller["paddleMove"]();

      expect(mockPaddle.move).toHaveBeenCalled(); // Verificar que se llamó a move del paddle
    });
  });

  describe("startGameMethod", () => {
    let controller: GameController;
    let mockView: jest.Mocked<GameView>;
    let mockMap: jest.Mocked<Map>;

    beforeEach(() => {
      mockView = {
        // Mock de GameView
        updateScore: jest.fn(),
        clearCanvas: jest.fn(),
        render: jest.fn(),
      } as unknown as jest.Mocked<GameView>;

      (Ball as jest.Mock) = jest.fn().mockImplementation(() => ({
        // Mock de Ball para pdoer observar el constructor
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        radius: 5,
        move: jest.fn(),
        checkCollision: jest.fn(),
        ballDownMap: jest.fn(),
      }));

      (Paddle as jest.Mock) = jest.fn().mockImplementation(() => ({
        // Mock de Paddle para pdoer observar el constructor
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
      }));

      mockMap = {
        // Mock de Map
        bricks: [],
        initializeMap: jest.fn(),
        checkCollision: jest.fn(),
        selectLevel: jest.fn(),
        getBricks: jest.fn(),
        getBrickColumnCount: jest.fn(),
      } as unknown as jest.Mocked<Map>;

      controller = new GameController(mockView);
      controller["map"] = mockMap; // Establecer el mock de Map
      controller["isTesting"] = true; // Evitar que se llame a requestAnimationFrame
    });

    it("debería inicializar la puntuación correctamente", () => {
      const updateScoreMock = jest.spyOn(controller["view"], "updateScore");

      controller["startGameMethod"]();

      expect(updateScoreMock).toHaveBeenCalledWith(controller["score"]); // Verificar que se llamó a updateScore con la puntuación inicial
      updateScoreMock.mockRestore();
    });

    it("debería inicializar las propiedades correctamente", () => {
      // Mockear gameLoop
      controller["gameLoop"] = jest.fn();

      // Llamar al método startGameMethod
      controller["startGameMethod"]();

      // Verificar que las propiedades están correctamente inicializadas
      expect(controller["isRunning"]).toBe(true);
      expect(controller["startGame"]).toBe(true);

      // Verificar que se ha creado una bola con las propiedades correctas
      expect(Ball).toHaveBeenCalledWith(
        controller["canvasWidth"] / 2,
        controller["canvasHeight"] - 40,
        4,
        1,
        -1
      );

      // Verificar que se ha creado la paleta con las propiedades correctas
      expect(Paddle).toHaveBeenCalledWith(
        50,
        10,
        (controller["canvasWidth"] - 50) / 2,
        controller["canvasHeight"] - 10 - 20
      );

      // Verificar que se llama a selectLevel
      expect(mockMap.selectLevel).toHaveBeenCalled();

      // Verificar que gameLoop se llama
      expect(controller["gameLoop"]).toHaveBeenCalled();
    });
  });

  describe("mapCollision", () => {
    let controller: GameController;
    let mockView: jest.Mocked<GameView>;
    let mockMap: jest.Mocked<Map>;
    let mockBall: jest.Mocked<Ball>;
    let mockBrick: jest.Mocked<Brick>;

    beforeEach(() => {
      mockView = {
        // Mock de GameView
        updateScore: jest.fn(),
      } as unknown as jest.Mocked<GameView>;

      mockBall = {
        // Mock de Ball
        x: 10,
        y: 10,
        changeY: jest.fn(),
      } as unknown as jest.Mocked<Ball>;

      mockBrick = {
        // Mock de Brick
        isHit: jest.fn(() => true),
        hit: jest.fn(),
      } as unknown as jest.Mocked<Brick>;

      mockMap = {
        // Mock de Map
        getBricks: jest.fn(() => [[mockBrick]]),
        getBrickColumnCount: jest.fn(() => 1),
        getBrickRowCount: jest.fn(() => 1),
        getBrickWidth: jest.fn(() => 10),
        getBrickHeigth: jest.fn(() => 10),
      } as unknown as jest.Mocked<Map>;

      controller = new GameController(mockView);
      controller["map"] = mockMap;
      controller["ball"] = mockBall;
    });

    it("debería actualizar la puntuación cuando un ladrillo es golpeado", () => {
      controller["mapCollision"]();
      expect(mockView.updateScore).toHaveBeenCalledWith(100); // Verificar que se llamó a updateScore con la puntuación correcta
    });

    it("debería llamar a hit en el ladrillo cuando la bola lo golpea", () => {
      controller["mapCollision"]();
      expect(mockBrick.hit).toHaveBeenCalled(); // Verificar que se llamó a hit en el ladrillo
    });

    it("no debería actualizar la puntuación si la bola no golpea el ladrillo", () => {
      mockBrick.isHit.mockReturnValueOnce(false); // Hacer que isHit devuelva false
      controller["mapCollision"]();
      expect(mockView.updateScore).not.toHaveBeenCalled(); // Verificar que no se llamó a updateScore
    });

    it("debería llamar a changeY cuando un ladrillo es golpeado", () => {
      controller["mapCollision"]();
      expect(mockBall.changeY).toHaveBeenCalled(); // Verificar que se llamó a changeY
    });

    it("no debería llamar a changeY si la bola no golpea el ladrillo", () => {
      mockBrick.isHit.mockReturnValueOnce(false); // Hacer que isHit devuelva false
      controller["mapCollision"]();
      expect(mockBall.changeY).not.toHaveBeenCalled(); // Verificar que no se llamó a changeY
    });
  });
});
