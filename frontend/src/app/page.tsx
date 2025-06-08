'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { ArrowRight, Sparkles, Zap, Target, Layers, Code, BarChart3, Bug, Figma, Brain, CheckCircle, Mail, Phone, Chrome } from 'lucide-react';

export default function LandingPage() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic
    console.log('Form submitted:', formData);
  };

  const handleGoogleAuth = () => {
    // TODO: Implement Google authentication
    console.log('Google authentication');
  };

  const features = [
    { icon: Brain, title: 'AI Brainstorming', desc: 'Generate innovative ideas with AI assistance' },
    { icon: Layers, title: 'Wireframing', desc: 'Create stunning wireframes instantly' },
    { icon: Figma, title: 'Figma Integration', desc: 'Seamless design workflow integration' },
    { icon: Code, title: 'Code Generation', desc: 'AI-powered code generation' },
    { icon: Target, title: 'QA Automation', desc: 'Automated testing and quality assurance' },
    { icon: BarChart3, title: 'Analytics', desc: 'Deep insights and performance metrics' },
    { icon: Bug, title: 'Bug Tracking', desc: 'Intelligent issue management' },
    { icon: Zap, title: 'Vector Search', desc: 'Powerful semantic search capabilities' }
  ];

  const benefits = [
    'Accelerate product development by 10x',
    'Reduce time-to-market significantly',
    'AI-powered insights and recommendations',
    'Seamless team collaboration',
    'Integration with popular tools'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] [background-size:20px_20px]"></div>
      </div>
      
      <div className="relative flex min-h-screen">
        {/* Left Section - 60% */}
        <div className="flex-1 lg:flex-[0.6] flex flex-col justify-center px-8 lg:px-16 xl:px-24">
          <div className="max-w-2xl">
            {/* Logo and Badge */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  ProVerse
                </h1>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-500/30">
                  AI Universe for Product Managers
                </Badge>
              </div>
            </div>

            {/* Main Heading */}
            <div className="mb-8">
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Complete Product
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Development Lifecycle
                </span>
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                From ideation to deployment. Streamline your workflow with AI-powered tools, 
                seamless integrations, and intelligent automation.
              </p>
            </div>

            {/* Benefits List */}
            <div className="mb-8 space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <feature.icon className="w-6 h-6 text-purple-400 mb-2 group-hover:text-purple-300 transition-colors" />
                    <h3 className="font-semibold text-sm text-white mb-1">{feature.title}</h3>
                    <p className="text-xs text-slate-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trusted By */}
            <div className="text-center lg:text-left">
              <p className="text-sm text-slate-400 mb-4">Trusted by product teams worldwide</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 opacity-60">
                <div className="text-2xl font-bold">Google</div>
                <div className="text-2xl font-bold">Microsoft</div>
                <div className="text-2xl font-bold">Meta</div>
                <div className="text-2xl font-bold">Amazon</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - 40% */}
        <div className="flex-1 lg:flex-[0.4] flex items-center justify-center p-8">
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white mb-2">
                Welcome to ProVerse ✨
              </CardTitle>
              <CardDescription className="text-slate-300">
                Join thousands of product managers accelerating their careers
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={authMode} onValueChange={(value: string) => setAuthMode(value as 'signin' | 'signup')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-white/20">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-white/20">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4 mt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4 mt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="text"
                        name="name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="Phone number (optional)"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Create Account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-slate-400">Or continue with</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleGoogleAuth}
                  variant="outline"
                  className="w-full mt-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
              </div>
              
              <p className="text-center text-xs text-slate-400 mt-6">
                By signing up, you agree to our{' '}
                <a href="#" className="text-purple-400 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-8 right-8 flex justify-between items-center text-sm text-slate-500">
        <p>API: <span className="font-mono">http://localhost:3002</span> | Frontend: <span className="font-mono">http://localhost:3000</span></p>
        <p>© 2025 ProVerse. All rights reserved.</p>
      </div>
    </div>
  );
} 