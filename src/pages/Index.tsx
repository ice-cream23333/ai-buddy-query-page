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

  // 当用户登录时，尝试同步本地数据到数据库
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
    
    // 如果用户已登录，保存评分到数据库
    if (user) {
      saveRatingToDatabase(messageId, rating, user.id);
    }
    
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full max-w-7xl mx-auto p-6 flex-1 overflow-hidden flex flex-col min-h-screen">
        <ChatHeader />
        
        <Card className="mt-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI模型对比平台
                  </h2>
                  <p className="text-gray-600 text-sm">同时体验多个AI模型，找到最适合的答案</p>
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
                  清除历史
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-4 mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-gray-700 leading-relaxed">
              🤖 提出任何问题，比较不同AI模型的回答，并为您喜欢的回答点赞。您的反馈有助于改进AI系统！
            </p>
            {!user && (
              <p className="mt-2 text-blue-600">
                💡 <a href="/login" className="underline hover:text-blue-800 transition-colors">登录</a> 以保存您的反馈和聊天历史
              </p>
            )}
          </CardContent>
        </Card>
        
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {/* 显示欢迎消息 */}
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
            <Card className="bg-white/60 backdrop-blur-sm border-blue-200">
              <CardContent className="p-6">
                <div className="flex justify-center items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-full text-white">
                    <MessageSquare size={20} />
                  </div>
                  <LoadingDots />
                  <span className="text-gray-700 font-medium">正在获取AI回答...</span>
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
          <div className="text-center mt-3 text-xs text-gray-500">
            💡 需要帮助？查看我们的 <a href="#" className="text-blue-500 hover:text-blue-700 underline transition-colors">分步教程</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
