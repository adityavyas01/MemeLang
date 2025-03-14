/**
 * Custom error messages for MemeLang with Hindi meme references
 */

interface ErrorMemeTemplate {
  prefix: string;  // Hindi/Bollywood meme reference
}

// Map specific error patterns to specific memes - no randomness
const ERROR_MEME_MAP: Record<string, ErrorMemeTemplate> = {
  // Syntax errors
  'Unexpected token': {
    prefix: "अरे भाई भाई भाई! गलत token लिख दिया तूने!"  // Arnab Goswami "Bhai bhai bhai" meme
  },
  'Expected': {
    prefix: "कुछ तो गड़बड़ है, Daya!"  // Famous CID dialogue
  },
  'Unterminated': {
    prefix: "ये अधूरा है, पूरा करो!"  // "This is incomplete, finish it!"
  },
  'Semicolon': {
    prefix: "25 दिन में पैसा डबल - सेमीकॉलन लगाओ!"  // Reference to "21 din me paisa double" scam
  },
  
  // Scope and variable errors
  'undefined': {
    prefix: "Rasode mein kaun tha? Variable नहीं था!"  // Famous "Rasode mein kaun tha" meme
  },
  'already defined': {
    prefix: "Ek baar jo maine commitment kar di..."  // Famous Salman Khan dialogue
  },
  'is not defined': {
    prefix: "जिस चीज़ की तलाश है वो है ही नहीं!"  // "The thing you're looking for doesn't exist!"
  },
  
  // Type errors
  'cannot be used as': {
    prefix: "ये शादी नहीं हो सकती!"  // "This marriage cannot happen!" - typical drama dialogue
  },
  'is not a function': {
    prefix: "थाली में जूता? Function नहीं है ये!"  // "Shoe in a plate?" - inappropriate usage
  },
  'Invalid left-hand': {
    prefix: "तुम मुजे tang करने लगे हो!"  // "You're starting to irritate me!" - Famous Big B line
  },
  
  // Runtime errors
  'division by zero': {
    prefix: "अनंत से मिलने की कोशिश? जीरो से डिवाइड!"  // "Trying to meet infinity? Dividing by zero!"
  },
  'stack overflow': {
    prefix: "रिकर्शन में फंस गए? हाथी याद दिला दूं?"  // "Stuck in recursion? Let me remind you of the elephant!"
  },
  'out of bounds': {
    prefix: "सीमाओं के बाहर जाना खतरनाक है!"  // "Going outside the boundaries is dangerous!"
  },
  
  // Default
  'default': {
    prefix: "एक गलती से mistake हो गया!"  // "By mistake, a mistake happened!" - Famous double-negative
  }
};

/**
 * Find the most appropriate error template for a given error message
 */
export function getErrorTemplate(originalMessage: string): ErrorMemeTemplate {
  // Try to match with known error patterns
  for (const [pattern, template] of Object.entries(ERROR_MEME_MAP)) {
    if (originalMessage.toLowerCase().includes(pattern.toLowerCase())) {
      return template;
    }
  }
  
  // If no match found, return the default template
  return ERROR_MEME_MAP['default'];
}

/**
 * Extract error type from the error message
 */
function extractErrorType(error: Error): string {
  // First try to get from error name property
  if (error.name && error.name !== 'Error') {
    return error.name;
  }
  
  // Try to extract from the message (e.g., "SyntaxError: ...")
  const typeMatch = error.message.match(/^([A-Z][a-zA-Z]*Error):/);
  if (typeMatch) {
    return typeMatch[1];
  }
  
  return 'Error';
}

/**
 * Enhances an error message with a custom meme-inspired prefix
 * BhaiLang style - just the meme followed by error info without position
 */
export function enhanceErrorMessage(originalError: Error): string {
  const template = getErrorTemplate(originalError.message);
  const errorType = extractErrorType(originalError);
  
  // Get the original message without duplication
  let cleanMessage = originalError.message;
  
  // Get clean error message without any prefix we might have added
  Object.values(ERROR_MEME_MAP).forEach(t => {
    if (cleanMessage.startsWith(t.prefix)) {
      cleanMessage = cleanMessage.substring(t.prefix.length).trim();
      // Remove any leading newlines
      cleanMessage = cleanMessage.replace(/^\n+/, '');
    }
  });
  
  // Clean up error message of any line/position info
  cleanMessage = cleanMessage.replace(/(?:at |^)(?:line|line:)\s*\d+(?:,| |:|,\s|\s+)(?:column|col|position|char)(?:umn)?\s*\d+/i, '');
  cleanMessage = cleanMessage.replace(/(?:at |^)(?:line|line:)\s*\d+/i, '');
  cleanMessage = cleanMessage.trim();
  
  // Format the error with type information but no position
  return `${template.prefix}\n\n${errorType}: ${cleanMessage}`;
} 