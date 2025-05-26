
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut, Home, MessageSquare, Settings } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const ChatHeader: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200/50">
      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Chat with Models
          </h1>
        </div>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/profile" className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                <Settings className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="flex items-center gap-1"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link to="/login" className="flex items-center gap-1">
              <User size={16} />
              Login
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
