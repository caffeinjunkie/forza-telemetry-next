import { Suspense } from "react";
import TelemetryDashboard from "./components/TelemetryDashboard";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Suspense>
        <TelemetryDashboard />
      </Suspense>
    </div>
  );
}
