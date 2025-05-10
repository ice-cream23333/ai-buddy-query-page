
import { ApiProvider, CHAT_STORAGE_KEY, Message } from '@/types/chat';

// This is a temporary mock service that will be replaced with the actual AI API integration
export interface AiResponse {
  message: string;
  provider: ApiProvider;
}

export const getAiResponse = async (message: string, provider: ApiProvider = 'mock'): Promise<AiResponse> => {
  console.log(`Using provider: ${provider}`);
  
  // 在实际场景中，这里会根据不同的provider调用不同的API
  // For demonstration purposes, we're still using mock responses
  
  // Simulate network delay with different times for each provider
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
  
  if (provider === 'openai') {
    return { message: getMockOpenAIResponse(message), provider };
  } else if (provider === 'doubao') {
    return { message: getMockDoubaoResponse(message), provider };
  } else if (provider === 'deepseek') {
    return { message: getMockDeepseekResponse(message), provider };
  } else {
    // Default mock provider
    return { message: getMockResponse(message), provider };
  }
};

// 同时调用所有AI提供商
export const getAllAiResponses = async (message: string): Promise<AiResponse[]> => {
  const providers: ApiProvider[] = ['doubao', 'openai', 'deepseek'];
  
  try {
    // 并行调用所有API
    const responses = await Promise.all(
      providers.map(provider => getAiResponse(message, provider))
    );
    return responses;
  } catch (error) {
    console.error('Error getting AI responses:', error);
    throw error;
  }
};

// 为每个提供商创建不同的回复风格
function getMockOpenAIResponse(message: string): string {
  if (message.toLowerCase().includes('stress') || message.includes('压力')) {
    return `To manage exam stress effectively:

1. Preparation strategies:
   • Break down study material into manageable daily goals
   • Start early to avoid last-minute
   • Create concise summary notes for quick reviews

2. Physical well-being:
   • Prioritize 7-8 hours of sleep
   • Choose brain-boosting foods (nuts, fruits, protein)
   • Exercise for at least 20 minutes daily`;
  }
  
  return getMockResponse(message);
}

function getMockDeepseekResponse(message: string): string {
  if (message.toLowerCase().includes('stress') || message.includes('压力')) {
    return `To manage exam stress effectively, try these approaches:

1. Create a realistic study schedule
2. Practice the Pomodoro technique
3. Mindfulness for 5-10 minutes daily
4. Establish regular sleep (7-8 hours) and nutrition
5. Use the Feynman technique: 25 min of focused study followed by 5-minute breaks

Remember to focus on learning rather than perfection, and view the exam as an opportunity to demonstrate what you've learned.`;
  }
  
  return getMockResponse(message);
}

function getMockDoubaoResponse(message: string): string {
  if (message.toLowerCase().includes('stress') || message.includes('压力')) {
    return `Managing exam stress is about balance. Here's what helps:

First, organize your materials and create a structured study plan by breaking large topics into smaller chunks when they seem overwhelming.

Second, take care of your physical health - proper sleep, healthy meals, and regular exercise significantly impact your mental state.

For immediate stress relief, try the 4-7-8 breathing technique (inhale for 4, hold for 7, exhale for 8). This activates your parasympathetic nervous system.`;
  }
  
  return getMockResponse(message);
}

// 通用回复生成
function getMockResponse(message: string): string {
  // 基本回复逻辑
  if (message.includes('你好') || message.includes('嗨') || message.includes('hi')) {
    return '你好！很高兴为您服务。有什么我能帮助您的吗？';
  }
  
  if (message.includes('天气')) {
    return '抱歉，我目前无法查询实时天气。这个功能需要连接到天气API。请问您有其他问题吗？';
  }
  
  if (message.includes('介绍') || message.includes('是谁')) {
    return '我是一个AI助手，可以回答您的问题、提供信息以及助您解决各种问题。虽然我的能力有限，但我会尽力为您提供帮助！';
  }

  // Default response
  return '感谢您的提问。目前我是一个简单的模拟AI，还无法处理复杂的问题。将来会连接到真实的AI API来为您提供更准确的回答。';
}

// 保存聊天记录到本地存储
export const saveChatsToLocal = (messages: Message[]): void => {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('保存聊天记录失败:', error);
  }
};

// 从本地存储加载聊天记录
export const loadChatsFromLocal = (): Message[] => {
  try {
    const savedChats = localStorage.getItem(CHAT_STORAGE_KEY);
    return savedChats ? JSON.parse(savedChats) : [];
  } catch (error) {
    console.error('加载聊天记录失败:', error);
    return [];
  }
};

// 清除本地存储的聊天记录
export const clearLocalChats = (): void => {
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch (error) {
    console.error('清除聊天记录失败:', error);
  }
};
