import { Paddle } from "../../src/model/Paddle";

// Descripción de las pruebas para la clase Paddle
describe("Paddle", () => {
  // Prueba para verificar que el ancho de la pala se asigna correctamente
  it("debería asignar el ancho de la pala (paddleWidth) correctamente", () => {
    const paddle = new Paddle(100, 20, 50, 200); // Crea una pala con ancho 100
    expect(paddle.paddleWidth).toBe(100); // Verifica que el ancho de la pala sea 100
  });

  // Prueba para verificar que la altura de la pala se asigna correctamente
  it("debería asignar la altura de la pala (paddleHeight) correctamente", () => {
    const paddle = new Paddle(100, 20, 50, 200); // Crea una pala con altura 20
    expect(paddle.paddleHeight).toBe(20); // Verifica que la altura de la pala sea 20
  });

  // Prueba para verificar que la posición X de la pala se asigna correctamente
  it("debería asignar la posición X de la pala (paddleX) correctamente", () => {
    const paddle = new Paddle(100, 20, 50, 200); // Crea una pala en X = 50
    expect(paddle.paddleX).toBe(50); // Verifica que la posición X de la pala sea 50
  });

  // Prueba para verificar que la posición Y de la pala se asigna correctamente
  it("debería asignar la posición Y de la pala (paddleY) correctamente", () => {
    const paddle = new Paddle(100, 20, 50, 200); // Crea una pala en Y = 200
    expect(paddle.paddleY).toBe(200); // Verifica que la posición Y de la pala sea 200
  });

  // Descripción de las pruebas para la detección de colisiones con los bordes del canvas
  describe("Paddle: checkCollisionCanvas", () => {
    let paddle: Paddle;

    // Configuración de la pala antes de cada prueba
    beforeEach(() => {
      // Paddle de 50px de ancho y 10px de alto, posición inicial (100, 380)
      paddle = new Paddle(50, 10, 100, 380);
    });

    // Verifica que no haya colisión cuando la pala está lejos del borde derecho
    it("debería detectar que no hay colisión en el borde derecho cuando el paddle está lejos del borde del canvas", () => {
      paddle.paddleX = 200; // Lejos del borde derecho
      expect(paddle.checkCollisionCanvasRight()).toBe(true);
    });

    // Verifica que haya colisión cuando la pala está en el borde derecho
    it("debería detectar colisión en el borde derecho cuando el paddle está al borde del canvas", () => {
      paddle.paddleX = 398; // En el límite derecho (canvasWidth - paddleWidth)
      expect(paddle.checkCollisionCanvasRight()).toBe(false);
    });

    // Verifica que no haya colisión cuando la pala está lejos del borde izquierdo
    it("debería detectar que no hay colisión en el borde izquierdo cuando el paddle está lejos del borde izquierdo", () => {
      paddle.paddleX = 100; // Lejos del borde izquierdo
      expect(paddle.checkCollisionCanvasLeft()).toBe(true);
    });

    // Verifica que haya colisión cuando la pala está en el borde izquierdo
    it("debería detectar colisión en el borde izquierdo cuando el paddle está al borde del canvas", () => {
      paddle.paddleX = 0; // En el límite izquierdo
      expect(paddle.checkCollisionCanvasLeft()).toBe(false);
    });

    // Verifica que no haya colisión en el borde derecho para una posición intermedia dentro del canvas
    it("debería detectar que no hay colisión en el borde derecho para una posición intermedia dentro del canvas", () => {
      paddle.paddleX = 300; // Posición intermedia
      expect(paddle.checkCollisionCanvasRight()).toBe(true);
    });

    // Verifica que no haya colisión en el borde izquierdo para una posición intermedia dentro del canvas
    it("debería detectar que no hay colisión en el borde izquierdo para una posición intermedia dentro del canvas", () => {
      paddle.paddleX = 200; // Posición intermedia
      expect(paddle.checkCollisionCanvasLeft()).toBe(true);
    });
  });

  /// Descripción de las pruebas para la función checkCollision
  describe("Paddle: checkCollision", () => {
    let paddle: Paddle;

    // Configuración de la pala antes de cada prueba
    beforeEach(() => {
      paddle = new Paddle(50, 10, 100, 380);
    });

    // Verifica que no haya errores al ejecutar checkCollision
    it("debería ejecutar checkCollision sin errores", () => {
      expect(() => paddle.checkCollision()).not.toThrow();
    });

    // Verifica que se llamen a checkCollisionCanvasRight y checkCollisionCanvasLeft
    it("debería llamar a checkCollisionCanvasRight y checkCollisionCanvasLeft", () => {
      jest.spyOn(paddle, "checkCollisionCanvasRight"); // Espía checkCollisionCanvasRight
      jest.spyOn(paddle, "checkCollisionCanvasLeft"); // Espía checkCollisionCanvasLeft

      paddle.checkCollision();

      expect(paddle.checkCollisionCanvasRight).toHaveBeenCalled();
      expect(paddle.checkCollisionCanvasLeft).toHaveBeenCalled();
    });

    // Verifica que se asignen correctamente las colisiones
    it("debería assignar collisionRight y collisionLeft de manera correcta", () => {
      jest.spyOn(paddle, "checkCollisionCanvasRight").mockReturnValue(true); // Simula que checkCollisionCanvasRight devuelve true
      jest.spyOn(paddle, "checkCollisionCanvasLeft").mockReturnValue(false); // Simula que checkCollisionCanvasLeft devuelve false

      paddle.checkCollision();

      expect(paddle["collisionRight"]).toBe(true);
      expect(paddle["collisionLeft"]).toBe(false);
    });
  });

  // Descripción de las pruebas para el movimiento de la pala
  describe("move", () => {
    let paddle: Paddle;

    beforeEach(() => {
      paddle = new Paddle(50, 10, 100, 380);
      paddle["PADDLE_SENSITIVITY"] = 10; // Sensibilidad de la pala
      paddle["paddleX"] = 50; // Posición inicial
      paddle["collisionRight"] = true; // Colisión derecha
      paddle["collisionLeft"] = false; // Sin colisión izquierda
    });

    // Verifica que la pala se mueva a la derecha cuando se presiona la tecla de derecha
    it("debería mover el paddle a la derecha cuando rightPressed es true y collisionRight es true", () => {
      paddle.move(true, false); // Mover a la derecha
      expect(paddle["paddleX"]).toBe(60); // paddleX + PADDLE_SENSITIVITY
    });

    // Las combinaciones de las diferentes condiciones cumplen un condition coverage del 100%
    it("debería mover el paddle a la izquierda cuando leftPressed es true y collisionLeft es true", () => {
      paddle["collisionRight"] = false; // Reset colisión derecha
      paddle["collisionLeft"] = true;

      paddle.move(false, true); // Mover a la izquierda
      expect(paddle["paddleX"]).toBe(40); // paddleX - PADDLE_SENSITIVITY
    });

    // Verifica que la pala no se mueva si no hay colisión en la dirección respectiva
    it("no debería mover el paddle si no hay colisión en la respectiva dirección", () => {
      paddle["collisionRight"] = false; // Sin colisión derecha
      paddle["collisionLeft"] = false; // Sin colisión izquierda

      paddle.move(true, false); // Mover a la derecha
      expect(paddle["paddleX"]).toBe(50); // No movimiento a la derecha

      paddle.move(false, true);
      expect(paddle["paddleX"]).toBe(50); // No movimiento a la izquierda
    });

    // Verifica que la pala no se mueva si no se presiona ninguna tecla
    it("debería moverse solo en la dirección permitida por la colisión cuando ambas teclas están presionadas", () => {
      paddle["collisionRight"] = true; // Colisión derecha
      paddle["collisionLeft"] = false; // Sin colisión izquierda

      paddle.move(true, true); // Mover a la derecha
      expect(paddle["paddleX"]).toBe(60); // Se mueve a la derecha

      paddle["collisionRight"] = false; // Sin colisión derecha
      paddle["collisionLeft"] = true; // Colisión izquierda

      paddle.move(true, true); // Mover a la izquierda
      expect(paddle["paddleX"]).toBe(50); // Se mueve a la izquierda desde 60 -> 50
    });
  });

  //-------------------------------------------------------------------------------------------------------------
  //-------------------- TESTS PARTICIONES EQUIVALENTES, VALORES LÍMITE Y VALORES FRONTERA ----------------------
  //-------------------------------------------------------------------------------------------------------------

  describe("Paddle - Particiones Equivalentes", () => {
    let paddle: Paddle;

    beforeEach(() => {
      paddle = new Paddle(50, 10, 100, 380); // Pala inicial
      paddle.canvasWidth = 448;
      paddle.PADDLE_SENSITIVITY = 10;
    });

    // Pruebas para el constructor con valores válidos
    describe("Constructor - Propiedades iniciales", () => {
      it("debería inicializar correctamente con dimensiones válidas", () => {
        paddle = new Paddle(50, 10, 100, 380); // Valores válidos
        expect(paddle.paddleWidth).toBe(50);
        expect(paddle.paddleHeight).toBe(10);
        expect(paddle.paddleX).toBe(100);
        expect(paddle.paddleY).toBe(380);
      });

      // Pruebas para el constructor con valores
      it("debería manejar dimensiones inválidas (negativas)", () => {
        paddle = new Paddle(-50, -10, 100, 380); // Dimensiones negativas
        expect(paddle.paddleWidth).toBe(-50); // Ancho negativo
        expect(paddle.paddleHeight).toBe(-10); // Alto negativo
      });

      it("debería manejar posiciones iniciales fuera del rango del canvas", () => {
        paddle = new Paddle(50, 10, 500, 380); // Fuera del canvas
        expect(paddle.paddleX).toBe(500); // Posición X fuera del canvas
      });
    });

    // Pruebas para checkCollisionCanvasRight
    describe("checkCollisionCanvasRight", () => {
      // Pruebas para el borde derecho
      it("debería permitir movimiento cuando la pala está completamente dentro del borde derecho", () => {
        paddle.paddleX = 300; // paddleX + paddleWidth < canvasWidth
        expect(paddle.checkCollisionCanvasRight()).toBe(true);
      });

      // Pruebas para el borde derecho
      it("debería detectar colisión cuando la pala está tocando el borde derecho", () => {
        paddle.paddleX = 398; // paddleX + paddleWidth === canvasWidth
        expect(paddle.checkCollisionCanvasRight()).toBe(false);
      });

      // Pruebas para el borde derecho
      it("debería detectar colisión cuando la pala está más allá del borde derecho", () => {
        paddle.paddleX = 400; // paddleX + paddleWidth > canvasWidth
        expect(paddle.checkCollisionCanvasRight()).toBe(false);
      });
    });

    // Pruebas para checkCollisionCanvasLeft
    describe("checkCollisionCanvasLeft", () => {
      // Pruebas para el borde izquierdo
      it("debería permitir movimiento cuando la pala está completamente dentro del borde izquierdo", () => {
        paddle.paddleX = 100; // paddleX > 0
        expect(paddle.checkCollisionCanvasLeft()).toBe(true);
      });

      // Pruebas para el borde izquierdo
      it("debería detectar colisión cuando la pala está tocando el borde izquierdo", () => {
        paddle.paddleX = 0; // paddleX === 0
        expect(paddle.checkCollisionCanvasLeft()).toBe(false);
      });

      // Pruebas para el borde izquierdo
      it("debería detectar colisión cuando la pala está más allá del borde izquierdo", () => {
        paddle.paddleX = -1; // paddleX < 0
        expect(paddle.checkCollisionCanvasLeft()).toBe(false);
      });
    });

    // Pruebas para move
    describe("move", () => {
      beforeEach(() => {
        paddle.collisionRight = true;
        paddle.collisionLeft = true;
      });

      // Pruebas para moverse a la derecha
      it("debería moverse a la derecha si collisionRight es true", () => {
        paddle.move(true, false);
        expect(paddle.paddleX).toBe(110); // paddleX + PADDLE_SENSITIVITY
      });

      // Pruebas para moverse a la izquierda
      it("debería moverse a la izquierda si collisionLeft es true", () => {
        paddle.move(false, true);
        expect(paddle.paddleX).toBe(90); // paddleX - PADDLE_SENSITIVITY
      });

      // Pruebas para no moverse
      it("no debería moverse si ambas colisiones son falsas", () => {
        paddle.collisionRight = false; // Sin colisión derecha
        paddle.collisionLeft = false; // Sin colisión izquierda
        paddle.move(true, false);
        expect(paddle.paddleX).toBe(100); // Sin movimiento
      });

      // Pruebas para moverse solo en la dirección permitida
      it("debería moverse correctamente solo en la dirección permitida cuando ambas teclas están presionadas", () => {
        paddle.collisionRight = true;
        paddle.collisionLeft = false;
        paddle.move(true, true);
        expect(paddle.paddleX).toBe(110); // Se mueve solo a la derecha
      });

      // Pruebas para moverse solo en la dirección permitida
      it("debería moverse correctamente cuando ninguna tecla está presionada", () => {
        paddle.move(false, false);
        expect(paddle.paddleX).toBe(100); // Sin movimiento
      });
    });
  });

  // Pruebas para los límites y fronteras de la pala
  describe("Paddle - Límites y Fronteras", () => {
    let paddle: Paddle;

    beforeEach(() => {
      paddle = new Paddle(50, 10, 100, 380); // Paddle inicial
      paddle["PADDLE_SENSITIVITY"] = 10;
    });

    // Pruebas para el constructor
    describe("Constructor", () => {
      // Pruebas para valores límite
      it("debería inicializar correctamente dentro de los valores frontera", () => {
        const paddle = new Paddle(1, 1, 0, 0); // Frontera inferior
        expect(paddle.paddleWidth).toBe(1);
        expect(paddle.paddleHeight).toBe(1);
        expect(paddle.paddleX).toBe(0);
        expect(paddle.paddleY).toBe(0);
      });

      // Pruebas para valores límite
      it("debería manejar valores límite justo por debajo de la frontera inferior", () => {
        const paddle = new Paddle(-1, -1, -1, -1); // Límite inferior
        expect(paddle.paddleWidth).toBe(-1);
        expect(paddle.paddleHeight).toBe(-1);
      });

      // Pruebas para valores frontera
      it("debería manejar valores frontera superiores razonables", () => {
        const paddle = new Paddle(100, 20, 448, 380); // Frontera superior
        expect(paddle.paddleWidth).toBe(100);
        expect(paddle.paddleX).toBe(448);
      });
    });

    // Pruebas para checkCollisionCanvasRight
    describe("checkCollisionCanvasRight", () => {
      // Pruebas para valores frontera derecha
      it("debería detectar colisión justo en la frontera derecha", () => {
        paddle.paddleX = 398; // paddleX + paddleWidth === canvasWidth
        expect(paddle.checkCollisionCanvasRight()).toBe(false);
      });

      // Pruebas para valores frontera derecha
      it("debería permitir movimiento justo por debajo de la frontera derecha", () => {
        paddle.paddleX = 397; // paddleX + paddleWidth === canvasWidth - 1
        expect(paddle.checkCollisionCanvasRight()).toBe(true);
      });

      // Pruebas para valores frontera derecha
      it("debería detectar colisión justo por encima de la frontera derecha", () => {
        paddle.paddleX = 399; // paddleX + paddleWidth === canvasWidth + 1
        expect(paddle.checkCollisionCanvasRight()).toBe(false);
      });
    });

    // Pruebas para checkCollisionCanvasLeft
    describe("checkCollisionCanvasLeft", () => {
      // Pruebas para valores frontera izquierda
      it("debería detectar colisión justo en la frontera izquierda", () => {
        paddle.paddleX = 0; // paddleX === 0
        expect(paddle.checkCollisionCanvasLeft()).toBe(false);
      });

      // Pruebas para valores frontera izquierda
      it("debería permitir movimiento justo por encima de la frontera izquierda", () => {
        paddle.paddleX = 1; // paddleX === 1
        expect(paddle.checkCollisionCanvasLeft()).toBe(true);
      });

      // Pruebas para valores frontera izquierda
      it("debería detectar colisión justo por debajo de la frontera izquierda", () => {
        paddle.paddleX = -1; // paddleX === -1
        expect(paddle.checkCollisionCanvasLeft()).toBe(false);
      });
    });

    // Pruebas para move
    describe("move", () => {
      // Pruebas para valores frontera
      it("debería moverse correctamente dentro de los valores frontera", () => {
        paddle.collisionRight = true; // Colisión derecha
        paddle.move(true, false);
        expect(paddle.paddleX).toBe(110); // paddleX + PADDLE_SENSITIVITY
      });

      // Pruebas para valores frontera
      it("no debería moverse más allá de los valores frontera", () => {
        paddle.paddleX = 398; // Frontera derecha
        paddle.collisionRight = false; // Sin colisión derecha
        paddle.move(true, false);
        expect(paddle.paddleX).toBe(398); // No debería moverse
      });

      // Pruebas para valores limite
      it("debería detectar movimiento correcto en los valores límite", () => {
        paddle.paddleX = 1; // Frontera izquierda superior
        paddle.collisionLeft = true;
        paddle.move(false, true);
        expect(paddle.paddleX).toBe(-9); // paddleX - PADDLE_SENSITIVITY
      });
    });
  });
});
