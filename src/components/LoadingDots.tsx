
import React from 'react';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex space-x-2 my-2">
      <div className="w-3 h-3 bg-ai-purple rounded-full animate-pulse-dot"></div>
      <div className="w-3 h-3 bg-ai-purple rounded-full animate-pulse-dot" style={{ animationDelay: "0.2s" }}></div>
      <div className="w-3 h-3 bg-ai-purple rounded-full animate-pulse-dot" style={{ animationDelay: "0.4s" }}></div>
    </div>
  );
};

export default LoadingDots;
