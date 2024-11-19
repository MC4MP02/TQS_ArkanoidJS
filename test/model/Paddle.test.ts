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
      paddle["PADDLE_SENSITIVITY"] = 10; // Sensibilidad ficticia para pruebas
      paddle["paddleX"] = 50; // Posición inicial
      paddle["collisionRight"] = true;
      paddle["collisionLeft"] = false;
    });

    it("debería mover el paddle a la derecha cuando rightPressed es true y collisionRight es true", () => {
      paddle.move(true, false);
      expect(paddle["paddleX"]).toBe(60); // paddleX + PADDLE_SENSITIVITY
    });

    it("debería mover el paddle a la izquierda cuando leftPressed es true y collisionLeft es true", () => {
      paddle["collisionRight"] = false; // Reset colisión derecha
      paddle["collisionLeft"] = true;

      paddle.move(false, true);
      expect(paddle["paddleX"]).toBe(40); // paddleX - PADDLE_SENSITIVITY
    });
  });
});
