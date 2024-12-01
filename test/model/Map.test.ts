import { Brick } from "../../src/model/Brick";
import { Map } from "../../src/model/Map";

describe("Map", () => {
  let map: Map;

  beforeEach(() => {
    // Inicializa una nueva instancia de Map antes de cada test
    map = new Map();
  });

  // Test para verificar que getBricks devuelve correctamente la matriz de ladrillos inicial
  it("debería devolver el array de bricks con getBricks", () => {
    expect(map.getBricks()).toEqual([]); // La matriz inicial debería estar vacía
  });

  // Test para verificar el número de columnas de ladrillos
  it("debería devolver el número de columnas de ladrillos con getBrickColumnCount", () => {
    expect(map.getBrickColumnCount()).toBe(0); // Inicialmente, debería ser 0
  });

  // Test para verificar el número de filas de ladrillos
  it("debería devolver el número de filas de ladrillos con getBrickRowCount", () => {
    expect(map.getBrickRowCount()).toBe(0); // Inicialmente, debería ser 0
  });

  // Test para verificar el ancho de los ladrillos
  it("debería devolver el ancho de los ladrillos con getBrickWidth", () => {
    expect(map.getBrickWidth()).toBe(0); // Inicialmente, debería ser 0
  });

  // Test para verificar la altura de los ladrillos
  it("debería devolver la altura de los ladrillos con getBrickHeigth", () => {
    expect(map.getBrickHeigth()).toBe(0); // Inicialmente, debería ser 0
  });

  // Test para verificar los valores personalizados asignados a las propiedades del mapa
  it("debería devolver valores personalizados asignados a las propiedades", () => {
    // Crear mocks de los bricks
    const mockBrickAlive = {
      BrickX: 0, // Coordenada X del ladrillo
      BrickY: 0, // Coordenada Y del ladrillo
      status: 1, // Estado del ladrillo (vivo)
      color: 0xffffff, // Color del ladrillo
      hit: jest.fn(), // Mock para el método hit
      isHit: jest.fn(), // Mock para el método isHit
    };

    const mockBrickDead = {
      BrickX: 100,
      BrickY: 100,
      status: 0, // Estado del ladrillo (muerto)
      color: 0x000000,
      hit: jest.fn(),
      isHit: jest.fn(),
    };

    // Asignar valores personalizados a las propiedades de Map
    map["brickColumnCount"] = 5;
    map["brickRowCount"] = 4;
    map["brickWidth"] = 50;
    map["brickHeigth"] = 20;
    map["bricks"] = [[mockBrickAlive, mockBrickDead]] as any; // Usamos mocks para los bricks

    // Comprobar que los getters devuelven los valores personalizados
    expect(map.getBrickColumnCount()).toBe(5);
    expect(map.getBrickRowCount()).toBe(4);
    expect(map.getBrickWidth()).toBe(50);
    expect(map.getBrickHeigth()).toBe(20);
    expect(map.getBricks()).toEqual([[mockBrickAlive, mockBrickDead]]);
  });

  describe("selectLevel", () => {
    // Test para verificar la configuración del nivel 1
    it("debería asignar valores correctos al seleccionar el nivel 1", () => {
      map.selectLevel(1);

      expect(map["brickColumnCount"]).toBe(13);
      expect(map["brickRowCount"]).toBe(7);
      expect(map["brickWidth"]).toBe(32);
      expect(map["brickHeigth"]).toBe(16);
      expect(map["brickPadding"]).toBe(0);
      expect(map["brickOffsetLeft"]).toBe(16);
      expect(map["brickOffsetTop"]).toBe(80);
    });

    // Test para verificar que las propiedades se reinician en un nivel no válido
    it("debería reiniciar las propiedades al seleccionar un nivel no válido", () => {
      map.selectLevel(99); // Nivel no válido

      // Verifica que las propiedades se reinicien a 0
      expect(map["brickColumnCount"]).toBe(0);
      expect(map["brickRowCount"]).toBe(0);
      expect(map["brickWidth"]).toBe(0);
      expect(map["brickHeigth"]).toBe(0);
      expect(map["brickPadding"]).toBe(0);
      expect(map["brickOffsetLeft"]).toBe(0);
      expect(map["brickOffsetTop"]).toBe(0);
    });

    // Test para verificar que generateBricks es llamado al seleccionar un nivel
    it("debería llamar a generateBricks al seleccionar cualquier nivel", () => {
      jest.spyOn(map, "generateBricks");

      map.selectLevel(1); // Nivel válido
      expect(map.generateBricks).toHaveBeenCalled();

      map.selectLevel(99); // Nivel no válido
      expect(map.generateBricks).toHaveBeenCalledTimes(2);
    });
  });
  describe("generateBricks", () => {
    // Test para verificar que la matriz de ladrillos tiene las dimensiones correctas
    it("debería inicializar la matriz de bricks con las dimensiones correctas", () => {
      map["brickColumnCount"] = 2; // Dos columnas
      map["brickRowCount"] = 3; // Tres filas

      map.generateBricks();

      expect(map["bricks"].length).toBe(2); // Dos columnas
      expect(map["bricks"][0].length).toBe(3); // Tres filas en la primera columna
      expect(map["bricks"][1].length).toBe(3); // Tres filas en la segunda columna
    });

    // Test para verificar que los ladrillos tienen las posiciones correctas
    it("debería asignar posiciones correctas a los bricks", () => {
      map["brickColumnCount"] = 1; // Una columna
      map["brickRowCount"] = 1; // Una fila
      map["brickWidth"] = 32;
      map["brickHeigth"] = 16;
      map["brickPadding"] = 2;
      map["brickOffsetLeft"] = 10;
      map["brickOffsetTop"] = 20;

      map.generateBricks();

      const brick = map["bricks"][0][0];
      expect(brick).toEqual(
        expect.objectContaining({
          BrickX: 10, // Offset izquierdo
          BrickY: 20, // Offset superior
        })
      );
    });

    // Test para verificar que cada ladrillo se inicializa correctamente como instancia de Brick
    it("debería inicializar cada ladrillo como una instancia de Brick", () => {
      map["brickColumnCount"] = 1; // Una columna
      map["brickRowCount"] = 1; // Una fila
      map["brickWidth"] = 32;
      map["brickHeigth"] = 16;
      map["brickPadding"] = 2;
      map["brickOffsetLeft"] = 10;
      map["brickOffsetTop"] = 20;
      map["BRICK_STATUS"] = { ALIVE: 1, DEAD: 0 };

      jest.spyOn(global.Math, "random").mockReturnValue(0.5); // Simular un número aleatorio fijo

      map.generateBricks();

      const brick = map["bricks"][0][0];
      expect(brick).toBeInstanceOf(Brick);
      expect(brick).toEqual(
        expect.objectContaining({
          BrickX: 10, // Offset izquierdo
          BrickY: 20, // Offset superior
          status: 1, // Estado inicial
          color: 4, // Número aleatorio (Math.random() * 8)
        })
      );

      jest.spyOn(global.Math, "random").mockRestore(); // Restaurar el comportamiento de Math.random
    });

    describe("generateBricks - Loop Testing", () => {
      beforeEach(() => {
        // Configuración previa al test para las dimensiones y posiciones
        map["brickWidth"] = 32;
        map["brickHeigth"] = 16;
        map["brickPadding"] = 2;
        map["brickOffsetLeft"] = 10;
        map["brickOffsetTop"] = 20;
        map["BRICK_STATUS"] = { ALIVE: 1, DEAD: 0 };
      });
    
      // Test del bucle interno: Verifica iteraciones específicas de filas con una columna fija
      it("debería testear el bucle interno (r = 0,1,2,4,6,7) con c = 1", () => {
        map["brickColumnCount"] = 2; // Dos columnas
        map["brickRowCount"] = 8; // Ocho filas para probar los valores específicos
    
        map.generateBricks();
    
        const columnIndex = 1; // Fijamos c = 1
        const rowsToTest = [0, 1, 2, 4, 6, 7];
    
        rowsToTest.forEach((rowIndex) => {
          const brick = map["bricks"][columnIndex][rowIndex];
          expect(brick).toBeInstanceOf(Brick);
          expect(brick).toEqual(
            expect.objectContaining({
              BrickX: expect.any(Number),
              BrickY: expect.any(Number),
            })
          );
        });
      });
    
      // Test del bucle externo: Verifica iteraciones específicas de columnas con una fila fija
      it("debería testear el bucle externo (c = 0,1,2,8,12,13) con r = 7", () => {
        map["brickColumnCount"] = 14; // Catorce columnas para probar los valores específicos
        map["brickRowCount"] = 8; // Ocho filas
    
        map.generateBricks();
    
        const rowIndex = 7; // Fijamos r = 7
        const columnsToTest = [0, 1, 2, 8, 12, 13];
    
        columnsToTest.forEach((columnIndex) => {
          const brick = map["bricks"][columnIndex][rowIndex];
          expect(brick).toBeInstanceOf(Brick);
          expect(brick).toEqual(
            expect.objectContaining({
              BrickX: expect.any(Number),
              BrickY: expect.any(Number),
            })
          );
        });
      });
    });
  });

  //-------------------------------------------------------------------------------------------------------------
  //-------------------- TESTS PARTICIONES EQUIVALENTES, VALORES LÍMITE Y VALORES FRONTERA ----------------------
  //-------------------------------------------------------------------------------------------------------------

  describe("Propiedades - Dimensiones y Desplazamiento", () => {
    // Test para verificar los límites y fronteras de las dimensiones de la matriz
    it("debería manejar dimensiones de matriz en la frontera y límites", () => {
      // Frontera
      map["brickColumnCount"] = 5;
      map["brickRowCount"] = 5;
      expect(map.getBrickColumnCount()).toBe(5);
      expect(map.getBrickRowCount()).toBe(5);

      // Límite inferior
      map["brickColumnCount"] = 4;
      map["brickRowCount"] = 4;
      expect(map.getBrickColumnCount()).toBe(4);
      expect(map.getBrickRowCount()).toBe(4);

      // Límite superior
      map["brickColumnCount"] = 6;
      map["brickRowCount"] = 6;
      expect(map.getBrickColumnCount()).toBe(6);
      expect(map.getBrickRowCount()).toBe(6);
    });
    // Test para verificar los límites y fronteras de las dimensiones de los ladrillos
    it("debería manejar dimensiones de ladrillos en la frontera y límites", () => {
      // Frontera
      map["brickWidth"] = 32;
      map["brickHeigth"] = 16;
      expect(map.getBrickWidth()).toBe(32);
      expect(map.getBrickHeigth()).toBe(16);

      // Límite inferior
      map["brickWidth"] = 31;
      map["brickHeigth"] = 15;
      expect(map.getBrickWidth()).toBe(31);
      expect(map.getBrickHeigth()).toBe(15);

      // Límite superior
      map["brickWidth"] = 33;
      map["brickHeigth"] = 17;
      expect(map.getBrickWidth()).toBe(33);
      expect(map.getBrickHeigth()).toBe(17);
    });

    it("debería manejar desplazamiento y espaciado en la frontera y límites", () => {
      // Frontera
      map["brickOffsetLeft"] = 16;
      map["brickOffsetTop"] = 80;
      map["brickPadding"] = 0;
      expect(map["brickOffsetLeft"]).toBe(16);
      expect(map["brickOffsetTop"]).toBe(80);
      expect(map["brickPadding"]).toBe(0);

      // Límite inferior
      map["brickOffsetLeft"] = 15;
      map["brickOffsetTop"] = 79;
      map["brickPadding"] = -1;
      expect(map["brickOffsetLeft"]).toBe(15);
      expect(map["brickOffsetTop"]).toBe(79);
      expect(map["brickPadding"]).toBe(-1);

      // Límite superior
      map["brickOffsetLeft"] = 17;
      map["brickOffsetTop"] = 81;
      map["brickPadding"] = 1;
      expect(map["brickOffsetLeft"]).toBe(17);
      expect(map["brickOffsetTop"]).toBe(81);
      expect(map["brickPadding"]).toBe(1);
    });
  });

  describe("selectLevel - Límites y Frontera", () => {
    it("debería manejar niveles válidos y no válidos en la frontera y límites", () => {
      // Frontera
      map.selectLevel(1);
      expect(map.getBrickColumnCount()).toBe(13);

      // Límite inferior
      map.selectLevel(0);
      expect(map.getBrickColumnCount()).toBe(0);

      // Límite superior
      map.selectLevel(2);
      expect(map.getBrickColumnCount()).toBe(0);
    });
  });

  describe("generateBricks - Límites y Frontera", () => {
    it("debería generar correctamente una matriz en la frontera y límites", () => {

      // Límite inferior
      map["brickColumnCount"] = 4;
      map["brickRowCount"] = 4;
      map.generateBricks();
      expect(map.getBricks().length).toBe(4);
      expect(map.getBricks()[0].length).toBe(4);

      // Frontera
      map["brickColumnCount"] = 5;
      map["brickRowCount"] = 5;
      map.generateBricks();
      expect(map.getBricks().length).toBe(5);
      expect(map.getBricks()[0].length).toBe(5);

      // Límite superior
      map["brickColumnCount"] = 6;
      map["brickRowCount"] = 6;
      map.generateBricks();
      expect(map.getBricks().length).toBe(6);
      expect(map.getBricks()[0].length).toBe(6);
    });

    it("debería manejar valores frontera y límites para ladrillos", () => {

      // Límite inferior
      map["brickColumnCount"] = 0;
      map["brickRowCount"] = 0;
      map.generateBricks();
      expect(map.getBricks().length).toBe(0);

      map["brickColumnCount"] = 1; // Frontera
      map["brickRowCount"] = 1;
      map.generateBricks();
      const brick = map.getBricks()[0][0];
      expect(brick).toBeDefined();

      // Límite superior
      map["brickColumnCount"] = 2;
      map["brickRowCount"] = 2;
      map.generateBricks();
      expect(map.getBricks().length).toBe(2);
    });
  });
});
