'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { 
  Lightbulb, 
  X, 
  Send, 
  MessageSquare, 
  Clock
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
}

interface ChatAssistantProps {
  onOpenChange?: (isOpen: boolean) => void
}

export function ChatAssistant({ onOpenChange }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }
  const [currentInput, setCurrentInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const activeChat = chatSessions.find(chat => chat.id === activeChatId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeChat?.messages])

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    }
    setChatSessions(prev => [newChat, ...prev])
    setActiveChatId(newChat.id)
  }

  const updateChatTitle = (chatId: string, firstMessage: string) => {
    const title = firstMessage.length > 30 
      ? firstMessage.substring(0, 30) + '...' 
      : firstMessage
    
    setChatSessions(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, title }
          : chat
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentInput.trim() || isLoading) return

    let chatId = activeChatId
    if (!chatId) {
      createNewChat()
      chatId = Date.now().toString()
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput.trim(),
      timestamp: new Date()
    }

    // Add user message
    setChatSessions(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, userMessage],
              title: chat.messages.length === 0 ? 
                (currentInput.length > 30 ? currentInput.substring(0, 30) + '...' : currentInput) 
                : chat.title
            }
          : chat
      )
    )

    const userInput = currentInput
    setCurrentInput('')
    setIsLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: userInput }]
        }),
      })
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const data = await res.json()
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Sorry, I could not process your request.',
        timestamp: new Date()
      }

      // Add assistant response
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === chatId 
            ? { ...chat, messages: [...chat.messages, assistantMessage] }
            : chat
        )
      )

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      }

      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === chatId 
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  if (!isOpen) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => handleOpenChange(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Lightbulb className="w-5 h-5 text-white" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed top-0 right-0 w-[30%] h-screen bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleOpenChange(false)}
          className="text-white hover:bg-white/20 p-1 h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Sessions Sidebar */}
        <div className="w-40 bg-gray-50 border-r border-gray-200 p-3 overflow-y-auto">
          <Button
            onClick={createNewChat}
            className="w-full mb-3 text-sm bg-purple-500 hover:bg-purple-600 text-white"
            size="sm"
          >
            New Chat
          </Button>
          <div className="space-y-2">
            {chatSessions.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-2 rounded cursor-pointer text-sm transition-colors ${
                  activeChatId === chat.id 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="font-medium truncate">{chat.title}</div>
                <div className="text-gray-500 text-xs">{formatDate(chat.createdAt)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeChat.messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-12">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Start a conversation</p>
                    <p className="text-sm mt-2">Ask questions about your idea validation results or anything else!</p>
                  </div>
                ) : (
                  activeChat.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        <div className={`text-xs mt-2 flex items-center gap-1 ${
                          message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <textarea
                    ref={inputRef}
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={2}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  <Button
                    type="submit"
                    disabled={!currentInput.trim() || isLoading}
                    className="bg-purple-500 hover:bg-purple-600 text-white p-2 h-11 w-11 self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Select a chat or create a new one</p>
                <p className="text-sm mt-2">Start your conversation with AI Assistant</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 