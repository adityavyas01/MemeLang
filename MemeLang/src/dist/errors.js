export class CompileTimeError extends Error {
    constructor(message, position) {
        const line = position ? position.line : 'unknown';
        const column = position ? position.column : 'unknown';
        super(`Arre Bhai Bhai! Kuch gadbad hai: ${message}
      Line ${line}, Position ${column} pe error hai.
      Zara check kar le bhai!`);
        this.position = position;
        this.name = 'CompileTimeError';
    }
}
export class RuntimeError extends Error {
    constructor(message, position) {
        const line = position ? position.line : 'unknown';
        const column = position ? position.column : 'unknown';
        super(`Bhai Runtime pe gadbad ho gayi!
      Error: ${message}
      Line ${line}, Position ${column} pe dekh ek baar.
      Kuch to locha hai bhai!`);
        this.position = position;
        this.name = 'RuntimeError';
    }
}
export class TypeMismatchError extends Error {
    constructor(expected, got, position) {
        const line = position ? position.line : 'unknown';
        const column = position ? position.column : 'unknown';
        super(`Arre Bhai! Type ka chakkar hai:
      Expected: ${expected}
      Got: ${got}
      Line ${line}, Position ${column} pe type match nahi kar raha.
      Sahi type use kar bhai!`);
        this.position = position;
        this.name = 'TypeMismatchError';
    }
}
export class ClassError extends Error {
    constructor(message, position) {
        const line = position ? position.line : 'unknown';
        const column = position ? position.column : 'unknown';
        super(`Bhai, class mein problem hai:
      ${message}
      Line ${line}, Position ${column} pe dekh le ek baar.
      OOP concepts sahi se use kar bhai!`);
        this.position = position;
        this.name = 'ClassError';
    }
}
