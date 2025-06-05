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
  'README.md'
];

filesToInclude.forEach(file => {
  archive.file(path.join(__dirname, file), { name: file });
});

// Add icons directory
archive.directory(path.join(__dirname, 'icons'), 'icons');

// Finalize the archive
archive.finalize();
