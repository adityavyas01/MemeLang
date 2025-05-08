const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if pkg is installed
try {
  require.resolve('pkg');
} catch (e) {
  console.log('Installing pkg...');
  exec('npm install -g pkg', (error) => {
    if (error) {
      console.error('Error installing pkg:', error);
      process.exit(1);
    }
    buildExecutable();
  });
}

function buildExecutable() {
  console.log('Building standalone MemeLang executable...');
  
  // Create a temporary package.json for pkg
  const pkgConfig = {
    name: "memelang-standalone",
    version: "1.0.0",
    bin: "./src/cli.js",
    pkg: {
      assets: [
        "dist/**/*",
        "src/**/*"
      ],
      targets: [
        "node16-win-x64",
        "node16-macos-x64",
        "node16-linux-x64"
      ],
      outputPath: "standalone/dist"
    }
  };
  
  // Create standalone directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
  }
  
  // Write temporary package.json
  fs.writeFileSync(
    path.join(__dirname, 'pkg-config.json'),
    JSON.stringify(pkgConfig, null, 2)
  );
  
  // Run pkg
  exec('pkg -c standalone/pkg-config.json .', (error, stdout, stderr) => {
    if (error) {
      console.error('Error building executable:', error);
      console.error(stderr);
      process.exit(1);
    }
    
    console.log(stdout);
    console.log('Standalone executables built successfully!');
    console.log('You can find them in the standalone/dist directory.');
    
    // Clean up
    fs.unlinkSync(path.join(__dirname, 'pkg-config.json'));
  });
}

// If pkg is already installed, build the executable
if (process.argv[2] !== 'installing') {
  buildExecutable();
} 