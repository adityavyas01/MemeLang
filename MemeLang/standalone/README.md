# MemeLang Standalone Executables

This directory contains standalone executables for MemeLang. These executables allow you to run MemeLang without installing Node.js or any other dependencies.

## Download

Pre-built executables are available for download:

- [Windows (64-bit)](https://github.com/yourusername/MemeLang/releases/latest/download/memelang-win-x64.exe)
- [macOS (64-bit)](https://github.com/yourusername/MemeLang/releases/latest/download/memelang-macos-x64)
- [Linux (64-bit)](https://github.com/yourusername/MemeLang/releases/latest/download/memelang-linux-x64)

## Usage

### Windows

```cmd
memelang-win-x64.exe your-script.ml
```

### macOS

```bash
chmod +x memelang-macos-x64
./memelang-macos-x64 your-script.ml
```

### Linux

```bash
chmod +x memelang-linux-x64
./memelang-linux-x64 your-script.ml
```

## Building the Executables

If you want to build the executables yourself:

1. Ensure you have Node.js installed
2. Clone the MemeLang repository
3. Run the build script:

```bash
cd MemeLang
node standalone/build-standalone.js
```

The executables will be created in the `standalone/dist` directory.

## MemeLang Syntax

- Programs start with `hi_bhai` and end with `bye_bhai`
- Declare variables with `rakho`
- Print to console with `chaap()`
- Statements end with semicolons
- For more syntax details, refer to the main [MemeLang README.md](../README.md) 