import { Brick } from "../../src/model/Brick";

describe("Brick", () => {
  let brick: Brick;
  let BRICK_STATUS: { ALIVE: number; DEAD: number } = {
    ALIVE: 1,
    DEAD: 0,
  };

  beforeEach(() => {
    brick = new Brick(10, 20, 1, 0);
  });

  // Test de inicialización
  it("debería inicializarse con las propiedades correctas", () => {
    expect(brick.BrickX).toBe(10);
    expect(brick.BrickY).toBe(20);
    expect(brick.status).toBe(BRICK_STATUS.ALIVE);
    expect(brick.color).toBe(0);
  });

  // Test de valores predeterminados del estado
  it("debería inicializarse con el estado ALIVE cuando el estado es 1", () => {
    const brickAlive = new Brick(5, 5, BRICK_STATUS.ALIVE, 100);
    expect(brickAlive.status).toBe(BRICK_STATUS.ALIVE);
  });

  it("debería inicializarse con el estado DEAD cuando el estado es 0", () => {
    const brickDead = new Brick(5, 5, BRICK_STATUS.DEAD, 100);
    expect(brickDead.status).toBe(BRICK_STATUS.DEAD);
  });

  describe("hit", () => {
    it("debería llamar a la clase hit() y actualizar el status del brick", () => {
      const brickAlive = new Brick(0, 0, BRICK_STATUS.ALIVE, 0);

      expect(brickAlive.status).toBe(BRICK_STATUS.ALIVE);

      brickAlive.hit();

      expect(brickAlive.status).toBe(BRICK_STATUS.DEAD);
    });
  });

  describe("isHit", () => {
    beforeEach(() => {
      brick = new Brick(100, 100, 1, 255); // Ladrillo en posición (100, 100)
    });

    it("debería devolver true si la bola golpea el ladrillo", () => {
      const ballX = 150;
      const ballY = 120;
      const brickWidth = 50;
      const brickHeight = 30;
      expect(brick.isHit(ballX, ballY, brickWidth, brickHeight)).toBe(true);
    });

    it("debería devolver false si la bola está fuera del rango en X", () => {
      const ballX = 200;
      const ballY = 120;
      const brickWidth = 50;
      const brickHeight = 30;
      expect(brick.isHit(ballX, ballY, brickWidth, brickHeight)).toBe(false);
    });

    it("debería devolver false si la bola está fuera del rango en Y", () => {
      const ballX = 150;
      const ballY = 200;
      const brickWidth = 50;
      const brickHeight = 30;
      expect(brick.isHit(ballX, ballY, brickWidth, brickHeight)).toBe(false);
    });

    it("debería devolver false si el ladrillo está muerto", () => {
      brick.status = BRICK_STATUS.DEAD; // Marcamos el ladrillo como muerto
      const ballX = 150;
      const ballY = 120;
      const brickWidth = 50;
      const brickHeight = 30;
      expect(brick.isHit(ballX, ballY, brickWidth, brickHeight)).toBe(false);
    });

    it("debería devolver false si la bola está justo fuera del límite derecho del ladrillo", () => {
      const ballX = 151; // Fuera por un pixel
      const ballY = 120;
      const brickWidth = 50;
      const brickHeight = 30;
      expect(brick.isHit(ballX, ballY, brickWidth, brickHeight)).toBe(false);
    });
  });

  //-------------------------------------------------------------------------------------------------------------
  //-------------------- TESTS PARTICIONES EQUIVALENTES, VALORES LÍMITE Y VALORES FRONTERA ----------------------
  //-------------------------------------------------------------------------------------------------------------

  describe("Brick Constructor - Particiones, Límites y Fronteras", () => {
    it("debería inicializar correctamente con valores válidos", () => {
      const brick = new Brick(10, 20, 1, 100);
      expect(brick.BrickX).toBe(10);
      expect(brick.BrickY).toBe(20);
      expect(brick.status).toBe(1);
      expect(brick.color).toBe(100);
    });
  
    it("debería manejar correctamente valores frontera para coordenadas", () => {
      const brick = new Brick(0, 0, 1, 0); // Coordenadas mínimas
      expect(brick.BrickX).toBe(0);
      expect(brick.BrickY).toBe(0);
    });
  
    it("debería manejar valores límite fuera del rango esperado", () => {
      const brick = new Brick(-10, -20, 1, -50); // Coordenadas y color negativos
      expect(brick.BrickX).toBe(-10);
      expect(brick.BrickY).toBe(-20);
      expect(brick.color).toBe(-50);
    });
  
    it("debería manejar valores frontera para color", () => {
      const brick = new Brick(10, 20, 1, 255); // Máximo color esperado
      expect(brick.color).toBe(255);
    });
  });

  describe("Brick.hit - Particiones, Límites y Fronteras", () => {
    it("debería cambiar el estado del ladrillo a DEAD si está ALIVE", () => {
      brick.status = 1; // ALIVE
      brick.hit();
      expect(brick.status).toBe(0); // DEAD
    });
  
    it("debería manejar correctamente si el ladrillo ya está DEAD", () => {
      brick.status = 0; // DEAD
      brick.hit();
      expect(brick.status).toBe(0); // Sigue estando DEAD
    });
  });
  
  describe("Brick.isHit - Particiones Equivalentes", () => {
    let brick: Brick;
    const BRICK_STATUS = { ALIVE: 1, DEAD: 0 };
  
    beforeEach(() => {
      brick = new Brick(100, 100, BRICK_STATUS.ALIVE, 255); // Ladrillo en posición (100, 100)
    });
  
    // Partición 1: Estado del ladrillo
    it("debería devolver true si el ladrillo está vivo y la bola está dentro del rango", () => {
      expect(brick.isHit(120, 120, 50, 30)).toBe(true); // Ladrillo vivo, bola dentro del rango
    });
  
    it("debería devolver false si el ladrillo está muerto aunque la bola esté dentro del rango", () => {
      brick.status = BRICK_STATUS.DEAD;
      expect(brick.isHit(120, 120, 50, 30)).toBe(false); // Ladrillo muerto
    });
  
    // Partición 2: Posición de la bola respecto al ladrillo
    it("debería devolver false si la bola está fuera del rango en X", () => {
      expect(brick.isHit(200, 120, 50, 30)).toBe(false); // Bola fuera del rango en X
    });
  
    it("debería devolver false si la bola está fuera del rango en Y", () => {
      expect(brick.isHit(120, 200, 50, 30)).toBe(false); // Bola fuera del rango en Y
    });
  
    // Partición 3: Bola en relación con los límites
    it("debería devolver true si la bola está completamente dentro del ladrillo", () => {
      expect(brick.isHit(120, 120, 50, 30)).toBe(true); // Bola completamente dentro
    });
  
    it("debería devolver true si la bola está justo en el límite del ladrillo", () => {
      expect(brick.isHit(150, 120, 50, 30)).toBe(true); // Bola en el límite derecho
    });
  
    it("debería devolver false si la bola está completamente fuera del rango del ladrillo", () => {
      expect(brick.isHit(200, 200, 50, 30)).toBe(false); // Bola completamente fuera
    });
  });

  describe("Brick.isHit - Límites y Fronteras", () => {
    let brick: Brick;
    const BRICK_STATUS = { ALIVE: 1, DEAD: 0 };
  
    beforeEach(() => {
      brick = new Brick(100, 100, BRICK_STATUS.ALIVE, 255); // Ladrillo en posición (100, 100)
    });
  
    // Fronteras y límites para el eje X
    it("debería detectar colisión justo en la frontera izquierda", () => {
      expect(brick.isHit(100, 120, 50, 30)).toBe(true); // Frontera izquierda
    });
  
    it("debería devolver false justo en el límite inferior izquierdo", () => {
      expect(brick.isHit(99, 120, 50, 30)).toBe(false); // Límite inferior izquierdo
    });
  
    it("debería detectar colisión justo dentro del límite superior izquierdo", () => {
      expect(brick.isHit(101, 120, 50, 30)).toBe(true); // Límite superior izquierdo
    });
  
    it("debería detectar colisión justo en la frontera derecha", () => {
      expect(brick.isHit(150, 120, 50, 30)).toBe(true); // Frontera derecha
    });
  
    it("debería detectar colisión justo dentro del límite inferior derecho", () => {
      expect(brick.isHit(149, 120, 50, 30)).toBe(true); // Límite inferior derecho
    });
  
    it("debería devolver false justo en el límite superior derecho", () => {
      expect(brick.isHit(151, 120, 50, 30)).toBe(false); // Límite superior derecho
    });
  
    // Fronteras y límites para el eje Y
    it("debería detectar colisión justo en la frontera superior", () => {
      expect(brick.isHit(120, 100, 50, 30)).toBe(true); // Frontera superior
    });
  
    it("debería devolver false justo en el límite inferior superior", () => {
      expect(brick.isHit(120, 99, 50, 30)).toBe(false); // Límite inferior superior
    });
  
    it("debería detectar colisión justo dentro del límite superior superior", () => {
      expect(brick.isHit(120, 101, 50, 30)).toBe(true); // Límite superior superior
    });
  
    it("debería detectar colisión justo en la frontera inferior", () => {
      expect(brick.isHit(120, 130, 50, 30)).toBe(true); // Frontera inferior
    });
  
    it("debería detectar colisión justo dentro del límite inferior inferior", () => {
      expect(brick.isHit(120, 129, 50, 30)).toBe(true); // Límite inferior inferior
    });
  
    it("debería devolver false justo en el límite superior inferior", () => {
      expect(brick.isHit(120, 131, 50, 30)).toBe(false); // Límite superior inferior
    });
  
    // Fronteras y límites para el estado del ladrillo
    it("debería devolver true si el ladrillo está vivo y dentro del rango", () => {
      expect(brick.isHit(120, 120, 50, 30)).toBe(true); // Ladrillo vivo
    });
  
    it("debería devolver false si el ladrillo está muerto", () => {
      brick.status = BRICK_STATUS.DEAD;
      expect(brick.isHit(120, 120, 50, 30)).toBe(false); // Ladrillo muerto
    });
  });

});
