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
      paddle = new Paddle(50, 10, 100, 380); // Paddle de 50px de ancho, posición inicial (100, 380)
    });

    it("no debería detectar ninguna colisión en el borde derecho cuando la paleta está lejos del borde del canvas.", () => {
      paddle.paddleX = 200;
      expect(paddle.checkCollisionCanvasRight()).toBe(true);
    });

    it("No debería detectar ninguna colisión en el borde izquierdo cuando el Paddle está lejos del borde izquierdo del canvas.", () => {
      paddle.paddleX = 100;
      expect(paddle.checkCollisionCanvasLeft()).toBe(true);
    });
  });
});
