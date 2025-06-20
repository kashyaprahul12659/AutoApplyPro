const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create a file to stream archive data to
const output = fs.createWriteStream(path.join(__dirname, '..', 'frontend', 'public', 'autoapply-extension.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log('Extension packaged successfully!');
  console.log(`Total size: ${archive.pointer()} bytes`);
});

// Good practice to catch warnings
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

// Handle errors
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files
const filesToInclude = [
  'manifest.json',
  'popup.html',
  'popup.js',
  'content.js',
  'background.js',
  'utils.js',
  'listener.js',
  'jd-analyzer.js',
  'README.md'
];

filesToInclude.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    archive.file(filePath, { name: file });
    console.log(`Added ${file} to extension package`);
  } else {
    console.warn(`Warning: ${file} not found, skipping...`);
  }
});

// Add utils directory
const utilsDir = path.join(__dirname, 'utils');
if (fs.existsSync(utilsDir)) {
  archive.directory(utilsDir, 'utils');
  console.log('Added utils directory to extension package');
}

// Add icons directory
const iconsDir = path.join(__dirname, 'icons');
if (fs.existsSync(iconsDir)) {
  archive.directory(iconsDir, 'icons');
  console.log('Added icons directory to extension package');
} else {
  console.warn('Warning: icons directory not found');
}

// Finalize the archive
archive.finalize();
