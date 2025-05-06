
import React from 'react';
import { cn } from '@/lib/utils';
import { User, MessageSquare } from 'lucide-react';

export interface ChatMessageProps {
  message: string;
  isAi: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isAi }) => {
  return (
    <div
      className={cn(
        "flex w-full max-w-4xl mx-auto p-4 rounded-lg mb-4",
        isAi ? "bg-white" : "bg-ai-purple-light text-white"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full mr-4",
        isAi ? "bg-ai-purple text-white" : "bg-white text-ai-purple"
      )}>
        {isAi ? <MessageSquare size={20} /> : <User size={20} />}
      </div>
      <div className={cn(
        "flex-1",
        isAi ? "text-ai-text-dark" : "text-white"
      )}>
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;
