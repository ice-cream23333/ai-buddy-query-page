
// This is a temporary mock service that will be replaced with the actual AI API integration
export interface AiResponse {
  message: string;
}

export const getAiResponse = async (message: string): Promise<AiResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock responses based on different inputs
  if (message.includes('你好') || message.includes('嗨') || message.includes('hi')) {
    return { message: '你好！很高兴为您服务。有什么我能帮助您的吗？' };
  }
  
  if (message.includes('天气')) {
    return { message: '抱歉，我目前无法查询实时天气。这个功能需要连接到天气API。请问您有其他问题吗？' };
  }
  
  if (message.includes('介绍') || message.includes('是谁')) {
    return { message: '我是一个AI助手，可以回答您的问题、提供信息以及助您解决各种问题。虽然我的能力有限，但我会尽力为您提供帮助！' };
  }

  // Default response
  return { message: '感谢您的提问。目前我是一个简单的模拟AI，还无法处理复杂的问题。将来会连接到真实的AI API来为您提供更准确的回答。' };
};
