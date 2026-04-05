---
sidebar_position: 10
title: API Reference
---

# API Reference

## `ai(prompt, options?)`

The main function. Calls an AI model and returns the response.

```typescript
import { ai } from 'aiclientjs';

// Simple
const res = await ai('Hello');

// With messages
const res = await ai([
  { role: 'system', content: 'Be helpful' },
  { role: 'user', content: 'Hello' },
]);

// Streaming
const stream = await ai('Hello', { stream: true });

// Structured output
const res = await ai('List colors', { schema: mySchema });
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `prompt` | `string \| Message[]` | Text prompt or conversation messages |

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `provider` | `string` | `'openai'` | Provider name |
| `model` | `string` | varies | Model identifier |
| `apiKey` | `string` | env var | API key |
| `baseURL` | `string` | provider default | Custom API endpoint |
| `system` | `string` | — | System prompt |
| `stream` | `boolean` | `false` | Enable streaming |
| `schema` | `JsonSchema \| ZodSchema` | — | Structured output schema |
| `schemaName` | `string` | `'response'` | Name for the schema |
| `tools` | `Record<string, ToolDefinition>` | — | Tool definitions |
| `temperature` | `number` | — | Sampling temperature (0-2) |
| `maxTokens` | `number` | — | Max response tokens |
| `stop` | `string[]` | — | Stop sequences |
| `signal` | `AbortSignal` | — | Cancellation signal |
| `headers` | `Record<string, string>` | — | Custom HTTP headers |

### Returns

**Without streaming**: `Promise<AIResponse>`

```typescript
interface AIResponse {
  text: string;
  toolCalls: ToolCall[];
  toolResults: ToolResult[];
  usage: TokenUsage;
  model: string;
  finishReason: FinishReason;
  raw: unknown;
}
```

**With `schema`**: `Promise<AIStructuredResponse<T>>`

```typescript
interface AIStructuredResponse<T> extends AIResponse {
  data: T; // parsed, validated JSON
}
```

**With `stream: true`**: `Promise<AIStream>`

```typescript
interface AIStream extends AsyncIterable<string> {
  text(): Promise<string>;
  response(): Promise<AIResponse>;
  toReadableStream(): ReadableStream<string>;
  abort(): void;
}
```

---

## `createAIClient(config)`

Create a preconfigured `ai` function with defaults baked in.

```typescript
import { createAIClient } from 'aiclientjs';

const gpt = createAIClient({
  provider: 'openai',
  model: 'gpt-4o',
  system: 'Be concise.',
});

const res = await gpt('Hello');
```

### Config

| Option | Type | Description |
|---|---|---|
| `provider` | `string` | Default provider |
| `model` | `string` | Default model |
| `apiKey` | `string` | Default API key |
| `baseURL` | `string` | Default base URL |
| `system` | `string` | Default system prompt |
| `temperature` | `number` | Default temperature |
| `maxTokens` | `number` | Default max tokens |
| `headers` | `Record<string, string>` | Default headers |

Per-call options override the defaults.

---

## `registerProvider(name, provider)`

Register a custom provider.

```typescript
import { registerProvider } from 'aiclientjs';

registerProvider('my-provider', {
  name: 'my-provider',
  async chat(request, config) { /* ... */ },
  async *stream(request, config) { /* ... */ },
});
```

---

## Types

### `Message`

```typescript
type Message =
  | { role: 'system'; content: string }
  | { role: 'user'; content: string | ContentPart[] }
  | { role: 'assistant'; content: string | null; toolCalls?: ToolCall[] }
  | { role: 'tool'; content: string; toolCallId: string };

type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image'; url: string; mimeType?: string };
```

### `ToolDefinition`

```typescript
interface ToolDefinition<TParams = unknown> {
  description?: string;
  parameters: JsonSchema | ZodSchema;
  execute?: (params: TParams) => unknown | Promise<unknown>;
}
```

### `ToolCall`

```typescript
interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}
```

### `TokenUsage`

```typescript
interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}
```

### `FinishReason`

```typescript
type FinishReason = 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'unknown';
```

### `AIError`

```typescript
class AIError extends Error {
  code: AIErrorCode;
  statusCode?: number;
  provider?: string;
}

type AIErrorCode =
  | 'AUTH_ERROR'
  | 'RATE_LIMIT'
  | 'PROVIDER_ERROR'
  | 'INVALID_CONFIG'
  | 'UNKNOWN_PROVIDER'
  | 'SCHEMA_VALIDATION'
  | 'STREAM_ABORTED'
  | 'NETWORK_ERROR'
  | 'TOOL_EXECUTION_ERROR';
```

### `AIProvider`

For building custom providers:

```typescript
interface AIProvider {
  readonly name: string;
  chat(request: ProviderRequest, config: ProviderConfig): Promise<ProviderResponse>;
  stream(request: ProviderRequest, config: ProviderConfig): AsyncIterable<ProviderStreamEvent>;
}
```
