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

});
