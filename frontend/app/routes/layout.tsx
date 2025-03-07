import { Outlet, useNavigate } from "react-router-dom";
import AccountMenuButton from "~/components/account-menu-button";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-gray-800 text-white flex flex-row justify-between items-center">
        <h1 className="text-xl">Web Audio Transcriber</h1>
        <AccountMenuButton profileImageUrl="https://github.com/shadcn.png"/>
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
