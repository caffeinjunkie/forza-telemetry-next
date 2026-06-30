const http = require('http');
const dgram = require('dgram'); // Ensure you have this
const udpSocket = dgram.createSocket('udp4');

const clients = new Set();

// 1. The HTTP Server (SSE)
const server = http.createServer((req, res) => {
    if (req.url === '/telemetry') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });
        clients.add(res);
        req.on('close', () => clients.delete(res));
    }
});

function broadcast(data) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    for (const client of clients) client.write(payload);
}

server.listen(3001);

function normalizeSteering(val) {
    // If the value is > 127, it's a negative number wrapped to unsigned
    // We convert it back to a signed 8-bit integer (-128 to 127)
    let signedVal = val > 127 ? val - 256 : val;
    
    // Normalize to -1.0 to 1.0 range
    // 127 is the max positive, 128 is the max negative
    return signedVal / 128;
}

function getCarClass(carClassValue) {
    switch (carClassValue) {
        case 0:
            return "D";
        case 1:
            return "C";
        case 2:
            return "B";
        case 3:
            return "A";
        case 4:
            return "S1";
        case 5:
            return "S2";
        case 6:
            return "X";
        case 7:
            return "R";
        default:
            return "Unknown";
    }
}

function parseForzaData(msg) {
    // Only attempt to parse if we have a full packet (324 bytes for V2)
    if (msg.length < 324) return null;

    const carOrdinal = msg.readInt32LE(216);
    const perfIndex = msg.readInt32LE(220);
    // const perfIndex = msg.readInt32LE(224);

    console.log("Car ordinal:", carOrdinal);
    console.log("Car class:", carClassValue);
    console.log("Perf index:", perfIndex);
    
    // Actual speed in m/s is at offset 256 (F32)
    const actualSpeedMs = msg.readFloatLE(256);
    const gear = msg.readUInt8(319);
    // const engineMaxRpm = msg.readFloatLE(228);
    const currentRpm = msg.readFloatLE(16);
    const velZ = msg.readFloatLE(40);
    const isReversing = velZ < -0.1;
    
    const throttle = msg.readUInt8(315) / 255 * 100;
    const brake = msg.readUInt8(316) / 255 * 100;
    const clutch = msg.readUInt8(317) / 255 * 100;
    const handbrake = msg.readUInt8(318) / 255 * 100;

    const rawSteering = msg.readUInt8(320);
    const steering = normalizeSteering(rawSteering) * 100;

    const data = {
      rpm: Math.round(currentRpm),
      speed: Math.round(actualSpeedMs),
      gear: gear,
      handbrake: Math.round(handbrake),
      throttle: Math.round(throttle),
      brake: Math.round(brake),
      clutch: Math.round(clutch),
      steering: Math.round(steering),
      reversing: isReversing,
      carOrdinal: carOrdinal,
      perfIndex: perfIndex,
    };

    return data;
}

// 2. The UDP Listener (Forza)
udpSocket.on('message', (msg, rinfo) => {
    try {
        // 2. PARSING: Ensure this returns a valid Object
      const data = parseForzaData(msg); 
      
      console.log("Parsed data:", data);
      
      // 3. BROADCAST: Ensure data is valid
      if (data && clients.size > 0) {
          broadcast(data);
      }
    } catch (e) {
        console.error("Parsing Error:", e);
    }
});

udpSocket.bind(20440); // Or your specific port