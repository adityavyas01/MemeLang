import { MemeLang } from '../src/index';
describe('Interpreter', () => {
    let memelang;
    beforeEach(() => {
        memelang = new MemeLang();
    });
    test('evaluates arithmetic expressions', () => {
        expect(memelang.execute('2 + 3 * 4')).toBe(14);
        expect(memelang.execute('(2 + 3) * 4')).toBe(20);
        expect(memelang.execute('10 - 5 / 2')).toBe(7.5);
    });
    test('handles variable declarations and assignments', () => {
        const program = `
      rakho x = 10;
      rakho y = 20;
      x + y
    `;
        expect(memelang.execute(program)).toBe(30);
    });
    test('handles if statements', () => {
        const program = `
      rakho x = 10;
      agar (x > 5) {
        x = x * 2;
      } warna {
        x = x / 2;
      }
      x
    `;
        expect(memelang.execute(program)).toBe(20);
    });
    test('handles while loops', () => {
        const program = `
      rakho sum = 0;
      rakho i = 1;
      jabtak (i <= 5) {
        sum = sum + i;
        i = i + 1;
      }
      sum
    `;
        expect(memelang.execute(program)).toBe(15);
    });
    test('handles function declarations and calls', () => {
        const program = `
      karna factorial(n) {
        agar (n <= 1) {
          wapis 1;
        }
        wapis n * factorial(n - 1);
      }
      factorial(5)
    `;
        expect(memelang.execute(program)).toBe(120);
    });
    test('handles arrays', () => {
        const program = `
      rakho arr = [1, 2, 3, 4, 5];
      rakho sum = 0;
      rakho i = 0;
      jabtak (i < len(arr)) {
        sum = sum + arr[i];
        i = i + 1;
      }
      sum
    `;
        expect(memelang.execute(program)).toBe(15);
    });
    test('handles string operations', () => {
        const program = `
      rakho name = "World";
      "Hello, " + name + "!"
    `;
        expect(memelang.execute(program)).toBe("Hello, World!");
    });
    test('handles logical operators', () => {
        expect(memelang.execute('sahi aur sahi')).toBe(true);
        expect(memelang.execute('sahi aur galat')).toBe(false);
        expect(memelang.execute('sahi ya galat')).toBe(true);
        expect(memelang.execute('nahi galat')).toBe(true);
    });
    test('handles comparison operators', () => {
        expect(memelang.execute('5 > 3')).toBe(true);
        expect(memelang.execute('5 < 3')).toBe(false);
        expect(memelang.execute('5 >= 5')).toBe(true);
        expect(memelang.execute('5 <= 4')).toBe(false);
        expect(memelang.execute('5 == 5')).toBe(true);
        expect(memelang.execute('5 != 4')).toBe(true);
    });
    test('handles runtime errors', () => {
        expect(() => memelang.execute('x + 1')).toThrow(); // Undefined variable
        expect(() => memelang.execute('1 / 0')).toThrow(); // Division by zero
        expect(() => memelang.execute('badlo x = 1; x = 2;')).toThrow(); // Reassigning const
    });
    test('handles built-in functions', () => {
        expect(memelang.execute('len([1, 2, 3])')).toBe(3);
        expect(memelang.execute('type(42)')).toBe("number");
        expect(memelang.execute('type("hello")')).toBe("string");
    });
});
