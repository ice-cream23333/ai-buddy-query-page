
export interface Message {
  id: string;
  content: string;
  isAi: boolean;
}

export type ApiProvider = 'doubao' | 'openai' | 'mock';

export interface ApiProviderOption {
  id: ApiProvider;
  name: string;
}
