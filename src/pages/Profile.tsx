
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, LogOut, Calendar, Mail, Hash, Shield, Clock } from 'lucide-react';
import ChatHeader from '@/components/ChatHeader';

export default function Profile() {
  const { user, signOut, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const getAccountAge = (dateString: string) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full max-w-7xl mx-auto p-6 flex-1 overflow-hidden flex flex-col min-h-screen">
        <ChatHeader />
        
        <div className="mt-8">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            User Profile
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Main Profile Card */}
            <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <User className="h-6 w-6" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email Address</p>
                    <p className="font-semibold text-gray-800">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Hash className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">User ID</p>
                    <p className="font-mono text-sm text-gray-800 break-all">{user.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Registration Date</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(user.created_at ?? new Date().toISOString())}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Stats Card */}
            <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6" />
                  Account Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Account Age</p>
                    <p className="font-semibold text-gray-800">
                      {getAccountAge(user.created_at ?? new Date().toISOString())}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Account Status</p>
                    <p className="font-semibold text-emerald-600">Active</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">User Type</p>
                    <p className="font-semibold text-gray-800">Standard User</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sign Out Section */}
          <div className="max-w-md mx-auto mt-8">
            <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-lg">
              <CardFooter className="pt-6">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 hover:border-red-300 border-red-200"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
