"use strict";
/**
 * Custom error messages for MemeLang with Hindi meme references
 */
exports.__esModule = true;
exports.enhanceErrorMessage = exports.getErrorTemplate = void 0;
// Map specific error patterns to specific memes - no randomness
var ERROR_MEME_MAP = {
    // Syntax errors
    'Unexpected token': {
        prefix: "अरे भाई भाई भाई! गलत token लिख दिया तूने!" // Arnab Goswami "Bhai bhai bhai" meme
    },
    'Expected': {
        prefix: "कुछ तो गड़बड़ है, Daya!" // Famous CID dialogue
    },
    'Unterminated': {
        prefix: "ये अधूरा है, पूरा करो!" // "This is incomplete, finish it!"
    },
    'Semicolon': {
        prefix: "25 दिन में पैसा डबल - सेमीकॉलन लगाओ!" // Reference to "21 din me paisa double" scam
    },
    // Scope and variable errors
    'undefined': {
        prefix: "Rasode mein kaun tha? Variable नहीं था!" // Famous "Rasode mein kaun tha" meme
    },
    'already defined': {
        prefix: "Ek baar jo maine commitment kar di..." // Famous Salman Khan dialogue
    },
    'is not defined': {
        prefix: "जिस चीज़ की तलाश है वो है ही नहीं!" // "The thing you're looking for doesn't exist!"
    },
    // Type errors
    'cannot be used as': {
        prefix: "ये शादी नहीं हो सकती!" // "This marriage cannot happen!" - typical drama dialogue
    },
    'is not a function': {
        prefix: "थाली में जूता? Function नहीं है ये!" // "Shoe in a plate?" - inappropriate usage
    },
    'Invalid left-hand': {
        prefix: "तुम मुजे tang करने लगे हो!" // "You're starting to irritate me!" - Famous Big B line
    },
    // Runtime errors
    'division by zero': {
        prefix: "अनंत से मिलने की कोशिश? जीरो से डिवाइड!" // "Trying to meet infinity? Dividing by zero!"
    },
    'stack overflow': {
        prefix: "रिकर्शन में फंस गए? हाथी याद दिला दूं?" // "Stuck in recursion? Let me remind you of the elephant!"
    },
    'out of bounds': {
        prefix: "सीमाओं के बाहर जाना खतरनाक है!" // "Going outside the boundaries is dangerous!"
    },
    // Module errors
    'Cannot find module': {
        prefix: "गुम हो गया! मॉड्यूल नहीं मिला!" // "Lost! Module not found!"
    },
    'module not found': {
        prefix: "कहां हो तुम? मॉड्यूल ढूंढ रहा हूं!" // "Where are you? Looking for a module!"
    },
    'ERR_MODULE_NOT_FOUND': {
        prefix: "404: मॉड्यूल की तलाश जारी है!" // "404: Module search continues!"
    },
    'Error importing module': {
        prefix: "इम्पोर्ट में एरर? अभी कौन सा युग चल रहा है?" // "Error in import? What era is this?"
    },
    // NPM and script errors
    'Missing script': {
        prefix: "स्क्रिप्ट का पता नहीं! कहीं गुम हो गया?" // "Script is missing! Did it get lost somewhere?"
    },
    'npm error': {
        prefix: "NPM भी नाराज़ है! अब क्या करें?" // "NPM is also angry! What to do now?"
    },
    'command not found': {
        prefix: "कमांड नहीं मिली! गोलू की तरह गायब!" // "Command not found! Disappeared like Golu!"
    },
    // Generic/internal errors
    'Internal': {
        prefix: "अंदरूनी गड़बड़! अब ये कहां से आया?" // "Internal mess-up! Where did this come from?"
    },
    // Default
    'default': {
        prefix: "एक गलती से mistake हो गया!" // "By mistake, a mistake happened!" - Famous double-negative
    }
};
/**
 * Find the most appropriate error template for a given error message
 */
function getErrorTemplate(originalMessage) {
    // Try to match with known error patterns
    for (var _i = 0, _a = Object.entries(ERROR_MEME_MAP); _i < _a.length; _i++) {
        var _b = _a[_i], pattern = _b[0], template = _b[1];
        if (originalMessage.toLowerCase().includes(pattern.toLowerCase())) {
            return template;
        }
    }
    // If no match found, return the default template
    return ERROR_MEME_MAP['default'];
}
exports.getErrorTemplate = getErrorTemplate;
/**
 * Extract error type from the error message
 */
function extractErrorType(error) {
    // First try to get from error name property
    if (error.name && error.name !== 'Error') {
        return error.name;
    }
    // Try to extract from the message (e.g., "SyntaxError: ...")
    var typeMatch = error.message.match(/^([A-Z][a-zA-Z]*Error):/);
    if (typeMatch) {
        return typeMatch[1];
    }
    // Check for NPM-specific errors
    if (error.message.includes('npm error')) {
        return 'NPMError';
    }
    // Check for module-related errors
    if (error.message.includes('module') || error.message.includes('Module')) {
        return 'ModuleError';
    }
    return 'Error';
}
/**
 * Enhances an error message with a custom meme-inspired prefix
 * BhaiLang style - just the meme followed by error info without position
 */
function enhanceErrorMessage(originalError) {
    var template = getErrorTemplate(originalError.message);
    var errorType = extractErrorType(originalError);
    // Get the original message without duplication
    var cleanMessage = originalError.message;
    // Get clean error message without any prefix we might have added
    Object.values(ERROR_MEME_MAP).forEach(function (t) {
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
    return "𝗘𝗥𝗥𝗢𝗥\n\n".concat(template.prefix, "\n\n").concat(errorType, ": ").concat(cleanMessage);
}
exports.enhanceErrorMessage = enhanceErrorMessage;

// Add a global error handler for Node.js environments
if (typeof process !== 'undefined') {
    process.on('uncaughtException', function(err) {
        console.error(enhanceErrorMessage(err));
        process.exit(1);
    });
}
