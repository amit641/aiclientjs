---
sidebar_position: 1
title: Streaming
---

# Streaming

Stream tokens as they arrive from the model. Just add `stream: true`.

## Basic Streaming

```typescript
import { ai } from 'aiclientjs';

const stream = await ai('Write a poem about code', { stream: true });

for await (const chunk of stream) {
  process.stdout.write(chunk); // tokens arrive in real-time
}
```

## Collect Full Response

Use `.text()` to collect the complete text after streaming, or `.response()` for the full response object:

```typescript
const stream = await ai('Tell me a story', { stream: true });

// Option 1: Just the text
const fullText = await stream.text();
console.log(fullText);

// Option 2: Full response with usage stats
const stream2 = await ai('Tell me a joke', { stream: true });
const response = await stream2.response();
console.log(response.text);
console.log(response.usage.totalTokens);
```

## Web ReadableStream

Convert to a Web `ReadableStream` for use with HTTP frameworks:

```typescript
// Hono / Express / Next.js API route
const stream = await ai('Hello', { stream: true });
return new Response(stream.toReadableStream());
```

### Next.js Route Handler

```typescript
// app/api/chat/route.ts
import { ai } from 'aiclientjs';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const stream = await ai(prompt, { stream: true });

  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

## Abort a Stream

```typescript
const stream = await ai('Write a very long essay', { stream: true });

// Stop after 2 seconds
setTimeout(() => stream.abort(), 2000);

for await (const chunk of stream) {
  process.stdout.write(chunk);
}
```

## Streaming with Different Providers

Streaming works identically across all providers:

```typescript
// OpenAI
const s1 = await ai('Hello', { stream: true, provider: 'openai' });

// Anthropic
const s2 = await ai('Hello', { stream: true, provider: 'anthropic' });

// Google Gemini
const s3 = await ai('Hello', { stream: true, provider: 'google' });

// Ollama (local)
const s4 = await ai('Hello', { stream: true, provider: 'ollama', model: 'llama3.1' });
```
