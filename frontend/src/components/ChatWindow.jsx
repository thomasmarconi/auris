import { useState, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const { state, sendMessage } = useChat();
  const bottomRef = useRef(null);

  // auto scroll to bottom as messages come in
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages]);

  const handleSend = () => {
    if (!input.trim() || state.isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-1 mx-auto w-full border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {state.messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-4 py-3 rounded-xl leading-relaxed ${
              msg.role === "user"
                ? "self-end bg-blue-600 text-white"
                : "self-start bg-slate-100 text-slate-800"
            }`}
          >
            <span className="text-[11px] font-semibold opacity-60 block mb-1 uppercase tracking-[0.05em]">
              {msg.role === "user" ? "You" : "Claude"}
            </span>
            <p>{msg.content}</p>
          </div>
        ))}
        {state.error && (
          <div className="text-red-500 text-sm text-center">{state.error}</div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 p-4 border-t border-gray-200 bg-white">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Heya! Let me help you find new music... (Enter to send, Shift+Enter for new line)"
          disabled={state.isLoading}
          rows={3}
          className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-lg resize-none text-sm font-[inherit] outline-none focus:border-blue-600"
        />
        <button
          onClick={handleSend}
          disabled={state.isLoading || !input.trim()}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold self-end cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}