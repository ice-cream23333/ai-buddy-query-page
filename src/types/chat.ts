
export interface Message {
  id: string;
  content: string;
  isAi: boolean;
  provider?: ApiProvider;
  rating?: 'like' | 'dislike'; 
}

export type ApiProvider = 'doubao' | 'openai' | 'deepseek' | 'mock';

export interface ApiProviderOption {
  id: ApiProvider;
  name: string;
}

// Local storage key for saving chat data
export const CHAT_STORAGE_KEY = 'ai-chat-history';

// 新增类型：用户问题
export interface UserQuestion {
  id: string;
  content: string;
  timestamp: number;
}

// 新增类型：AI回答组
export interface AiResponseGroup {
  questionId: string;
  responses: Message[];
}
