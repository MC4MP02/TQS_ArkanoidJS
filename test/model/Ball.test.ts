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

  describe("checkCollision", () => {
    it("debería detectar colisión con la pala", () => {
      const paddleX = 90;
      const paddleY = 100;
      const paddleWidth = 80;
      const paddleHeight = 10;
      const canvasWidth = 300;
      const canvasHeight = 400;

      ball["checkCollision"](
        paddleX,
        paddleY,
        paddleWidth,
        paddleHeight,
        canvasWidth,
        canvasHeight
      );

      expect(ball["collisionPaddle"]).toBe(true);
    });
    it("debería detectar colisión con los bordes izquierdo y derecho del canvas (eje X)", () => {
      const paddleX = 90;
      const paddleY = 95;
      const paddleWidth = 80;
      const paddleHeight = 20;
      const canvasWidth = 110;
      const canvasHeight = 400;

      ball["checkCollision"](
        paddleX,
        paddleY,
        paddleWidth,
        paddleHeight,
        canvasWidth,
        canvasHeight
      );

      expect(ball["collisionCanvasX"]).toBe(true);
    });

    it("debería detectar colisión con los bordes superior e inferior del canvas (eje Y)", () => {
      const paddleX = 90;
      const paddleY = 95;
      const paddleWidth = 80;
      const paddleHeight = 20;
      const canvasWidth = 300;
      const canvasHeight = 110;

      ball["checkCollision"](
        paddleX,
        paddleY,
        paddleWidth,
        paddleHeight,
        canvasWidth,
        canvasHeight
      );

      expect(ball["collisionCanvasY"]).toBe(true);
    });

    it("no debería detectar colisión cuando la bola está lejos de la pala y de los bordes del canvas", () => {
      const paddleX = 200;
      const paddleY = 300;
      const paddleWidth = 80;
      const paddleHeight = 20;
      const canvasWidth = 400;
      const canvasHeight = 400;

      ball["checkCollision"](
        paddleX,
        paddleY,
        paddleWidth,
        paddleHeight,
        canvasWidth,
        canvasHeight
      );

      expect(ball["collisionPaddle"]).toBe(false);
      expect(ball["collisionCanvasX"]).toBe(false);
      expect(ball["collisionCanvasY"]).toBe(false);
    });

    describe("ballDownMap", () => {
      it("debería detectar colisión en el borde inferior del canvas", () => {
        ball.y = 295;
        ball.speedY = 10;
        ball.radius = 5;
        const canvasHeight = 300;

        const resultado = ball.ballDownMap(canvasHeight);
        expect(resultado).toBe(true);
      });

      it("no debería detectar colisión cuando está dentro del canvas", () => {
        ball.y = 250;
        ball.speedY = 5;
        ball.radius = 10;
        const canvasHeight = 300;

        const resultado = ball.ballDownMap(canvasHeight);
        expect(resultado).toBe(false);
      });
    });
  });

  //-------------------------------------------------------------------------------------------------------------
  //-------------------- TESTS PARTICIONES EQUIVALENTES, VALORES LÍMITE Y VALORES FRONTERA ----------------------
  //-------------------------------------------------------------------------------------------------------------

  describe("checkCollisionCanvasX", () => {
    const canvasWidth = 400;
  
    describe("Particiones equivalentes", () => {
      it("Debería detectar colisión con el borde izquierdo (partición válida)", () => {
        ball.x = 0;
        ball.speedX = -5; // Movimiento hacia la izquierda
        ball.radius = 10;
        expect(ball["checkCollisionCanvasX"](canvasWidth)).toBe(true);
      });
  
      it("Debería detectar colisión con el borde derecho (partición válida)", () => {
        ball.x = 400;
        ball.speedX = 5; // Movimiento hacia la derecha
        ball.radius = 10;
        expect(ball["checkCollisionCanvasX"](canvasWidth)).toBe(true);
      });
  
      it("No debería detectar colisión cuando la bola está completamente dentro del rango (partición válida)", () => {
        ball.x = 200;
        ball.speedX = 5; // Movimiento dentro del rango
        ball.radius = 10;
        expect(ball["checkCollisionCanvasX"](canvasWidth)).toBe(false);
      });
    });
  
    describe("Fronteras y límites", () => {
      describe("Borde izquierdo", () => {

        it("Debería detectar colisión en el límite inferior del borde izquierdo", () => {
          ball.x = 13;
          ball.speedX = -5; // Movimiento hacia la izquierda
          ball.radius = 10;
          expect(ball["checkCollisionCanvasX"](canvasWidth)).toBe(true);
        });

        it("Debería detectar colisión en la frontera del borde izquierdo", () => {
          ball.x = 14; // 14 - 5 < 10
          ball.speedX = -5; // Movimiento hacia la izquierda
          ball.radius = 10;
          expect(ball["checkCollisionCanvasX"](canvasWidth)).toBe(true);
        });
  
        it("No debería detectar colisión en el límite superior del borde izquierdo", () => {
          ball.x = 15;
          ball.speedX = -5; // Movimiento hacia la izquierda
          ball.radius = 10;
          expect(ball["checkCollisionCanvasX"](canvasWidth)).toBe(false);
        });
      });
  
      describe("Borde derecho", () => {

        it("Debería detectar colisión en el límite superior del borde derecho", () => {
          ball.x = 387;
          ball.speedX = 5; // Movimiento hacia la derecha
          ball.radius = 10;
          expect(ball["checkCollisionCanvasX"](canvasWidth)).toBe(true);
        });

        it("Debería detectar colisión en la frontera del borde derecho", () => {
          ball.x = 386; // 386 + 5 > 400 - 10
          ball.speedX = 5; // Movimiento hacia la derecha
          ball.radius = 10;
          expect(ball["checkCollisionCanvasX"](canvasWidth)).toBe(true);
        });
  
        it("No debería detectar colisión en el límite inferior del borde derecho", () => {
          ball.x = 385;
          ball.speedX = 5; // Movimiento hacia la derecha
          ball.radius = 10;
          expect(ball["checkCollisionCanvasX"](canvasWidth)).toBe(false);
        });
      });
    });
  });

  describe("checkCollisionCanvasY", () => {
    const canvasHeight = 400;
  
    describe("Particiones equivalentes", () => {
      it("Debería detectar colisión con el borde superior (partición válida)", () => {
        ball.y = 0;
        ball.speedY = -5; // Movimiento hacia arriba
        ball.radius = 10;
        expect(ball["checkCollisionCanvasY"](canvasHeight)).toBe(true);
      });
  
      it("Debería detectar colisión con el borde inferior (partición válida)", () => {
        ball.y = 400;
        ball.speedY = 5; // Movimiento hacia abajo
        ball.radius = 10;
        expect(ball["checkCollisionCanvasY"](canvasHeight)).toBe(true);
      });
  
      it("No debería detectar colisión cuando la bola está completamente dentro del rango (partición válida)", () => {
        ball.y = 200;
        ball.speedY = 5; // Movimiento dentro del rango
        ball.radius = 10;
        expect(ball["checkCollisionCanvasY"](canvasHeight)).toBe(false);
      });
    });
  
    describe("Fronteras y límites", () => {
      describe("Borde superior", () => {
        it("Debería detectar colisión en el límite inferior del borde superior", () => {
          ball.y = 13;
          ball.speedY = -5; // Movimiento hacia arriba
          ball.radius = 10;
          expect(ball["checkCollisionCanvasY"](canvasHeight)).toBe(true);
        });
  
        it("Debería detectar colisión en la frontera del borde superior", () => {
          ball.y = 14; // 14 - 5 < 10
          ball.speedY = -5; // Movimiento hacia arriba
          ball.radius = 10;
          expect(ball["checkCollisionCanvasY"](canvasHeight)).toBe(true);
        });
  
        it("No debería detectar colisión en el límite superior del borde superior", () => {
          ball.y = 15;
          ball.speedY = -5; // Movimiento hacia arriba
          ball.radius = 10;
          expect(ball["checkCollisionCanvasY"](canvasHeight)).toBe(false);
        });
      });
  
      describe("Borde inferior", () => {
        it("Debería detectar colisión en el límite superior del borde inferior", () => {
          ball.y = 387;
          ball.speedY = 5; // Movimiento hacia abajo
          ball.radius = 10;
          expect(ball["checkCollisionCanvasY"](canvasHeight)).toBe(true);
        });
  
        it("Debería detectar colisión en la frontera del borde inferior", () => {
          ball.y = 386; // 386 + 5 > 400 - 10
          ball.speedY = 5; // Movimiento hacia abajo
          ball.radius = 10;
          expect(ball["checkCollisionCanvasY"](canvasHeight)).toBe(true);
        });
  
        it("No debería detectar colisión en el límite inferior del borde inferior", () => {
          ball.y = 385;
          ball.speedY = 5; // Movimiento hacia abajo
          ball.radius = 10;
          expect(ball["checkCollisionCanvasY"](canvasHeight)).toBe(false);
        });
      });
    });
  });

  describe("checkCollisionPaddle", () => {
    const paddleX = 50;
    const paddleY = 350;
    const paddleWidth = 100;
    const paddleHeight = 10;
  
    describe("Particiones equivalentes", () => {
      it("Debería detectar colisión cuando la bola está completamente dentro del área del paddle", () => {
        ball.x = 75;
        ball.y = 355;
        ball.speedX = 0; // Sin movimiento
        ball.speedY = 0;
        expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(true);
      });
  
      it("No debería detectar colisión cuando la bola está completamente fuera del área del paddle", () => {
        ball.x = 200; // Mucho más allá del borde derecho del paddle
        ball.y = 355;
        ball.speedX = 0;
        ball.speedY = 0;
        expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(false);
      });
  
      it("No debería detectar colisión cuando la bola está justo en los bordes pero no dentro", () => {
        ball.x = 49; // Justo en el borde izquierdo pero fuera
        ball.y = 355;
        ball.speedX = 0;
        ball.speedY = 0;
        expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(false);
      });
    });
  
    describe("Fronteras y límites", () => {
      describe("Borde derecho del paddle", () => {
        it("Debería detectar colisión en la frontera del borde derecho", () => {
          ball.x = 148; // 148 + 1 < 50 + 100 && 148 + 1 > 50
          ball.speedX = 1; 
          ball.y = 355;
          ball.speedY = 0;
          expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(true);
        });
  
        it("Debería detectar colisión en el límite inferior del borde derecho", () => {
          ball.x = 147; 
          ball.speedX = 1; 
          ball.y = 355;
          ball.speedY = 0;
          expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(true);
        });
  
        it("No debería detectar colisión en el límite superior del borde derecho", () => {
          ball.x = 149; 
          ball.speedX = 1; 
          ball.y = 355;
          ball.speedY = 0;
          expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(false);
        });
      });
  
      describe("Borde izquierdo del paddle", () => {
        it("Debería detectar colisión en la frontera del borde izquierdo", () => {
          ball.x = 50; // 50 + 1 < 50 + 100 && 50 + 1 > 50
          ball.speedX = 1;
          ball.y = 355;
          ball.speedY = 0;
          expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(true);
        });
  
        it("No Debería detectar colisión en el límite inferior del borde izquierdo", () => {
          ball.x = 49; 
          ball.speedX = 1;
          ball.y = 355;
          ball.speedY = 0;
          expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(false);
        });
  
        it("Debería detectar colisión en el límite superior del borde izquierdo", () => {
          ball.x = 51; 
          ball.speedX = 1;
          ball.y = 355;
          ball.speedY = 0;
          expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(true);
        });
      });
  
      describe("Borde superior del paddle", () => {
        it("Debería detectar colisión en la frontera del borde superior", () => {
          ball.y = 360; // 360 - 1 > 350 && 360 - 1 < 350 + 10
          ball.speedY = -1; // Movimiento hacia arriba
          ball.x = 148;
          ball.speedX = 1;
          expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(true);
        });
  
        it("Debería detectar colisión en el límite inferior del borde superior", () => {
          ball.y = 359; 
          ball.speedY = -1; 
          ball.x = 148;
          ball.speedX = 1;
          expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(true);
        });
  
        it("No debería detectar colisión en el límite superior del borde superior", () => {
          ball.y = 361; 
          ball.speedY = -1; 
          ball.x = 149;
          ball.speedX = 1;
          expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(false);
        });
      });
  
      describe("Borde inferior del paddle", () => {
        it("Debería detectar colisión en la frontera del borde inferior", () => {
          ball.y = 350; // 350 + 1 > 350 && 350 + 1 < 350 + 10
          ball.speedY = 1;// Movimiento hacia abajo
          ball.x = 148;
          ball.speedX = 1;
          expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(true);
        });
  
        it("No Debería detectar colisión en el límite inferior del borde inferior", () => {
          ball.y = 349; 
          ball.speedY = 1;
          ball.x = 149;
          ball.speedX = 1;
          expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(false);
        });
  
        it("Debería detectar colisión en el límite superior del borde inferior", () => {
          ball.y = 351; 
          ball.speedY = 1;
          ball.x = 148;
          ball.speedX = 1;
          expect(ball["checkCollisionPaddle"](paddleX, paddleY, paddleWidth, paddleHeight)).toBe(true);
        });
      });
    });
  });
  
  
});

