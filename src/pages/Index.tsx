import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import LoadingDots from '@/components/LoadingDots';
import AiResponseComparison from '@/components/AiResponseComparison';
import { Message, ApiProvider, UserQuestion } from '@/types/chat';
import { getAllAiResponses, saveChatsToLocal, loadChatsFromLocal, saveRatingToDatabase, syncLocalChatsToDatabase } from '@/services/aiService';
import { toast } from '@/components/ui/sonner';
import { FileText, Database, MessageSquare, Sparkles, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [questions, setQuestions] = useState<UserQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const savedMessages = loadChatsFromLocal();
    if (savedMessages && savedMessages.length > 0) {
      setMessages(savedMessages);
      
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
      setMessages([
        {
          id: '1',
          content: 'Welcome to AI Assistant! You can ask questions and get responses from multiple AI models for comparison.',
          isAi: true,
          provider: 'mock'
        }
      ]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      saveChatsToLocal(messages);
    }
  }, [messages]);

  useEffect(() => {
    if (user && messages.length > 0) {
      syncLocalChatsToDatabase(messages, user.id).catch(console.error);
    }
  }, [user, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, questions]);

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
      const responses = await getAllAiResponses(content);
      
      const aiMessages: Message[] = responses.map((response, index) => ({
        id: (Date.now() + index + 1).toString(),
        content: response.message,
        isAi: true,
        provider: response.provider
      }));
      
      setMessages(prev => [...prev, ...aiMessages]);
    } catch (error) {
      console.error('Error getting AI responses:', error);
      toast.error('获取AI回复失败，请重试');
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
    
    if (user) {
      saveRatingToDatabase(messageId, rating, user.id);
    }
    
    const ratingText = rating === 'like' ? '👍 感谢您的积极反馈' : '👎 感谢您的反馈，我们会努力改进';
    toast.success(ratingText);
  };

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(messages, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `ai-聊天记录-${new Date().toISOString().slice(0, 10)}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('数据导出成功');
    } catch (error) {
      console.error('Export data failed:', error);
      toast.error('导出数据失败，请重试');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('确定要清空所有聊天记录吗？此操作无法撤销。')) {
      setMessages([
        {
          id: '1',
          content: '欢迎使用AI助手！您可以提问并获得多个AI模型的回答对比。',
          isAi: true,
          provider: 'mock'
        }
      ]);
      setQuestions([]);
      toast.success('聊天记录已清空');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full max-w-7xl mx-auto p-6 flex-1 overflow-hidden flex flex-col min-h-screen">
        <ChatHeader />
        
        <Card className="mt-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI模型对比平台
                  </h3>
                  <p className="text-gray-600 text-sm">体验多个AI模型，找到最适合的答案</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportData}
                  className="flex items-center gap-2 bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 text-blue-700"
                >
                  <Download size={16} />
                  导出数据
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearHistory}
                  className="flex items-center gap-2 bg-white/80 hover:bg-red-50 border-red-200 hover:border-red-300 text-red-600"
                >
                  <Trash2 size={16} />
                  清空记录
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {messages.length === 1 && messages[0].isAi && (
            <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-white">
                    <MessageSquare className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">开始您的AI对话之旅</h3>
                <p className="text-gray-600">{messages[0].content}</p>
              </CardContent>
            </Card>
          )}
          
          {questions.map((question) => (
            <AiResponseComparison
              key={question.id}
              question={question.content}
              responses={getResponsesForQuestion(question.id)}
              onRateMessage={handleRateMessage}
            />
          ))}
          
          {isLoading && (
            <Card className="bg-white/60 backdrop-blur-sm border-blue-200">
              <CardContent className="p-6">
                <div className="flex justify-center items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-full text-white">
                    <MessageSquare size={20} />
                  </div>
                  <LoadingDots />
                  <span className="text-gray-700 font-medium">正在获取AI回复...</span>
                </div>
              </CardContent>
            </Card>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="sticky bottom-0 pt-4 pb-6">
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
