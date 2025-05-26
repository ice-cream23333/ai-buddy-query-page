import { ApiProvider, Message } from '@/types/chat';

// Mock AI responses for different providers
const mockResponses: Record<ApiProvider, string[]> = {
  doubao: [
    "As Doubao AI, I think this is an excellent question. Based on my training data, I can provide the following insights...",
    "This question involves multiple aspects. From a technical perspective...",
    "Let me analyze this question in detail for you across various dimensions...",
    "According to my knowledge base, there are several key points to consider in this field..."
  ],
  openai: [
    "As OpenAI's GPT model, I think this is a great question. Based on my training data, I can provide the following insights...",
    "This question involves multiple aspects. From a technical perspective...",
    "Let me analyze this question in detail for you across various levels...",
    "According to my knowledge base, there are several key points to consider in this field..."
  ],
  deepseek: [
    "As DeepSeek, I'm happy to help you answer this question. From my perspective...",
    "This is indeed an interesting question. Let me analyze from different angles...",
    "I think this question can be considered from the following dimensions...",
    "Based on my understanding, the core of this question lies in..."
  ],
  claude: [
    "As Claude, I'm happy to help you answer this question. From my perspective...",
    "This is indeed an interesting question. Let me analyze from different angles...",
    "I think this question can be considered from the following dimensions...",
    "Based on my understanding, the core of this question lies in..."
  ],
  gemini: [
    "As Google's Gemini model, I can provide the following analysis...",
    "This is a multi-layered question. Let me break it down step by step...",
    "From my training and understanding, this question involves...",
    "I suggest we can explore this question from the following aspects..."
  ],
  llama: [
    "As Llama model, I provide the following insights based on open-source training data...",
    "This question is very valuable. According to my analysis...",
    "Let me answer in detail based on my training data...",
    "From an open-source AI perspective, I think this question can be understood this way..."
  ],
  mock: [
    "This is a mock response for testing purposes."
  ]
};

// Get all AI responses function
export const getAllAiResponses = async (message: string): Promise<Array<{provider: ApiProvider, message: string}>> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const providers: ApiProvider[] = ['doubao', 'openai', 'deepseek'];
  
  return providers.map(provider => {
    const responses = mockResponses[provider];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const enhancedResponse = `${randomResponse}\n\nRegarding your question "${message}", I would like to add the following points:\n\n${generateRandomInsight()}`;
    
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
  const enhancedResponse = `${randomResponse}\n\nRegarding your question "${message}", I would like to add the following points:\n\n${generateRandomInsight()}`;
  
  return {
    id: `${provider}-${Date.now()}-${Math.random()}`,
    provider,
    content: enhancedResponse,
    timestamp: new Date().toISOString()
  };
};

function generateRandomInsight(): string {
  const insights = [
    "This field is rapidly evolving, I recommend you follow the latest research developments.",
    "From a practical perspective, you may need to consider the feasibility of implementation.",
    "This question also involves ethical and social impacts, worth deep consideration.",
    "I suggest you can consult relevant academic literature for more information.",
    "From a user experience perspective, this solution needs further optimization."
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
}

export const getAvailableProviders = (): ApiProvider[] => {
  return ['doubao', 'openai', 'deepseek'];
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
  console.log('Rating saved locally:', { messageId, rating, userId });
};

export const syncLocalChatsToDatabase = async (messages: Message[], userId: string) => {
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
