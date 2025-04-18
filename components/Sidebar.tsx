const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      {/* List of chats */}
      <ul>
        <li className="mb-2">Chat 1</li>
        <li className="mb-2">Chat 2</li>
        {/* Add more chats as needed */}
      </ul>
      <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded">
        New Chat
      </button>
    </div>
  );
};

export default Sidebar;
