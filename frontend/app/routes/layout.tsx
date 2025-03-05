import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-gray-800 text-white">
        <h1 className="text-xl">Web Audio Transcriber</h1>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="p-4 bg-gray-800 text-white text-center">
        &copy; 2025 Web Audio Transcriber
      </footer>
    </div>
  );
}
