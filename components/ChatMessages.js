import React from 'react';
import ChatItem from './ChatItem';

const ChatMessages = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      {messages.map((message, index) => (
        <ChatItem key={index} sender={message.sender} message={message.message} />
      ))}
    </div>
  );
};

export default ChatMessages;
