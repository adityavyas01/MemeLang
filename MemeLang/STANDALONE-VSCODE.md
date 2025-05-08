# Using MemeLang with VS Code

This guide explains how to set up and use MemeLang's standalone executables with Visual Studio Code.

## Setup

1. **Build or download the standalone executable** for your platform:
   - Windows: `memelang-win-x64.exe`
   - macOS: `memelang-macos-x64`
   - Linux: `memelang-linux-x64`

2. **Place the executable** in a location on your PATH or note its full path

3. **Create a language configuration file** in your project:
   
   Create `.vscode/memelang.language-configuration.json`:
   ```json
   {
     "comments": {
       "lineComment": "//",
       "blockComment": ["/*", "*/"]
     },
     "brackets": [
       ["{", "}"],
       ["[", "]"],
       ["(", ")"]
     ],
     "autoClosingPairs": [
       { "open": "{", "close": "}" },
       { "open": "[", "close": "]" },
       { "open": "(", "close": ")" },
       { "open": "\"", "close": "\"", "notIn": ["string"] },
       { "open": "'", "close": "'", "notIn": ["string"] }
     ],
     "surroundingPairs": [
       ["{", "}"],
       ["[", "]"],
       ["(", ")"],
       ["\"", "\""],
       ["'", "'"]
     ]
   }
   ```

4. **Create a language definition file**:
   
   Create `.vscode/memelang.tmLanguage.json`:
   ```json
   {
     "name": "MemeLang",
     "scopeName": "source.memelang",
     "fileTypes": ["ml"],
     "patterns": [
       {
         "name": "keyword.control.memelang",
         "match": "\\b(hi_bhai|bye_bhai|agar|nahi_to|bas_kar|jab_tak|karo|rakho|dikha|chaap|mera_naam)\\b"
       },
       {
         "name": "constant.numeric.memelang",
         "match": "\\b[0-9]+(?:\\.[0-9]+)?\\b"
       },
       {
         "name": "string.quoted.double.memelang",
         "begin": "\"",
         "end": "\"",
         "patterns": [
           {
             "name": "constant.character.escape.memelang",
             "match": "\\\\."
           }
         ]
       },
       {
         "name": "comment.line.double-slash.memelang",
         "match": "//.*$"
       },
       {
         "name": "comment.block.memelang",
         "begin": "/\\*",
         "end": "\\*/"
       }
     ]
   }
   ```

5. **Configure VS Code tasks for MemeLang**:

   Create or edit `.vscode/tasks.json`:
   ```json
   {
     "version": "2.0.0",
     "tasks": [
       {
         "label": "Run MemeLang Script",
         "type": "shell",
         "command": "path/to/memelang-${command:extension.pickPlatform}",
         "args": ["${file}"],
         "group": {
           "kind": "build",
           "isDefault": true
         },
         "presentation": {
           "reveal": "always",
           "panel": "new"
         },
         "problemMatcher": []
       }
     ],
     "inputs": [
       {
         "id": "extension.pickPlatform",
         "type": "command",
         "command": "extension.commandvariable.pickStringRemember",
         "args": {
           "key": "platform",
           "options": [
             {
               "label": "Windows",
               "value": "win-x64.exe"
             },
             {
               "label": "macOS",
               "value": "macos-x64"
             },
             {
               "label": "Linux",
               "value": "linux-x64"
             }
           ],
           "default": "${platform}" 
         }
       }
     ]
   }
   ```
   
   Replace `path/to/memelang` with the actual path to your MemeLang executable.

6. **Install recommended VS Code extensions**:
   - "Command Variable" for the task input variables
   - "Custom Local Extensions" to register the language configuration

## Usage

1. **Create a MemeLang file** with a `.ml` extension

2. **Run your script**: 
   - Press `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (macOS)
   - Alternatively, open the Command Palette (`Ctrl+Shift+P`) and select "Run Task" > "Run MemeLang Script"

3. **Debugging**: Currently, MemeLang doesn't have integrated debugging support. Use `chaap()` statements for debugging.

## Alternative: Use Tasks Only

If you don't want to set up syntax highlighting, you can simply:

1. Create only the `.vscode/tasks.json` file from step 5
2. Replace the command with the direct path to your executable
3. Run tasks as described in the Usage section

## Creating Custom Extensions (Optional)

For a more integrated experience, you can create a VS Code extension for MemeLang. Follow the [VS Code Extension API](https://code.visualstudio.com/api) documentation to create a full language extension. 