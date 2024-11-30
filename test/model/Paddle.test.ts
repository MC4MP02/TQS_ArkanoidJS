import { Paddle } from "../../src/model/Paddle";

describe("Paddle", () => {
  it("debería asignar el ancho de la pala (paddleWidth) correctamente", () => {
    const paddle = new Paddle(100, 20, 50, 200);
    expect(paddle.paddleWidth).toBe(100);
  });
  it("debería asignar la altura de la pala (paddleHeight) correctamente", () => {
    const paddle = new Paddle(100, 20, 50, 200);
    expect(paddle.paddleHeight).toBe(20);
  });
  it("debería asignar la posición X de la pala (paddleX) correctamente", () => {
    const paddle = new Paddle(100, 20, 50, 200);
    expect(paddle.paddleX).toBe(50);
  });
  it("debería asignar la posición Y de la pala (paddleY) correctamente", () => {
    const paddle = new Paddle(100, 20, 50, 200);
    expect(paddle.paddleY).toBe(200);
  });

  describe("Paddle: checkCollisionCanvas", () => {
    let paddle: Paddle;

    beforeEach(() => {
      // Paddle de 50px de ancho y 10px de alto, posición inicial (100, 380)
      paddle = new Paddle(50, 10, 100, 380);
    });

    it("debería detectar que no hay colisión en el borde derecho cuando el paddle está lejos del borde del canvas", () => {
      paddle.paddleX = 200; // Lejos del borde derecho
      expect(paddle.checkCollisionCanvasRight()).toBe(true);
    });

    it("debería detectar colisión en el borde derecho cuando el paddle está al borde del canvas", () => {
      paddle.paddleX = 398; // En el límite derecho (canvasWidth - paddleWidth)
      expect(paddle.checkCollisionCanvasRight()).toBe(false);
    });

    it("debería detectar que no hay colisión en el borde izquierdo cuando el paddle está lejos del borde izquierdo", () => {
      paddle.paddleX = 100; // Lejos del borde izquierdo
      expect(paddle.checkCollisionCanvasLeft()).toBe(true);
    });

    it("debería detectar colisión en el borde izquierdo cuando el paddle está al borde del canvas", () => {
      paddle.paddleX = 0; // En el límite izquierdo
      expect(paddle.checkCollisionCanvasLeft()).toBe(false);
    });

    it("debería detectar que no hay colisión en el borde derecho para una posición intermedia dentro del canvas", () => {
      paddle.paddleX = 300; // Posición intermedia
      expect(paddle.checkCollisionCanvasRight()).toBe(true);
    });

    it("debería detectar que no hay colisión en el borde izquierdo para una posición intermedia dentro del canvas", () => {
      paddle.paddleX = 200; // Posición intermedia
      expect(paddle.checkCollisionCanvasLeft()).toBe(true);
    });
  });

  describe("Paddle: checkCollision", () => {
    let paddle: Paddle;

    beforeEach(() => {
      paddle = new Paddle(50, 10, 100, 380);
    });

    it("debería ejecutar checkCollision sin errores", () => {
      expect(() => paddle.checkCollision()).not.toThrow();
    });

    it("debería llamar a checkCollisionCanvasRight y checkCollisionCanvasLeft", () => {
      jest.spyOn(paddle, "checkCollisionCanvasRight");
      jest.spyOn(paddle, "checkCollisionCanvasLeft");

      paddle.checkCollision();

      expect(paddle.checkCollisionCanvasRight).toHaveBeenCalled();
      expect(paddle.checkCollisionCanvasLeft).toHaveBeenCalled();
    });

    it("debería assignar collisionRight y collisionLeft de manera correcta", () => {
      jest.spyOn(paddle, "checkCollisionCanvasRight").mockReturnValue(true);
      jest.spyOn(paddle, "checkCollisionCanvasLeft").mockReturnValue(false);

      paddle.checkCollision();

      expect(paddle["collisionRight"]).toBe(true);
      expect(paddle["collisionLeft"]).toBe(false);
    });
  });

  describe("move", () => {
    let paddle: Paddle;

    beforeEach(() => {
      paddle = new Paddle(50, 10, 100, 380);
      paddle["PADDLE_SENSITIVITY"] = 10;
      paddle["paddleX"] = 50; // Posición inicial
      paddle["collisionRight"] = true;
      paddle["collisionLeft"] = false;
    });

    it("debería mover el paddle a la derecha cuando rightPressed es true y collisionRight es true", () => {
      paddle.move(true, false);
      expect(paddle["paddleX"]).toBe(60); // paddleX + PADDLE_SENSITIVITY
    });

    //Las combinaciones de las diferentes condiciones cumplen un condition coverage del 100%
    it("debería mover el paddle a la izquierda cuando leftPressed es true y collisionLeft es true", () => {
      paddle["collisionRight"] = false; // Reset colisión derecha
      paddle["collisionLeft"] = true;

      paddle.move(false, true);
      expect(paddle["paddleX"]).toBe(40); // paddleX - PADDLE_SENSITIVITY
    });

    it("no debería mover el paddle si no hay colisión en la respectiva dirección", () => {
      paddle["collisionRight"] = false;
      paddle["collisionLeft"] = false;

      paddle.move(true, false);
      expect(paddle["paddleX"]).toBe(50); // No movimiento a la derecha

      paddle.move(false, true);
      expect(paddle["paddleX"]).toBe(50); // No movimiento a la izquierda
    });

    it("debería moverse solo en la dirección permitida por la colisión cuando ambas teclas están presionadas", () => {
      paddle["collisionRight"] = true;
      paddle["collisionLeft"] = false;

      paddle.move(true, true);
      expect(paddle["paddleX"]).toBe(60); // Se mueve a la derecha

      paddle["collisionRight"] = false;
      paddle["collisionLeft"] = true;

      paddle.move(true, true);
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
  
    describe("Constructor - Propiedades iniciales", () => {
      it("debería inicializar correctamente con dimensiones válidas", () => {
        paddle = new Paddle(50, 10, 100, 380); // Valores válidos
        expect(paddle.paddleWidth).toBe(50);
        expect(paddle.paddleHeight).toBe(10);
        expect(paddle.paddleX).toBe(100);
        expect(paddle.paddleY).toBe(380);
      });
  
      it("debería manejar dimensiones inválidas (negativas)", () => {
        paddle = new Paddle(-50, -10, 100, 380); // Dimensiones negativas
        expect(paddle.paddleWidth).toBe(-50);
        expect(paddle.paddleHeight).toBe(-10);
      });
  
      it("debería manejar posiciones iniciales fuera del rango del canvas", () => {
        paddle = new Paddle(50, 10, 500, 380); // Fuera del canvas
        expect(paddle.paddleX).toBe(500);
      });
    });
  
    describe("checkCollisionCanvasRight", () => {
      it("debería permitir movimiento cuando la pala está completamente dentro del borde derecho", () => {
        paddle.paddleX = 300; // paddleX + paddleWidth < canvasWidth
        expect(paddle.checkCollisionCanvasRight()).toBe(true);
      });
  
      it("debería detectar colisión cuando la pala está tocando el borde derecho", () => {
        paddle.paddleX = 398; // paddleX + paddleWidth === canvasWidth
        expect(paddle.checkCollisionCanvasRight()).toBe(false);
      });
  
      it("debería detectar colisión cuando la pala está más allá del borde derecho", () => {
        paddle.paddleX = 400; // paddleX + paddleWidth > canvasWidth
        expect(paddle.checkCollisionCanvasRight()).toBe(false);
      });
    });
  
    describe("checkCollisionCanvasLeft", () => {
      it("debería permitir movimiento cuando la pala está completamente dentro del borde izquierdo", () => {
        paddle.paddleX = 100; // paddleX > 0
        expect(paddle.checkCollisionCanvasLeft()).toBe(true);
      });
  
      it("debería detectar colisión cuando la pala está tocando el borde izquierdo", () => {
        paddle.paddleX = 0; // paddleX === 0
        expect(paddle.checkCollisionCanvasLeft()).toBe(false);
      });
  
      it("debería detectar colisión cuando la pala está más allá del borde izquierdo", () => {
        paddle.paddleX = -1; // paddleX < 0
        expect(paddle.checkCollisionCanvasLeft()).toBe(false);
      });
    });
  
    describe("move", () => {
      beforeEach(() => {
        paddle.collisionRight = true;
        paddle.collisionLeft = true;
      });
  
      it("debería moverse a la derecha si collisionRight es true", () => {
        paddle.move(true, false);
        expect(paddle.paddleX).toBe(110); // paddleX + PADDLE_SENSITIVITY
      });
  
      it("debería moverse a la izquierda si collisionLeft es true", () => {
        paddle.move(false, true);
        expect(paddle.paddleX).toBe(90); // paddleX - PADDLE_SENSITIVITY
      });
  
      it("no debería moverse si ambas colisiones son falsas", () => {
        paddle.collisionRight = false;
        paddle.collisionLeft = false;
        paddle.move(true, false);
        expect(paddle.paddleX).toBe(100); // Sin movimiento
      });
  
      it("debería moverse correctamente solo en la dirección permitida cuando ambas teclas están presionadas", () => {
        paddle.collisionRight = true;
        paddle.collisionLeft = false;
        paddle.move(true, true);
        expect(paddle.paddleX).toBe(110); // Se mueve solo a la derecha
      });
  
      it("debería moverse correctamente cuando ninguna tecla está presionada", () => {
        paddle.move(false, false);
        expect(paddle.paddleX).toBe(100); // Sin movimiento
      });
    });
  });

  describe("Paddle - Límites y Fronteras", () => {
    let paddle: Paddle;
  
    beforeEach(() => {
      paddle = new Paddle(50, 10, 100, 380); // Paddle inicial
      paddle["PADDLE_SENSITIVITY"] = 10;
    });
  
    describe("Constructor", () => {
      it("debería inicializar correctamente dentro de los valores frontera", () => {
        const paddle = new Paddle(1, 1, 0, 0); // Frontera inferior
        expect(paddle.paddleWidth).toBe(1);
        expect(paddle.paddleHeight).toBe(1);
        expect(paddle.paddleX).toBe(0);
        expect(paddle.paddleY).toBe(0);
      });
  
      it("debería manejar valores límite justo por debajo de la frontera inferior", () => {
        const paddle = new Paddle(-1, -1, -1, -1); // Límite inferior
        expect(paddle.paddleWidth).toBe(-1);
        expect(paddle.paddleHeight).toBe(-1);
      });
  
      it("debería manejar valores frontera superiores razonables", () => {
        const paddle = new Paddle(100, 20, 448, 380); // Frontera superior
        expect(paddle.paddleWidth).toBe(100);
        expect(paddle.paddleX).toBe(448);
      });
    });
  
    describe("checkCollisionCanvasRight", () => {
      it("debería detectar colisión justo en la frontera derecha", () => {
        paddle.paddleX = 398; // paddleX + paddleWidth === canvasWidth
        expect(paddle.checkCollisionCanvasRight()).toBe(false);
      });
  
      it("debería permitir movimiento justo por debajo de la frontera derecha", () => {
        paddle.paddleX = 397; // paddleX + paddleWidth === canvasWidth - 1
        expect(paddle.checkCollisionCanvasRight()).toBe(true);
      });
  
      it("debería detectar colisión justo por encima de la frontera derecha", () => {
        paddle.paddleX = 399; // paddleX + paddleWidth === canvasWidth + 1
        expect(paddle.checkCollisionCanvasRight()).toBe(false);
      });
    });
  
    describe("checkCollisionCanvasLeft", () => {
      it("debería detectar colisión justo en la frontera izquierda", () => {
        paddle.paddleX = 0; // paddleX === 0
        expect(paddle.checkCollisionCanvasLeft()).toBe(false);
      });
  
      it("debería permitir movimiento justo por encima de la frontera izquierda", () => {
        paddle.paddleX = 1; // paddleX === 1
        expect(paddle.checkCollisionCanvasLeft()).toBe(true);
      });
  
      it("debería detectar colisión justo por debajo de la frontera izquierda", () => {
        paddle.paddleX = -1; // paddleX === -1
        expect(paddle.checkCollisionCanvasLeft()).toBe(false);
      });
    });
  
    describe("move", () => {
      it("debería moverse correctamente dentro de los valores frontera", () => {
        paddle.collisionRight = true;
        paddle.move(true, false);
        expect(paddle.paddleX).toBe(110); // paddleX + PADDLE_SENSITIVITY
      });
  
      it("no debería moverse más allá de los valores frontera", () => {
        paddle.paddleX = 398; // Frontera derecha
        paddle.collisionRight = false;
        paddle.move(true, false);
        expect(paddle.paddleX).toBe(398); // No debería moverse
      });
  
      it("debería detectar movimiento correcto en los valores límite", () => {
        paddle.paddleX = 1; // Frontera izquierda superior
        paddle.collisionLeft = true;
        paddle.move(false, true);
        expect(paddle.paddleX).toBe(-9); // paddleX - PADDLE_SENSITIVITY
      });
    });
  });
  
});
