
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <ReactMarkdown
      className={`markdown-content ${className}`}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-gray-800">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mb-3 text-gray-800">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold mb-2 text-gray-800">{children}</h3>,
        h4: ({ children }) => <h4 className="text-base font-bold mb-2 text-gray-700">{children}</h4>,
        p: ({ children }) => <p className="mb-3 text-gray-700 leading-relaxed">{children}</p>,
        strong: ({ children }) => <strong className="font-bold text-gray-800">{children}</strong>,
        em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-gray-700 ml-2">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-400 pl-4 py-2 mb-3 bg-blue-50 italic text-gray-700">
            {children}
          </blockquote>
        ),
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">
                {children}
              </code>
            );
          }
          return (
            <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto mb-3">
              <code className="text-sm font-mono text-gray-800">{children}</code>
            </pre>
          );
        },
        hr: () => <hr className="my-6 border-gray-300" />,
        table: ({ children }) => (
          <div className="overflow-x-auto mb-3">
            <table className="min-w-full border border-gray-300">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
        th: ({ children }) => (
          <th className="px-4 py-2 text-left font-semibold text-gray-800 border-r border-gray-300">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-gray-700 border-r border-gray-300">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
