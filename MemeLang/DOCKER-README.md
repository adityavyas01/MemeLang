# MemeLang Docker Setup

MemeLang is a fun programming language with Hindi meme-inspired syntax. This Docker setup allows you to run MemeLang without having to install Node.js or clone the repository.

## Prerequisites

- Docker installed on your system
  - [Install Docker](https://docs.docker.com/get-docker/)

## Quick Start

### Step 1: Build the Docker image

```bash
# Clone this repo (one-time only)
git clone https://github.com/yourusername/MemeLang.git
cd MemeLang

# Build the Docker image
docker build -t memelang -f Dockerfile.cli .
```

### Step 2: Run MemeLang scripts

#### Using the provided script runners:

On Linux/macOS:
```bash
chmod +x run-memelang.sh
./run-memelang.sh your-script.ml
```

On Windows:
```cmd
run-memelang.bat your-script.ml
```

#### Or directly with Docker:

```bash
docker run --rm -v "/path/to/your/scripts:/scripts" memelang your-script.ml
```

## Example Scripts

An example script is included in the Docker image:

```bash
# Run the example script
docker run --rm memelang /app/examples/test-script.ml
```

## Creating MemeLang Scripts

Create a file with `.ml` extension and write MemeLang code:

```
hi_bhai
  rakho x = 10;
  rakho y = 20;
  rakho sum = x + y;
  chaap("Sum is: " + sum);
bye_bhai
```

Save this to a file (e.g., `myscript.ml`) and run it:

```bash
./run-memelang.sh myscript.ml
```

## MemeLang Syntax

- Programs start with `hi_bhai` and end with `bye_bhai`
- Declare variables with `rakho`
- Print to console with `chaap()`
- Statements end with semicolons
- For more syntax details, refer to the main [MemeLang README.md](README.md)

## Distribution

If you want to share MemeLang with others:

1. Publish the Docker image to Docker Hub:

```bash
docker tag memelang yourusername/memelang:latest
docker push yourusername/memelang:latest
```

2. Share the run scripts, and users can run:

```bash
docker pull yourusername/memelang:latest
```

Then they can use the run scripts to execute MemeLang programs.

## Contributing

Feel free to contribute to MemeLang! See the main [README.md](README.md) for more details. 