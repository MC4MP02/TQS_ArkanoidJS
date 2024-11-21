import { Map } from "../../src/model/Map";

describe("Map", () => {
  let map: Map;

  beforeEach(() => {
    map = new Map();
  });

  it("debería devolver el array de bricks con getBricks", () => {
    expect(map.getBricks()).toEqual([]); // Valor inicial por defecto
  });

  it("debería devolver el número de columnas de ladrillos con getBrickColumnCount", () => {
    expect(map.getBrickColumnCount()).toBe(0); // Valor inicial por defecto
  });

  it("debería devolver el número de filas de ladrillos con getBrickRowCount", () => {
    expect(map.getBrickRowCount()).toBe(0); // Valor inicial por defecto
  });

  it("debería devolver el ancho de los ladrillos con getBrickWidth", () => {
    expect(map.getBrickWidth()).toBe(0); // Valor inicial por defecto
  });

  it("debería devolver la altura de los ladrillos con getBrickHeigth", () => {
    expect(map.getBrickHeigth()).toBe(0); // Valor inicial por defecto
  });

  it("debería devolver valores personalizados asignados a las propiedades", () => {
    // Crear mocks de los bricks
    const mockBrickAlive = {
      BrickX: 0,
      BrickY: 0,
      status: 1,
      color: 0xffffff,
      hit: jest.fn(),
      isHit: jest.fn(),
    };

    const mockBrickDead = {
      BrickX: 100,
      BrickY: 100,
      status: 0,
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
  });

  it("debería reiniciar las propiedades al seleccionar un nivel no válido", () => {
    map.selectLevel(99); // Nivel no válido

    expect(map["brickColumnCount"]).toBe(0);
    expect(map["brickRowCount"]).toBe(0);
    expect(map["brickWidth"]).toBe(0);
    expect(map["brickHeigth"]).toBe(0);
    expect(map["brickPadding"]).toBe(0);
    expect(map["brickOffsetLeft"]).toBe(0);
    expect(map["brickOffsetTop"]).toBe(0);
  });

  it("debería llamar a generateBricks al seleccionar cualquier nivel", () => {
    jest.spyOn(map, "generateBricks");

    map.selectLevel(1); // Nivel válido
    expect(map.generateBricks).toHaveBeenCalled();

    map.selectLevel(99); // Nivel no válido
    expect(map.generateBricks).toHaveBeenCalledTimes(2);
  });
});
