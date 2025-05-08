'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { Interpreter } from '../interpreter';
import { editor } from 'monaco-editor';
import { FaPlay, FaTrash, FaFileAlt, FaSave, FaFolderOpen, FaSun, FaMoon } from 'react-icons/fa';
import type { IconType } from 'react-icons';

// Cast icons to a valid component type
type IconProps = {
  icon: IconType;
  size?: string;
  className?: string;
};

const Icon = ({ icon, size, className, ...props }: IconProps) => {
  const IconComponent = icon as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>>;
  return <IconComponent className={className} style={{ fontSize: size }} {...props} />;
};

// Make the Interpreter available globally for testing
if (typeof window !== 'undefined') {
  (window as any).MemeLangInterpreter = Interpreter;
}

const defaultCode = `hi_bhai
  // Print a simple greeting
  chaap("Namaste Duniya!");
  
  // You can also use multiple print statements
  chaap("Welcome to MemeLang!");
  
  // Basic variable usage
  rakho x = 10;
  chaap("Value of x is: " + x);
bye_bhai
// Program ends with bye_bhai`;

// Configure Monaco for MemeLang
const configureMemeLanguage = (monaco: Monaco) => {
  // Register a new language
  monaco.languages.register({ id: 'memelang' });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('memelang', {
    tokenizer: {
      root: [
        // Comments - handle these first to ensure proper tokenization
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],
        
        // Keywords with word boundaries to prevent partial matches
        [/\b(hi_bhai|bye_bhai|rakho|pakka|chaap|agar|warna|jabtak|wapas|kaam|sahi|galat|kuch_nahi|roko|agla|aur|ya|nahi)\b/, 'keyword'],
        
        // OOP Keywords
        [/\b(class|extends|private|public|protected|static|constructor|this|super|new)\b/, 'keyword'],
        
        // Import/Export Keywords
        [/\b(import|export|from|default)\b/, 'keyword'],
        
        // Strings
        [/".*?"/, 'string'],
        [/'.*?'/, 'string'],
        
        // Numbers
        [/\b\d+(\.\d+)?\b/, 'number'],
        
        // Operators
        [/[+\-*/=<>!&|%]+/, 'operator'],
        
        // Identifiers - must start with letter or underscore
        [/\b[a-zA-Z_]\w*\b/, 'identifier'],
        
        // Brackets and punctuation
        [/[\[\](){},;.]/, 'delimiter'],
      ],
      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment']
      ]
    }
  });

  // Define syntax highlighting for the language
  monaco.languages.setLanguageConfiguration('memelang', {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/']
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    indentationRules: {
      increaseIndentPattern: /^\s*(hi_bhai|agar|jabtak|kaam|warna|class)\b.*$/,
      decreaseIndentPattern: /^\s*(bye_bhai|warna)\b.*$/
    }
  });

  // Define a theme
  monaco.editor.defineTheme('memelang-theme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'comment', foreground: '6A9955' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'operator', foreground: 'D4D4D4' },
      { token: 'identifier', foreground: '9CDCFE' },
      { token: 'delimiter', foreground: 'D4D4D4' }
    ],
    colors: {}
  });

  // Configure the editor
  monaco.editor.setTheme('memelang-theme');
};

