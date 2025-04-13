const { exec } = require('child_process');
const net = require('net');

// Function to check if a port is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      resolve(true); // Port is in use
    });
    server.once('listening', () => {
      server.close();
      resolve(false); // Port is not in use
    });
    server.listen(port);
  });
}

// Function to start MongoDB
async function startMongoDB() {
  console.log('Checking if MongoDB is running...');
  
  const isMongoRunning = await isPortInUse(27017);
  
  if (isMongoRunning) {
    console.log('MongoDB is already running on port 27017');
    return;
  }
  
  console.log('MongoDB is not running. Attempting to start it...');
  
  // Try to start MongoDB
  exec('mongod --dbpath="C:\\data\\db"', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting MongoDB: ${error.message}`);
      console.log('Please make sure MongoDB is installed and the data directory exists.');
      console.log('You can create the data directory with: mkdir C:\\data\\db');
      return;
    }
    
    if (stderr) {
      console.error(`MongoDB stderr: ${stderr}`);
    }
    
    console.log(`MongoDB stdout: ${stdout}`);
    console.log('MongoDB started successfully');
  });
}

// Start MongoDB
startMongoDB(); 