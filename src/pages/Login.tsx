
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mail } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.string().email('请输入有效的电子邮件地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
});

const registerSchema = z.object({
  email: z.string().email('请输入有效的电子邮件地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  confirmPassword: z.string().min(6, '密码至少需要6个字符'),
}).refine(data => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

const resetPasswordSchema = z.object({
  email: z.string().email('请输入有效的电子邮件地址'),
});

export default function Login() {
  const { user, signIn, signUp, loading, supabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const { error } = await signIn(values.email, values.password);
      if (!error) {
        navigate('/');
        toast({
          title: "登录成功",
          description: "欢迎回来！",
        });
      } else {
        toast({
          title: "登录失败",
          description: error.message || "请检查您的邮箱和密码",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "登录失败",
        description: "网络连接失败，请检查您的网络连接",
        variant: "destructive",
      });
    }
  };

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const { error } = await signUp(values.email, values.password);
      if (!error) {
        setActiveTab('login');
        registerForm.reset();
        toast({
          title: "注册成功",
          description: "请检查您的邮箱进行确认",
        });
      } else {
        toast({
          title: "注册失败",
          description: error.message || "注册过程中出现错误",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Register error:', error);
      toast({
        title: "注册失败",
        description: "网络连接失败，请检查您的网络连接",
        variant: "destructive",
      });
    }
  };

  const onResetPasswordSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsResetting(true);
    try {
      // 这里需要调用 Supabase 的密码重置功能
      // 暂时先显示一个提示
      toast({
        title: "密码重置邮件已发送",
        description: "请检查您的邮箱并按照邮件中的指示重置密码",
      });
      setShowResetPassword(false);
      resetPasswordForm.reset();
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "发送失败",
        description: "密码重置邮件发送失败，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

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

  if (user) {
    return <Navigate to="/" />;
  }

  if (!supabaseConfigured) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ai-neutral-bg p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Supabase 配置缺失</CardTitle>
            <CardDescription>需要设置 Supabase 环境变量才能使用身份验证功能</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>配置错误</AlertTitle>
              <AlertDescription>
                <p>缺少必要的 Supabase 环境变量。请确保以下环境变量已设置:</p>
                <ul className="list-disc pl-4 mt-2">
                  <li>VITE_SUPABASE_URL</li>
                  <li>VITE_SUPABASE_ANON_KEY</li>
                </ul>
                <p className="mt-2">
                  您需要通过 Lovable 的 Supabase 集成来设置这些变量。点击界面右上角的绿色 Supabase 按钮进行连接。
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/')} className="w-full">
              返回首页
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (showResetPassword) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md p-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                重置密码
              </CardTitle>
              <CardDescription>输入您的邮箱地址，我们将发送重置链接</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...resetPasswordForm}>
                <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={resetPasswordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>邮箱</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入邮箱" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isResetting}>
                    {isResetting ? "发送中..." : "发送重置邮件"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setShowResetPassword(false)} className="w-full">
                返回登录
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI 模型对比平台
          </h1>
          <p className="text-gray-600 mt-2">登录以保存您的会话和喜好设置</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">登录</TabsTrigger>
            <TabsTrigger value="register">注册</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>账号登录</CardTitle>
                <CardDescription>输入您的邮箱和密码登录</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>邮箱</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入邮箱" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>密码</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="请输入密码" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      登录
                    </Button>
                  </form>
                </Form>
                <div className="mt-4 text-center">
                  <Button 
                    variant="link" 
                    onClick={() => setShowResetPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    忘记密码？
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>注册账号</CardTitle>
                <CardDescription>创建一个新账号</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>邮箱</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入邮箱" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>密码</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="请输入密码" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>确认密码</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="请再次输入密码" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      注册
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
