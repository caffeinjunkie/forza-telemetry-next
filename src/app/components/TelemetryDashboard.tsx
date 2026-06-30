"use client";

import { useEffect, useState } from "react";

export default function TelemetryDashboard() {
  const [telemetry, setTelemetry] = useState({ rpm: 0, speedKmh: 0 });

  useEffect(() => {
    // Connect to the local Node.js WebSocket bridge
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTelemetry(data);
    };

    return () => ws.close();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-10 font-mono">
      <h1 className="text-3xl mb-8 text-blue-400">FH6 Telemetry Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div className="bg-neutral-800 p-6 rounded-lg text-center shadow-lg">
          <p className="text-gray-400 text-sm tracking-wider">SPEED</p>
          <p className="text-6xl font-bold my-2">{telemetry.speedKmh}</p>
          <p className="text-gray-500 text-xs">KM/H</p>
        </div>

        <div className="bg-neutral-800 p-6 rounded-lg text-center shadow-lg">
          <p className="text-gray-400 text-sm tracking-wider">RPM</p>
          <p className="text-6xl font-bold my-2">{telemetry.rpm}</p>
          <p className="text-gray-500 text-xs">REV/MIN</p>
        </div>
      </div>
    </main>
  );
}
