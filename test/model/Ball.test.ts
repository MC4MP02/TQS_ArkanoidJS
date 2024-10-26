import { Ball } from "../../src/model/Ball";

describe("Ball", () => {
  let ball: Ball;

  beforeEach(() => {
    // Inicializamos una bola para cada test
    ball = new Ball(100, 100, 10, 5, 5);
  });

  describe("constructor", () => {
    it("debería inicializar las propiedades correctamente", () => {
      expect(ball.x).toBe(100);
      expect(ball.y).toBe(100);
      expect(ball.radius).toBe(10);
      expect(ball.speedX).toBe(5);
      expect(ball.speedY).toBe(5);
    });
  });

  describe("changeX", () => {
    it("debería cambiar la dirección de speedX y actualizar la posición X", () => {
      const initialX = ball.x;
      ball.changeX();
      expect(ball.speedX).toBe(-5); // Debe invertir la velocidad
      expect(ball.x).toBe(initialX - 5); // Debe moverse a la izquierda
    });
  });

  describe("changeY", () => {
    it("debería cambiar la dirección de speedY y actualizar la posición Y", () => {
      const initialY = ball.y;
      ball.changeY();
      expect(ball.speedY).toBe(-5); // Debe invertir la velocidad
      expect(ball.y).toBe(initialY - 5); // Debe moverse hacia arriba
    });
  });
});
