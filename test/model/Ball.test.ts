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

  describe("move", () => {
    it("debería actualizar la posición de la bola según speedX y speedY", () => {
      ball.move();
      expect(ball.x).toBe(105); // 100 + 5
      expect(ball.y).toBe(105); // 100 + 5
    });

    it("debería invertir speedY al colisionar con la pala", () => {
      ball["collisionPaddle"] = true; // Simulamos una colisión
      ball.move();
      expect(ball.y).toBe(95); // Debe moverse hacia abajo
    });

    it("debería invertir speedX al colisionar con el canvas X", () => {
      ball.x = 490; // Simulamos que la bola está cerca del borde derecho
      ball["collisionCanvasX"] = true; // Simulamos una colisión
      ball.move();
      expect(ball.speedX).toBe(-5); // Debe invertir la dirección
    });

    it("debería invertir speedY al colisionar con el canvas Y", () => {
      ball.y = 5; // Simulamos que la bola está cerca del borde superior
      ball["collisionCanvasY"] = true; // Simulamos una colisión
      ball.move();
      expect(ball.speedY).toBe(-5); // Debe invertir la dirección
    });
  });

  describe("checkCollisionPaddle", () => {
    it("Debería detectar una colisión cuando el objeto está en el rango de x e y del paddle", () => {
      ball.x = 45;
      ball.speedX = 5;
      ball.y = 85;
      ball.speedY = 10;

      const resultado = ball["checkCollisionPaddle"](40, 90, 30, 20);
      expect(resultado).toBe(true);
    });

    it("No debería detectar colisión cuando el objeto no está en el rango de y del paddle", () => {
      ball.x = 45;
      ball.speedX = 5;
      ball.y = 200;
      ball.speedY = -10;

      const resultado = ball["checkCollisionPaddle"](40, 90, 30, 20);
      expect(resultado).toBe(false);
    });

    it("No debería detectar colisión cuando el objeto no está en el rango de x del paddle", () => {
      ball.x = 10;
      ball.speedX = 5;
      ball.y = 95;
      ball.speedY = 0;

      const resultado = ball["checkCollisionPaddle"](40, 90, 30, 20);
      expect(resultado).toBe(false);
    });
  });

  describe("checkCollisionCanvasX", () => {
    it("Debería detectar una colisión en el borde izquierdo del canvas", () => {
      ball.x = 5;
      ball.speedX = -10;
      ball.radius = 10;

      const resultado = ball["checkCollisionCanvasX"](400);
      expect(resultado).toBe(true);
    });

    it("Debería detectar una colisión en el borde derecho del canvas", () => {
      ball.x = 390;
      ball.speedX = 15;
      ball.radius = 10;

      const resultado = ball["checkCollisionCanvasX"](400);
      expect(resultado).toBe(true);
    });

    it("No debería detectar colisión cuando el objeto está dentro del canvas", () => {
      ball.x = 200;
      ball.speedX = 5;
      ball.radius = 10;

      const resultado = ball["checkCollisionCanvasX"](400);
      expect(resultado).toBe(false);
    });
  });

  describe("checkCollisionCanvasY ", () => {
    it("Debería detectar una colisión en el borde superior del canvas", () => {
      ball.y = 5;
      ball.speedY = -10;
      ball.radius = 10;

      const resultado = ball["checkCollisionCanvasY"](300);
      expect(resultado).toBe(true);
    });

    it("Debería detectar una colisión en el borde inferior del canvas", () => {
      ball.y = 290;
      ball.speedY = 15;
      ball.radius = 10;

      const resultado = ball["checkCollisionCanvasY"](300);
      expect(resultado).toBe(true);
    });

    it("No debería detectar colisión cuando el objeto está dentro del canvas", () => {
      ball.y = 150;
      ball.speedY = 5;
      ball.radius = 10;

      const resultado = ball["checkCollisionCanvasY"](300);
      expect(resultado).toBe(false);
    });
  });

  describe('checkCollision', () => {
    it('debería detectar colisión con la pala', () => {
      const paddleX = 90;
      const paddleY = 120;
      const paddleWidth = 80;
      const paddleHeight = 10;
      const canvasWidth = 300;
      const canvasHeight = 400;
  
      ball["checkCollision"](paddleX, paddleY, paddleWidth, paddleHeight, canvasWidth, canvasHeight);
  
      expect(ball["collisionPaddle"]).toBe(true);
    });
    it('debería detectar colisión con los bordes izquierdo y derecho del canvas (eje X)', () => {
      const paddleX = 90;
      const paddleY = 95;
      const paddleWidth = 80;
      const paddleHeight = 20;
      const canvasWidth = 110; 
      const canvasHeight = 400;
  
      ball["checkCollision"](paddleX, paddleY, paddleWidth, paddleHeight, canvasWidth, canvasHeight);
  
      expect(ball["collisionCanvasX"]).toBe(true);
    });
  
    it('debería detectar colisión con los bordes superior e inferior del canvas (eje Y)', () => {
      const paddleX = 90;
      const paddleY = 95;
      const paddleWidth = 80;
      const paddleHeight = 20;
      const canvasWidth = 300;
      const canvasHeight = 110; 
  
      ball["checkCollision"](paddleX, paddleY, paddleWidth, paddleHeight, canvasWidth, canvasHeight);
  
      expect(ball["collisionCanvasY"]).toBe(true); 
    });
  
    it('no debería detectar colisión cuando la bola está lejos de la pala y de los bordes del canvas', () => {
      const paddleX = 200;
      const paddleY = 300;
      const paddleWidth = 80;
      const paddleHeight = 20;
      const canvasWidth = 400;
      const canvasHeight = 400;
  
      ball["checkCollision"](paddleX, paddleY, paddleWidth, paddleHeight, canvasWidth, canvasHeight);
  
      expect(ball["collisionPaddle"]).toBe(false); 
      expect(ball["collisionCanvasX"]).toBe(false); 
      expect(ball["collisionCanvasY"]).toBe(false); 
    });
  });
  
});
