---
slug: /
sidebar_position: 1
title: Introduction
---

# aiclientjs

**The lightweight, universal AI client for JavaScript & TypeScript.**

One function. Any model. Zero dependencies.

```bash
npm install aiclientjs
```

```typescript
import { ai } from 'aiclientjs';

const { text } = await ai('Explain quantum computing in one sentence');
```

That's it. No boilerplate. No framework lock-in. Works everywhere.

## Why aiclientjs?

| | aiclientjs | Vercel AI SDK | Direct API calls |
|---|---|---|---|
| **Bundle size** | ~8 KB gzipped | ~150 KB+ | N/A |
| **Dependencies** | 0 | 20+ | varies |
| **Providers** | OpenAI, Anthropic, Google, Ollama, custom | OpenAI, Anthropic, Google, more | 1 per SDK |
| **Runtimes** | Node, Deno, Bun, Browser, Edge | Primarily Node/Edge | varies |
| **Streaming** | `for await...of` | React hooks / streams | manual SSE parsing |
| **TypeScript** | First-class, fully typed | Yes | varies |
| **Learning curve** | 1 function | Framework concepts | Per-provider docs |

## Features

- **One unified API** — `ai()` works with every provider
- **Zero dependencies** — uses native `fetch`, `ReadableStream`, `TextDecoder`
- **Streaming** — first-class `async iterable` support
- **Structured output** — type-safe JSON with JSON Schema or Zod
- **Tool calling** — define tools, aiclientjs executes them
- **Provider-agnostic** — OpenAI, Anthropic, Google Gemini, Ollama, or your own
- **Universal runtime** — Node.js 18+, Deno, Bun, Browser, Cloudflare Workers

## Runtime Support

| Runtime | Supported |
|---|---|
| Node.js 18+ | ✅ |
| Deno | ✅ |
| Bun | ✅ |
| Cloudflare Workers | ✅ |
| Browser | ✅ |
| Vercel Edge | ✅ |
