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
  
  // Chinese responses for "什么是大语言模型"
  if (message.includes('什么是大语言模型') || message.includes('大语言模型是什么') || message.includes('什么是大模型') || message.includes('大模型是什么')) {
    const responses: Record<ApiProvider, string> = {
      doubao: `**大语言模型（LLM）** 是基于深度学习的 AI 模型，通过海量文本数据训练，能理解和生成自然语言，核心特点包括：

**大规模参数与数据**：参数达数十亿至数千亿，基于数万亿 token 语料学习语言规律。

**强语言能力**：支持自然语言理解、生成及长上下文交互（如对话、写作、翻译）。

**零/少样本学习**：通过提示词即可完成任务，无需大量特定数据。

**技术原理**：基于 Transformer 架构（自注意力机制），采用 "预训练 - 微调" 模式（先学通用知识，再针对任务优化）。

**典型模型**：GPT 系列（生成能力强）、LLaMA（开源可定制）、Claude（擅长长文本推理）等。

**应用场景**：智能助手、内容创作、教育、医疗、编程辅助等。

**挑战**：生成幻觉、可解释性差、计算成本高，需应对伦理风险（如虚假信息、偏见）。

**未来方向**：优化可解释性、降低算力消耗、推动多模态融合，强调负责任 AI 开发。`,
      openai: `大语言模型（Large Language Model，LLM）是一种基于深度学习的人工智能模型，专门用于理解和生成自然语言文字。它的核心是 Transformer 神经网络结构，能够通过对大量文本数据进行训练，学会语言中的词语搭配、语法结构和语义逻辑。

大语言模型的训练方式是通过预测"下一个词"的方式，从而逐步掌握语言规律。例如：输入"今天天气很"，模型会预测"好"、"热"、"晴朗"等词的可能性。训练所用的数据通常包括维基百科、新闻、网页、小说、代码等海量文本。

这类模型拥有极大的参数规模，从几亿到上千亿不等，代表性的模型包括 OpenAI 的 GPT 系列、Google 的 Gemini、Anthropic 的 Claude、Meta 的 LLaMA，以及国内的 ChatGLM、通义千问、百川等。

大语言模型被广泛应用于智能问答、自动写作、文本翻译、代码生成、虚拟客服等领域。随着技术发展，LLM 也逐步具备了逻辑推理、多轮对话、情感分析等能力，正在成为通用人工智能（AGI）发展的关键组成部分。`,
      deepseek: `大语言模型（Large Language Model，LLM）是一种基于人工智能（AI）和深度学习的自然语言处理（NLP）模型，能够理解、生成和操作人类语言。这类模型通过海量文本数据进行训练，学习语言的统计规律、语义关系和上下文信息，从而完成多种语言相关任务。

### **核心特点**
1. **规模庞大**  
   - 参数量通常达到数十亿甚至万亿级别（例如GPT-3有1750亿参数）。
   - 需要大规模算力（如GPU/TPU集群）和数据进行训练。

2. **通用性强**  
   - 通过预训练（Pre-training）学习语言的通用表征，可适应多种下游任务（如翻译、问答、写作等）。
   - 支持零样本（Zero-shot）或少样本（Few-shot）学习，无需任务特定训练。

3. **基于Transformer架构**  
   - 依赖自注意力机制（Self-Attention）捕捉长距离上下文依赖。
   - 典型架构：编码器-解码器（如T5）、仅解码器（如GPT）、仅编码器（如BERT）。

---

### **关键技术**
1. **预训练与微调**  
   - **预训练**：在无标注文本上学习语言模式（如预测下一个词或掩码词）。
   - **微调**：针对具体任务（如客服、分类）用标注数据调整模型。

2. **提示工程（Prompting）**  
   - 通过设计输入提示（Prompt）引导模型生成所需输出（例如：“翻译成中文：Hello → 你好”）。

3. **对齐与安全**  
   - 使用RLHF（基于人类反馈的强化学习）使输出更符合人类价值观。
   - 解决偏见、幻觉（生成虚假信息）等问题。

---

### **典型应用**
- **文本生成**：写作辅助、代码生成（如GitHub Copilot）。
- **对话系统**：智能客服、虚拟助手（如ChatGPT）。
- **信息提取**：摘要、情感分析、实体识别。
- **多模态扩展**：结合图像/语音的模型（如GPT-4V）。

---

### **代表模型**
- **GPT系列**（OpenAI）：生成任务优先，迭代至GPT-4。
- **BERT**（Google）：双向上下文理解，适合分类任务。
- **PaLM**（Google）、LLaMA（Meta）：开源或部分开放的模型。
- **Claude**（Anthropic）、**Gemini**（Google）：注重安全与对齐。

---

### **挑战与争议**
算力需求：训练成本高昂，碳排放问题。

伦理风险：生成虚假信息、隐私泄露、职业替代。

局限性：缺乏真实理解，依赖训练数据质量。

大语言模型正推动AI普及，但其发展需平衡性能、效率与责任。未来可能向更小（如蒸馏模型）、更专精或具身智能（结合物理世界）方向演进。`,
      claude: "大语言模型是指参数数量极其庞大的人工智能模型，通常基于Transformer架构构建。这些模型通过在大规模、多样化的文本数据上进行预训练，学习到了丰富的语言知识和推理能力。大模型的关键特点包括：参数规模庞大（通常数十亿个参数）、训练数据量大、具备强大的零样本和少样本学习能力。它们不仅能够理解和生成自然语言，还能进行逻辑推理、代码编写、创意写作等多种复杂任务。",
      gemini: "大语言模型是指具有大量参数的机器学习模型，特别是在自然语言处理领域。这些模型利用深度学习技术，在大规模数据集上进行训练，从而获得强大的语言理解和生成能力。大模型的特点包括：参数数量庞大（从数十亿到数千亿不等）、训练数据规模大、具备多模态处理能力。它们能够执行各种复杂任务，如文本生成、翻译、摘要、问答等。谷歌的Gemini就是这样一个多模态大语言模型。",
      llama: "大语言模型是指参数规模达到数十亿甚至千亿级别的深度学习模型。这些模型通过在大量文本数据上进行预训练，学习语言的统计模式和知识表示。大模型的核心优势包括：1）规模带来的性能提升；2）强大的迁移学习能力；3）涌现的复杂推理能力。作为开源大语言模型，LLaMA系列致力于为研究社区提供高质量、可访问的大模型技术，推动AI技术的民主化发展。",
      mock: "这是关于大语言模型的模拟回答。"
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
