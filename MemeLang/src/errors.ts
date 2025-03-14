export class CompileError extends Error {
  constructor(
    message: string,
    public line?: number,
    public column?: number
  ) {
    // No longer adding random meme suffixes
    super(`${message}`);
    this.name = 'CompileError';
  }

  toString(): string {
    if (this.line !== undefined && this.column !== undefined) {
      return `${this.name}: ${this.message} at line ${this.line}, column ${this.column}`;
    }
    return `${this.name}: ${this.message}`;
  }
}

export class RuntimeError extends Error {
  constructor(
    message: string,
    public line?: number,
    public column?: number
  ) {
    // No longer adding random meme suffixes
    super(`${message}`);
    this.name = 'RuntimeError';
  }

  toString(): string {
    if (this.line !== undefined && this.column !== undefined) {
      return `${this.name}: ${this.message} at line ${this.line}, column ${this.column}`;
    }
    return `${this.name}: ${this.message}`;
  }
}

export class TypeError extends Error {
  constructor(
    message: string,
    public line?: number,
    public column?: number
  ) {
    // No longer adding random meme suffixes
    super(`Type Error: ${message}`);
    this.name = 'TypeError';
    
    // Ensure line and column are accessible
    if (line !== undefined) this.line = line;
    if (column !== undefined) this.column = column;
  }
}

export class SyntaxError extends Error {
  constructor(
    message: string,
    public line?: number,
    public column?: number
  ) {
    // No longer adding random meme suffixes
    super(`Syntax Error: ${message}`);
    this.name = 'SyntaxError';
    
    // Ensure line and column are accessible
    if (line !== undefined) this.line = line;
    if (column !== undefined) this.column = column;
  }
}

// Function to get a random meme error suffix - keeping for reference but no longer used
function getRandomMemeErrorSuffix(): string {
  const memeSuffixes = [
    "Ye kya kar diya tune bhai?",                    // What have you done, bro?
    "Aise kaise chalega?",                           // How will this work?
    "Kuch toh gadbad hai Daya!",                     // Something's fishy, Daya! (CID reference)
    "Rasode mein kaun tha? Error tha!",              // Who was in the kitchen? It was the error! (Famous meme)
    "Bade harami ho beta tum!",                      // You're very naughty (Meme reference)
    "Error 404: Logic not found!",                   // Tech humor with Hindi context
    "Abey Saale!",                                   // Oh you! (Common exclamation)
    "Dekh ke coding kar, andha hai kya?",            // Code carefully, are you blind?
    "Ye toh hona hi tha!",                           // This was bound to happen!
    "Aap chronology samajhiye!",                     // Understand the chronology! (Political meme)
    "Itni galti kaise kar di tune?",                 // How did you make such a mistake?
    "Thoda dhyan kidhar hai bhai?",                  // Where is your attention, brother?
    "Ye error nahi hai, ye emotion hai!",            // This is not an error, this is an emotion!
    "Kehna kya chahte ho?",                          // What are you trying to say?
    "Jor jor se bolke sabko scheme bata de!",        // Loudly announce your scheme to everyone! (Meme)
    "Pappu pass ho gaya!",                           // Pappu passed! (Ironically)
    "Babu bhaiya, yeh galat hai!",                   // Babu bhaiya, this is wrong! (Hera Pheri reference)
    "Abba dabba jabba!",                             // Nonsensical phrase (3 Idiots reference)
    "Utha le re baba, utha le!",                     // Take him away, God! (Golmaal reference)
    "Control Uday, control!",                        // Control yourself Uday! (Welcome reference)
  ];
  
  return memeSuffixes[Math.floor(Math.random() * memeSuffixes.length)];
} 