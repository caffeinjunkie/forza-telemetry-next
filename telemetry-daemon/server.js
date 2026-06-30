// telemetry-server.js
const dgram = require('dgram');
const { WebSocketServer } = require('ws');

const UDP_PORT = 20440;
const WS_PORT = 3001;

// Initialize WebSocket Server
const wss = new WebSocketServer({ port: WS_PORT });
console.log(`WebSocket server running on port ${WS_PORT}`);

// Initialize UDP Listener
const server = dgram.createSocket('udp4');

server.on('message', (msg) => {
  // FH6 packet size is 324 bytes. 
  // We parse the buffer using Little-Endian reads.
  if (msg.length >= 324) {
    
    // CurrentEngineRpm is at offset 16 (F32)
    const currentRpm = msg.readFloatLE(16);
    
    // VelocityX, Y, Z are at 24, 28, 32. 
    // We derive total speed in m/s, then convert to KM/H.
    const velX = msg.readFloatLE(24);
    const velY = msg.readFloatLE(28);
    const velZ = msg.readFloatLE(32);
    const speedMs = Math.sqrt(velX ** 2 + velY ** 2 + velZ ** 2);
    const speedKmh = speedMs * 3.6;

    const data = {
      rpm: Math.round(currentRpm),
      speedKmh: Math.round(speedKmh)
    };

    // Broadcast to all connected web clients
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { 
        client.send(JSON.stringify(data));
      }
    });
  }
});

server.bind(UDP_PORT, () => {
  console.log(`Listening for Forza Horizon 6 UDP packets on port ${UDP_PORT}`);
});