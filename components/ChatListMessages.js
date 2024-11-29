import React from 'react';
import ChatMessage from './ChatMessage';

const ChatListMessages = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      {messages.map((message, index) => (
        <ChatMessage key={index} sender={message.sender} message={message.message} />
      ))}
    </div>
  );
};

export default ChatListMessages;
