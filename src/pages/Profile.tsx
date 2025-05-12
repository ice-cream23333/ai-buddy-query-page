
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

export default function Profile() {
  const { user, signOut, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="flex flex-col h-screen bg-ai-neutral-bg">
      <div className="w-full max-w-6xl mx-auto p-4 flex-1 overflow-hidden flex flex-col">
        <div className="mt-8">
          <h1 className="text-2xl font-bold mb-6">个人中心</h1>
          
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                用户信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">邮箱</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">用户ID</p>
                <p className="font-medium">{user.id.substring(0, 8)}...</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">账号创建时间</p>
                <p className="font-medium">
                  {new Date(user.created_at ?? Date.now()).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2 text-red-500 hover:bg-red-50"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
