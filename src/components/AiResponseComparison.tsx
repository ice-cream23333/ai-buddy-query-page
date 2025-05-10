
import React from 'react';
import { Message } from '@/types/chat';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AiResponseComparisonProps {
  question: string;
  responses: Message[];
  onRateMessage?: (messageId: string, rating: 'like' | 'dislike') => void;
}

const AiResponseComparison: React.FC<AiResponseComparisonProps> = ({
  question,
  responses,
  onRateMessage,
}) => {
  // 按提供商对回答进行分组
  const openaiResponse = responses.find((r) => r.provider === 'openai');
  const deepseekResponse = responses.find((r) => r.provider === 'deepseek');
  const doubaoResponse = responses.find((r) => r.provider === 'doubao');

  const handleRate = (messageId: string, rating: 'like' | 'dislike') => {
    if (onRateMessage) {
      onRateMessage(messageId, rating);
    }
  };

  const renderResponseCard = (response?: Message) => {
    if (!response) return null;

    const providerName = 
      response.provider === 'openai' ? 'OpenAI' :
      response.provider === 'deepseek' ? 'DeepSeek' :
      response.provider === 'doubao' ? 'Doubao' : 'AI';

    return (
      <div className="flex-1 p-4 bg-white rounded-md shadow-sm">
        <h3 className="font-medium text-base mb-2">{providerName}</h3>
        <div className="whitespace-pre-line text-sm">
          {response.content}
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRate(response.id, 'like')}
            className={cn(
              "border-gray-200 hover:bg-green-50",
              response.rating === 'like' && "bg-green-50 border-green-200"
            )}
          >
            <ThumbsUp className={cn(
              "h-4 w-4", 
              response.rating === 'like' ? "text-green-500" : "text-gray-500"
            )} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRate(response.id, 'dislike')}
            className={cn(
              "border-gray-200 hover:bg-red-50",
              response.rating === 'dislike' && "bg-red-50 border-red-200"
            )}
          >
            <ThumbsDown className={cn(
              "h-4 w-4", 
              response.rating === 'dislike' ? "text-red-500" : "text-gray-500"
            )} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mb-8">
      <div className="mb-4 p-3 bg-white rounded-md border border-gray-200">
        <div className="text-sm text-gray-500 mb-1">问题：</div>
        <div className="font-medium">{question}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderResponseCard(openaiResponse)}
        {renderResponseCard(deepseekResponse)}
        {renderResponseCard(doubaoResponse)}
      </div>
    </div>
  );
};

export default AiResponseComparison;
