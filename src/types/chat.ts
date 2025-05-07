
export interface Message {
  id: string;
  content: string;
  isAi: boolean;
  provider?: ApiProvider;
  rating?: 'like' | 'dislike'; // Added rating field
}

export type ApiProvider = 'doubao' | 'openai' | 'deepseek' | 'mock';

export interface ApiProviderOption {
  id: ApiProvider;
  name: string;
}

// Local storage key for saving chat data
export const CHAT_STORAGE_KEY = 'ai-chat-history';
