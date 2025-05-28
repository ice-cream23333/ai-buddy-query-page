
import React from 'react';
import { Message } from '@/types/chat';
import { ThumbsUp, ThumbsDown, Bot, Sparkles, Brain, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import SelectableText from '@/components/SelectableText';
import { toast } from '@/components/ui/sonner';

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
  // Group responses by provider
  const doubaoResponse = responses.find((r) => r.provider === 'doubao');
  const openaiResponse = responses.find((r) => r.provider === 'openai');
  const deepseekResponse = responses.find((r) => r.provider === 'deepseek');

  const handleRate = (messageId: string, rating: 'like' | 'dislike') => {
    if (onRateMessage) {
      onRateMessage(messageId, rating);
    }
  };

  const handleSegmentFeedback = (messageId: string, selectedText: string, feedback: 'positive' | 'negative', comment?: string) => {
    console.log('Segment feedback:', { messageId, selectedText, feedback, comment });
    
    const feedbackText = feedback === 'positive' ? '👍 感谢您对这段内容的积极反馈' : '👎 感谢您的反馈，我们会努力改进这部分内容';
    toast.success(feedbackText);
    
    // Here you could save the detailed feedback to a backend service
    // For now, we'll just log it
  };

  const getProviderInfo = (provider?: string) => {
    switch (provider) {
      case 'doubao':
        return { name: '豆包', color: 'bg-red-500', icon: Brain };
      case 'openai':
        return { name: 'OpenAI GPT', color: 'bg-emerald-500', icon: Bot };
      case 'deepseek':
        return { name: 'DeepSeek', color: 'bg-blue-500', icon: Sparkles };
      default:
        return { name: 'AI', color: 'bg-gray-500', icon: Bot };
    }
  };

  const renderResponseCard = (response?: Message) => {
    if (!response) {
      return (
        <Card className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-lg opacity-50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full text-white bg-gray-400">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg text-gray-500">暂无回复</h3>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-gray-400 text-center py-8">
              回复不可用
            </div>
          </CardContent>
        </Card>
      );
    }

    const providerInfo = getProviderInfo(response.provider);
    const Icon = providerInfo.icon;

    return (
      <Card className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-full text-white", providerInfo.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">{providerInfo.name}</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="mb-6 bg-white/60 p-4 rounded-lg backdrop-blur-sm">
            <SelectableText
              content={response.content}
              messageId={response.id}
              onSegmentFeedback={handleSegmentFeedback}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              选中文本可进行详细反馈
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRate(response.id, 'like')}
                className={cn(
                  "border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200",
                  response.rating === 'like' && "bg-green-50 border-green-300 text-green-700"
                )}
              >
                <ThumbsUp className={cn(
                  "h-4 w-4 mr-1", 
                  response.rating === 'like' ? "text-green-600" : "text-gray-500"
                )} />
                <span className="text-sm">赞</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRate(response.id, 'dislike')}
                className={cn(
                  "border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200",
                  response.rating === 'dislike' && "bg-red-50 border-red-300 text-red-700"
                )}
              >
                <ThumbsDown className={cn(
                  "h-4 w-4 mr-1", 
                  response.rating === 'dislike' ? "text-red-600" : "text-gray-500"
                )} />
                <span className="text-sm">踩</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full mb-8">
      <Card className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-500 rounded-full text-white mt-1">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-indigo-600 font-medium mb-2">问题</div>
              <div className="text-gray-800 font-medium text-lg leading-relaxed">{question}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderResponseCard(doubaoResponse)}
        {renderResponseCard(openaiResponse)}
        {renderResponseCard(deepseekResponse)}
      </div>
    </div>
  );
};

export default AiResponseComparison;
