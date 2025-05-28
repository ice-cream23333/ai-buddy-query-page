
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectableTextProps {
  content: string;
  messageId: string;
  onSegmentFeedback?: (messageId: string, selectedText: string, feedback: 'positive' | 'negative', comment?: string) => void;
}

const SelectableText: React.FC<SelectableTextProps> = ({ 
  content, 
  messageId, 
  onSegmentFeedback 
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState('');
  const textRef = useRef<HTMLDivElement>(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selected = selection.toString().trim();
      setSelectedText(selected);
      setShowFeedbackPanel(true);
    } else {
      setSelectedText('');
      setShowFeedbackPanel(false);
    }
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    if (onSegmentFeedback && selectedText) {
      onSegmentFeedback(messageId, selectedText, type, feedbackComment);
      setShowFeedbackPanel(false);
      setSelectedText('');
      setFeedbackComment('');
      
      // Clear selection
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleCloseFeedback = () => {
    setShowFeedbackPanel(false);
    setSelectedText('');
    setFeedbackComment('');
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div className="relative">
      <div
        ref={textRef}
        className="whitespace-pre-line text-gray-700 leading-relaxed select-text cursor-text"
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
      >
        {content}
      </div>
      
      {showFeedbackPanel && selectedText && (
        <Card className="absolute top-0 left-0 z-50 bg-white border shadow-lg max-w-md">
          <CardContent className="p-4">
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-700 mb-2">已选择文本：</div>
              <div className="text-sm bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                "{selectedText}"
              </div>
            </div>
            
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                反馈评论（可选）：
              </label>
              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="请描述您对这段内容的具体意见..."
                className="w-full text-sm border rounded px-2 py-1 resize-none"
                rows={2}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleFeedback('positive')}
                  className="flex items-center space-x-1 border-green-200 hover:bg-green-50 text-green-700"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>有帮助</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleFeedback('negative')}
                  className="flex items-center space-x-1 border-red-200 hover:bg-red-50 text-red-700"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>需改进</span>
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCloseFeedback}
                className="text-gray-500"
              >
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SelectableText;
