'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { AlertCircle, CheckCircle, Clock, Zap, MessageSquare, TrendingUp } from 'lucide-react'

interface TokenUsage {
  inputTokensEstimate: number;
  outputTokensEstimate: number;
  totalTokensEstimate: number;
  maxTokensLimit: number;
}

interface ApiResponse {
  reply: string;
  model: string;
  tokenUsage?: TokenUsage;
}

interface ApiError {
  error: string;
  details?: string;
}

export default function ApiTester() {
  const [testPrompt, setTestPrompt] = useState('Capital of London?')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [testHistory, setTestHistory] = useState<Array<{
    prompt: string;
    timestamp: string;
    success: boolean;
    tokens?: number;
    response?: string;
    error?: string;
  }>>([])

  const predefinedPrompts = [
    'Capital of London?',
    'What is the best pricing strategy for a SaaS product?',
    'How do I validate a product idea?',
    'What are the key features of a successful MVP?',
    'Tell me about market research techniques.'
  ]

  const testApi = async () => {
    if (!testPrompt.trim()) return

    setIsLoading(true)
    setResponse(null)
    setError(null)

    const startTime = Date.now()

    try {
      const res = await fetch('http://localhost:3001/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: testPrompt }]
        }),
      })

      const data = await res.json()
      const endTime = Date.now()
      const responseTime = endTime - startTime

      if (!res.ok) {
        const apiError: ApiError = {
          error: data.error || `HTTP ${res.status}`,
          details: data.details
        }
        setError(apiError)
        
        // Add to test history
        setTestHistory(prev => [{
          prompt: testPrompt,
          timestamp: new Date().toLocaleTimeString(),
          success: false,
          error: apiError.error
        }, ...prev.slice(0, 9)]) // Keep last 10 tests

      } else {
        const apiResponse: ApiResponse = {
          reply: data.reply,
          model: data.model,
          tokenUsage: data.tokenUsage
        }
        setResponse(apiResponse)

        // Add to test history
        setTestHistory(prev => [{
          prompt: testPrompt,
          timestamp: new Date().toLocaleTimeString(),
          success: true,
          tokens: data.tokenUsage?.totalTokensEstimate || 0,
          response: data.reply.substring(0, 100) + (data.reply.length > 100 ? '...' : '')
        }, ...prev.slice(0, 9)]) // Keep last 10 tests
      }

    } catch (err) {
      const networkError: ApiError = {
        error: 'Network Error',
        details: err instanceof Error ? err.message : 'Unknown error occurred'
      }
      setError(networkError)

      // Add to test history
      setTestHistory(prev => [{
        prompt: testPrompt,
        timestamp: new Date().toLocaleTimeString(),
        success: false,
        error: networkError.error
      }, ...prev.slice(0, 9)])

    } finally {
      setIsLoading(false)
    }
  }

  const calculateCost = (tokenUsage: TokenUsage) => {
    const inputCost = (tokenUsage.inputTokensEstimate * 0.15) / 1000000
    const outputCost = (tokenUsage.outputTokensEstimate * 0.60) / 1000000
    return inputCost + outputCost
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            OpenAI API Testing Tool
          </CardTitle>
          <CardDescription>
            Test your OpenAI API integration, monitor token usage, and debug responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Input Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Test Prompt</label>
            <textarea
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="w-full p-3 border rounded-lg resize-none"
              rows={3}
              placeholder="Enter your test prompt..."
            />
            
            {/* Predefined Prompts */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Quick tests:</span>
              {predefinedPrompts.map((prompt, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => setTestPrompt(prompt)}
                  className="text-xs"
                >
                  {prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt}
                </Button>
              ))}
            </div>
          </div>

          {/* Test Button */}
          <Button
            onClick={testApi}
            disabled={isLoading || !testPrompt.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Testing API...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                Test OpenAI API
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Response Section */}
      {(response || error) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {error ? (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  API Error
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  API Response
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">{error.error}</p>
                  {error.details && (
                    <p className="text-red-600 text-sm mt-1">{error.details}</p>
                  )}
                </div>
                
                {error.error.includes('quota') && (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        <strong>💡 Primary Solution:</strong> Check your spending limits at{' '}
                        <a
                          href="https://platform.openai.com/settings/organization/limits"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-medium"
                        >
                          platform.openai.com/settings/organization/limits
                        </a>
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">🔍 Detailed Diagnosis Steps:</h4>
                      <div className="space-y-2 text-sm text-yellow-700">
                        <div className="flex items-start gap-2">
                          <span className="font-medium">1.</span>
                          <div>
                            <strong>Check Spending Limits:</strong><br/>
                             Go to <a href="https://platform.openai.com/settings/organization/limits" target="_blank" className="underline">Settings - Limits</a><br/>
                            - Monthly spending limit might be set to $0<br/>
                            - Hard limit might be lower than your credits
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <span className="font-medium">2.</span>
                          <div>
                            <strong>Verify Payment Method:</strong><br/>
                            Go to <a href="https://platform.openai.com/account/billing" target="_blank" className="underline">Billing - Payment methods</a><br/>
                            - Ensure you have a valid payment method<br/>
                            - Check if payment method is verified
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <span className="font-medium">3.</span>
                          <div>
                            <strong>Check Usage Dashboard:</strong><br/>
                            Go to <a href="https://platform.openai.com/usage" target="_blank" className="underline">Usage Dashboard</a><br/>
                            - See if you've hit monthly limits<br/>
                            - Check current month vs limit
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <span className="font-medium">4.</span>
                          <div>
                            <strong>API Key Permissions:</strong><br/>
                            Go to <a href="https://platform.openai.com/api-keys" target="_blank" className="underline">API Keys</a><br/>
                            - Verify your key has &quot;All&quot; permissions<br/>
                            - Check if key is restricted to specific models
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <span className="font-medium">5.</span>
                          <div>
                            <strong>Project Settings:</strong><br/>
                            - Switch between different projects<br/>
                            - Try creating a new API key<br/>
                            - Check if project has specific restrictions
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">🚨 Most Common Issue:</h4>
                      <p className="text-red-700 text-sm">
                        <strong>Monthly spending limit set to $0.00</strong><br/>
                        Even with credits, OpenAI requires a spending limit greater than $0 to use the API.<br/>
                        Set your monthly limit to at least $5-10 at the limits page above.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">✅ Quick Fix:</h4>
                      <p className="text-green-700 text-sm">
                        1. Go to <a href="https://platform.openai.com/settings/organization/limits" target="_blank" className="underline">Organization Limits</a><br/>
                        2. Set &quot;Monthly spending limit&quot; to $10.00<br/>
                        3. Set &quot;Hard limit&quot; to $10.00<br/>
                        4. Click &quot;Save&quot;<br/>
                        5. Wait 2-3 minutes and try again
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : response ? (
              <div className="space-y-4">
                {/* Model & Status */}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Model: {response.model}</Badge>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Success
                  </Badge>
                </div>

                {/* Response Text */}
                <div className="p-3 bg-gray-50 border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Response:</h4>
                  <p className="text-sm whitespace-pre-wrap">{response.reply}</p>
                </div>

                {/* Token Usage */}
                {response.tokenUsage && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Token Usage & Cost Analysis
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Input Tokens</p>
                        <p className="font-medium">{response.tokenUsage.inputTokensEstimate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Output Tokens</p>
                        <p className="font-medium">{response.tokenUsage.outputTokensEstimate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Tokens</p>
                        <p className="font-medium">{response.tokenUsage.totalTokensEstimate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cost (USD)</p>
                        <p className="font-medium text-green-600">
                          ${calculateCost(response.tokenUsage).toFixed(6)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs text-gray-500">
                        Token limit: {response.tokenUsage.maxTokensLimit} | 
                        Usage: {((response.tokenUsage.totalTokensEstimate / response.tokenUsage.maxTokensLimit) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Test History */}
      {testHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test History</CardTitle>
            <CardDescription>Recent API test results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testHistory.map((test, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    test.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {test.prompt.length > 30 ? test.prompt.substring(0, 30) + '...' : test.prompt}
                      </p>
                      {test.success && test.response && (
                        <p className="text-xs text-gray-600 mt-1">{test.response}</p>
                      )}
                      {!test.success && test.error && (
                        <p className="text-xs text-red-600 mt-1">{test.error}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{test.timestamp}</p>
                      {test.success && test.tokens && (
                        <p className="text-xs text-blue-600">{test.tokens} tokens</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">API Endpoint</p>
              <p className="font-medium">http://localhost:3001/api/chatgpt</p>
            </div>
            <div>
              <p className="text-gray-600">Model</p>
              <p className="font-medium">gpt-4o-mini</p>
            </div>
            <div>
              <p className="text-gray-600">Max Tokens</p>
              <p className="font-medium">1,000 tokens</p>
            </div>
            <div>
              <p className="text-gray-600">Pricing</p>
              <p className="font-medium">$0.15/1M input + $0.60/1M output</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 