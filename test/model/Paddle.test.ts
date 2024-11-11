import { Paddle } from "../../src/model/Paddle";

describe("Paddle", () => {
  it("debería asignar el ancho de la pala (paddleWidth) correctamente", () => {
    const paddle = new Paddle(100);
    expect(paddle.paddleWidth).toBe(100);
  });
  it("debería asignar la altura de la pala (paddleHeight) correctamente", () => {
    const paddle = new Paddle(100, 20);
    expect(paddle.paddleHeight).toBe(20);
  });
});
