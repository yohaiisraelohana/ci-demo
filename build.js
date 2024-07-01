// build.js

const fs = require('fs');
const path = require('path');

const buildDirectory = path.resolve(__dirname, 'build');
if (!fs.existsSync(buildDirectory)) {
    fs.mkdirSync(buildDirectory);
}

// Copy index.js to build directory
fs.copyFileSync(path.resolve(__dirname, 'index.js'), path.resolve(buildDirectory, 'index.js'));

console.log('Build completed.');
