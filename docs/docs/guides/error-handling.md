---
sidebar_position: 5
title: Error Handling
---

# Error Handling

aiclientjs throws typed `AIError` instances with structured error codes.

## Catching Errors

```typescript
import { ai, AIError } from 'aiclientjs';

try {
  const res = await ai('Hello');
} catch (err) {
  if (err instanceof AIError) {
    console.log(err.code);       // 'AUTH_ERROR' | 'RATE_LIMIT' | etc.
    console.log(err.statusCode); // 401, 429, 500, etc.
    console.log(err.provider);   // 'openai', 'anthropic', etc.
    console.log(err.message);    // Human-readable description
  }
}
```

## Error Codes

| Code | Description | Common Cause |
|---|---|---|
| `AUTH_ERROR` | Authentication failed | Invalid or missing API key |
| `RATE_LIMIT` | Rate limit exceeded | Too many requests |
| `PROVIDER_ERROR` | Provider returned an error | Server error, invalid model, etc. |
| `INVALID_CONFIG` | Bad configuration | Missing required options |
| `UNKNOWN_PROVIDER` | Provider not found | Typo in provider name |
| `SCHEMA_VALIDATION` | Structured output failed | Model returned invalid JSON |
| `STREAM_ABORTED` | Stream was cancelled | `abort()` called or signal aborted |
| `NETWORK_ERROR` | Network failure | No internet, DNS failure, etc. |
| `TOOL_EXECUTION_ERROR` | Tool `execute` threw | Bug in your tool handler |

## Handling Specific Errors

```typescript
try {
  const res = await ai('Hello');
} catch (err) {
  if (!(err instanceof AIError)) throw err;

  switch (err.code) {
    case 'AUTH_ERROR':
      console.log('Check your API key');
      break;
    case 'RATE_LIMIT':
      console.log('Slow down — retrying in 5s...');
      await new Promise(r => setTimeout(r, 5000));
      break;
    case 'SCHEMA_VALIDATION':
      console.log('Model returned bad JSON, try again');
      break;
    default:
      throw err;
  }
}
```

## Static Factory Methods

`AIError` provides named constructors for common errors:

```typescript
AIError.authentication('openai');
AIError.rateLimit('anthropic');
AIError.providerError('google', 500, 'Internal error');
AIError.invalidConfig('Missing model name');
AIError.unknownProvider('typo-provider');
AIError.schemaValidation('Expected object, got string');
AIError.streamAborted();
```

These are useful when building [custom providers](/guides/providers#custom-providers).
