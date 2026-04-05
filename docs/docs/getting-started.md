---
sidebar_position: 2
title: Getting Started
---

# Getting Started

## Installation

```bash
npm install aiclientjs    # npm
pnpm add aiclientjs       # pnpm
yarn add aiclientjs       # yarn
bun add aiclientjs        # bun
```

## Set Your API Key

aiclientjs reads API keys from environment variables automatically:

```bash
export OPENAI_API_KEY=sk-...
# or
export ANTHROPIC_API_KEY=sk-ant-...
# or
export GOOGLE_API_KEY=AI...
```

You can also pass the key directly:

```typescript
await ai('Hello', { apiKey: 'sk-...' });
```

## Your First Call

```typescript
import { ai } from 'aiclientjs';

const response = await ai('Explain quantum computing in one sentence');
console.log(response.text);
console.log(`Tokens used: ${response.usage.totalTokens}`);
```

## Switch Providers

Change the provider with a single option:

```typescript
// OpenAI (default)
const res = await ai('Hello!');

// Anthropic Claude
const res = await ai('Hello!', { provider: 'anthropic' });

// Google Gemini
const res = await ai('Hello!', { provider: 'google' });

// Local model via Ollama (no API key needed)
const res = await ai('Hello!', { provider: 'ollama', model: 'llama3.1' });
```

## Preconfigured Clients

Use `createAIClient` to avoid repeating options:

```typescript
import { createAIClient } from 'aiclientjs';

const gpt = createAIClient({
  provider: 'openai',
  model: 'gpt-4o',
  system: 'You are a helpful assistant. Be concise.',
  temperature: 0.7,
});

const claude = createAIClient({
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
});

// Use without repeating config
const answer = await gpt('What is 2+2?');
const story = await claude('Tell me a short story', { stream: true });
```

## Multi-modal (Vision)

Pass images alongside text:

```typescript
const res = await ai([
  {
    role: 'user',
    content: [
      { type: 'text', text: 'What is in this image?' },
      { type: 'image', url: 'https://example.com/photo.jpg' },
    ],
  },
]);

console.log(res.text);
```

## Cancellation

Use `AbortSignal` to cancel requests:

```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

const res = await ai('Write a long essay', {
  signal: controller.signal,
});
```

## Next Steps

- [Streaming](/guides/streaming) — real-time token delivery
- [Structured Output](/guides/structured-output) — type-safe JSON responses
- [Tool Calling](/guides/tool-calling) — let models call your functions
- [Providers](/guides/providers) — configure and create custom providers
