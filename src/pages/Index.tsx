
import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import LoadingDots from '@/components/LoadingDots';
import ApiProviderSelector from '@/components/ApiProviderSelector';
import { Message, ApiProvider, CHAT_STORAGE_KEY } from '@/types/chat';
import { getAiResponse, saveChatsToLocal, loadChatsFromLocal } from '@/services/aiService';
import { toast } from '@/components/ui/sonner';
import { MessageSquare, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiProvider, setApiProvider] = useState<ApiProvider>('mock');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载本地存储的聊天记录
  useEffect(() => {
    const savedMessages = loadChatsFromLocal();
    if (savedMessages && savedMessages.length > 0) {
      setMessages(savedMessages);
    } else {
      // 如果没有本地存储的聊天记录，设置初始欢迎消息
      setMessages([
        {
          id: '1',
          content: '欢迎使用AI助手！请问有什么可以帮您的？',
          isAi: true,
          provider: 'mock'
        }
      ]);
    }
  }, []);

  // 当消息更新时，保存到本地存储
  useEffect(() => {
    if (messages.length > 0) {
      saveChatsToLocal(messages);
    }
  }, [messages]);

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
      // Get AI response using the selected provider
      const response = await getAiResponse(content, apiProvider);
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isAi: true,
        provider: apiProvider
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('获取AI回复时出错，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderChange = (provider: ApiProvider) => {
    setApiProvider(provider);
    const providerName = 
      provider === 'mock' ? '模拟API' : 
      provider === 'openai' ? 'OpenAI' : 
      provider === 'doubao' ? '豆包AI' : 'Deepseek';
    toast.success(`已切换到 ${providerName}`);
  };

  const handleExportData = () => {
    try {
      // 创建一个包含对话数据的JSON文件
      const dataStr = JSON.stringify(messages, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      // 创建下载链接
      const exportFileDefaultName = `ai-chat-data-${new Date().toISOString().slice(0, 10)}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('数据集导出成功');
    } catch (error) {
      console.error('导出数据失败:', error);
      toast.error('导出数据失败，请重试');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('确定要清除所有聊天记录吗？此操作不可恢复。')) {
      setMessages([
        {
          id: '1',
          content: '欢迎使用AI助手！请问有什么可以帮您的？',
          isAi: true,
          provider: 'mock'
        }
      ]);
      toast.success('聊天记录已清除');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-ai-neutral-bg">
      <div className="w-full max-w-4xl mx-auto p-4 flex-1 overflow-hidden flex flex-col">
        <ChatHeader />
        
        <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex-grow">
            <ApiProviderSelector 
              selectedProvider={apiProvider} 
              onProviderChange={handleProviderChange} 
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportData}
              className="flex items-center gap-1"
            >
              <FileText size={16} />
              导出数据集
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearHistory}
              className="flex items-center gap-1 text-red-500 hover:bg-red-50"
            >
              <Database size={16} />
              清除历史
            </Button>
          </div>
        </div>
        
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
