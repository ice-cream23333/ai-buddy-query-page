import { ApiProvider, Message } from '@/types/chat';

// Mock AI responses for different providers in English
const mockResponsesEn: Record<ApiProvider, string[]> = {
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

// Mock AI responses for different providers in Chinese
const mockResponsesCn: Record<ApiProvider, string[]> = {
  doubao: [
    "作为豆包AI，我认为这是一个很好的问题。基于我的训练数据，我可以提供以下见解...",
    "这个问题涉及多个方面。从技术角度来看...",
    "让我为您从各个维度详细分析这个问题...",
    "根据我的知识库，在这个领域有几个关键点需要考虑..."
  ],
  openai: [
    "作为OpenAI的GPT模型，我认为这是一个很棒的问题。基于我的训练数据，我可以提供以下见解...",
    "这个问题涉及多个层面。从技术角度来看...",
    "让我为您从各个层次详细分析这个问题...",
    "根据我的知识库，在这个领域有几个关键点需要考虑..."
  ],
  deepseek: [
    "作为DeepSeek，我很高兴为您回答这个问题。从我的角度来看...",
    "这确实是一个有趣的问题。让我从不同角度进行分析...",
    "我认为这个问题可以从以下几个维度来考虑...",
    "根据我的理解，这个问题的核心在于..."
  ],
  claude: [
    "作为Claude，我很高兴为您回答这个问题。从我的角度来看...",
    "这确实是一个有趣的问题。让我从不同角度进行分析...",
    "我认为这个问题可以从以下几个维度来考虑...",
    "根据我的理解，这个问题的核心在于..."
  ],
  gemini: [
    "作为Google的Gemini模型，我可以提供以下分析...",
    "这是一个多层次的问题。让我逐步分解...",
    "根据我的训练和理解，这个问题涉及...",
    "我建议我们可以从以下几个方面来探讨这个问题..."
  ],
  llama: [
    "作为Llama模型，我基于开源训练数据提供以下见解...",
    "这个问题非常有价值。根据我的分析...",
    "让我根据我的训练数据详细回答...",
    "从开源AI的角度来看，我认为这个问题可以这样理解..."
  ],
  mock: [
    "这是关于大模型的模拟回答。"
  ]
};

// Function to detect if text contains Chinese characters
const containsChinese = (text: string): boolean => {
  return /[\u4e00-\u9fff]/.test(text);
};

// Specific responses for common questions
const getSpecificResponse = (message: string, provider: ApiProvider): string | null => {
  const lowerMessage = message.toLowerCase();
  
  // Chinese responses for "什么是大模型"
  if (message.includes('什么是大模型') || message.includes('大模型是什么')) {
    const responses: Record<ApiProvider, string> = {
      doubao: "大模型是指参数量巨大的深度学习模型，通常包含数十亿甚至千亿个参数。这些模型通过在海量文本数据上进行预训练，具备了强大的语言理解和生成能力。大模型的特点包括：1）规模庞大，参数量通常超过10亿；2）能力涌现，在达到一定规模后会表现出意想不到的能力；3）通用性强，可以处理多种不同类型的任务。代表性的大模型包括GPT系列、BERT、T5等。作为豆包AI，我也是基于大模型技术构建的。",
      openai: "大模型（Large Language Models，LLMs）是具有大量参数的神经网络模型，通常参数数量在数十亿到万亿级别。这些模型通过在大规模文本语料库上进行预训练，学习语言的统计规律和知识表示。大模型的核心特征包括：规模效应（参数越多，性能通常越好）、少样本学习能力、多任务处理能力等。GPT系列就是典型的大模型代表，它们展现了强大的文本生成、理解和推理能力。",
      deepseek: "大模型是当前人工智能领域的重要突破，指的是参数规模庞大的深度学习模型。这些模型通过Transformer架构，在海量数据上进行预训练，获得了强大的语言理解和生成能力。大模型的优势在于：1）强大的泛化能力，能够处理未见过的任务；2）涌现能力，当模型规模达到临界点时会出现新的能力；3）上下文学习，可以通过少量示例快速适应新任务。作为DeepSeek，我们专注于开发高效且强大的大模型技术。",
      claude: "大模型是指参数数量极其庞大的人工智能模型，通常基于Transformer架构构建。这些模型通过在大规模、多样化的文本数据上进行预训练，学习到了丰富的语言知识和推理能力。大模型的关键特点包括：参数规模庞大（通常数十亿个参数）、训练数据量大、具备强大的零样本和少样本学习能力。它们不仅能够理解和生成自然语言，还能进行逻辑推理、代码编写、创意写作等多种复杂任务。",
      gemini: "大模型是指具有大量参数的机器学习模型，特别是在自然语言处理领域。这些模型利用深度学习技术，在大规模数据集上进行训练，从而获得强大的语言理解和生成能力。大模型的特点包括：参数数量庞大（从数十亿到数千亿不等）、训练数据规模大、具备多模态处理能力。它们能够执行各种复杂任务，如文本生成、翻译、摘要、问答等。谷歌的Gemini就是这样一个多模态大模型。",
      llama: "大模型是指参数规模达到数十亿甚至千亿级别的深度学习模型。这些模型通过在大量文本数据上进行预训练，学习语言的统计模式和知识表示。大模型的核心优势包括：1）规模带来的性能提升；2）强大的迁移学习能力；3）涌现的复杂推理能力。作为开源大模型，LLaMA系列致力于为研究社区提供高质量、可访问的大模型技术，推动AI技术的民主化发展。",
      mock: "这是关于大模型的模拟回答。"
    };
    return responses[provider];
  }
  
  // English responses for "what is a large language model"
  if (lowerMessage.includes('what is a large language model') || lowerMessage.includes('what are large language models')) {
    const responses: Record<ApiProvider, string> = {
      doubao: "Large Language Models (LLMs) are AI systems with billions or even trillions of parameters, trained on vast amounts of text data. These models demonstrate remarkable capabilities in understanding and generating human-like text. Key characteristics include: 1) Massive scale with billions of parameters, 2) Emergent abilities that appear at certain scales, 3) Versatility across multiple tasks like writing, coding, and reasoning. As Doubao AI, I'm built on such large-scale model technology, enabling me to assist with diverse tasks.",
      openai: "Large Language Models are neural networks with an enormous number of parameters, typically ranging from billions to trillions. They're trained on extensive text datasets to learn statistical patterns and knowledge representations of language. Key features include scale effects (more parameters often mean better performance), few-shot learning capabilities, and multi-task processing abilities. The GPT series exemplifies these models, showcasing powerful text generation, understanding, and reasoning capabilities.",
      deepseek: "Large Language Models represent a significant breakthrough in AI, referring to deep learning models with massive parameter counts. Built primarily on Transformer architecture and pre-trained on enormous datasets, they exhibit powerful language understanding and generation capabilities. Their advantages include: 1) Strong generalization to unseen tasks, 2) Emergent abilities at critical scale thresholds, 3) In-context learning from few examples. At DeepSeek, we focus on developing efficient yet powerful large model technologies.",
      claude: "Large Language Models are AI systems with extremely large numbers of parameters, typically built on Transformer architecture. They're pre-trained on vast, diverse text datasets to learn rich linguistic knowledge and reasoning capabilities. Key characteristics include massive parameter scales (usually billions), large training datasets, and strong zero-shot and few-shot learning abilities. They can understand and generate natural language while performing complex tasks like logical reasoning, code writing, and creative composition.",
      gemini: "Large Language Models are machine learning models with vast numbers of parameters, particularly in natural language processing. Using deep learning techniques and trained on large-scale datasets, they achieve powerful language understanding and generation capabilities. Features include enormous parameter counts (billions to trillions), massive training data, and multimodal processing abilities. They can execute various complex tasks like text generation, translation, summarization, and question-answering. Google's Gemini is such a multimodal large language model.",
      llama: "Large Language Models are deep learning models with parameter scales reaching billions or even hundreds of billions. Through pre-training on extensive text data, they learn statistical patterns and knowledge representations of language. Core advantages include: 1) Performance improvements from scale, 2) Strong transfer learning capabilities, 3) Emergent complex reasoning abilities. As an open-source large model, the LLaMA series aims to provide high-quality, accessible large model technology for the research community, promoting democratization of AI technology.",
      mock: "This is a mock response about large language models."
    };
    return responses[provider];
  }
  
  return null;
};

// Get all AI responses function
export const getAllAiResponses = async (message: string): Promise<Array<{provider: ApiProvider, message: string}>> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const providers: ApiProvider[] = ['doubao', 'openai', 'deepseek'];
  const isChinese = containsChinese(message);
  
  return providers.map(provider => {
    // Check for specific responses first
    const specificResponse = getSpecificResponse(message, provider);
    if (specificResponse) {
      return {
        provider,
        message: specificResponse
      };
    }
    
    // Use appropriate language responses
    const responses = isChinese ? mockResponsesCn[provider] : mockResponsesEn[provider];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const enhancedResponse = `${randomResponse}\n\n${isChinese ? '关于您的问题' : 'Regarding your question'} "${message}"${isChinese ? '，我想补充以下几点：' : ', I would like to add the following points:'}\n\n${generateRandomInsight(isChinese)}`;
    
    return {
      provider,
      message: enhancedResponse
    };
  });
};

