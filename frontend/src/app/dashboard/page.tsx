'use client'

import { ChangeEvent, FormEvent, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Sparkles, LogOut, User, Mail, Calendar, MessageSquare, TestTube2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from '../../components/Sidebar'
import ApiTester from '../../components/ApiTester'

const prompts = [
  { key: 'description', prompt: 'Provide product description.' },
  { key: 'problem', prompt: 'What is the problem statement?' },
  { key: 'usp', prompt: "List your product's USPs." },
  { key: 'moat', prompt: 'Describe your product\'s MOAT.' },
];

export default function Dashboard() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [activeModule, setActiveModule] = useState('Idea Validation');
  const [activeTab, setActiveTab] = useState('chat');
  const [chat, setChat] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [input, setInput] = useState('');
  const [productInfo, setProductInfo] = useState({ description: '', problem: '', usp: '', moat: '' });
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (activeModule === 'Idea Validation' && chat.length === 0 && prompts[0]) {
      setChat([{ sender: 'bot', text: prompts[0].prompt }]);
      setCurrentPromptIdx(0);
    }
  }, [activeModule]);

  useEffect(() => {
    chatEndRef?.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [chat]);

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    const userMsg = { sender: 'user' as const, text: input };
    setChat((prev) => [...prev, userMsg]);
    
    // Save input to productInfo
    const key = prompts?.[currentPromptIdx]?.key ?? '';
    if (key) {
      setProductInfo((prev) => ({ ...prev, [key]: input }));
    }
    setInput('');

    // Prepare chat history for OpenAI (role: user/assistant)
    const messages = [
      ...chat.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
      { role: 'user', content: input },
    ];

    try {
      const res = await fetch('http://localhost:3001/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.reply) {
        setChat((prev) => [...prev, { sender: 'bot' as const, text: data.reply }]);
      } else {
        throw new Error('No reply received from server');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChat((prev) => [...prev, { 
        sender: 'bot' as const, 
        text: 'Sorry, there was an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
      
      // Advance prompt if needed
      if (currentPromptIdx < prompts.length - 1) {
        setCurrentPromptIdx((idx) => idx + 1);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar activeModule={activeModule} onModuleSelect={setActiveModule} />
      <div className="flex-1">
        {activeModule === 'Idea Validation' ? (
          <div className="max-w-6xl mx-auto mt-10 p-6">
            {/* Tab Navigation */}
            <div className="flex mb-6 bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Idea Validation Chat
              </button>
              <button
                onClick={() => setActiveTab('test')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition ${
                  activeTab === 'test'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <TestTube2 className="w-4 h-4" />
                API Testing Tool
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'chat' ? (
              <div className="max-w-2xl mx-auto flex flex-col h-[70vh] bg-white rounded-lg shadow p-4">
                <div className="flex-1 overflow-y-auto mb-4">
                  {chat.map((msg, idx) => (
                    <div key={idx} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'}`}>{msg.text}</div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form className="flex gap-2" onSubmit={handleSend}>
                  <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Type your answer..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={currentPromptIdx >= prompts.length || isLoading}
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded shadow hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPromptIdx >= prompts.length || isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </button>
                </form>
                {currentPromptIdx >= prompts.length && (
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Product Summary</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">Description:</span> {productInfo.description}</p>
                        <p><span className="font-medium">Problem:</span> {productInfo.problem}</p>
                        <p><span className="font-medium">USPs:</span> {productInfo.usp}</p>
                        <p><span className="font-medium">MOAT:</span> {productInfo.moat}</p>
                      </div>
                    </div>
                    <button className="w-full py-2 px-4 bg-green-600 text-white font-bold rounded shadow hover:bg-green-700 transition">
                      Validate with Market
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <ApiTester />
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Header */}
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">ProVerse</h1>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-500/30 text-xs">
                      Dashboard
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.user_metadata?.name || 'User'}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back, {user.user_metadata?.name || 'there'}! 👋
                </h2>
                <p className="text-slate-300">
                  You've successfully signed in to ProVerse. Your AI-powered product management journey starts here.
                </p>
              </div>

              {/* User Info Card */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Your account details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Email</p>
                        <p className="text-sm text-slate-300">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Name</p>
                        <p className="text-sm text-slate-300">{user.user_metadata?.name || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Member Since</p>
                        <p className="text-sm text-slate-300">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                    <CardDescription className="text-slate-300">
                      Get started with ProVerse modules
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Start Brainstorming Session
                    </Button>
                    <Button className="w-full justify-start bg-white/10 border border-white/20 text-white hover:bg-white/20">
                      Create New Wireframe
                    </Button>
                    <Button className="w-full justify-start bg-white/10 border border-white/20 text-white hover:bg-white/20">
                      Connect Figma Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 