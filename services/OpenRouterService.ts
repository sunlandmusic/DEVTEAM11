import { TeamId } from '../types';
import { FileAttachment } from './store';
import { useState, useEffect, useRef } from 'react';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const BASE_URL = 'https://openrouter.ai/api/v1';

console.log('🔍 Environment check:');
console.log('  - VITE_OPENROUTER_API_KEY exists:', !!import.meta.env.VITE_OPENROUTER_API_KEY);
console.log('  - API_KEY value:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'undefined');
console.log('  - All env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

if (!API_KEY) {
  console.error(
    "❌ OpenRouter API key is not configured. Please set the VITE_OPENROUTER_API_KEY environment variable."
  );
} else {
  console.log('✅ API key found and loaded');
}

const getModelForTeam = (teamId: TeamId) => {
  // Models for each team based on their strengths
  const models = {
    1: 'anthropic/claude-opus-4',     // Most capable
    2: 'anthropic/claude-sonnet-4',   // Balanced
    3: 'google/gemini-pro',  // Fast
    4: 'anthropic/claude-opus-4'      // Most capable (backup)
  };
  
  return models[teamId] || models[1]; // Default to Team 1's model if invalid team
};

const attachmentsToString = (attachments: FileAttachment[]) => {
  if (attachments.length === 0) return '';
  
  const formattedAttachments = attachments.map(attachment => {
    if (!attachment.content) {
      return `\n[File: ${attachment.name} - ERROR: No content loaded]`;
    }
    
    // Add clear delimiters and file type information
    const fileExtension = attachment.name.split('.').pop()?.toLowerCase();
    const delimiter = '```';
    
    return `
[File: ${attachment.name}]
${delimiter}${fileExtension || 'text'}
${attachment.content.slice(0, 1024 * 1024)}
${delimiter}
[End of ${attachment.name}]`;
  }).join('\n\n');
  
  const result = `\n\n--- ATTACHED FILES ---\n${formattedAttachments}\n--- END OF ATTACHED FILES ---\n`;
  console.log('📄 Generated attachments string:', result.substring(0, 200) + '...');
  return result;
};

export const OpenRouterService = () => {
  const [credits, setCredits] = useState<{ used: number; total: number }>({ used: 0, total: 0 });
  const globalAbortController = useRef<AbortController | null>(null);
  const activeRequests = useRef<Set<AbortController>>(new Set());

  const fetchCredits = async () => {
    if (!API_KEY) {
      console.log('No API key found');
      return;
    }

    try {
      console.log('Fetching credits from OpenRouter...');
      const response = await fetch(`${BASE_URL}/credits`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': 'https://devteam.app',
          'X-Title': 'DEVTEAM'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Credits response:', data);
        setCredits({
          used: data.data.total_usage || 0,
          total: data.data.total_credits || 10
        });
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch credits. Status:', response.status, 'Error:', errorText);
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  // Call fetchCredits immediately when the service is initialized
  useEffect(() => {
    console.log('🚀 OpenRouterService initialized, fetching credits...');
    fetchCredits();
  }, []);

  const processTeamRequest = async (prompt: string, teamId: TeamId, attachments: FileAttachment[] = [], mode: 'eco' | 'options' | 'pro' | 'max' = 'max') => {
    console.log('🚀 Starting API request:', { prompt, teamId, mode, attachmentsCount: attachments.length });
    console.log('📎 Attachments details:', attachments.map(att => ({ name: att.name, status: att.status, hasContent: !!att.content, contentLength: att.content?.length || 0 })));
    
    // Use different models based on mode
    const models = mode === 'max' ? [
      'google/gemini-2.5-pro',
      'deepseek/deepseek-r1-0528-qwen3-8b:free',
      'anthropic/claude-opus-4',
      'x-ai/grok-4'
    ] : mode === 'pro' ? [
      'anthropic/claude-opus-4',
      'x-ai/grok-4'
    ] : mode === 'options' ? [
      // OPTIONS mode: specific models for each team
      teamId === 1 ? 'deepseek/deepseek-r1-0528-qwen3-8b:free' :
      teamId === 2 ? 'anthropic/claude-opus-4' :
      teamId === 3 ? 'x-ai/grok-4' :
      'google/gemini-2.5-pro' // Team 4
    ] : [
      // ECO mode: DeepSeek R1 for all teams
      'deepseek/deepseek-r1-0528-qwen3-8b:free'
    ];
    
    console.log('📋 Using models:', models);

    try {
      if (!API_KEY) {
        throw new Error('No API key configured. Please set VITE_OPENROUTER_API_KEY in your .env.local file');
      }
      
      console.log('🔑 API Key found:', API_KEY.substring(0, 10) + '...');
      
      // Create individual abort controllers for each model request to prevent interference
      const modelRequests = models.map(async (model, index) => {
        const requestAbortController = new AbortController();
        activeRequests.current.add(requestAbortController);
        
        try {
          console.log(`🔄 Making request to model: ${model} (Team ${teamId})`);
          
          // Add delay between requests to prevent rate limiting
          if (index > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000 * index));
          }
          
          const requestBody = {
            model: model,
            messages: [
              {
                role: 'system',
                content: `Process the following request with expertise and precision.`
              },
              {
                role: 'user',
                content: prompt + attachmentsToString(attachments)
              }
            ]
          };
          
          // Enhanced API Payload Debugging
          console.log('=== API PAYLOAD DEBUG ===');
          console.log('Attachments count:', attachments.length);
          console.log('Attachment details:', attachments.map(a => ({
            name: a.name,
            hasContent: !!a.content,
            contentLength: a.content?.length || 0,
            contentPreview: a.content?.substring(0, 100)
          })));
          console.log('Full message being sent:', requestBody.messages[1].content);
          console.log('Message length:', requestBody.messages[1].content.length);
          console.log(`📤 Request body for ${model}:`, JSON.stringify(requestBody, null, 2));
          console.log(`📊 Payload analysis for ${model}:`, {
            totalLength: JSON.stringify(requestBody).length,
            userMessageLength: requestBody.messages[1].content.length,
            hasAttachments: requestBody.messages[1].content.includes('ATTACHED FILES'),
            hasContent: requestBody.messages[1].content.includes('```'),
            attachmentCount: (requestBody.messages[1].content.match(/\[File:/g) || []).length
          });
          
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            signal: requestAbortController.signal,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_KEY}`,
              'HTTP-Referer': 'https://devteam.app',
              'X-Title': 'DEVTEAM'
            },
            body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ API Error for model', model, ':', {
              status: response.status,
              statusText: response.statusText,
              data: errorData,
              headers: Object.fromEntries(response.headers.entries())
            });
            throw new Error(`API call failed for ${model} (${response.status}): ${errorData.error?.message || response.statusText}`);
          }

          const data = await response.json();
          console.log(`✅ Response from ${model}:`, data.choices[0].message.content.substring(0, 100) + '...');
          let modelName = model.split('/')[1].toUpperCase();
          if (modelName.startsWith('DEEPSEEK')) modelName = 'DEEPSEEK R1';
          return `\n\n\n\n<span style=\"color: #a855f7; font-weight: bold;\">${modelName}</span>\n\n\n\n${data.choices[0].message.content}`;
        } finally {
          activeRequests.current.delete(requestAbortController);
        }
      });

      const responses = await Promise.all(modelRequests);

      // Update credits after successful request
      setCredits(prev => ({
        used: prev.used + models.length,
        total: prev.total
      }));

      return responses;
    } catch (error: any) {
      if ((error as Error).name === 'AbortError') {
        console.log('❌ Request was cancelled');
        throw new Error('Request was cancelled');
      }
      console.error('❌ Request Error:', error);
      throw error;
    }
  };

  const getCredits = () => credits;

  const testAPIKey = async () => {
    if (!API_KEY) {
      console.error('❌ No API key available for testing');
      return false;
    }
    
    try {
      console.log('🧪 Testing API key...');
      const response = await fetch(`${BASE_URL}/credits`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': 'https://devteam.app',
          'X-Title': 'DEVTEAM'
        }
      });
      
      if (response.ok) {
        console.log('✅ API key test successful');
        return true;
      } else {
        console.error('❌ API key test failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ API key test error:', error);
      return false;
    }
  };

  const cancelRequests = () => {
    // Cancel all active requests
    activeRequests.current.forEach(controller => {
      controller.abort();
    });
    activeRequests.current.clear();
    
    // Also cancel global controller if it exists
    if (globalAbortController.current) {
      globalAbortController.current.abort();
      globalAbortController.current = null;
    }
  };

  const sendPrompt = async (prompt: string, attachments: FileAttachment[], teamId: TeamId, mode: 'eco' | 'options' | 'pro' | 'max' = 'max'): Promise<string> => {
    const response = await processTeamRequest(prompt, teamId, attachments, mode);
    return response.join('\n\n');
  };

  return {
    processTeamRequest,
    getCredits,
    cancelRequests,
    sendPrompt,
    testAPIKey
  };
}; 