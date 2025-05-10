
import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import LoadingDots from '@/components/LoadingDots';
import AiResponseComparison from '@/components/AiResponseComparison';
import { Message, ApiProvider, UserQuestion } from '@/types/chat';
import { getAllAiResponses, saveChatsToLocal, loadChatsFromLocal } from '@/services/aiService';
import { toast } from '@/components/ui/sonner';
import { FileText, Database, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [questions, setQuestions] = useState<UserQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载本地存储的聊天记录
  useEffect(() => {
    const savedMessages = loadChatsFromLocal();
    if (savedMessages && savedMessages.length > 0) {
      setMessages(savedMessages);
      
      // 从保存的消息中提取问题
      const extractedQuestions: UserQuestion[] = [];
      const seenQuestions = new Set();
      
      savedMessages.forEach((msg) => {
        if (!msg.isAi && !seenQuestions.has(msg.content)) {
          extractedQuestions.push({
            id: msg.id,
            content: msg.content,
            timestamp: parseInt(msg.id)
          });
          seenQuestions.add(msg.content);
        }
      });
      
      setQuestions(extractedQuestions);
    } else {
      // 如果没有本地存储的聊天记录，设置初始欢迎消息
      setMessages([
        {
          id: '1',
          content: '欢迎使用AI助手！您可以输入问题，同时获得三个AI的回答并进行对比。',
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
  }, [messages, questions]);

  // 获取与问题相关的所有AI响应
  const getResponsesForQuestion = (questionId: string) => {
    return messages.filter(msg => 
      msg.isAi && 
      messages.findIndex(m => m.id === questionId) < messages.indexOf(msg) && 
      (messages.find(m => 
        m.id > msg.id && 
        !m.isAi && 
        messages.indexOf(m) > messages.indexOf(msg)
      ) === undefined)
    );
  };

  const handleSendMessage = async (content: string) => {
    const questionId = Date.now().toString();
    
    // 添加用户问题
    const userMessage: Message = {
      id: questionId,
      content,
      isAi: false
    };
    
    const newQuestion: UserQuestion = {
      id: questionId,
      content,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuestions(prev => [...prev, newQuestion]);
    setIsLoading(true);

    try {
      // 获取所有AI提供商的响应
      const responses = await getAllAiResponses(content);
      
      // 添加所有AI响应
      const aiMessages: Message[] = responses.map((response, index) => ({
        id: (Date.now() + index + 1).toString(),
        content: response.message,
        isAi: true,
        provider: response.provider
      }));
      
      setMessages(prev => [...prev, ...aiMessages]);
    } catch (error) {
      console.error('Error getting AI responses:', error);
      toast.error('获取AI回复时出错，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRateMessage = (messageId: string, rating: 'like' | 'dislike') => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === messageId 
          ? { ...message, rating: message.rating === rating ? undefined : rating }
          : message
      )
    );
    
    const ratingText = rating === 'like' ? '👍 感谢您的正面反馈' : '👎 感谢您的反馈，我们会努力改进';
    toast.success(ratingText);
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
          content: '欢迎使用AI助手！您可以输入问题，同时获得三个AI的回答并进行对比。',
          isAi: true,
          provider: 'mock'
        }
      ]);
      setQuestions([]);
      toast.success('聊天记录已清除');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-ai-neutral-bg">
      <div className="w-full max-w-6xl mx-auto p-4 flex-1 overflow-hidden flex flex-col">
        <ChatHeader />
        
        <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
          <h2 className="text-xl font-bold">AI模型对比</h2>
          
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
        
        <div className="text-center mt-2 mb-4 text-gray-600 text-sm">
          提出任何问题，比较不同AI模型的回答，并为您喜欢的回答点赞。您的反馈有助于改进AI系统！
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-2">
          {/* 显示欢迎消息 */}
          {messages.length === 1 && messages[0].isAi && (
            <div className="mb-6 bg-white p-4 rounded-lg text-center">
              {messages[0].content}
            </div>
          )}
          
          {/* 显示问题和AI回答 */}
          {questions.map((question) => (
            <AiResponseComparison
              key={question.id}
              question={question.content}
              responses={getResponsesForQuestion(question.id)}
              onRateMessage={handleRateMessage}
            />
          ))}
          
          {isLoading && (
            <div className="flex w-full max-w-6xl mx-auto p-4 justify-center items-center">
              <MessageSquare size={20} className="text-ai-purple mr-2" />
              <LoadingDots />
              <div className="ml-2 text-gray-600">正在获取AI回答...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="sticky bottom-0 bg-ai-neutral-bg pt-2 pb-4">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
          />
          <div className="text-center mt-2 text-xs text-gray-500">
            需要帮助？查看我们的 <a href="#" className="text-ai-purple hover:underline">分步教程</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
