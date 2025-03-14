'use client';

import React, { useState, useEffect } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import { Interpreter } from '../interpreter';
import { execute } from '../index';
import { editor } from 'monaco-editor';

const defaultCode = `hi_bhai
  chaap("Namaste Duniya!");
bye_bhai`;

// Configure Monaco for MemeLang
const configureMemeLanguage = (monaco: Monaco) => {
  // Register a new language
  monaco.languages.register({ id: 'memelang' });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('memelang', {
    tokenizer: {
      root: [
        // Keywords
        [/\b(hi_bhai|bye_bhai|rakho|pakka|chaap|agar|warna|jabtak|wapas|kaam|sahi|galat|kuch_nahi)\b/, 'keyword'],
        
        // Strings
        [/".*?"/, 'string'],
        [/'.*?'/, 'string'],
        
        // Comments
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],
        
        // Numbers
        [/\d+(\.\d+)?/, 'number'],
        
        // Operators
        [/[+\-*/=<>!&|%]+/, 'operator'],
        
        // Identifiers
        [/[a-zA-Z_]\w*/, 'identifier'],
        
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
  const [isRunning, setIsRunning] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    configureMemeLanguage(monaco);
    setEditorLoaded(true);
  };

  const runCode = async () => {
    setIsRunning(true);
    try {
      // Clear previous output before running new code
      setOutput([]);
      const result = await execute(code);
      setOutput(result);
    } catch (error) {
      // Just show the error message without GIFs
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // BhaiLang style - just the meme and error info
      setOutput([
        `😱 𝗘𝗥𝗥𝗢𝗥! 😱`,
        `${errorMessage}`
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                MemeLang
              </h1>
              <span className="px-2 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">
                Beta
              </span>
            </div>
            <button
              onClick={runCode}
              disabled={isRunning}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105 ${
                isRunning
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25'
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Run Code</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Editor</h2>
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
                theme="memelang-theme"
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
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
          <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Output</h2>
              <button
                onClick={() => setOutput([])}
                className="text-gray-400 hover:text-white transition-colors"
                title="Clear output"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div className="h-[600px] p-4 font-mono text-sm overflow-auto bg-gray-900 text-gray-100" role="log">
              <div className="whitespace-pre-wrap">
                {output.length > 0 ? (
                  <div>
                    {output.map((line, index) => {
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
                  <div className="text-gray-500 flex items-center justify-center h-full">
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                      </svg>
                      <p>Run your code to see the output here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Examples Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((example, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-700 cursor-pointer hover:border-blue-500/50 hover:shadow-blue-500/10 transition-all duration-200"
                onClick={() => setCode(example.code)}
              >
                <h3 className="font-medium text-white mb-2">
                  {example.title}
                </h3>
                <p className="text-gray-400 text-sm">{example.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentation.map((section, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
                <h3 className="font-medium text-white mb-3">{section.title}</h3>
                <div className="space-y-3">
                  {section.items.map((item, i) => (
                    <div key={i} className="text-sm">
                      <code className="bg-gray-900 px-3 py-1.5 rounded-lg text-blue-400 font-mono block">
                        {item.syntax}
                      </code>
                      <p className="text-gray-400 mt-2">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

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
];

const documentation = [
  {
    title: 'Program Structure',
    items: [
      {
        syntax: 'hi_bhai',
        description: 'Start your program with this',
      },
      {
        syntax: 'bye_bhai',
        description: 'End your program with this',
      },
    ],
  },
  {
    title: 'Variables',
    items: [
      {
        syntax: 'rakho variable = value',
        description: 'Declare a variable (let)',
      },
      {
        syntax: 'pakka variable = value',
        description: 'Declare a constant (const)',
      },
    ],
  },
  {
    title: 'Control Flow',
    items: [
      {
        syntax: 'agar (condition) { }',
        description: 'If statement',
      },
      {
        syntax: 'warna { }',
        description: 'Else statement',
      },
      {
        syntax: 'jabtak (condition) { }',
        description: 'While loop',
      },
    ],
  },
  {
    title: 'Functions',
    items: [
      {
        syntax: 'kaam name(params) { }',
        description: 'Function declaration',
      },
      {
        syntax: 'wapas value',
        description: 'Return a value from function',
      },
    ],
  },
  {
    title: 'Input/Output',
    items: [
      {
        syntax: 'chaap(value)',
        description: 'Print a value to output',
      },
    ],
  },
  {
    title: 'Data Types',
    items: [
      {
        syntax: 'sahi / galat',
        description: 'Boolean values (true/false)',
      },
      {
        syntax: 'kuch_nahi',
        description: 'Null value',
      },
      {
        syntax: '[1, 2, 3]',
        description: 'Array literal',
      },
    ],
  },
]; 