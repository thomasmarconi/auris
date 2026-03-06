import ChatWindow from "./components/ChatWindow";

export default function App() {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-lg font-semibold text-slate-800">Auris - Discover New Music</h1>
      </header>
      <main className="flex flex-col flex-1">
        <ChatWindow />
      </main>
    </div>
  );
}