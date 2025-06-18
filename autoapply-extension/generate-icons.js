const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

// Sizes needed for Chrome extension
const sizes = [16, 48, 128];

async function generateIcons() {
  try {
    console.log('Generating icons for AutoApply Pro extension...');
    
    // Since we can't directly convert SVG to PNG with Canvas in Node.js without additional
    // libraries, we'll create the icons programmatically
    
    for (const size of sizes) {
      // Create a canvas with the desired size
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
        // Helper function for rounded rectangle
      function roundRect(x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      }
      
      // Background
      ctx.fillStyle = '#2563EB';
      roundRect(0, 0, size, size, size * 0.2);
      ctx.fill();
      
      // Document background
      const padding = size * 0.15;
      ctx.fillStyle = '#FFFFFF';
      roundRect(padding, padding, size - padding * 2, size - padding * 2, size * 0.07);
      ctx.fill();
      
      // Document lines
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = Math.max(1, size * 0.04);
      ctx.lineCap = 'round';
      
      // Line 1 (short)
      ctx.beginPath();
      ctx.moveTo(size * 0.25, size * 0.4);
      ctx.lineTo(size * 0.6, size * 0.4);
      ctx.stroke();
      
      // Line 2 (long)
      ctx.beginPath();
      ctx.moveTo(size * 0.25, size * 0.5);
      ctx.lineTo(size * 0.75, size * 0.5);
      ctx.stroke();
      
      // Line 3 (medium)
      ctx.beginPath();
      ctx.moveTo(size * 0.25, size * 0.6);
      ctx.lineTo(size * 0.55, size * 0.6);
      ctx.stroke();
      
      // Auto-fill arrow indicator (only for larger icons)
      if (size >= 48) {
        ctx.strokeStyle = '#FF5757';
        ctx.lineWidth = Math.max(1, size * 0.03);
        
        // Arrow shaft
        ctx.beginPath();
        ctx.moveTo(size * 0.75, size * 0.3);
        ctx.lineTo(size * 0.75, size * 0.7);
        ctx.stroke();
        
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(size * 0.7, size * 0.35);
        ctx.lineTo(size * 0.75, size * 0.3);
        ctx.lineTo(size * 0.8, size * 0.35);
        ctx.stroke();
      }
      
      // Write to file
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(path.join(__dirname, 'icons', `icon${size}.png`), buffer);
      console.log(`Generated icon${size}.png`);
    }
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
