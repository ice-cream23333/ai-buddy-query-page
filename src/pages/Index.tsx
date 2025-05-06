
import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import LoadingDots from '@/components/LoadingDots';
import { Message } from '@/types/chat';
import { getAiResponse } from '@/services/aiService';
import { toast } from '@/components/ui/sonner';
import { MessageSquare } from 'lucide-react';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '欢迎使用AI助手！请问有什么可以帮您的？',
      isAi: true
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isAi: false
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get AI response
      const response = await getAiResponse(content);
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isAi: true
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('获取AI回复时出错，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-ai-neutral-bg">
      <div className="w-full max-w-4xl mx-auto p-4 flex-1 overflow-hidden flex flex-col">
        <ChatHeader />
        
        <div className="flex-1 overflow-y-auto py-4 px-2">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id}
              message={message.content}
              isAi={message.isAi}
            />
          ))}
          
          {isLoading && (
            <div className="flex w-full max-w-4xl mx-auto p-4 rounded-lg mb-4 bg-white">
              <div className="flex items-center justify-center w-10 h-10 rounded-full mr-4 bg-ai-purple text-white">
                <MessageSquare size={20} />
              </div>
              <LoadingDots />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="sticky bottom-0 bg-ai-neutral-bg pt-2 pb-4">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
