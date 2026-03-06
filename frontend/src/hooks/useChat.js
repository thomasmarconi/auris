import { useReducer } from "react";

const initialState = {
  messages: [],
  isLoading: false,
  error: null
};

function chatReducer(state, action) {
  switch (action.type) {
    case "ADD_USER_MESSAGE":
      return {
        ...state,
        isLoading: true,
        error: null,
        messages: [...state.messages, { role: "user", content: action.payload }]
      };
    case "INIT_ASSISTANT_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, { role: "assistant", content: "" }]
      };
    case "STREAM_CHUNK": {
      const msgs = [...state.messages];
      const last = msgs[msgs.length - 1];
      msgs[msgs.length - 1] = {
        ...last,
        content: last.content + action.payload
      };
      return { ...state, messages: msgs };
    }
    case "DONE":
      return { ...state, isLoading: false };
    case "ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const sendMessage = async (userInput) => {
    const updatedMessages = [
      ...state.messages,
      { role: "user", content: userInput }
    ];

    dispatch({ type: "ADD_USER_MESSAGE", payload: userInput });
    dispatch({ type: "INIT_ASSISTANT_MESSAGE" });

    try {
      const response = await fetch(`${import.meta.env.API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) throw new Error("API request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        dispatch({ type: "STREAM_CHUNK", payload: chunk });
      }

      dispatch({ type: "DONE" });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  };

  return { state, sendMessage };
}
