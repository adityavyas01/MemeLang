// This is a minimal extension implementation that just provides syntax highlighting
// No activation logic is needed for syntax highlighting and basic features

/**
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {
    console.log('MemeLang extension is now active');
}

/**
 * @param {import('vscode').ExtensionContext} context
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
}; 