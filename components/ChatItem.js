import React from 'react';

const ChatItem = ({ message, sender }) => (
  <div className="bg-white shadow-md rounded-lg p-4 mb-4">
    <p className="font-bold">{sender}</p>
    <p>{message}</p>
  </div>
);

export default ChatItem;
