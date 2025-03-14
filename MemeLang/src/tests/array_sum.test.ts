import { Interpreter } from '../interpreter';

describe('MemeLang Array Sum Test', () => {
  let interpreter: Interpreter;

  beforeEach(() => {
    interpreter = new Interpreter();
  });

  test('Array sum should calculate correctly', () => {
    const code = `hi_bhai
      rakho numbers = [1, 2, 3, 4, 5];
      rakho sum = 0;
      rakho i = 0;
      rakho count = 5; // Explicitly use the array length
      
      jabtak i < count {
        sum = sum + numbers[i];
        i = i + 1;
      }
      
      chaap "Sum: " + sum;
    bye_bhai`;
    
    const result = interpreter.interpret(code);
    expect(result).toEqual(['Sum: 15']);
  });
}); 