export default function Home() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentFileName, setCurrentFileName] = useState<string>('untitled.ml');
  const [showExamples, setShowExamples] = useState<boolean>(false);
  const [showDocs, setShowDocs] = useState<boolean>(false);
  const [showFileManager, setShowFileManager] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<{[path: string]: string}>({});
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    // Check for user preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    // Check for saved code in localStorage
    const savedCode = localStorage.getItem('memelang-code');
    if (savedCode) {
      setCode(savedCode);
    }
    
    // Load saved files from localStorage
    const savedFiles = localStorage.getItem('memelang-files');
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        setFiles(parsedFiles);
      } catch (e) {
        // Ignore parsing errors
        console.error('Failed to parse saved files', e);
      }
    }
  }, []);

  // Save code to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('memelang-code', code);
  }, [code]);

  // Save files to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('memelang-files', JSON.stringify(files));
  }, [files]);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    configureMemeLanguage(monaco);
  };

  const runCode = async () => {
    const currentCode = code.trim();
    console.log("Running code:", currentCode);
    
    if (!currentCode) {
      console.log("No code to run");
      setOutput(["No code to run"]);
      return;
    }
    
    // Check for future features before running the interpreter
    if (currentCode.includes('class ') || currentCode.includes(' extends ')) {
      setOutput([
        "✨ Future Feature: Object-Oriented Programming ✨",
        "",
        "Classes and inheritance are coming in a future release!",
        "",
        "The current version of MemeLang doesn't support OOP yet.",
        "Stay tuned for updates to try this feature."
      ]);
      return;
    }
    
    if (currentCode.includes('import ') || currentCode.includes('export ')) {
      setOutput([
        "✨ Future Feature: Import/Export ✨",
        "",
        "Module system is coming in a future release!",
        "",
        "The current version of MemeLang doesn't support imports/exports yet.",
        "Stay tuned for updates to try this feature."
      ]);
      return;
    }
    
    try {
      console.log("Creating interpreter with code:", currentCode);
      const interpreter = new Interpreter(currentCode);
      console.log("Interpreter created");
      
      const result = await interpreter.interpret(currentCode);
      console.log("Interpretation result:", result);
      
      setOutput(result);
    } catch (error) {
      console.error("Error running code:", error);
      // Split the error message by newlines to display it nicely in the output
      const errorMessage = error instanceof Error ? error.toString() : String(error);
      setOutput(errorMessage.split('\n'));
    }
  };

  const clearOutput = () => {
    setOutput([]);
    setError(null);
  };

  const saveFile = () => {
    // Save the file to our virtual file system
    const updatedFiles = {
      ...files,
      [currentFileName]: code
    };
    setFiles(updatedFiles);
    localStorage.setItem('memelang-files', JSON.stringify(updatedFiles));
    
    // Show a confirmation message
    setOutput([`File "${currentFileName}" saved successfully.`]);
    
    // Save it to the user's machine
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newFileName = file.name;
    setCurrentFileName(newFileName);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setCode(content);
        
        // Add the file to our virtual file system
        const updatedFiles = {
          ...files,
          [newFileName]: content
        };
        setFiles(updatedFiles);
        localStorage.setItem('memelang-files', JSON.stringify(updatedFiles));
        
        // Show a confirmation message
        setOutput([`File "${newFileName}" loaded successfully.`]);
      }
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleExampleClick = (exampleCode: string) => {
    setCode(exampleCode);
    setShowExamples(false);
  };

  const newFile = () => {
    if (confirm("Start a new file? This will clear the current editor content.")) {
      setCode(defaultCode);
      setCurrentFileName('untitled.ml');
    }
  };

  // Function to load a file from our virtual file system
  const loadFileFromSystem = (fileName: string) => {
    if (files[fileName]) {
      setCurrentFileName(fileName);
      setCode(files[fileName]);
      setShowFileManager(false);
      setOutput([`File "${fileName}" loaded from storage.`]);
    } else {
      setError(`File not found: ${fileName}`);
    }
  };

  const deleteFile = (fileName: string) => {
    if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
      const updatedFiles = { ...files };
      delete updatedFiles[fileName];
      setFiles(updatedFiles);
      localStorage.setItem('memelang-files', JSON.stringify(updatedFiles));
      
      if (currentFileName === fileName) {
        setCurrentFileName('untitled.ml');
        setCode(defaultCode);
      }
      
      setOutput([`File "${fileName}" deleted.`]);
    }
  };

  // Add theme toggle functionality
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <main className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text' : 'text-blue-700'}`}>
                MemeLang
              </h1>
              <span className={`px-2 py-1 text-xs font-medium ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700'} rounded-full`}>
                Beta
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'} transition-colors`}
              >
                {theme === 'dark' ? (
                  <Icon icon={FaSun} size="1.2em" />
                ) : (
                  <Icon icon={FaMoon} size="1.2em" />
                )}
              </button>
              <button 
                onClick={newFile}
                title="New file"
                className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'} transition-colors`}
              >
                <Icon icon={FaFileAlt} size="1.2em" />
              </button>
              <button 
                onClick={saveFile}
                title="Save file"
                className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'} transition-colors`}
              >
                <Icon icon={FaSave} size="1.2em" />
              </button>
              <button 
                onClick={triggerFileInput}
                title="Load file"
                className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'} transition-colors`}
              >
                <Icon icon={FaFolderOpen} size="1.2em" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".ml,.txt" 
                onChange={loadFile} 
              />
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Current: {currentFileName}</div>
              <button
                onClick={runCode}
                disabled={isRunning}
                className={`px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105 ${
                  isRunning
                    ? 'bg-gray-600 cursor-not-allowed'
                    : theme === 'dark' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25'
                      : 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 shadow-lg hover:shadow-blue-500/25'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {isRunning ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon={FaPlay} size="0.9em" />
                      <span>Run Code</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
          
          {/* Top Navigation */}
          <div className="flex mt-4">
            <button
              className={`py-2 px-4 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'} ${showFileManager ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => {
                setShowFileManager(!showFileManager);
                setShowExamples(false);
                setShowDocs(false);
              }}
            >
              File Manager
            </button>
            <button
              className={`py-2 px-4 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'} ${showExamples ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => {
                setShowExamples(!showExamples);
                setShowDocs(false);
                setShowFileManager(false);
              }}
            >
              Examples
            </button>
            <button
              className={`py-2 px-4 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'} ${showDocs ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => {
                setShowDocs(!showDocs);
                setShowExamples(false);
                setShowFileManager(false);
              }}
            >
              Documentation
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* File Manager Section */}
        {showFileManager && (
          <div className="mb-8">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
                <Icon icon={FaFolderOpen} className="mr-2" />
                File Manager
              </h2>
              <div className="mb-4">
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                  Files are saved in browser storage.
                </p>
                
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-purple-900/30 border border-purple-800' : 'bg-purple-50 border border-purple-100'} mb-4`}>
                  <div className="flex items-center">
                    <div className={`mr-2 p-1 rounded-full ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-200'}`}>
                      <Icon icon={FaFolderOpen} className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`} />
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                      Import/Export functionality will be available in future updates.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  <div 
                    className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} p-4 rounded-lg cursor-pointer flex items-center justify-center`}
                    onClick={newFile}
                  >
                    <div className="text-center">
                      <Icon icon={FaFileAlt} className={`mx-auto text-3xl mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>New File</span>
                    </div>
                  </div>

                  {Object.keys(files).map((fileName) => (
                    <div 
                      key={fileName}
                      className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg transition-colors relative group ${fileName === currentFileName ? 'border-2 border-blue-500' : ''}`}
                    >
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button 
                          onClick={() => loadFileFromSystem(fileName)}
                          className={`p-1 rounded ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                          title="Open file"
                        >
                          <Icon icon={FaFolderOpen} size="0.8em" />
                        </button>
                        <button 
                          onClick={() => deleteFile(fileName)}
                          className={`p-1 rounded bg-red-500 hover:bg-red-600 text-white`}
                          title="Delete file"
                        >
                          <Icon icon={FaTrash} size="0.8em" />
                        </button>
                      </div>
                      
                      <div 
                        className="cursor-pointer"
                        onClick={() => loadFileFromSystem(fileName)}
                      >
                        <Icon icon={FaFileAlt} className={`mx-auto text-3xl mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} block text-center truncate max-w-[120px]`}>
                          {fileName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {Object.keys(files).length === 0 && (
                  <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg text-center mt-4`}>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      No files saved yet. Save a file to see it here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h2 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Editor</h2>
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>
            <div className="h-[600px]">
              <Editor
                height="100%"
                defaultLanguage="memelang"
                theme={theme === 'dark' ? 'memelang-theme' : 'vs'}
                value={code}
                onChange={(value) => {
                  console.log("Editor onChange called with value:", value);
                  setCode(value || '');
                }}
                onMount={(editor, monaco) => {
                  console.log("Editor mounted with initial value:", editor.getValue());
                  handleEditorDidMount(editor, monaco);
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              />
            </div>
          </div>
          
          {/* Output Section */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h2 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Output</h2>
              <button
                onClick={clearOutput}
                className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                title="Clear output"
              >
                <Icon icon={FaTrash} size="1.2em" />
              </button>
            </div>
            <div 
              className={`h-[600px] p-4 font-mono text-sm overflow-auto ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`} 
              role="log"
              ref={outputRef}
            >
              <div className="whitespace-pre-wrap">
                {error ? (
                  <div className="text-red-500 whitespace-pre-wrap">{error}</div>
                ) : (
                  output.length > 0 ? (
                    <div>
                      {output.map((line, index) => {
                        // Check if it's a future feature message
                        if (line.includes('✨ Future Feature:')) {
                          return (
                            <div key={index} className="text-center text-purple-400 font-bold text-xl mb-2">
                              {line}
                            </div>
                          );
                        }
                        
                        // Check if it's the error title line
                        if (line.includes('𝗘𝗥𝗥𝗢𝗥')) {
                          return (
                            <div key={index} className="text-center text-red-500 font-bold text-xl mb-2 animate-pulse">
                              {line}
                            </div>
                          );
                        }
                        
                        // Format error message with colored components
                        const isErrorLine = line.includes('Error');
                        if (isErrorLine) {
                          // Style the whole error line in red
                          return <div key={index} className="text-red-400 font-mono">{line}</div>;
                        }
                        
                        // Style Hindi meme phrases
                        if (/[\u0900-\u097F]/.test(line)) { // If contains Hindi characters
                          return <div key={index} className="text-cyan-300 font-bold italic my-1">{line}</div>;
                        }
                        
                        // Regular line
                        return <div key={index}>{line}</div>;
                      })}
                    </div>
                  ) : (
                    <div className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} flex items-center justify-center h-full`}>
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                        </svg>
                        <p>Run your code to see the output here</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Examples Section - Now below editor/output */}
        {showExamples && (
          <div className="mt-8">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
                <Icon icon={FaFolderOpen} className="mr-2" />
                Examples
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examples.map((example, index) => (
                  <div
                    key={index}
                    className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-xl shadow-xl border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'} cursor-pointer hover:border-blue-500/50 hover:shadow-blue-500/10 transition-all duration-200`}
                    onClick={() => setCode(example.code)}
                  >
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2 flex items-center`}>
                      {example.title}
                      {example.description.includes('Coming Soon') && (
                        <span className={`ml-2 px-2 py-0.5 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full`}>
                          Future
                        </span>
                      )}
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{example.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Documentation Section */}
        {showDocs && (
          <div className="mt-8">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
                <Icon icon={FaFolderOpen} className="mr-2" />
                Documentation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documentation.map((section, index) => (
                  <div key={index} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-xl shadow-xl border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-3`}>
                      {section.title}
                      {section.title.includes('Coming Soon') && (
                        <span className={`ml-2 px-2 py-0.5 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full`}>
                          Future
                        </span>
                      )}
                    </h3>
                    <div className="space-y-3">
                      {section.items.map((item, i) => (
                        <div key={i} className="text-sm">
                          <code className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} px-3 py-1.5 rounded-lg font-mono block`}>
                            {item}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Updated examples to include import/export example
const examples = [
  {
    title: 'Hello World',
    description: 'A simple hello world program',
    code: `hi_bhai
  chaap("Namaste Duniya!");
bye_bhai`,
  },
  {
    title: 'Variables',
    description: 'Working with variables',
    code: `hi_bhai
  rakho naam = "Rahul";
  rakho umar = 25;
  chaap("Naam: " + naam);
  chaap("Umar: " + umar);
bye_bhai`,
  },
  {
    title: 'Conditional Statements',
    description: 'Using if-else conditions',
    code: `hi_bhai
  rakho umar = 20;
  
  agar (umar >= 18) {
    chaap("Aap vote kar sakte hain!");
  } warna {
    chaap("Aap abhi vote nahi kar sakte!");
  }
bye_bhai`,
  },
  {
    title: 'Loops',
    description: 'Using while loops',
    code: `hi_bhai
  rakho count = 1;
  
  jabtak (count <= 5) {
    chaap("Count: " + count);
    count = count + 1;
  }
bye_bhai`,
  },
  {
    title: 'Functions',
    description: 'Creating and using functions',
    code: `hi_bhai
  kaam namaste(naam) {
    wapas "Namaste, " + naam + "!";
  }
  
  rakho sandesh = namaste("Rahul");
  chaap(sandesh);
bye_bhai`,
  },
  {
    title: 'Arrays',
    description: 'Working with arrays',
    code: `hi_bhai
  rakho numbers = [1, 2, 3, 4, 5];
  rakho sum = 0;
  rakho i = 0;
  
  jabtak (i < numbers.length) {
    sum = sum + numbers[i];
    i = i + 1;
  }
  
  chaap("Sum: " + sum);
bye_bhai`,
  },
  {
    title: 'Object-Oriented Programming',
    description: 'Using classes and inheritance (Coming Soon)',
    code: `hi_bhai
  // Define a Person class
  class Person {
    // Constructor
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
    
    // Method to greet
    namaste() {
      chaap("Namaste, my name is " + this.name + " and I am " + this.age + " years old.");
    }
    
    // Method to have a birthday
    birthday() {
      this.age = this.age + 1;
      chaap(this.name + " is now " + this.age + " years old!");
    }
  }
  
  // Define a Student class that extends Person
  class Student extends Person {
    // Constructor with super call
    constructor(name, age, subject) {
      super(name, age);
      this.subject = subject;
    }
    
    // Override the namaste method
    namaste() {
      chaap("Namaste, I am " + this.name + ", a student of " + this.subject + ".");
    }
    
    // Method to study
    study() {
      chaap(this.name + " is studying " + this.subject + "!");
    }
  }
  
  // Create a Person instance
  rakho rahul = new Person("Rahul", 25);
  rahul.namaste();
  rahul.birthday();
  
  // Create a Student instance
  rakho priya = new Student("Priya", 20, "Computer Science");
  priya.namaste();
  priya.study();
  priya.birthday();
bye_bhai`,
  },
  {
    title: 'Error Showcase',
    description: 'Fun Hindi meme error messages',
    code: `hi_bhai
  chaap("=== MemeLang Error Showcase ===");
  chaap("Uncomment any ERROR line to see its meme!");
  chaap("-----------------------------------");
  
  // 1. VARIABLE NOT DEFINED ERROR
  // Shows: "Rasode mein kaun tha? Variable नहीं था!"
  // chaap(undefinedVariable);
  
  // 2. MISSING SEMICOLON ERROR 
  // Shows: "25 दिन में पैसा डबल - सेमीकॉलन लगाओ!"
  // chaap("Missing semicolon")
  
  // 3. DIVISION BY ZERO ERROR
  // Shows: "अनंत से मिलने की कोशिश? जीरो से डिवाइड!"
  // rakho boom = 5 / 0;
  
  // 4. ARRAY OUT OF BOUNDS ERROR
  // Shows: "सीमाओं के बाहर जाना खतरनाक है!"
  // rakho arr = [1, 2, 3]; chaap(arr[99]);
  
  // 5. NOT A FUNCTION ERROR
  // Shows: "थाली में जूता? Function नहीं है ये!"
  // rakho notAFunction = 42; notAFunction();
  
  // 6. INVALID ASSIGNMENT ERROR
  // Shows: "तुम मुजे tang करने लगे हो!"
  // 5 = 10;
  
  chaap("Each error comes with a Hindi meme phrase!");
bye_bhai`,
  },
  {
    title: 'Import/Export',
    description: 'Using modules with import/export (Coming Soon)',
    code: `// IMPORTANT: This feature is coming soon!
// Import/Export functionality will be available in future updates

hi_bhai
  // Export a function to add two numbers
  export kaam add(a, b) {
    wapas a + b;
  }
  
  // Export a function to subtract two numbers
  export kaam subtract(a, b) {
    wapas a - b;
  }
  
  // Export a constant value of PI
  export pakka PI = 3.14159;
  
  // Export default multiplication function
  export default kaam multiply(a, b) {
    wapas a * b;
  }
bye_bhai

// --- MAIN.ML FILE CONTENT ---
// After saving math.ml, create a new file with this content:

hi_bhai
  // Import specific functions from a module
  import { add, subtract, PI } from "./math.ml";
  
  // Import the default export
  import multiply from "./math.ml";
  
  // Using the imported functions
  rakho sum = add(5, 3);
  chaap("Sum: " + sum);  // Output: 8
  
  rakho difference = subtract(10, 4);
  chaap("Difference: " + difference);  // Output: 6
  
  chaap("PI value: " + PI);  // Output: 3.14159
  
  rakho product = multiply(6, 7);
  chaap("Product: " + product);  // Output: 42
bye_bhai

// Note: Import/Export functionality is planned for future releases.
`,
  },
];

// Updated documentation to include detailed explanations for all keywords
const documentation = [
  {
    title: 'Program Structure',
    items: [
      'hi_bhai - Begins a program (similar to "main" in C/C++)',
      'bye_bhai - Ends a program block',
    ],
  },
  {
    title: 'Variables & Constants',
    items: [
      'rakho name = value - Declares a variable (similar to "let" or "var")',
      'pakka name = value - Declares a constant (similar to "const")',
    ],
  },
  {
    title: 'Conditionals',
    items: [
      'agar (condition) { } - If statement (evaluates condition)',
      'warna { } - Else statement (runs when condition is false)',
      'sahi - Boolean true value',
      'galat - Boolean false value',
      'kuch_nahi - Null value',
    ],
  },
  {
    title: 'Loops',
    items: [
      'jabtak (condition) { } - While loop (repeats until condition is false)',
      'roko - Break statement (exits the current loop)',
      'agla - Continue statement (skips to next iteration)',
    ],
  },
  {
    title: 'Functions',
    items: [
      'kaam name(param1, param2) { } - Function declaration',
      'wapas value - Return statement (returns a value from function)',
    ],
  },
  {
    title: 'Input/Output',
    items: [
      'chaap(value) - Prints value to output (like "console.log" or "print")',
      'input() - Gets user input (returns as string)',
    ],
  },
  {
    title: 'Operators',
    items: [
      '= - Assignment operator',
      '+ - Addition or string concatenation',
      '- - Subtraction',
      '* - Multiplication',
      '/ - Division',
      '% - Modulo (remainder)',
      '== - Equality comparison',
      '!= - Inequality comparison',
      '< - Less than',
      '<= - Less than or equal to',
      '> - Greater than',
      '>= - Greater than or equal to',
      '&& - Logical AND',
      '|| - Logical OR',
      '! - Logical NOT',
    ],
  },
  {
    title: 'Data Structures',
    items: [
      'Arrays: [1, 2, 3] - Creates an array of values',
      'Array access: arr[index] - Accesses element at position',
      'Array length: arr.length - Gets number of elements in array',
    ],
  },
  {
    title: 'Classes & OOP (Coming Soon)',
    items: [
      'class ClassName { } - Creates a class',
      'class Child extends Parent { } - Inheritance (Child inherits from Parent)',
      'constructor(params) { } - Constructor method (creates object)',
      'this.property - Refers to instance property',
      'super(params) - Calls parent class constructor',
      'new ClassName(args) - Creates a new class instance',
    ],
  },
  {
    title: 'Access Modifiers (Coming Soon)',
    items: [
      'public method() { } - Method accessible from outside the class',
      'private method() { } - Method only accessible within the class',
      'protected method() { } - Method accessible within class and subclasses',
      'static method() { } - Method callable on the class itself, not instances',
    ],
  },
  {
    title: 'Modules & Import/Export (Coming Soon)',
    items: [
      'export kaam funcName() { } - Exports a function for use in other files',
      'export pakka CONST_NAME = value - Exports a constant',
      'export default expression - Exports a default value from module',
      'import { name1, name2 } from "./path.ml" - Named imports',
      'import defaultExport from "./path.ml" - Default import',
      'import * as name from "./path.ml" - Namespace import (all exports)',
    ],
  },
]; 