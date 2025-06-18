const express = require('express');
const router = express.Router();
const { ChatOpenAI } = require('@langchain/openai');
const { HumanMessage, AIMessage } = require('@langchain/core/messages');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize LangChain ChatOpenAI
const initializeChatModel = (modelName = 'gpt-4o-mini') => {
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
    maxTokens: 1000, // Reasonable limit for most responses (was 200,000!)
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
    
    // Use gpt-4o-mini as the primary model
    const modelsToTry = ['gpt-4o-mini'];
    let lastError = null;
    
    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model}`);
        
        // Initialize the chat model
        const chatModel = initializeChatModel(model);
        
        // Convert messages to LangChain format
        const langchainMessages = messages.map(msg => {
          if (msg.role === 'user') {
            return new HumanMessage(msg.content);
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
            maxTokensLimit: 1000
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
    
    // Test gpt-4o-mini model
    const modelsToTest = ['gpt-4o-mini'];
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
      primaryModel: 'gpt-4o-mini',
      maxTokens: 1000,
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    res.status(500).json({ 
      error: err.message 
    });
  }
});

module.exports = router; 