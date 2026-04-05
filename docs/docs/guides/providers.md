---
sidebar_position: 4
title: Providers
---

# Providers

aiclientjs ships with 4 built-in providers and supports custom providers.

## Built-in Providers

| Provider | Models | Auth | Default Model |
|---|---|---|---|
| `openai` | GPT-4o, GPT-4, o1, etc. | `OPENAI_API_KEY` | `gpt-4o` |
| `anthropic` | Claude Sonnet, Opus, Haiku | `ANTHROPIC_API_KEY` | `claude-sonnet-4-20250514` |
| `google` | Gemini 2.0, 1.5, etc. | `GOOGLE_API_KEY` | `gemini-2.0-flash` |
| `ollama` | Llama, Mistral, Phi, any local model | No auth needed | `llama3.1` |

## OpenAI

```typescript
import { ai } from 'aiclientjs';

const res = await ai('Hello', {
  provider: 'openai',
  model: 'gpt-4o',        // or 'gpt-4', 'gpt-4o-mini', 'o1', etc.
});
```

## Anthropic

```typescript
const res = await ai('Hello', {
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',  // or 'claude-3-opus', 'claude-3-haiku', etc.
});
```

## Google Gemini

```typescript
const res = await ai('Hello', {
  provider: 'google',
  model: 'gemini-2.0-flash',  // or 'gemini-1.5-pro', etc.
});
```

## Ollama (Local Models)

No API key needed. Make sure Ollama is running locally:

```bash
# Install: https://ollama.com
ollama pull llama3.1
ollama serve
```

```typescript
const res = await ai('Hello', {
  provider: 'ollama',
  model: 'llama3.1',
  baseURL: 'http://localhost:11434',  // default
});
```

## OpenAI-Compatible APIs

Any OpenAI-compatible endpoint works with the `openai` provider and a custom `baseURL`:

```typescript
// Together AI
const res = await ai('Hello', {
  provider: 'openai',
  baseURL: 'https://api.together.xyz/v1',
  apiKey: process.env.TOGETHER_API_KEY,
  model: 'meta-llama/Llama-3-70b-chat-hf',
});

// Groq
const res = await ai('Hello', {
  provider: 'openai',
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama3-70b-8192',
});

// Azure OpenAI
const res = await ai('Hello', {
  provider: 'openai',
  baseURL: 'https://YOUR_RESOURCE.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT',
  apiKey: process.env.AZURE_OPENAI_KEY,
  model: 'gpt-4o',
});
```

## Custom Providers

Register your own provider with `registerProvider`:

```typescript
import { registerProvider } from 'aiclientjs';

registerProvider('my-provider', {
  name: 'my-provider',

  async chat(request, config) {
    // `request` has: model, messages, temperature, maxTokens, tools, etc.
    // `config` has: apiKey, baseURL, headers

    const response = await fetch(`${config.baseURL}/chat`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${config.apiKey}` },
      body: JSON.stringify({ model: request.model, messages: request.messages }),
    });

    const data = await response.json();

    return {
      text: data.response,
      toolCalls: [],
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      model: request.model,
      finishReason: 'stop',
      raw: data,
    };
  },

  async *stream(request, config) {
    // Yield ProviderStreamEvent objects
    yield { type: 'text', text: 'Hello from custom provider!' };
    yield { type: 'finish', finishReason: 'stop' };
  },
});

// Now use it
const res = await ai('Hello', { provider: 'my-provider', apiKey: '...', baseURL: '...' });
```

## Extending Built-in Providers

You can extend the built-in provider classes:

```typescript
import { OpenAIProvider, registerProvider } from 'aiclientjs';

class MyOpenAIProvider extends OpenAIProvider {
  readonly name = 'my-openai';

  // Override any method to customize behavior
  protected buildHeaders(config) {
    return {
      ...super.buildHeaders(config),
      'X-Custom-Header': 'my-value',
    };
  }
}

registerProvider('my-openai', new MyOpenAIProvider());
```
