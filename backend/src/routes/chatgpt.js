const express = require('express');
const router = express.Router();
const { ChatOpenAI } = require('@langchain/openai');
const { HumanMessage, AIMessage } = require('@langchain/core/messages');
const axios = require('axios');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Enhanced web search function for comprehensive market research
const searchMarketData = async (query) => {
  try {
    console.log(`Searching for: ${query}`);
    
    // Multiple search strategies for better market data
    const searchSources = [
      // DuckDuckGo instant answers (free)
      {
        url: 'https://api.duckduckgo.com/',
        params: { q: query, format: 'json', no_html: '1', skip_disambig: '1' }
      }
    ];
    
    const searchPromises = searchSources.map(async (source) => {
      try {
        const response = await axios.get(source.url, {
          params: source.params,
          timeout: 5000,
          headers: {
            'User-Agent': 'ProVerse Market Research Bot 1.0'
          }
        });
        
        if (response.data && response.data.AbstractText) {
          return response.data.AbstractText;
        }
        
        // Check for related topics
        if (response.data && response.data.RelatedTopics && response.data.RelatedTopics.length > 0) {
          const relatedInfo = response.data.RelatedTopics.slice(0, 3)
            .map(topic => topic.Text)
            .filter(text => text)
            .join('. ');
          if (relatedInfo) return relatedInfo;
        }
        
        return null;
      } catch (err) {
        console.log(`Search source failed: ${err.message}`);
        return null;
      }
    });
    
    const results = await Promise.all(searchPromises);
    const validResults = results.filter(result => result !== null);
    
    if (validResults.length > 0) {
      return validResults.join('\n\n');
    }
    
    // Enhanced fallback with industry-specific guidance
    const industryKeywords = query.toLowerCase();
    let industryGuidance = '';
    
    if (industryKeywords.includes('healthcare') || industryKeywords.includes('medical')) {
      industryGuidance = 'Healthcare market data sources: FDA reports, healthcare.gov statistics, medical device industry reports, pharmaceutical market analysis.';
    } else if (industryKeywords.includes('fintech') || industryKeywords.includes('finance')) {
      industryGuidance = 'Fintech market data sources: Federal Reserve reports, banking industry statistics, payment processing market analysis, regulatory compliance costs.';
    } else if (industryKeywords.includes('saas') || industryKeywords.includes('software')) {
      industryGuidance = 'SaaS market data sources: Software industry reports, subscription economy statistics, cloud computing market analysis, enterprise software trends.';
    } else if (industryKeywords.includes('ecommerce') || industryKeywords.includes('retail')) {
      industryGuidance = 'E-commerce market data sources: Retail industry reports, online shopping statistics, consumer behavior studies, digital commerce trends.';
    }
    
    return `Market research guidance for "${query}": ${industryGuidance} Consider checking Statista, IBISWorld, Grand View Research, McKinsey Global Institute, and industry-specific trade associations for current market sizing, growth rates, and competitive landscape data.`;
    
  } catch (error) {
    console.log('Web search error:', error.message);
    return `Market research needed for: "${query}". Recommend consulting current industry reports and market research databases for accurate sizing and trend data.`;
  }
};

