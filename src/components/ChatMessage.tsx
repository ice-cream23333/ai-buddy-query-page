
import React from 'react';
import { cn } from '@/lib/utils';
import { User, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@/types/chat';

export interface ChatMessageProps {
  message: Message;
  onRateMessage?: (messageId: string, rating: 'like' | 'dislike') => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRateMessage }) => {
  const { content, isAi, rating, id } = message;
  
  const handleRate = (newRating: 'like' | 'dislike') => {
    if (onRateMessage) {
      onRateMessage(id, newRating);
    }
  };

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
      <div className="flex-1 flex flex-col">
        <div className={cn(
          "flex-1",
          isAi ? "text-ai-text-dark" : "text-white"
        )}>
          {content}
        </div>
        
        {isAi && (
          <div className="flex justify-end mt-2 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRate('like')}
              className={cn(
                "border-gray-200 hover:bg-green-50",
                rating === 'like' && "bg-green-50 border-green-200"
              )}
            >
              <ThumbsUp className={cn(
                "h-4 w-4", 
                rating === 'like' ? "text-green-500" : "text-gray-500"
              )} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRate('dislike')}
              className={cn(
                "border-gray-200 hover:bg-red-50",
                rating === 'dislike' && "bg-red-50 border-red-200"
              )}
            >
              <ThumbsDown className={cn(
                "h-4 w-4", 
                rating === 'dislike' ? "text-red-500" : "text-gray-500"
              )} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
