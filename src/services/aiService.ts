
import { ApiProvider, Message } from '@/types/chat';

// Mock AI responses for different providers
const mockResponses: Record<ApiProvider, string[]> = {
  openai: [
    "作为 OpenAI 的 GPT 模型，我认为这是一个很好的问题。基于我的训练数据，我可以提供以下见解...",
    "这个问题涉及多个方面。从技术角度来看...",
    "让我为您详细分析一下这个问题的各个层面...",
    "根据我的知识库，这个领域有以下几个关键点需要考虑..."
  ],
  claude: [
    "作为 Claude，我很乐意帮助您解答这个问题。从我的角度来看...",
    "这确实是一个有趣的问题。让我从不同的角度来分析...",
    "我认为这个问题可以从以下几个维度来思考...",
    "基于我的理解，这个问题的核心在于..."
  ],
  gemini: [
    "作为 Google 的 Gemini 模型，我可以为您提供以下分析...",
    "这是一个多层次的问题。让我逐步为您解析...",
    "从我的训练和理解来看，这个问题涉及...",
    "我建议我们可以从以下几个方面来探讨这个问题..."
  ],
  llama: [
    "作为 Llama 模型，我基于开源训练数据为您提供以下见解...",
    "这个问题很有价值。根据我的分析...",
    "让我基于我的训练数据为您详细解答...",
    "从开源 AI 的角度，我认为这个问题可以这样理解..."
  ]
};

// Add the missing function to get all AI responses
export const getAllAiResponses = async (message: string): Promise<Array<{provider: ApiProvider, message: string}>> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const providers: ApiProvider[] = ['openai', 'claude', 'gemini', 'llama'];
  
  return providers.map(provider => {
    const responses = mockResponses[provider];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const enhancedResponse = `${randomResponse}\n\n针对您的问题"${message}"，我补充以下观点：\n\n${generateRandomInsight()}`;
    
    return {
      provider,
      message: enhancedResponse
    };
  });
};

export const queryAI = async (message: string, provider: ApiProvider): Promise<{id: string, provider: ApiProvider, content: string, timestamp: string}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const responses = mockResponses[provider];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Add some variation to the response
  const enhancedResponse = `${randomResponse}\n\n针对您的问题"${message}"，我补充以下观点：\n\n${generateRandomInsight()}`;
  
  return {
    id: `${provider}-${Date.now()}-${Math.random()}`,
    provider,
    content: enhancedResponse,
    timestamp: new Date().toISOString()
  };
};

function generateRandomInsight(): string {
  const insights = [
    "这个领域正在快速发展，建议您关注最新的研究进展。",
    "从实践的角度来看，您可能需要考虑实施的可行性。",
    "这个问题还涉及到伦理和社会影响，值得深入思考。",
    "建议您可以查阅相关的学术文献获取更多信息。",
    "从用户体验的角度，这个解决方案需要进一步优化。"
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
}

export const getAvailableProviders = (): ApiProvider[] => {
  return ['openai', 'claude', 'gemini', 'llama'];
};

// Local storage functions for chat history
export const saveChatsToLocal = (messages: Message[]) => {
  try {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
};

export const loadChatsFromLocal = (): Message[] => {
  try {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [];
  }
};

export const clearChatHistory = () => {
  try {
    localStorage.removeItem('chatHistory');
  } catch (error) {
    console.error('Failed to clear chat history:', error);
  }
};

// Mock functions for database operations (since we removed Supabase calls)
export const saveRatingToDatabase = async (messageId: string, rating: 'like' | 'dislike', userId: string) => {
  // Mock implementation - in a real app this would save to Supabase
  console.log('Rating saved locally:', { messageId, rating, userId });
};

export const syncLocalChatsToDatabase = async (messages: Message[], userId: string) => {
  // Mock implementation - in a real app this would sync to Supabase
  console.log('Chats synced locally:', { messageCount: messages.length, userId });
};

// Local storage functions for ratings
export const saveRating = (messageId: string, rating: 'like' | 'dislike') => {
  try {
    const ratings = getRatings();
    ratings[messageId] = rating;
    localStorage.setItem('messageRatings', JSON.stringify(ratings));
  } catch (error) {
    console.error('Failed to save rating:', error);
  }
};

export const getRatings = (): Record<string, 'like' | 'dislike'> => {
  try {
    const saved = localStorage.getItem('messageRatings');
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Failed to get ratings:', error);
    return {};
  }
};

export const getRating = (messageId: string): 'like' | 'dislike' | null => {
  const ratings = getRatings();
  return ratings[messageId] || null;
};
