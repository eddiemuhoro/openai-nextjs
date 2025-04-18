// components/ChatWindow.tsx
import React from "react";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import ReactMarkdown from "react-markdown";

interface ChatWindowProps {
  messages: ChatCompletionMessageParam[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-4 p-4 rounded ${
            msg.role === "user"
              ? "bg-blue-100 text-blue-900"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>
          <div className="mt-2">
            <ReactMarkdown>{msg.content as string}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
