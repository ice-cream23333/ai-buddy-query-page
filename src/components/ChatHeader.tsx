
import React from 'react';

const ChatHeader: React.FC = () => {
  return (
    <div className="w-full bg-ai-purple text-white p-4 text-center rounded-t-lg">
      <h1 className="text-xl font-bold">AI 智能助手</h1>
      <p className="text-sm opacity-80">有任何问题都可以向我提问</p>
    </div>
  );
};

export default ChatHeader;
