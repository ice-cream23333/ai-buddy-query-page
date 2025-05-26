
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string) => Promise<{ error: any | null, user: User | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  supabaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    // 获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 监听身份验证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabaseConfigured]);

  const signIn = async (email: string, password: string) => {
    if (!supabaseConfigured) {
      const error = new Error('Supabase 未配置，请设置环境变量');
      toast({
        title: "配置错误",
        description: "Supabase 未配置，请联系管理员",
        variant: "destructive",
      });
      return { error };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Sign in error:', error);
        let errorMessage = '登录失败';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = '邮箱或密码错误';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = '请先确认您的邮箱';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = '请求过于频繁，请稍后重试';
        } else if (error.message.includes('fetch')) {
          errorMessage = '网络连接失败，请检查您的网络';
        }
        
        return { error: { message: errorMessage } };
      }
      
      toast({
        title: "登录成功",
        description: "欢迎回来！",
      });
      return { error: null };
    } catch (error: any) {
      console.error('Network error during sign in:', error);
      const errorMessage = error.name === 'TypeError' && error.message.includes('fetch') 
        ? '网络连接失败，请检查您的网络连接' 
        : '登录失败，请稍后重试';
      
      return { error: { message: errorMessage } };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!supabaseConfigured) {
      const error = new Error('Supabase 未配置，请设置环境变量');
      toast({
        title: "配置错误",
        description: "Supabase 未配置，请联系管理员",
        variant: "destructive",
      });
      return { error, user: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Sign up error:', error);
        let errorMessage = '注册失败';
        
        if (error.message.includes('User already registered')) {
          errorMessage = '该邮箱已被注册';
        } else if (error.message.includes('Password should be')) {
          errorMessage = '密码不符合要求';
        } else if (error.message.includes('fetch')) {
          errorMessage = '网络连接失败，请检查您的网络';
        }
        
        return { error: { message: errorMessage }, user: null };
      }
      
      toast({
        title: "注册成功",
        description: "请检查邮箱进行确认",
      });
      return { error: null, user: data.user };
    } catch (error: any) {
      console.error('Network error during sign up:', error);
      const errorMessage = error.name === 'TypeError' && error.message.includes('fetch') 
        ? '网络连接失败，请检查您的网络连接' 
        : '注册失败，请稍后重试';
      
      return { error: { message: errorMessage }, user: null };
    }
  };

  const resetPassword = async (email: string) => {
    if (!supabaseConfigured) {
      const error = new Error('Supabase 未配置，请设置环境变量');
      toast({
        title: "配置错误",
        description: "Supabase 未配置，请联系管理员",
        variant: "destructive",
      });
      return { error };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Reset password error:', error);
        let errorMessage = '发送重置邮件失败';
        
        if (error.message.includes('fetch')) {
          errorMessage = '网络连接失败，请检查您的网络';
        }
        
        return { error: { message: errorMessage } };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Network error during password reset:', error);
      const errorMessage = error.name === 'TypeError' && error.message.includes('fetch') 
        ? '网络连接失败，请检查您的网络连接' 
        : '发送重置邮件失败，请稍后重试';
      
      return { error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    if (supabaseConfigured) {
      await supabase.auth.signOut();
      toast({
        title: "已退出登录",
        description: "您已成功退出",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    supabaseConfigured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
