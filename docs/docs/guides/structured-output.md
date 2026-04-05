---
sidebar_position: 2
title: Structured Output
---

# Structured Output

Get type-safe JSON responses from any model. aiclientjs supports both JSON Schema and Zod schemas.

## With JSON Schema

```typescript
import { ai } from 'aiclientjs';

const res = await ai<{ colors: string[] }>('List 5 colors', {
  schema: {
    type: 'object',
    properties: {
      colors: { type: 'array', items: { type: 'string' } },
    },
    required: ['colors'],
  },
  schemaName: 'color_list',
});

console.log(res.data.colors); // ['red', 'blue', 'green', 'yellow', 'purple']
```

The response includes a `.data` property with the parsed, typed JSON — in addition to the regular `.text` with the raw string.

## With Zod

aiclientjs detects Zod schemas automatically — no plugins, no adapters, no manual `zodToJsonSchema` calls.

```typescript
import { ai } from 'aiclientjs';
import { z } from 'zod';

const res = await ai('List 5 colors', {
  schema: z.object({
    colors: z.array(z.string()),
  }),
});

console.log(res.data.colors); // fully typed as string[]
```

:::tip
You don't need to install any adapter package. aiclientjs detects Zod via duck-typing and converts the schema to JSON Schema internally.
:::

## Complex Schemas

```typescript
import { z } from 'zod';

const MovieSchema = z.object({
  title: z.string(),
  year: z.number(),
  genres: z.array(z.string()),
  rating: z.number(),
  director: z.string(),
});

const res = await ai('Give me details about the movie Inception', {
  schema: MovieSchema,
});

console.log(res.data.title);    // 'Inception'
console.log(res.data.year);     // 2010
console.log(res.data.genres);   // ['Sci-Fi', 'Action', 'Thriller']
console.log(res.data.director); // 'Christopher Nolan'
```

## How It Works

1. aiclientjs converts your schema to JSON Schema (if Zod) or uses it directly
2. Sends it to the provider's structured output API:
   - **OpenAI**: `response_format: { type: 'json_schema' }`
   - **Google Gemini**: `responseMimeType: 'application/json'` + `responseSchema`
   - **Anthropic / Ollama**: System prompt injection with schema instructions
3. Parses the JSON response and validates it against your schema
4. Returns the typed `data` property on the response

## Schema Name

Some providers (like OpenAI) accept a name for the schema. Use `schemaName`:

```typescript
const res = await ai('Extract the user info', {
  schema: { type: 'object', properties: { name: { type: 'string' } } },
  schemaName: 'user_info',
});
```

## Error Handling

If the model returns invalid JSON or the data doesn't match the schema:

```typescript
import { ai, AIError } from 'aiclientjs';

try {
  const res = await ai('...', { schema: mySchema });
} catch (err) {
  if (err instanceof AIError && err.code === 'SCHEMA_VALIDATION') {
    console.log('Model returned invalid data:', err.message);
  }
}
```
