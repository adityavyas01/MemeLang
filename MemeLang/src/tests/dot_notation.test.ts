import { Interpreter } from '../interpreter';

describe('MemeLang Dot Notation Test', () => {
  let interpreter: Interpreter;

  beforeEach(() => {
    interpreter = new Interpreter();
  });

  test('Array length property should be accessible with dot notation', () => {
    const code = `hi_bhai
      rakho numbers = [1, 2, 3, 4, 5];
      rakho sum = 0;
      rakho i = 0;
      
      jabtak i < numbers.length {
        sum = sum + numbers[i];
        i = i + 1;
      }
      
      chaap "Sum: " + sum;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['Sum: 15']);
  });
}); 