export const queryAI = async (message: string, provider: ApiProvider): Promise<{id: string, provider: ApiProvider, content: string, timestamp: string}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const isChinese = containsChinese(message);
  
  // Check for specific responses first
  const specificResponse = getSpecificResponse(message, provider);
  if (specificResponse) {
    return {
      id: `${provider}-${Date.now()}-${Math.random()}`,
      provider,
      content: specificResponse,
      timestamp: new Date().toISOString()
    };
  }
  
  // Use appropriate language responses
  const responses = isChinese ? mockResponsesCn[provider] : mockResponsesEn[provider];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Add some variation to the response
  const enhancedResponse = `${randomResponse}\n\n${isChinese ? '关于您的问题' : 'Regarding your question'} "${message}"${isChinese ? '，我想补充以下几点：' : ', I would like to add the following points:'}\n\n${generateRandomInsight(isChinese)}`;
  
  return {
    id: `${provider}-${Date.now()}-${Math.random()}`,
    provider,
    content: enhancedResponse,
    timestamp: new Date().toISOString()
  };
};

function generateRandomInsight(isChinese: boolean = false): string {
  const insightsEn = [
    "This field is rapidly evolving, I recommend you follow the latest research developments.",
    "From a practical perspective, you may need to consider the feasibility of implementation.",
    "This question also involves ethical and social impacts, worth deep consideration.",
    "I suggest you can consult relevant academic literature for more information.",
    "From a user experience perspective, this solution needs further optimization."
  ];
  
  const insightsCn = [
    "这个领域正在快速发展，我建议您关注最新的研究进展。",
    "从实际应用的角度来看，您可能需要考虑实施的可行性。",
    "这个问题还涉及到伦理和社会影响，值得深入思考。",
    "我建议您可以查阅相关的学术文献以获取更多信息。",
    "从用户体验的角度来看，这个解决方案还需要进一步优化。"
  ];
  
  const insights = isChinese ? insightsCn : insightsEn;
  return insights[Math.floor(Math.random() * insights.length)];
}

// Get available providers function
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
