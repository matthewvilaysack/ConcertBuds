import React, { useState } from 'react';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 bg-gray-100 flex">
      <input
        type="text"
        className="flex-1 p-2 border rounded"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        className="ml-2 p-2 bg-blue-500 text-white rounded"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
