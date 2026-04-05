---
sidebar_position: 3
title: Tool Calling
---

# Tool Calling

Let models call your functions. Define tools with parameters and an `execute` handler, and aiclientjs runs them automatically.

## Basic Example

```typescript
import { ai } from 'aiclientjs';

const res = await ai('What is the weather in London?', {
  tools: {
    getWeather: {
      description: 'Get current weather for a city',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string', description: 'The city name' },
        },
        required: ['city'],
      },
      execute: async ({ city }) => {
        const response = await fetch(`https://api.weather.com/${city}`);
        return response.json();
      },
    },
  },
});

console.log(res.toolCalls);   // [{ id: '...', name: 'getWeather', arguments: { city: 'London' } }]
console.log(res.toolResults); // [{ toolCallId: '...', toolName: 'getWeather', result: { temp: 15 } }]
```

## Multiple Tools

```typescript
const res = await ai('Book a flight from NYC to London and check the weather there', {
  tools: {
    searchFlights: {
      description: 'Search for available flights',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string' },
          to: { type: 'string' },
        },
        required: ['from', 'to'],
      },
      execute: async ({ from, to }) => {
        return { flights: [`${from} -> ${to} at 8:00 AM`, `${from} -> ${to} at 2:00 PM`] };
      },
    },
    getWeather: {
      description: 'Get weather for a city',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string' },
        },
        required: ['city'],
      },
      execute: async ({ city }) => {
        return { temp: 15, condition: 'cloudy' };
      },
    },
  },
});
```

## Tools with Zod Parameters

```typescript
import { z } from 'zod';

const res = await ai('Calculate 15% tip on $85', {
  tools: {
    calculateTip: {
      description: 'Calculate tip amount',
      parameters: z.object({
        amount: z.number().describe('Bill amount in dollars'),
        percentage: z.number().describe('Tip percentage'),
      }),
      execute: ({ amount, percentage }) => ({
        tip: amount * (percentage / 100),
        total: amount + amount * (percentage / 100),
      }),
    },
  },
});
```

## Tools Without Execute

If you omit the `execute` handler, aiclientjs returns the tool calls without executing them. This is useful when you want to handle execution yourself:

```typescript
const res = await ai('What is the weather?', {
  tools: {
    getWeather: {
      description: 'Get weather',
      parameters: {
        type: 'object',
        properties: { city: { type: 'string' } },
      },
      // No execute — just get the tool calls
    },
  },
});

// Handle tool calls manually
for (const call of res.toolCalls) {
  console.log(`Model wants to call: ${call.name}(${JSON.stringify(call.arguments)})`);
}
```

## Response Structure

When tools are called, the response contains:

```typescript
{
  text: '',                  // Usually empty when tools are called
  toolCalls: [               // What the model wants to call
    {
      id: 'call_abc123',
      name: 'getWeather',
      arguments: { city: 'London' },
    },
  ],
  toolResults: [             // Results from execute handlers
    {
      toolCallId: 'call_abc123',
      toolName: 'getWeather',
      result: { temp: 15, condition: 'cloudy' },
    },
  ],
  finishReason: 'tool_calls',
  usage: { promptTokens: 25, completionTokens: 15, totalTokens: 40 },
}
```
