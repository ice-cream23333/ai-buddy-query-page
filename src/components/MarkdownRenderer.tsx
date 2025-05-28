
import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // 函数来移除markdown格式符号
  const removeMarkdownSymbols = (text: string): string => {
    return text
      // 移除标题符号 (# ## ### 等)
      .replace(/^#{1,6}\s+/gm, '')
      // 移除粗体符号 (**text** 或 __text__)
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      // 移除斜体符号 (*text* 或 _text_)
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1')
      .replace(/(?<!_)_([^_]+)_(?!_)/g, '$1')
      // 移除代码块符号
      .replace(/```[\s\S]*?```/g, (match) => {
        return match.replace(/```\w*\n?/g, '').replace(/```/g, '');
      })
      // 移除行内代码符号
      .replace(/`([^`]+)`/g, '$1')
      // 移除链接格式 [text](url)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // 移除图片格式 ![alt](url)
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      // 移除引用符号
      .replace(/^>\s+/gm, '')
      // 移除列表符号
      .replace(/^[\s]*[-*+]\s+/gm, '• ')
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // 移除水平线
      .replace(/^---+$/gm, '')
      .replace(/^\*\*\*+$/gm, '')
      // 清理多余的空行
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const cleanContent = removeMarkdownSymbols(content);

  return (
    <div className={`text-gray-700 leading-relaxed ${className}`}>
      <div className="whitespace-pre-wrap">
        {cleanContent}
      </div>
    </div>
  );
};

export default MarkdownRenderer;
