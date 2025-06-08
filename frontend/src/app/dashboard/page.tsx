'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Sparkles, LogOut, User, Mail, Calendar } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Dashboard() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

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
      <main className="container mx-auto px-6 py-8">
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

        {/* Coming Soon Notice */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">🚀 Coming Soon</CardTitle>
            <CardDescription className="text-slate-300">
              We're building amazing features for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'AI Brainstorming',
                'Smart Wireframes',
                'Code Generation',
                'QA Automation',
                'Analytics Dashboard',
                'Bug Tracking',
                'Team Collaboration',
                'Vector Search'
              ].map((feature, index) => (
                <div key={index} className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-white font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 