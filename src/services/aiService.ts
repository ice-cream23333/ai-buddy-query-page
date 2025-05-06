
import { ApiProvider } from '@/types/chat';

// This is a temporary mock service that will be replaced with the actual AI API integration
export interface AiResponse {
  message: string;
}

export const getAiResponse = async (message: string, provider: ApiProvider = 'mock'): Promise<AiResponse> => {
  console.log(`Using provider: ${provider}`);
  
  // 在实际场景中，这里会根据不同的provider调用不同的API
  // For demonstration purposes, we're still using mock responses
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (provider === 'openai') {
    return { message: `[OpenAI] ${getMockResponse(message)}` };
  } else if (provider === 'doubao') {
    return { message: `[豆包] ${getMockResponse(message)}` };
  } else {
    // Default mock provider
    return { message: getMockResponse(message) };
  }
};

function getMockResponse(message: string): string {
  // Mock responses based on different inputs
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
