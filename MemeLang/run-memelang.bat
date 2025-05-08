@echo off
REM MemeLang Docker Runner Script for Windows
REM This script allows running MemeLang scripts without installing Node.js or cloning the repository

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Error: Docker is not installed. Please install Docker first.
  exit /b 1
)

REM Create directories if they don't exist
if not exist scripts mkdir scripts
if not exist examples mkdir examples

REM Check if there's a script file provided
if "%~1"=="" (
  REM Run the container in interactive mode
  docker run --rm -it ^
    -v "%cd%\scripts:/scripts" ^
    -v "%cd%\examples:/examples" ^
    memelang
  exit /b 0
)

set SCRIPT_PATH=%~f1
set SCRIPT_DIR=%~dp1
set SCRIPT_NAME=%~nx1

REM Mount the script's directory and run the script
docker run --rm ^
  -v "%SCRIPT_DIR%:/scripts" ^
  memelang "/scripts/%SCRIPT_NAME%" 