#!/bin/bash

# MemeLang Docker Runner Script
# This script allows running MemeLang scripts without installing Node.js or cloning the repository

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "Error: Docker is not installed. Please install Docker first."
  exit 1
fi

# Create directories if they don't exist
mkdir -p scripts
mkdir -p examples

# Check if there's a script file provided
if [ $# -eq 0 ]; then
  # Run the container in interactive mode
  docker run --rm -it \
    -v "$(pwd)/scripts:/scripts" \
    -v "$(pwd)/examples:/examples" \
    memelang
  exit 0
fi

SCRIPT_PATH="$1"
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
SCRIPT_NAME="$(basename "$SCRIPT_PATH")"

# Mount the script's directory and run the script
docker run --rm \
  -v "$(cd "$SCRIPT_DIR" && pwd):/scripts" \
  memelang "/scripts/$SCRIPT_NAME" 