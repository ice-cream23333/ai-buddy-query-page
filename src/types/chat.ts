
export interface Message {
  id: string;
  content: string;
  isAi: boolean;
  provider?: ApiProvider;
  rating?: 'like' | 'dislike'; 
}

export type ApiProvider = 'openai' | 'claude' | 'gemini' | 'llama' | 'doubao' | 'deepseek' | 'mock';

export interface ApiProviderOption {
  id: ApiProvider;
  name: string;
}

// Local storage key for saving chat data
export const CHAT_STORAGE_KEY = 'ai-chat-history';

// User question type
export interface UserQuestion {
  id: string;
  content: string;
  timestamp: number;
}

// AI response group type
export interface AiResponseGroup {
  questionId: string;
  responses: Message[];
}
