# MemeLang VS Code Extension Installation Guide

This guide will help you install the MemeLang VS Code extension to provide syntax highlighting and language support for MemeLang files.

## Prerequisites

- Visual Studio Code (1.60.0 or higher)

## Installation Method 1: Install from Directory

1. Navigate to your VS Code extensions directory:
   - Windows: `%USERPROFILE%\.vscode\extensions` (typically `C:\Users\<username>\.vscode\extensions`)
   - macOS: `~/.vscode/extensions`
   - Linux: `~/.vscode/extensions`

2. Create a new folder called `memelang` and copy all the files from this extension directory into it.

3. Restart VS Code.

## Installation Method 2: Building and Installing VSIX Package

If you have Node.js and npm installed, you can build a VSIX package:

1. Install the VS Code Extension Manager:
   ```
   npm install -g @vscode/vsce
   ```

2. Navigate to the extension directory.

3. Build the VSIX package:
   ```
   vsce package
   ```

4. Install the extension:
   - In VS Code, press `Ctrl+Shift+X` to open the Extensions view
   - Click on the "..." menu (top-right of Extensions view)
   - Select "Install from VSIX..."
   - Browse to the generated `.vsix` file and select it

## Usage

After installation:

1. Files with the `.memelang` extension will automatically use the MemeLang syntax highlighting.

2. For existing files without the `.memelang` extension, you can:
   - Click on the language mode indicator in the bottom-right of VS Code
   - Select "MemeLang" from the language selection menu

3. Enjoy syntax highlighting, bracket matching, and other language features!

## Troubleshooting

If syntax highlighting doesn't work after installation:

1. Ensure VS Code has been restarted completely.
2. Check if the language mode is set to "MemeLang" (bottom-right language indicator).
3. Verify the extension is installed by checking the Extensions view (`Ctrl+Shift+X`).

If you continue to experience issues, please report them on our GitHub repository. 