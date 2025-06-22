'use client'

import { ChangeEvent, FormEvent, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Sparkles, LogOut, User, Mail, Calendar, MessageSquare, TrendingUp, Target, BarChart3, Users, Shield, DollarSign, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from '../../components/Sidebar'
import { ChatAssistant } from '../../components/ChatAssistant'

export default function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [activeModule, setActiveModule] = useState('Idea Validation');
  
  // Form state for idea validation
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    valueProposition: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMarketAnalysis = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.productName.trim() || !formData.description.trim() || !formData.valueProposition.trim()) {
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    const analysisPrompt = `You are a senior market research analyst with access to current market data. Analyze this product idea with EXHAUSTIVE detail and specific numbers.

PRODUCT DETAILS:
- Product Name: "${formData.productName}"
- Problem Being Solved: "${formData.description}"  
- Value Proposition: "${formData.valueProposition}"

Provide a COMPREHENSIVE MARKET ANALYSIS with specific data, numbers, and market sizing for each parameter:

1. **PROBLEM-MARKET FIT ASSESSMENT**
   - Market size validation with specific numbers (TAM, SAM, SOM in $)
   - Problem frequency and severity metrics
   - Current solution gaps with quantified pain points
   - Market readiness score with supporting data

2. **TARGET AUDIENCE VALIDATION & SEGMENTATION**
   - Total Addressable Market (TAM) size with population numbers
   - Serviceable Addressable Market (SAM) breakdown by segments
   - Serviceable Obtainable Market (SOM) with realistic capture rates
   - Detailed customer cohorts with:
     * Demographics (age, income, location, education)
     * Psychographics and behavioral patterns
     * Market size for each cohort (numbers and $)
     * Specific problem statements for each cohort
     * Willingness to pay analysis per segment

3. **COMPETITIVE LANDSCAPE ANALYSIS**
   - Direct competitors with market share percentages
   - Indirect competitors and substitutes
   - Competitive positioning matrix with feature comparison
   - Market concentration analysis (CR4, HHI if available)
   - Pricing analysis across competitors
   - Market gaps and white space opportunities

4. **VALUE PROPOSITION VALIDATION**
   - Unique value quantification vs competitors
   - Customer value creation metrics (time saved, cost reduction, etc.)
   - Price sensitivity analysis
   - Value perception studies data

5. **MOAT ANALYSIS & DEFENSIBILITY**
   - Barrier to entry assessment with specific factors
   - Network effects potential with growth metrics
   - Switching costs analysis
   - Intellectual property landscape
   - Resource requirements for competitors

6. **BUSINESS MODEL & REVENUE ANALYSIS**
   - Revenue model validation with industry benchmarks
   - Unit economics breakdown (CAC, LTV, payback period)
   - Pricing strategy with elasticity analysis
   - Revenue projections for Years 1-3
   - Gross margin analysis vs industry standards

7. **CUSTOMER ACQUISITION STRATEGY**
   - Channel effectiveness with conversion rates
   - Customer Acquisition Cost (CAC) by channel
   - Lifetime Value (LTV) calculations
   - Marketing spend allocation with ROI projections
   - Growth rate projections and viral coefficients

8. **RISK ASSESSMENT WITH QUANTIFICATION**
   - Market risks with probability and impact scores
   - Competitive risks with threat assessment
   - Regulatory risks and compliance costs
   - Technology risks and mitigation costs
   - Financial risks with scenario analysis

**FINAL PREDICTION SCORE (out of 10) with detailed reasoning:**
- Scoring breakdown by each parameter
- Market opportunity score with supporting metrics
- Execution difficulty assessment
- Time-to-market analysis
- Investment requirements vs potential returns

**STRATEGIC RECOMMENDATIONS:**
- Go-to-market strategy with timeline and budget
- Product development priorities with resource allocation
- Partnership opportunities with specific targets
- Funding requirements and milestones

IMPORTANT: Include specific numbers, percentages, market data, and quantified metrics throughout. Use current market research and industry reports for accuracy.`;

    try {
      const res = await fetch('http://localhost:3001/api/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: analysisPrompt }]
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.reply) {
        setAnalysisResult(data.reply);
      } else {
        throw new Error('No analysis received from server');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalysisError('Sorry, there was an error processing your market analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      description: '',
      valueProposition: ''
    });
    setAnalysisResult(null);
    setAnalysisError(null);
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
      <div className={`flex-1 transition-all duration-300 ${isChatOpen ? 'mr-[30%]' : ''}`}>
        {activeModule === 'Idea Validation' ? (
          <div className="max-w-7xl mx-auto mt-10 p-6">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Idea Validation</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get exhaustive market analysis with real-time data, detailed financial projections, and quantified insights.
              </p>
            </div>

            <div className="space-y-8">
              {!analysisResult ? (
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <Card className="bg-white shadow-xl border-0">
                      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Target className="w-6 h-6" />
                          Product Details
                        </CardTitle>
                        <CardDescription className="text-purple-100">
                          Tell us about your product idea to get started
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <form onSubmit={handleMarketAnalysis} className="space-y-6">
                          <div>
                            <label htmlFor="productName" className="text-sm font-semibold text-gray-700 mb-2 block">
                              Product Name *
                            </label>
                            <input
                              type="text"
                              id="productName"
                              name="productName"
                              value={formData.productName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                              placeholder="e.g., TaskMaster Pro"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
                              Product Description *
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              rows={4}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 resize-none"
                              placeholder="What problems are you solving? How frequent are these problems? Who is your target audience?"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="valueProposition" className="text-sm font-semibold text-gray-700 mb-2 block">
                              Value Proposition *
                            </label>
                            <textarea
                              id="valueProposition"
                              name="valueProposition"
                              value={formData.valueProposition}
                              onChange={handleInputChange}
                              rows={3}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 resize-none"
                              placeholder="What MOAT do you want to provide to users? What makes you unique?"
                              required
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={isAnalyzing}
                            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {isAnalyzing ? (
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Gathering Market Data & Analyzing...
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Analyze Market
                              </div>
                            )}
                          </Button>
                        </form>

                        {analysisError && (
                          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-red-800">
                              <AlertTriangle className="w-5 h-5" />
                              <span className="font-medium">Analysis Error</span>
                            </div>
                            <p className="text-red-700 mt-1">{analysisError}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Info Section */}
                    <div className="space-y-6">
                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-blue-900 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            What You'll Get
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div>
                              <p className="font-medium text-blue-900">Market Sizing with Real Data</p>
                              <p className="text-sm text-blue-700">TAM, SAM, SOM calculations with current market research</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div>
                              <p className="font-medium text-blue-900">Detailed Customer Segmentation</p>
                              <p className="text-sm text-blue-700">Demographics, cohorts, and willingness-to-pay analysis</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div>
                              <p className="font-medium text-blue-900">Competitive Intelligence</p>
                              <p className="text-sm text-blue-700">Market share data, pricing analysis, and positioning</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div>
                              <p className="font-medium text-blue-900">Financial Projections</p>
                              <p className="text-sm text-blue-700">Unit economics, CAC/LTV, and revenue forecasts</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <CardHeader>
                          <CardTitle className="text-green-900 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Analysis Framework
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-green-800">
                              <Users className="w-4 h-4" />
                              <span>TAM/SAM/SOM</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-800">
                              <Target className="w-4 h-4" />
                              <span>Cohort Analysis</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-800">
                              <BarChart3 className="w-4 h-4" />
                              <span>Market Share</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-800">
                              <DollarSign className="w-4 h-4" />
                              <span>Unit Economics</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-800">
                              <Shield className="w-4 h-4" />
                              <span>Defensibility</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-800">
                              <AlertTriangle className="w-4 h-4" />
                              <span>Risk Scoring</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  // Analysis Results Section
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">Market Analysis Results</h2>
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        New Analysis
                      </Button>
                    </div>

                    <Card className="bg-white shadow-xl border-0">
                      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-6 h-6" />
                          Analysis for "{formData.productName}"
                        </CardTitle>
                        <CardDescription className="text-purple-100">
                          Comprehensive market analysis and recommendations
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="prose max-w-none">
                          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {analysisResult}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
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
      
      {/* Chat Assistant - Always visible */}
      <ChatAssistant onOpenChange={setIsChatOpen} />
    </div>
  )
} 