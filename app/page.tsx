"use client";

import { useEffect, useState } from "react";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import ChatWindow from "@/components/ChatWindow";
import Sidebar from "@/components/Sidebar";
import { baseUrl } from "@/utils/urls";

export interface Conversation {
  id: number;
  user_id: string;
  created_at: string;
}

interface Message {
  role: string;
  content: string;
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [input, setInput] = useState<string>("");

  // Load all conversations (mocked or from backend)
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(baseUrl + "/conversations/query/12"); // optional
        const data = await res.json();
        setConversations(data);
        if (data.length > 0) {
          // setConversationId(data[0].id); // auto-select first
        }
      } catch (err) {
        console.error("Failed to fetch conversations. Using mock.", err);
      }
    };

    fetchConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) return;
      try {
        const res = await fetch(`${baseUrl}/chat/${conversationId}/history`);
        const data = await res.json();
        const formattedMessages = data.map((msg: Message) => ({
          role: msg.role,
          content: msg.content,
        }));
        setMessages(formattedMessages);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    loadMessages();
  }, [conversationId]);

  const sendMessage = async () => {
    // if (!input.trim() || !conversationId) return;

    const userMessage: ChatCompletionMessageParam = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const res = await fetch(`${baseUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 12,
          conversation_id: conversationId,
          messages: updatedMessages,
          is_new: !conversationId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const assistantMessage: ChatCompletionMessageParam = {
          role: "assistant",
          content: data.reply,
        };
        if (!conversationId) {
          setConversationId(data.conversation_id);
        }
        setMessages([...updatedMessages, assistantMessage]);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex p-4 bg-gray-100">
      <Sidebar
        conversations={conversations}
        onSelectConversation={(id) => setConversationId(id)}
        setMessages={setMessages}
      />
      <div className="flex-1 max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Pawa AI Chatbot</h1>
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