// Initialize LangChain ChatOpenAI
const initializeChatModel = (modelName = 'gpt-4o') => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  
  console.log(`Initializing ChatOpenAI with model: ${modelName}`);
  console.log(`API Key present: ${OPENAI_API_KEY ? 'Yes' : 'No'}`);
  console.log(`API Key length: ${OPENAI_API_KEY ? OPENAI_API_KEY.length : 0}`);
  console.log(`API Key starts with: ${OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 7) + '...' : 'N/A'}`);
  
  return new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    modelName: modelName,
    temperature: 0.7,
    maxTokens: 8000, // High limit for exhaustive market analysis with detailed numbers and data
    timeout: 30000,
    maxRetries: 1,
  });
};

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured.' });
    }
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required.' });
    }

    console.log('Making LangChain ChatOpenAI request');
    console.log('Messages count:', messages.length);
    
    // Enhanced market research with web search for detailed analysis
    let marketResearchData = '';
    const userMessage = messages[messages.length - 1];
    
    // Check if this is a market analysis request
    if (userMessage && userMessage.content && userMessage.content.includes('COMPREHENSIVE MARKET ANALYSIS')) {
      console.log('Detected market analysis request - gathering web research data...');
      
      // Extract product info from the message for targeted searches
      const productMatch = userMessage.content.match(/Product Name: "([^"]+)"/);
      const problemMatch = userMessage.content.match(/Problem Being Solved: "([^"]+)"/);
      
      if (productMatch && problemMatch) {
        const productName = productMatch[1];
        const problemDescription = problemMatch[1];
        
        // Perform targeted market research searches
        const searchQueries = [
          `${productName} market size industry analysis 2024`,
          `${problemDescription} market research statistics`,
          `${productName} competitors market share analysis`,
          `${problemDescription} industry trends revenue projections`
        ];
        
        const searchResults = await Promise.all(
          searchQueries.map(query => searchMarketData(query))
        );
        
        marketResearchData = `\n\nCURRENT MARKET RESEARCH DATA:\n${searchResults.join('\n\n')}\n\nUse this current market data to provide specific numbers and recent industry insights in your analysis.\n\n`;
        console.log('Market research data gathered successfully');
      }
    }
    
    // Use gpt-4o as the primary model
    const modelsToTry = ['gpt-4o'];
    let lastError = null;
    
    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model}`);
        
        // Initialize the chat model
        const chatModel = initializeChatModel(model);
        
        // Convert messages to LangChain format and enhance with market research data
        const langchainMessages = messages.map((msg, index) => {
          if (msg.role === 'user') {
            // Add market research data to the last user message if available
            const content = (index === messages.length - 1 && marketResearchData) 
              ? msg.content + marketResearchData 
              : msg.content;
            return new HumanMessage(content);
          } else if (msg.role === 'assistant') {
            return new AIMessage(msg.content);
          }
          return new HumanMessage(msg.content);
        });
        
        // Get response from LangChain
        const response = await chatModel.invoke(langchainMessages);
        
        console.log(`LangChain ChatOpenAI request successful with model: ${model}`);
        
        // Extract the content from the response
        const reply = response.content;
        
        // Log token usage information
        const inputTokensEstimate = langchainMessages.reduce((total, msg) => {
          return total + Math.ceil(msg.content.length / 4); // Rough estimate: 1 token ≈ 4 characters
        }, 0);
        const outputTokensEstimate = Math.ceil(reply.length / 4);
        
        console.log(`Token usage estimate - Input: ${inputTokensEstimate}, Output: ${outputTokensEstimate}, Total: ${inputTokensEstimate + outputTokensEstimate}`);
        
        return res.json({ 
          reply, 
          model: model,
          tokenUsage: {
            inputTokensEstimate,
            outputTokensEstimate,
            totalTokensEstimate: inputTokensEstimate + outputTokensEstimate,
            maxTokensLimit: 8000
          }
        });
        
      } catch (modelError) {
        console.log(`Model ${model} failed:`, modelError.message);
        lastError = modelError;
        
        // If it's a quota or rate limit issue, continue to try other models
        if (modelError.message.includes('quota') || modelError.message.includes('429') || modelError.message.includes('insufficient_quota')) {
          continue; // Try next model
        }
        
        // For other errors, don't try more models
        break;
      }
    }
    
    // If all models failed, throw the last error
    throw lastError;
    
  } catch (err) {
    console.error('LangChain ChatOpenAI error:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    
    // Handle specific LangChain/OpenAI errors
    if (err.message.includes('quota') || err.message.includes('insufficient_quota') || err.message.includes('429')) {
      return res.status(402).json({ 
        error: 'OpenAI quota exceeded. Please check your plan and billing details at https://platform.openai.com/account/billing',
        details: err.message
      });
    } else if (err.message.includes('rate limit') || err.message.includes('rate_limit_exceeded')) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait a moment and try again.'
      });
    } else if (err.message.includes('invalid') && err.message.includes('api')) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your OpenAI API key.'
      });
    } else if (err.message.includes('timeout')) {
      return res.status(408).json({ 
        error: 'Request timeout. Please try again.'
      });
    } else {
      return res.status(500).json({ 
        error: `ChatGPT service error: ${err.message}`
      });
    }
  }
});

// Test endpoint with multiple models
router.get('/test', async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured.' });
    }

    console.log('Testing LangChain ChatOpenAI connection...');
    
    // Test gpt-4o model
    const modelsToTest = ['gpt-4o'];
    const results = {};
    
    for (const model of modelsToTest) {
      try {
        console.log(`Testing model: ${model}`);
        const chatModel = initializeChatModel(model);
        const testMessage = new HumanMessage('Hi');
        
        const response = await chatModel.invoke([testMessage]);
        
        results[model] = {
          success: true,
          response: response.content
        };
        
        // If one model works, return success
        return res.json({ 
          success: true, 
          message: `LangChain ChatOpenAI is working with ${model}!`,
          response: response.content,
          model: model,
          allResults: results
        });
        
      } catch (err) {
        console.log(`Model ${model} test failed:`, err.message);
        results[model] = {
          success: false,
          error: err.message
        };
      }
    }
    
    // If all models failed
    res.status(500).json({ 
      success: false,
      error: 'All models failed',
      results: results,
      service: 'LangChain ChatOpenAI'
    });
    
  } catch (err) {
    console.error('LangChain test error:', err.message);
    res.status(500).json({ 
      success: false,
      error: err.message,
      service: 'LangChain ChatOpenAI'
    });
  }
});

// Debug endpoint to check API key and account info
router.get('/debug', async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured.' });
    }
    
    // Basic API key info (without exposing the key)
    res.json({
      apiKeyConfigured: !!OPENAI_API_KEY,
      apiKeyLength: OPENAI_API_KEY.length,
      apiKeyPrefix: OPENAI_API_KEY.substring(0, 7) + '...',
      nodeEnv: process.env.NODE_ENV,
      primaryModel: 'gpt-4o',
      maxTokens: 8000,
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    res.status(500).json({ 
      error: err.message 
    });
  }
});

module.exports = router; 