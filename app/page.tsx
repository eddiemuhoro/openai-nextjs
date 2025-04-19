// app/page.tsx
"use client";

import { useState } from "react";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [input, setInput] = useState<string>("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatCompletionMessageParam = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (res.ok) {
        const assistantMessage: ChatCompletionMessageParam = {
          role: "assistant",
          content: data.reply,
        };
        setMessages([...updatedMessages, assistantMessage]);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {/* <Sidebar /> */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">
          Pawa AI Chatbot with GPT-4.1 nano
        </h1>
        <ChatWindow messages={messages} />
        <div className="mt-4 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-l"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-r"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
