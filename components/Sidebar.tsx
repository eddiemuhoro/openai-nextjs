import { Conversation } from "@/app/page";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

interface SidebarProps {
  setMessages: React.Dispatch<
    React.SetStateAction<ChatCompletionMessageParam[]>
  >;
  conversations: Conversation[];
  onSelectConversation: (id: number | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  onSelectConversation,
  setMessages,
}) => {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <ul>
        {conversations.map((conv) => (
          <li key={conv.id} className="mb-2">
            <button
              onClick={() => onSelectConversation(conv.id)}
              className="text-blue-400 hover:underline block w-full text-left"
            >
              Chat #{conv.id}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          onSelectConversation(null);
          setMessages([]); // Clear messages when starting a new chat
        }}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        New Chat
      </button>
    </div>
  );
};

export default Sidebar;
