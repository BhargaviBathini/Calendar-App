const { spawn } = require('child_process');
const path = require('path');

// Start MongoDB check script
console.log('Starting MongoDB check...');
const mongoCheck = spawn('node', ['start-mongodb.js'], {
  stdio: 'inherit',
  shell: true
});

// Wait a bit for MongoDB to start
setTimeout(() => {
  // Start the server
  console.log('Starting server...');
  const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    shell: true
  });

  // Handle server process exit
  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    process.exit(code);
  });
}, 5000); // Wait 5 seconds for MongoDB to start

// Handle MongoDB check process exit
mongoCheck.on('close', (code) => {
  if (code !== 0) {
    console.log(`MongoDB check process exited with code ${code}`);
  }
}); 