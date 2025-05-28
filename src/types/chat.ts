
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

// Segment feedback type for detailed user feedback on specific text portions
export interface SegmentFeedback {
  id: string;
  messageId: string;
  selectedText: string;
  feedback: 'positive' | 'negative';
  comment?: string;
  timestamp: number;
  userId?: string;
}
