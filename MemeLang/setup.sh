#!/bin/bash

# MemeLang Setup Script
echo "🚀 Setting up MemeLang..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d "v" -f 2 | cut -d "." -f 1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version 14 or higher is required. You have version $NODE_VERSION."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file from example..."
    cp .env.example .env
fi

# Build the project
echo "🔨 Building MemeLang..."
npm run build

echo "✅ MemeLang is ready! Run 'npm run dev' to start the development server." 