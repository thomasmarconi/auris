import ChatWindow from "./components/ChatWindow";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-lg font-semibold text-slate-800">Claude Chat</h1>
      </header>
      <main className="flex-1 p-6">
        <ChatWindow />
      </main>
    </div>
  );
}