
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

const ChatHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-800">AI助手</h1>
        <span className="ml-2 px-2 py-1 text-xs bg-ai-neutral-accent rounded-full text-gray-600">多模型对比</span>
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/profile" className="flex items-center gap-1">
                <User size={16} />
                {user.email?.split('@')[0] || 'Profile'}
              </Link>
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link to="/login" className="flex items-center gap-1">
              <User size={16} />
              登录
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
