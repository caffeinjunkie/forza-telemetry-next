"use client";

import { useEffect, useState } from "react";

export default function TelemetryDashboard() {
  const [telemetry, setTelemetry] = useState({ 
    rpm: 0, 
    speed: 0, 
    gear: 0, 
    engineMaxRpm: 0, 
    currentEngineRpm: 0, 
    throttle: 0, 
    brake: 0, 
    clutch: 0, 
    steering: 0,
    reversing: false
  });

  useEffect(() => {
  const eventSource = new EventSource("http://localhost:3001/telemetry");

  eventSource.onmessage = (event) => {
    setTelemetry(JSON.parse(event.data));
  };

  return () => eventSource.close();
}, [setTelemetry]);

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-10 font-mono">
      <h1 className="text-3xl mb-8 text-blue-400">FH6 Telemetry Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div className="bg-neutral-800 p-6 rounded-lg text-center shadow-lg">
          <p className="text-gray-400 text-sm tracking-wider">SPEED</p>
          <p className="text-6xl font-bold my-2">{(telemetry.speed * 3.6).toFixed(0)}</p>
          <p className="text-gray-500 text-xs">KM/H</p>
        </div>

        <div className="bg-neutral-800 p-6 rounded-lg text-center shadow-lg">
          <p className="text-gray-400 text-sm tracking-wider">RPM</p>
          <p className="text-6xl font-bold my-2">{telemetry.rpm}</p>
          <p className="text-gray-500 text-xs">REV/MIN</p>
        </div>
        
        <div className="bg-neutral-800 p-6 rounded-lg text-center shadow-lg">
          <p className="text-gray-400 text-sm tracking-wider">ENGINE MAX RPM</p>
          <p className="text-6xl font-bold my-2">{telemetry.engineMaxRpm}</p>
          <p className="text-gray-500 text-xs">ENGINE MAX RPM</p>
        </div>
        
        <div className="bg-neutral-800 p-6 rounded-lg text-center shadow-lg">
          <p className="text-gray-400 text-sm tracking-wider">GEAR</p>
          <p className="text-6xl font-bold my-2">{telemetry.gear}</p>
          <p className="text-gray-500 text-xs">GEAR</p>
        </div>
        
        <div className="bg-neutral-800 p-6 rounded-lg text-center shadow-lg">
          <p className="text-gray-400 text-sm tracking-wider">THROTTLE</p>
          <p className="text-6xl font-bold my-2">{telemetry.throttle}</p>
          <p className="text-gray-500 text-xs">THROTTLE</p>
        </div>
        
        <div className="bg-neutral-800 p-6 rounded-lg text-center shadow-lg">
          <p className="text-gray-400 text-sm tracking-wider">BRAKE</p>
          <p className="text-6xl font-bold my-2">{telemetry.brake}</p>
          <p className="text-gray-500 text-xs">BRAKE</p>
        </div>
        
        <div className="bg-neutral-800 p-6 rounded-lg text-center shadow-lg">
          <p className="text-gray-400 text-sm tracking-wider">CLUTCH</p>
          <p className="text-6xl font-bold my-2">{telemetry.clutch}</p>
          <p className="text-gray-500 text-xs">CLUTCH</p>
        </div>
        
        <div className="bg-neutral-800 p-6 rounded-lg text-center shadow-lg">
          <p className="text-gray-400 text-sm tracking-wider">STEERING</p>
          <p className="text-6xl font-bold my-2">{telemetry.steering}</p>
          <p className="text-gray-500 text-xs">STEERING</p>
        </div>
      </div>
    </main>
  );
}
