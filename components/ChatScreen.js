import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { sender: 'Alice', message: 'Hey, are you going to the concert?' },
    { sender: 'Bob', message: 'Yes, I am! Can’t wait!' },
    { sender: 'Alice', message: 'Same here! Let’s meet up before the show.' },
  ]);

  const handleSend = (message) => {
    setMessages([...messages, { sender: 'You', message }]);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <ChatMessages messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatScreen;