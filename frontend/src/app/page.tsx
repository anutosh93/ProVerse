'use client';

import React from 'react';
import { ArrowRightIcon, SparklesIcon, CpuChipIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="flex justify-center items-center mb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">ProVerse</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-4 max-w-3xl mx-auto">
              An AI Universe for Product Managers
            </p>
            
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Complete product development lifecycle management from ideation to deployment. 
              Streamline your workflow with AI-powered tools.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="btn-shimmer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-cursor-lg transition-all duration-300 flex items-center gap-2">
                Get Started Free
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              
              <button className="glass px-8 py-4 rounded-xl font-semibold text-lg text-slate-700 dark:text-slate-300 hover:bg-white/20 transition-all duration-300">
                Watch Demo
              </button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                '🧠 AI Brainstorming',
                '🎨 Smart Wireframing', 
                '🔄 Figma Integration',
                '⚡ Code Generation',
                '🔍 QA Automation',
                '📊 Analytics',
                '🐛 Bug Tracking'
              ].map((feature, index) => (
                <span 
                  key={index}
                  className="glass px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Everything you need in one platform
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From initial brainstorming to final deployment, ProVerse provides AI-powered tools 
            for every step of your product development journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass p-8 rounded-2xl hover:shadow-cursor transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
              <CpuChipIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              AI-Powered Intelligence
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Leverage advanced AI to generate ideas, create wireframes, write code, 
              and analyze your product performance.
            </p>
            <ul className="text-sm text-slate-500 dark:text-slate-500 space-y-1">
              <li>• GPT-4 & Claude integration</li>
              <li>• Vector-based context memory</li>
              <li>• Smart recommendations</li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="glass p-8 rounded-2xl hover:shadow-cursor transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <RocketLaunchIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Complete Workflow
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              End-to-end product development from brainstorming to deployment, 
              all integrated in one seamless platform.
            </p>
            <ul className="text-sm text-slate-500 dark:text-slate-500 space-y-1">
              <li>• Brainstorming to PRD</li>
              <li>• Figma to Code generation</li>
              <li>• Automated QA testing</li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="glass p-8 rounded-2xl hover:shadow-cursor transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Smart Integrations
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Connect with your favorite tools like Figma, JIRA, Confluence, 
              and Google Workspace for seamless collaboration.
            </p>
            <ul className="text-sm text-slate-500 dark:text-slate-500 space-y-1">
              <li>• Figma design import</li>
              <li>• JIRA ticket creation</li>
              <li>• Google Meet recording</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center py-16">
        <div className="glass inline-flex items-center gap-3 px-6 py-3 rounded-full">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            Development Server Running
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-4">
          API: <span className="font-mono">http://localhost:3002</span> | 
          Frontend: <span className="font-mono">http://localhost:3000</span>
        </p>
      </div>
    </div>
  );
} 